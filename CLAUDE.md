# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NextJS 15 React application demonstrating integration between OneBalance (a Bitcoin DeFi platform) and Turnkey (a wallet infrastructure provider). The app provides a Bitcoin wallet interface with features for balance viewing, swapping, transfers, and transaction history.

**Key integrations:**
- **Turnkey SDK**: Handles wallet management and authentication via passkeys
- **OneBalance API**: Provides Bitcoin DeFi services (swaps, transfers, balance aggregation)
- **Bitcoin handling**: Uses bitcoinjs-lib for Bitcoin operations

## Development Commands

The project uses pnpm as the package manager. Key commands:

```bash
# Development
pnpm i                 # Install dependencies
pnpm run dev          # Start development server with Turbopack
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run tsc          # Run TypeScript compiler check
```

**Requirements:** Node.js v22, pnpm v9

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- `PUBLIC_TURNKEY_ORGANIZATION_ID` - Turnkey organization identifier  
- `PUBLIC_TURNKEY_RP_ID` - Turnkey relying party ID for passkeys
- `PUBLIC_ONEBALANCE_API` - OneBalance API base URL
- `TURNKEY_API_PRIVATE_KEY` - Server-side Turnkey API key
- `TURNKEY_API_PUBLIC_KEY` - Public key for Turnkey API
- `PUBLIC_ONEBALANCE_API_KEY` - OneBalance API authentication

## Architecture

### App Structure
- **App Router**: Uses NextJS 15 app directory structure with API routes
- **Authentication Flow**: Turnkey passkey-based auth → OneBalance account creation → Feature access
- **State Management**: React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom Pangram font family

### Key Directories
- `src/app/` - NextJS app router pages and API routes
- `src/features/` - Feature-based organization with co-located hooks, UI, and logic
- `src/components/ui/` - Reusable UI components (Radix-based)

### Feature Architecture
Each feature follows a consistent pattern:
- `*-ui.tsx` - React components and UI logic
- `*.ts` - Core business logic and types  
- `use-*.ts` - Custom React hooks
- `fetch-*.ts` - API integration functions

### Critical Components
- **Authentication**: `src/features/turnkey/use-turnkey-auth.ts` manages Turnkey authentication state
- **OneBalance Integration**: `src/features/onebalance-account/` handles account creation and management
- **Bitcoin Wallet**: `src/features/onebalance-account/use-persisted-btc-wallet.ts` manages wallet persistence

### API Routes
- `/api/balances/` - Balance aggregation endpoints
- `/api/assets/` - Supported asset information  
- `/api/chains/` - Blockchain network data
- `/api/predict-address/` - Address prediction for transactions

## Development Notes

### Next.js Configuration
- Uses standalone output for containerization
- WebAssembly support enabled for Bitcoin cryptography libraries
- Special handling for `tiny-secp256k1` in file tracing

### State Management Pattern
- React Query for all server state and API calls
- Custom hooks encapsulate feature logic and provide clean interfaces
- Authentication state drives conditional rendering throughout the app

### Bitcoin Integration
The app handles Bitcoin operations using:
- `bitcoinjs-lib` for transaction construction
- `tiny-secp256k1` for cryptographic operations  
- Turnkey for secure key management
- OneBalance for DeFi operations and address management

### Testing
Use standard Next.js testing patterns. The codebase currently doesn't include test files, so establish testing conventions when adding tests.