import { base, berachain, Chain, hederaTestnet } from 'wagmi/chains';

type AddressTypes = {
    USDC: string;
    NECT: string;
    PYTH: string;
    RPC: string;
    chain: Chain;
};

export const CONTRACT_ADDRESSES: {
    [chain: string]: {
        mainnet: AddressTypes;
        testnet?: AddressTypes;
    };
} = {
    BASE: {
        mainnet: {
            USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            NECT: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            PYTH: '0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a',
            RPC: 'https://mainnet.base.org',
            chain: base,
        },
    },
    BERACHAIN: {
        mainnet: {
            USDC: '',
            NECT: '',
            PYTH: '0x2880aB155794e7179c9eE2e38200202908C17B43',
            RPC: 'https://rpc.berachain.com',
            chain: berachain,
        },
    },
    HEDERA: {
        mainnet: {
            USDC: '',
            NECT: '',
            PYTH: '0xA2aa501b19aff244D90cc15a4Cf739D2725B5729',
            RPC: 'https://testnet.hashio.io/api',
            chain: hederaTestnet,
        },
    },
};

export const USED_CONTRACTS = CONTRACT_ADDRESSES.HEDERA.mainnet;

export const PYTH_ASSET_IDS = {
    AAPL: '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688',
    TSLA: '0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1',
    AMC: '0x5b1703d7eb9dc8662a61556a2ca2f9861747c3fc803e01ba5a8ce35cb50a13a1',
};
