'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionToken } from '@/types/option';
import { formatUnits } from 'ethers';
import { useAccount, useWriteContract } from 'wagmi';
import { OptionTokenABI } from '@/lib/abis';
import { erc20Abi } from 'viem';
import { toast } from 'sonner';

interface BuyOptionDialogProps {
    option: OptionToken;
    isOpen: boolean;
    onClose: () => void;
}

export function BuyOptionDialog({ option, isOpen, onClose }: BuyOptionDialogProps) {
    const [amount, setAmount] = useState(1);
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    const formatPrice = (value: bigint, decimals: number = 6) => {
        return `$${Number(formatUnits(value, decimals)).toLocaleString()}`;
    };

    const totalCost = option.premium * BigInt(amount);

    // // Read allowance
    // const { data: allowance = BigInt(0) } = useReadContract({
    //     address: option.paymentToken as `0x${string}`,
    //     abi: erc20Abi,
    //     functionName: 'allowance',
    //     args: [address as `0x${string}`, option.address as `0x${string}`],
    //     query: {
    //         enabled: !!address && !!option.paymentToken && !!option.address,
    //     },
    // });

    // Approve transaction
    const { writeContractAsync: approve } = useWriteContract();

    // Buy option transaction
    const { writeContractAsync: buyOption } = useWriteContract();

    const handleBuy = async () => {
        if (!address) return;

        setIsLoading(true);

        try {
            await approve({
                abi: erc20Abi,
                address: option.paymentToken as `0x${string}`,
                functionName: 'approve',
                args: [option.address as `0x${string}`, totalCost],
            });

            const params = {
                abi: OptionTokenABI,
                address: option.address as `0x${string}`,
                functionName: 'purchaseOption',
                args: [BigInt(amount)],
            } as const;

            if (totalCost > 0n) {
                Object.assign(params, { value: totalCost });
            }

            await buyOption(params);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            toast.success('Option purchased successfully');
        }
    };

    // const needsApproval = allowance < totalCost;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl sm:max-w-2xl bg-[var(--trading-text-muted)] border-none p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-center text-2xl font-medium text-black">
                        Buy {option.symbol} {option.optionType}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-black">Strike Price</p>
                            <p className="text-lg font-bold text-[var(--trading-bg)]">{formatPrice(option.strikePrice)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-black">Current Price</p>
                            <p className="text-lg font-bold text-[var(--trading-bg)]">{formatPrice(option.startPrice)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-black">Premium</p>
                            <p className="text-lg font-bold text-[var(--trading-bg)]">{formatPrice(option.premium)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-black">Collateralization</p>
                            <p className="text-lg font-bold text-[var(--trading-bg)]">{Number(option.collateral) / Number(option.premium)}x</p>
                        </div>
                    </div>

                    <div className="flex justify-center w-full">
                        <div className="space-y-2 max-w-1/2">
                            <p className="text-sm font-medium text-black">Amount</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setAmount(Math.max(1, amount - 1))}
                                    disabled={amount <= 1}
                                    className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] hover:bg-[var(--trading-bg)]/80"
                                >
                                    -
                                </Button>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="text-center bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setAmount(amount + 1)}
                                    className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] hover:bg-[var(--trading-bg)]/80"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-black">Total Cost</p>
                        <p className="text-lg font-bold text-[var(--trading-bg)]">{formatPrice(totalCost)}</p>
                    </div>

                    <Button
                        className="w-full bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-12 py-3 text-lg font-medium"
                        onClick={handleBuy}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Buy'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
