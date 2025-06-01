import { OptionToken, OptionType, OptionStatus } from '@/types/option';

export const dummyOptions: OptionToken[] = [
    {
        address: '0x3Efa40d6bbE733b9eE8BeECEfCD09e453919CCC7',
        optionType: OptionType.CALL,
        strikePrice: BigInt(220000000), // $620
        expiration: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days from now
        executionWindowSize: BigInt(24 * 60 * 60), // 24 hours
        premium: BigInt(10000000), // $10
        collateral: BigInt(200000000), // $200
        startPrice: BigInt(200000000),
        priceFixed: true,
        totalSold: BigInt(1000000000000), // $1,000,000
        totalSupply: BigInt(1000000000000), // $1,000,000
        status: OptionStatus.ACTIVE,
        isFullyExecuted: false,
        pythAssetId: 'AAPL',
        pythAddress: '0x1234567890123456789012345678901234567890',
        paymentToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'AAPL',
        name: 'Apple Call Option',
        decimals: 6,
    },
    {
        address: '0x3Efa40d6bbE733b9eE8BeECEfCD09e453919CCC7',
        optionType: OptionType.CALL,
        strikePrice: BigInt(380000000), // $110,000
        expiration: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
        executionWindowSize: BigInt(24 * 60 * 60),
        premium: BigInt(20000000), // $10
        collateral: BigInt(692000000), // $1,000
        startPrice: BigInt(346000000), // $103,700
        priceFixed: true,
        totalSold: BigInt(1000000000000), // $1,000,000
        totalSupply: BigInt(1000000000000), // $1,000,000
        status: OptionStatus.ACTIVE,
        isFullyExecuted: false,
        pythAssetId: 'TSLA',
        pythAddress: '0x2345678901234567890123456789012345678901',
        paymentToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'TSLA',
        name: 'Tesla Call Option',
        decimals: 6,
    },
];
