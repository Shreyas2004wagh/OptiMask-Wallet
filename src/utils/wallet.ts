import { ethers } from 'ethers';

export type Wallet = {
  address: string;
  privateKey: string;
  index: number;
};

/**
 * Generate a new 12-word mnemonic seed phrase
 */
export function generateMnemonic(): string {
  return ethers.Wallet.createRandom().mnemonic!.phrase;
}

/**
 * Create a wallet from a mnemonic at a specific derivation index
 */
export function createWalletFromMnemonic(mnemonic: string, index: number = 0): Wallet {
  const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
  const wallet = hdNode.deriveChild(index);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    index: index,
  };
}

/**
 * Get provider using Alchemy API
 */
export function getProvider(): ethers.JsonRpcProvider {
  const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Alchemy API key not found. Please set VITE_ALCHEMY_API_KEY in your .env file.');
  }
  
  return new ethers.AlchemyProvider('homestead', apiKey);
}

/**
 * Get wallet balance in ETH
 */
export async function getBalance(address: string): Promise<string> {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

/**
 * Send ETH transaction
 */
export async function sendTransaction(
  privateKey: string,
  to: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  const provider = getProvider();
  const wallet = new ethers.Wallet(privateKey, provider);
  
  const tx = await wallet.sendTransaction({
    to: to,
    value: ethers.parseEther(amount),
  });
  
  return tx;
}

