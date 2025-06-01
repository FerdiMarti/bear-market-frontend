'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { OptionType, OptionTypeLabels } from '@/types/option';
import { useAccount, useWriteContract, useReadContract, useWalletClient } from 'wagmi';
import { erc20Abi } from 'viem';
import { OptionTokenManagerABI } from '@/lib/abis';
import { toast } from 'sonner';
import { getLatestPriceUpdates, publishPiceUpdate } from '@/lib/pythNetwork';
import { PYTH_ASSET_IDS, USED_CONTRACTS } from '@/lib/constants';

const EXECUTION_WINDOW_SIZES = [
    {
        label: '4 hours',
        value: 4 * 60 * 60,
    },
    {
        label: '8 hours',
        value: 8 * 60 * 60,
    },
    {
        label: '12 hours',
        value: 12 * 60 * 60,
    },
    {
        label: '16 hours',
        value: 16 * 60 * 60,
    },
    {
        label: '1 day',
        value: 24 * 60 * 60,
    },
];

const COLLATERAL_TOKENS = [
    {
        label: '$USDC',
        value: 'USDC',
        decimals: 6,
        address: USED_CONTRACTS.USDC,
    },
    {
        label: '$NECT',
        value: 'NECT',
        decimals: 6,
        address: USED_CONTRACTS.NECT,
    },
];

const UNDERLYING_ASSETS = [
    {
        label: '$AAPL',
        value: 'AAPL',
        pythAssetId: PYTH_ASSET_IDS.AAPL,
    },
    {
        label: '$TSLA',
        value: 'TSLA',
        pythAssetId: PYTH_ASSET_IDS.TSLA,
    },
];

const DURATIONS = [
    {
        label: '30 days',
        value: 30 * 24 * 60 * 60,
    },
    {
        label: '60 days',
        value: 60 * 24 * 60 * 60,
    },
    {
        label: '90 days',
        value: 90 * 24 * 60 * 60,
    },
    {
        label: '120 days',
        value: 120 * 24 * 60 * 60,
    },
];

const AMOUNTS = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

const RATIO_OPTIONS = [
    {
        label: '1x',
        value: 1,
    },
    {
        label: '2x',
        value: 2,
    },
    {
        label: '3x',
        value: 3,
    },
    {
        label: '4x',
        value: 4,
    },
    {
        label: '5x',
        value: 5,
    },
];

// Asset price mapping
const assetPrices: Record<string, number> = {
    AAPL: 590,
    TSLA: 100,
};

