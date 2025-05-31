'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionToken } from '@/types/option';
import { formatUnits } from 'ethers';
import { useAccount } from 'wagmi';
import { OptionTokenABI } from '@/lib/abis';
import { ethers } from 'ethers';
import { erc20Abi } from 'viem';

interface BuyOptionDialogProps {
    option: OptionToken;
    isOpen: boolean;
    onClose: () => void;
}

export function BuyOptionDialog({ option, isOpen, onClose }: BuyOptionDialogProps) {
    const [amount, setAmount] = useState(1);
    const [isApproving, setIsApproving] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const { address } = useAccount();

    const formatPrice = (value: bigint, decimals: number = 8) => {
        return `$${Number(formatUnits(value, decimals)).toLocaleString()}`;
    };

    const totalCost = option.premium * BigInt(amount);

    const getProvider = () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            return new ethers.BrowserProvider(window.ethereum);
        }
        return null;
    };

    const getSigner = async () => {
        const provider = getProvider();
        if (!provider) return null;
        return await provider.getSigner();
    };

    const checkAllowance = async () => {
        const signer = await getSigner();
        if (!signer || !address) return BigInt(0);

        const erc20Contract = new ethers.Contract(option.paymentToken as string, erc20Abi, signer);

        const allowance = await erc20Contract.allowance(address, option.address);
        return allowance;
    };

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            const signer = await getSigner();
            if (!signer) throw new Error('No signer found');

            const erc20Contract = new ethers.Contract(option.paymentToken as string, erc20Abi, signer);

            const tx = await erc20Contract.approve(option.address, totalCost);
            await tx.wait();
        } catch (error) {
            console.error('Approval error:', error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleBuy = async () => {
        try {
            setIsBuying(true);
            const signer = await getSigner();
            if (!signer) throw new Error('No signer found');

            const optionContract = new ethers.Contract(option.address as string, OptionTokenABI, signer);

            const tx = await optionContract.purchaseOption(amount, { value: totalCost });
            await tx.wait();
        } catch (error) {
            console.error('Purchase error:', error);
        } finally {
            setIsBuying(false);
        }
    };

    const [allowance, setAllowance] = useState<bigint>(BigInt(0));

    // Check allowance when component mounts or when relevant values change
    useEffect(() => {
        const checkAllowanceAndUpdate = async () => {
            const currentAllowance = await checkAllowance();
            setAllowance(currentAllowance);
        };
        checkAllowanceAndUpdate();
    }, [address, option.paymentToken, option.address, totalCost]);

    const needsApproval = allowance < totalCost;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Buy {option.symbol} {option.optionType}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Strike Price</p>
                            <p className="font-medium">{formatPrice(option.strikePrice)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Current Price</p>
                            <p className="font-medium">{formatPrice(option.startPrice)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Premium</p>
                            <p className="font-medium">{formatPrice(option.premium)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Collateralization</p>
                            <p className="font-medium">{Number(option.collateral) / Number(option.premium)}x</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setAmount(Math.max(1, amount - 1))} disabled={amount <= 1}>
                                -
                            </Button>
                            <Input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="text-center"
                            />
                            <Button variant="outline" size="icon" onClick={() => setAmount(amount + 1)}>
                                +
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="font-medium">{formatPrice(totalCost)}</p>
                    </div>

                    <Button className="w-full" onClick={needsApproval ? handleApprove : handleBuy} disabled={isApproving || isBuying}>
                        {isApproving ? 'Approving...' : isBuying ? 'Buying...' : needsApproval ? 'Approve' : 'Buy'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
