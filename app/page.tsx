'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
    const [depositAmount, setDepositAmount] = useState('100');
    const [selectedRatio, setSelectedRatio] = useState('1x');
    const [estimatedPremium, setEstimatedPremium] = useState('5');
    const [selectedAsset, setSelectedAsset] = useState('SPX');

    // Asset price mapping
    const assetPrices: Record<string, number> = {
        SPX: 590,
        BTC: 103700,
        ETH: 2700,
    };

    // Calculate resulting collateral based on selected ratio and deposit amount
    const calculateCollateral = () => {
        const ratio = Number.parseFloat(selectedRatio);
        const deposit = Number.parseFloat(depositAmount);
        return (deposit * ratio).toLocaleString();
    };

    const optionsData = [
        {
            underlying: '$SPX',
            strike: '$620',
            marketPrice: '$590',
            type: 'Call',
            price: '$10',
            liquidity: '$1,000,000',
            collateralization: '2x',
        },
        {
            underlying: '$BTC',
            strike: '$110,000',
            marketPrice: '$103,700',
            type: 'Call',
            price: '$10',
            liquidity: '$1,000,000',
            collateralization: '1x',
        },
        {
            underlying: '$ETH',
            strike: '$3,000',
            marketPrice: '$2,700',
            type: 'Call',
            price: '$10',
            liquidity: '$1,000,000',
            collateralization: '1x',
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--trading-bg)] text-[var(--trading-text)] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="bg-[var(--trading-yellow)] text-black border-[var(--trading-yellow)] hover:bg-[var(--trading-yellow)]/90 rounded-full px-6"
                        >
                            All
                        </Button>
                        <Link href="/positions">
                            <Button
                                variant="outline"
                                className="bg-[var(--trading-yellow)] text-black border-[var(--trading-yellow)] hover:bg-[var(--trading-yellow)]/90 rounded-full px-6"
                            >
                                My positions
                            </Button>
                        </Link>
                    </div>

                    <h1 className="text-2xl font-medium">Explore Available Options</h1>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-full px-6">
                                Make $$$$
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl sm:max-w-2xl bg-[var(--trading-text-muted)] border-none p-8">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-center text-2xl font-medium text-black">Money Making Machine</DialogTitle>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Deposit Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Deposit $NECT</label>
                                        <div className="bg-[var(--trading-bg)] rounded-lg p-4 text-[var(--trading-text)]">
                                            <Input
                                                type="number"
                                                value={depositAmount}
                                                onChange={e => setDepositAmount(e.target.value)}
                                                className="bg-transparent border-none text-2xl font-bold text-[var(--trading-text)] p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="100"
                                            />
                                            <div className="text-sm text-[var(--trading-text-muted)] mt-1">Balance: $3400</div>
                                        </div>
                                    </div>

                                    {/* Estimated Premium */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Estimated Premium</label>
                                        <div className="bg-[var(--trading-bg)] rounded-lg p-4 text-[var(--trading-text)] relative">
                                            <Input
                                                type="number"
                                                value={estimatedPremium}
                                                onChange={e => setEstimatedPremium(e.target.value)}
                                                className="bg-transparent border-none text-2xl font-bold text-[var(--trading-text)] p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="5"
                                            />
                                            <button
                                                onClick={() => setEstimatedPremium('5')}
                                                className="absolute top-2 right-2 text-xs bg-[var(--trading-yellow)] text-black px-2 py-1 rounded hover:bg-[var(--trading-yellow)]/90 transition-colors"
                                            >
                                                recommended
                                            </button>
                                        </div>
                                    </div>

                                    {/* Collateralization Ratio */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Collateralization ratio</label>
                                        <div className="flex gap-2">
                                            {['1x', '2x', '3x', '4x', '5x'].map(ratio => (
                                                <Button
                                                    key={ratio}
                                                    variant={selectedRatio === ratio ? 'default' : 'outline'}
                                                    onClick={() => setSelectedRatio(ratio)}
                                                    className={
                                                        selectedRatio === ratio
                                                            ? 'bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-4 py-2'
                                                            : 'bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] hover:bg-[var(--trading-bg)]/80 rounded-lg px-4 py-2'
                                                    }
                                                >
                                                    {ratio}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Current Asset Price and Resulting Collateral */}
                                        <div className="mt-3 flex justify-between items-center">
                                            <div>
                                                <div className="text-sm text-black font-medium">Current asset price</div>
                                                <div className="text-lg font-bold text-[var(--trading-bg)]">
                                                    ${assetPrices[selectedAsset].toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-black font-medium">Resulting collateral</div>
                                                <div className="text-lg font-bold text-[var(--trading-bg)]">${calculateCollateral()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Underlying */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Underlying</label>
                                        <Select defaultValue="SPX" onValueChange={value => setSelectedAsset(value)}>
                                            <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                                <SelectItem value="SPX">$SPX</SelectItem>
                                                <SelectItem value="BTC">$BTC</SelectItem>
                                                <SelectItem value="ETH">$ETH</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Strike Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Strike Price</label>
                                        <Select defaultValue="605">
                                            <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                                <SelectItem value="605">$605</SelectItem>
                                                <SelectItem value="610">$610</SelectItem>
                                                <SelectItem value="620">$620</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Duration</label>
                                        <Select defaultValue="90">
                                            <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                                <SelectItem value="30">30 days</SelectItem>
                                                <SelectItem value="60">60 days</SelectItem>
                                                <SelectItem value="90">90 days</SelectItem>
                                                <SelectItem value="120">120 days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Type</label>
                                        <Select defaultValue="call">
                                            <SelectTrigger className="w-full bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)] rounded-lg h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--trading-bg)] text-[var(--trading-text)] border-[var(--trading-bg)]">
                                                <SelectItem value="call">Call</SelectItem>
                                                <SelectItem value="put">Put</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Mint Button */}
                            <div className="flex justify-center mt-8">
                                <Button className="bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-12 py-3 text-lg font-medium">
                                    Mint
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-8 gap-4 mb-4 px-6 text-sm text-[var(--trading-text-muted)]">
                    <div>Underlying</div>
                    <div>Strike</div>
                    <div>Market price</div>
                    <div>Type</div>
                    <div>Price</div>
                    <div>Liquidity</div>
                    <div>Collateralization</div>
                    <div></div>
                </div>

                {/* Table Rows */}
                <div className="space-y-4">
                    {optionsData.map((option, index) => (
                        <div key={index} className="bg-[var(--trading-row-bg)] rounded-2xl p-6 grid grid-cols-8 gap-4 items-center">
                            <div className="font-medium text-lg">{option.underlying}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.strike}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.marketPrice}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.type}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.price}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.liquidity}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.collateralization}</div>
                            <div className="flex justify-end">
                                <Button className="bg-[var(--trading-green)] text-black hover:bg-[var(--trading-green)]/90 rounded-lg px-6 font-medium">
                                    Buy
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
