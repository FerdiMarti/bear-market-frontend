import { OptionToken, OptionType, OptionStatus } from '@/types/option';

export const dummyOptions: OptionToken[] = [
    {
        address: '0x1234567890123456789012345678901234567890',
        optionType: OptionType.CALL,
        strikePrice: BigInt(62000000000), // $620
        expiration: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days from now
        executionWindowSize: BigInt(24 * 60 * 60), // 24 hours
        premium: BigInt(1000000000), // $10
        collateral: BigInt(20000000000), // $200
        startPrice: BigInt(59000000000), // $590
        priceFixed: true,
        totalSold: BigInt(1000000000000), // $1,000,000
        totalSupply: BigInt(1000000000000), // $1,000,000
        status: OptionStatus.ACTIVE,
        isFullyExecuted: false,
        pythAssetId: 'SPX',
        pythAddress: '0x1234567890123456789012345678901234567890',
        paymentToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'SPX',
        name: 'S&P 500 Call Option',
        decimals: 8,
    },
    {
        address: '0x2345678901234567890123456789012345678901',
        optionType: OptionType.CALL,
        strikePrice: BigInt(1100000000000), // $110,000
        expiration: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
        executionWindowSize: BigInt(24 * 60 * 60),
        premium: BigInt(1000000000), // $10
        collateral: BigInt(100000000000), // $1,000
        startPrice: BigInt(1037000000000), // $103,700
        priceFixed: true,
        totalSold: BigInt(1000000000000), // $1,000,000
        totalSupply: BigInt(1000000000000), // $1,000,000
        status: OptionStatus.ACTIVE,
        isFullyExecuted: false,
        pythAssetId: 'BTC',
        pythAddress: '0x2345678901234567890123456789012345678901',
        paymentToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'BTC',
        name: 'Bitcoin Call Option',
        decimals: 8,
    },
    {
        address: '0x3456789012345678901234567890123456789012',
        optionType: OptionType.CALL,
        strikePrice: BigInt(300000000000), // $3,000
        expiration: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
        executionWindowSize: BigInt(24 * 60 * 60),
        premium: BigInt(1000000000), // $10
        collateral: BigInt(10000000000), // $100
        startPrice: BigInt(270000000000), // $2,700
        priceFixed: true,
        totalSold: BigInt(1000000000000), // $1,000,000
        totalSupply: BigInt(1000000000000), // $1,000,000
        status: OptionStatus.ACTIVE,
        isFullyExecuted: false,
        pythAssetId: 'ETH',
        pythAddress: '0x3456789012345678901234567890123456789012',
        paymentToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'ETH',
        name: 'Ethereum Call Option',
        decimals: 8,
    },
];
