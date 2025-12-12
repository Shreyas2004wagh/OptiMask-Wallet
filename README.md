# OptiMask Wallet

OptiMask is a MetaMask-like environment that allows users to interact with the Ethereum blockchain seamlessly. With OptiMask, users can generate a mnemonic seed phrase, create multiple wallets, check their wallet balances, and even send transactions to other addresses.

## Features

- **Mnemonic Generation**: Generate a 12-word mnemonic seed phrase for secure wallet creation.
- **Multi-Wallet Support**: Create multiple wallets under a single mnemonic, each with its own address and private key.
- **Balance Checking**: Easily check the balance of each wallet in ETH.
- **Send Transactions**: Transfer ETH from your wallet to another Ethereum address with ease.
- **Clean UI**: A clean and responsive interface designed for ease of use.

## Tech Stack

- **React + TypeScript**: Modern frontend framework with type safety
- **Vite**: Fast build tool and development server
- **ethers.js**: For providing an easy-to-use library for interacting with the Ethereum blockchain
- **Alchemy**: For offering a reliable API to access blockchain data

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- An Alchemy API key ([Get one here](https://www.alchemy.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd OptiMask-Wallet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Alchemy API key to the `.env` file:
   ```
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Usage

### Generate a Seed Phrase
Click the "Generate Seed Phrase" button to create a new 12-word mnemonic. **Important**: Save this mnemonic securely - it's the master key to all your wallets!

### Create a Wallet
After generating a mnemonic, click "Create New Wallet" to create your first wallet. You can create multiple wallets from the same mnemonic - each will have a unique address and private key.

### Check Balance
1. Select a wallet from the dropdown menu
2. Click "Check Balance" to view the wallet's ETH balance

### Send Transactions
1. Select a wallet from the dropdown
2. Click "Send Transaction" to open the transaction form
3. Enter the recipient's Ethereum address
4. Enter the amount of ETH to send
5. Click "Send" to submit the transaction
6. Wait for confirmation - you'll see a transaction hash that links to Etherscan

## Security Notes

⚠️ **Important Security Warnings**:
- This is a development tool. For production use, implement additional security measures.
- Never share your mnemonic seed phrase or private keys with anyone.
- The mnemonic is stored in browser localStorage - clear it if you're on a shared computer.
- Always verify transaction details before sending.
- Use test networks (like Sepolia) for testing before using mainnet.

## Project Structure

```
OptiMask-Wallet/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── utils/
│   │   └── wallet.ts    # Wallet utility functions
│   └── ...
├── .env                 # Environment variables (create this)
├── package.json
└── README.md
```

## Future Enhancements

- **Multi-Chain Support**: Expand the wallet to support multiple blockchain networks (Polygon, Arbitrum, etc.)
- **Transaction History**: Display a list of past transactions for each wallet
- **Wallet Import**: Import existing wallets using private keys or JSON files
- **Network Switching**: Switch between Ethereum mainnet, testnets, and other networks
- **Token Support**: View and send ERC-20 tokens
- **Hardware Wallet Integration**: Support for Ledger and Trezor devices

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
