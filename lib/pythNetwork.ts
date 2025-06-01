import { HermesClient, PriceUpdate } from '@pythnetwork/hermes-client';
import { ethers } from 'ethers';
import PythAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json' assert { type: 'json' };
import { USED_CONTRACTS } from './constants';
import { WalletClient } from 'viem';

export async function getLatestPriceUpdates(priceId: string) {
    const connection = new HermesClient('https://hermes.pyth.network', {});

    const priceIds = [priceId];

    // Latest price updates
    const priceUpdates = await connection.getLatestPriceUpdates(priceIds);

    return priceUpdates;
}

export async function publishPiceUpdate(update: PriceUpdate, walletClient: WalletClient) {
    if (!walletClient) {
        throw new Error('Wallet not connected');
    }

    try {
        console.log('Starting publishPiceUpdate...');

        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(USED_CONTRACTS.PYTH, PythAbi, signer);

        // Convert each hex string in the array to BytesLike format
        const updateData = update.binary.data.map(hexString => {
            try {
                // Ensure the hex string starts with 0x
                const hexWithPrefix = hexString.startsWith('0x') ? hexString : `0x${hexString}`;
                return hexWithPrefix;
            } catch (error) {
                console.error('Error converting hex string:', error);
                throw error;
            }
        });

        const feeAmount = await contract.getUpdateFee(updateData);
        console.log('Calling updatePriceFeeds...');
        const tx = await contract.updatePriceFeeds(updateData, { value: feeAmount });
        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        return receipt;
    } catch (error) {
        console.error('Error in publishPiceUpdate:', error);
        throw error;
    }
}
