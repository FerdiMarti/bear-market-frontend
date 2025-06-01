'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { metaMaskWallet, phantomWallet } from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
    chains: [base],
    ssr: true,
    appName: 'Yield Robin',
    projectId: 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
    wallets: [
        {
            groupName: 'Wallets',
            wallets: [metaMaskWallet, phantomWallet],
        },
    ],
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
