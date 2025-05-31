'use client';

import { Button } from '@/components/ui/button';
import { MoneyMakingDialog } from '@/components/MoneyMakingDialog';
import Link from 'next/link';

export default function Page() {
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