export function MoneyMakingDialog() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRatio, setSelectedRatio] = useState(1);
    const [premium, setPremium] = useState(10);
    const [underlyingAsset, setUnderlyingAsset] = useState(UNDERLYING_ASSETS[0].value);
    const [executionWindowSize, setExecutionWindowSize] = useState(24 * 60 * 60);
    const [type, setType] = useState(OptionType.CALL);

    const getStrikePrices = (asset: string) => {
        const price = assetPrices[asset];
        if (type === OptionType.CALL) {
            return [Math.round(price * 1.05), Math.round(price * 1.1), Math.round(price * 1.15)];
        } else {
            return [Math.round(price * 0.95), Math.round(price * 0.9), Math.round(price * 0.85)];
        }
    };
    const [strikePrice, setStrikePrice] = useState(getStrikePrices(underlyingAsset)[0]);

    const [duration, setDuration] = useState(DURATIONS[0].value);
    const [amount, setAmount] = useState(1);
    const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKENS[0].value);
    const [collateralTokenBalance, setCollateralTokenBalance] = useState(0);

    // Read collateral token balance
    const { data: balance } = useReadContract({
        address: COLLATERAL_TOKENS.find(token => token.value === collateralToken)?.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        query: {
            enabled: !!address && !!collateralToken,
        },
    });

    // Update collateral token balance when balance changes
    useEffect(() => {
        if (balance) {
            const tokenInfo = COLLATERAL_TOKENS.find(token => token.value === collateralToken);
            const decimals = tokenInfo?.decimals || 6;
            setCollateralTokenBalance(Number(balance) / Math.pow(10, decimals));
        }
    }, [balance, collateralToken]);

    // Contract addresses - replace with your actual addresses
    const OPTION_TOKEN_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_MANAGER_ADDRESS as `0x${string}`; // Replace with actual address

    // Approval write
    const { writeContractAsync: approve } = useWriteContract();

    // Deploy option token write
    const { writeContractAsync: deployOptionToken } = useWriteContract();

    // Calculate resulting collateral based on selected ratio and deposit amount
    const calculateCollateral = () => {
        const assetPrice = assetPrices[underlyingAsset];
        return (assetPrice * selectedRatio * amount).toLocaleString();
    };

    const calculateRecommendedPremium = () => {
        //TODO implement actual premium calculation
        const assetPrice = assetPrices[underlyingAsset];
        const premium = assetPrice * 0.05;
        return Math.round(premium);
    };

    const handlePythUpdate = async (assetId: `0x${string}`) => {
        const update = await getLatestPriceUpdates(assetId);
        if (!walletClient) {
            console.error('Wallet not connected');
            return;
        }
        try {
            await publishPiceUpdate(update, walletClient);
        } catch (error) {
            console.error('Error publishing update:', error);
        }
    };

    const handleMint = async () => {
        if (!OPTION_TOKEN_MANAGER_ADDRESS) {
            toast.error('Option token manager address not found');
            return;
        }

        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }

        try {
            setIsLoading(true);

            // Calculate collateral amount
            const assetPrice = assetPrices[underlyingAsset];
            const collateralAmount = assetPrice * selectedRatio * amount;
            const collateralTokenInfo = COLLATERAL_TOKENS.find(token => token.value === collateralToken);
            const underlyingAssetInfo = UNDERLYING_ASSETS.find(asset => asset.value === underlyingAsset);

            // Convert to proper decimals
            const decimals = collateralTokenInfo?.decimals || 6; // Default to 6 if not available
            const collateralWithDecimals = BigInt(collateralAmount) * 10n ** BigInt(decimals);
            const premiumWithDecimals = BigInt(premium) * 10n ** BigInt(decimals);
            const strikePriceWithDecimals = BigInt(strikePrice) * 10n ** BigInt(decimals);

            await handlePythUpdate(underlyingAssetInfo?.pythAssetId as `0x${string}`);

            // First approve the collateral amount
            await approve({
                address: collateralTokenInfo?.address as `0x${string}`,
                abi: erc20Abi,
                functionName: 'approve',
                args: [OPTION_TOKEN_MANAGER_ADDRESS, collateralWithDecimals],
            });

            // Deploy the option token
            await deployOptionToken({
                address: OPTION_TOKEN_MANAGER_ADDRESS as `0x${string}`,
                abi: OptionTokenManagerABI,
                functionName: 'deployOptionToken',
                args: [
                    type,
                    underlyingAssetInfo?.pythAssetId as `0x${string}`,
                    strikePriceWithDecimals,
                    BigInt(Math.floor(Date.now() / 1000) + duration),
                    BigInt(executionWindowSize),
                    premiumWithDecimals,
                    BigInt(amount),
                    collateralTokenInfo?.address as `0x${string}`,
                    collateralWithDecimals,
                ],
            });

            toast.success('Option token deployed successfully!');
        } catch (error) {
            console.error('Error minting option:', error);
            toast.error('Failed to mint option token. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-full px-6">Create Option</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl sm:max-w-2xl bg-[var(--trading-text-muted)] border-none p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-center text-2xl font-medium text-black">Money Making Machine (Mint Options)</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Deposit Section */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Collateral Token</label>
                            <div className="bg-[var(--trading-bg)] rounded-lg p-4 text-[var(--trading-text)]">
                                <Select defaultValue={collateralToken} onValueChange={value => setCollateralToken(value)}>
                                    <SelectTrigger className="p-0 w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-6">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                        {COLLATERAL_TOKENS.map(token => (
                                            <SelectItem key={token.value} value={token.value}>
                                                {token.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-sm text-[var(--trading-text-muted)] mt-1">Balance: {collateralTokenBalance}</div>
                            </div>
                        </div>

                        {/*Premium */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Premium</label>
                            <div className="bg-[var(--trading-bg)] rounded-lg p-4 text-[var(--trading-text)] relative">
                                <Input
                                    type="number"
                                    value={premium}
                                    onChange={e => setPremium(Number(e.target.value))}
                                    className="bg-transparent border-none text-2xl font-bold text-[var(--trading-text)] p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="5"
                                />
                                <button
                                    onClick={() => setPremium(calculateRecommendedPremium())}
                                    className="absolute top-2 right-2 text-xs bg-[var(--trading-yellow)] text-black px-2 py-1 rounded hover:bg-[var(--trading-yellow)]/90 transition-colors"
                                >
                                    recommended
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Amount</label>
                            <Select defaultValue={amount.toString()} onValueChange={value => setAmount(Number(value))}>
                                <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                    {AMOUNTS.map(amount => (
                                        <SelectItem key={amount} value={amount.toString()}>
                                            {amount}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Collateralization Ratio */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Collateralization ratio</label>
                            <div className="flex gap-2">
                                {RATIO_OPTIONS.map(ratio => (
                                    <Button
                                        key={ratio.value}
                                        variant={selectedRatio === ratio.value ? 'default' : 'outline'}
                                        onClick={() => setSelectedRatio(ratio.value)}
                                        className={
                                            selectedRatio === ratio.value
                                                ? 'bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-4 py-2 border-none'
                                                : 'bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] hover:bg-[var(--trading-bg)]/80 rounded-lg px-4 py-2 border-none'
                                        }
                                    >
                                        {ratio.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Underlying */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Underlying</label>
                            <Select defaultValue={underlyingAsset} onValueChange={value => setUnderlyingAsset(value)}>
                                <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                    {UNDERLYING_ASSETS.map(asset => (
                                        <SelectItem key={asset.value} value={asset.value}>
                                            {asset.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Strike Price */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Strike Price</label>
                            <Select defaultValue={strikePrice.toString()} onValueChange={value => setStrikePrice(Number(value))}>
                                <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                    {getStrikePrices(underlyingAsset).map(price => (
                                        <SelectItem key={price} value={price.toString()}>
                                            ${price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Duration</label>
                            <Select defaultValue={DURATIONS[0].value.toString()} onValueChange={value => setDuration(Number(value))}>
                                <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                    {DURATIONS.map(duration => (
                                        <SelectItem key={duration.value} value={duration.value.toString()}>
                                            {duration.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Type</label>
                            <Select defaultValue={OptionType.CALL.toString()} onValueChange={value => setType(Number.parseInt(value))}>
                                <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                    {Object.values(OptionType).map(type => (
                                        <SelectItem key={type} value={type.toString()}>
                                            {OptionTypeLabels[type as OptionType]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Execution Window Size */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Execution Window Size</label>
                            <Select defaultValue={executionWindowSize.toString()} onValueChange={value => setExecutionWindowSize(Number(value))}>
                                <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                    {EXECUTION_WINDOW_SIZES.map(size => (
                                        <SelectItem key={size.value} value={size.value.toString()}>
                                            {size.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Current Asset Price and Resulting Collateral */}
                <div className="mt-3 flex justify-between items-center w-1/2 mt-4">
                    <div>
                        <div className="text-sm text-black font-medium">Current asset price</div>
                        <div className="text-lg font-bold text-[var(--trading-bg)]">${assetPrices[underlyingAsset].toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-black font-medium">Resulting collateral</div>
                        <div className="text-lg font-bold text-[var(--trading-bg)]">${calculateCollateral()}</div>
                    </div>
                </div>

                {/* Mint Button */}
                <div className="flex justify-center mt-8">
                    <Button
                        className="bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-12 py-3 text-lg font-medium"
                        onClick={handleMint}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Mint'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
