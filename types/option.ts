export enum OptionType {
    CALL = 'CALL',
    PUT = 'PUT',
}

export enum OptionStatus {
    ACTIVE = 'ACTIVE', // Before expiration
    EXPIRED = 'EXPIRED', // After expiration but before execution window ends
    EXECUTED = 'EXECUTED', // After execution window ends
    FULLY_EXECUTED = 'FULLY_EXECUTED', // All tokens have been executed
}

export interface OptionToken {
    // Basic option details
    address: string;
    optionType: OptionType;
    strikePrice: bigint;
    expiration: bigint;
    executionWindowSize: bigint;
    premium: bigint;
    collateral: bigint;

    // Price information
    startPrice: bigint;
    executionPrice?: bigint;
    priceFixed: boolean;

    // Token information
    totalSold: bigint;
    totalSupply: bigint;

    // Status tracking
    status: OptionStatus;
    isFullyExecuted: boolean;

    // External contract addresses
    pythAssetId: string;
    pythAddress: string;
    paymentToken: string;

    // Optional metadata for frontend display
    symbol?: string;
    name?: string;
    decimals?: number;
}
