import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PositionsPage() {
    // Sample data for user's bought options
    const boughtOptions = [
        {
            id: 1,
            underlying: '$SPX',
            type: 'Call',
            strike: '$610',
            expiresIn: '36h',
            size: 1,
        },
        {
            id: 2,
            underlying: '$BTC',
            type: 'Put',
            strike: '$100,000',
            expiresIn: '2d',
            size: 2,
        },
    ];

    // Sample data for user's created vault positions
    const vaultPositions = [
        {
            id: 1,
            underlying: '$SPX',
            type: 'Call',
            staked: '$1000',
            currency: '$NECT',
            yield: '$55.67',
            endingIn: '12h',
        },
        {
            id: 2,
            underlying: '$ETH',
            type: 'Put',
            staked: '$500',
            currency: '$NECT',
            yield: '$12.34',
            endingIn: '2d 4h',
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--trading-bg)] text-[var(--trading-text)] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-[var(--trading-yellow)] text-black border-[var(--trading-yellow)] hover:bg-[var(--trading-yellow)]/90"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-medium">My Positions</h1>
                </div>

                {/* Main container */}
                <div className="bg-[var(--trading-text-muted)] rounded-2xl p-8">
                    {/* Bought Options Section */}
                    <div className="mb-12">
                        <div className="space-y-4">
                            {boughtOptions.map(option => (
                                <div key={option.id} className="bg-[var(--trading-row-bg)] rounded-xl p-6 flex items-center justify-between">
                                    <div className="text-[var(--trading-text)]">
                                        <div className="text-lg font-medium mb-1">
                                            {option.underlying} {option.type}
                                        </div>
                                        <div className="text-sm text-[var(--trading-text-muted)] space-y-1">
                                            <div>Strike: {option.strike}</div>
                                            <div>Expires in: {option.expiresIn}</div>
                                            <div>Size: {option.size}</div>
                                        </div>
                                    </div>
                                    <Button className="bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-6">
                                        Sell
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vault Positions Section */}
                    <div>
                        <h2 className="text-xl font-medium text-black mb-6">Vault Positions</h2>
                        <div className="space-y-4">
                            {vaultPositions.map(position => (
                                <div key={position.id} className="bg-[var(--trading-row-bg)] rounded-xl p-6 flex items-center justify-between">
                                    <div className="text-[var(--trading-text)]">
                                        <div className="text-lg font-medium mb-1">
                                            {position.underlying} {position.type} Vault
                                        </div>
                                        <div className="text-sm text-[var(--trading-text-muted)] space-y-1">
                                            <div>
                                                Staked: {position.staked} {position.currency}
                                            </div>
                                            <div>Yield: {position.yield}</div>
                                        </div>
                                    </div>
                                    <Button
                                        disabled
                                        className="bg-[var(--trading-yellow)] text-black hover:bg-[var(--trading-yellow)]/90 rounded-lg px-6"
                                    >
                                        Ending in {position.endingIn}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
