'use client';

import { Button } from '@/components/ui/button';
import { MoneyMakingDialog } from '@/components/MoneyMakingDialog';
import { BuyOptionDialog } from '@/components/BuyOptionDialog';
import Link from 'next/link';
import { dummyOptions } from '@/data/dummyOptions';
import { formatUnits } from 'viem';
import { useState } from 'react';
import { OptionToken } from '@/types/option';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Page() {
    const [selectedOption, setSelectedOption] = useState<OptionToken | null>(null);

    const formatPrice = (value: bigint, decimals: number = 8) => {
        return `$${Number(formatUnits(value, decimals)).toLocaleString()}`;
    };

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
                    <ConnectButton showBalance={false} />
                    <MoneyMakingDialog />
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
                    {dummyOptions.map((option, index) => (
                        <div key={index} className="bg-[var(--trading-row-bg)] rounded-2xl p-6 grid grid-cols-8 gap-4 items-center">
                            <div className="font-medium text-lg">${option.symbol}</div>
                            <div className="text-[var(--trading-text-muted)]">{formatPrice(option.strikePrice)}</div>
                            <div className="text-[var(--trading-text-muted)]">{formatPrice(option.startPrice)}</div>
                            <div className="text-[var(--trading-text-muted)]">{option.optionType}</div>
                            <div className="text-[var(--trading-text-muted)]">{formatPrice(option.premium)}</div>
                            <div className="text-[var(--trading-text-muted)]">{formatPrice(option.totalSupply)}</div>
                            <div className="text-[var(--trading-text-muted)]">{Number(option.collateral) / Number(option.premium)}x</div>
                            <div className="flex justify-end">
                                <Button
                                    className="bg-[var(--trading-green)] text-black hover:bg-[var(--trading-green)]/90 rounded-lg px-6 font-medium"
                                    onClick={() => setSelectedOption(option)}
                                >
                                    Buy
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedOption && <BuyOptionDialog option={selectedOption} isOpen={!!selectedOption} onClose={() => setSelectedOption(null)} />}
        </div>
    );
}
