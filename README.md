# Bear Market Frontend

A modern web3 frontend application built with Next.js for interacting with the Bear Market protocol. This application provides a user-friendly interface for users to interact with blockchain-based financial services.

## Features

-   Modern UI built with Next.js and Tailwind CSS
-   Web3 integration using RainbowKit and wagmi
-   Providing recent pricing data to Pyth Network Oracle
-   Type-safe development with TypeScript
-   Responsive and accessible components using Radix UI

## Tech Stack

-   **Framework**: Next.js 15
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Web3**: RainbowKit, wagmi, ethers
-   **UI Components**: Radix UI
-   **State Management**: React Query
-   **Price Feeds**: Pyth Network

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Start the production server:

```bash
npm start
```

## Development

-   `npm run dev` - Start development server with Turbopack
-   `npm run build` - Build the application
-   `npm run lint` - Run ESLint
-   `npm run generate-abis` - Generate contract ABIs

## Environment Setup

Make sure to set up your environment variables in a `.env.local` file. Currently required variables are:

-   NEXT_PUBLIC_MANAGER_ADDRESS: the contract address of the OptionTokenManager.sol

Additionally, the used chain and related contract addresses can be set in utils/constants.ts.
