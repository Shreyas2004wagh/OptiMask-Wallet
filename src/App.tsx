import { useState, useEffect } from 'react';
import {
  generateMnemonic,
  createWalletFromMnemonic,
  getBalance,
  sendTransaction,
} from './utils/wallet';
import type { Wallet } from './utils/wallet';
import './App.css';
import { AppHeader } from './components/AppHeader.tsx';
import { MnemonicSection } from './components/MnemonicSection.tsx';
import { WalletSection } from './components/WalletSection.tsx';
import { TransactionForm } from './components/TransactionForm.tsx';
import { ErrorAlert, SuccessAlert } from './components/Alerts.tsx';
import { SecurityControls } from './components/SecurityControls.tsx';

function App() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number>(-1);
  const [balance, setBalance] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<string>('');
  
  // Transaction form state
  const [showTransactionForm, setShowTransactionForm] = useState<boolean>(false);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // On first load, clear any previously stored sensitive data from localStorage (migration away from persistence)
  useEffect(() => {
    try {
      if (localStorage.getItem('optimask_mnemonic') || localStorage.getItem('optimask_wallets')) {
        localStorage.removeItem('optimask_mnemonic');
        localStorage.removeItem('optimask_wallets');
      }
    } catch (e) {
      console.error('Failed to clear legacy localStorage data', e);
    }
  }, []);

  const selectedWallet = selectedWalletIndex !== -1 ? wallets[selectedWalletIndex] : undefined;

  const handleCopyMnemonic = () => {
    if (mnemonic) {
      void copyToClipboard(mnemonic, 'mnemonic');
    }
  };

  const handleCopyAddress = () => {
    if (selectedWallet) {
      void copyToClipboard(selectedWallet.address, 'address');
    }
  };

  const handleSelectWallet = (index: number) => {
    setSelectedWalletIndex(index);
    setBalance('');
  };

  const handleLockWallet = () => {
    // Clear all sensitive data from memory for the current session
    setMnemonic('');
    setWallets([]);
    setSelectedWalletIndex(-1);
    setBalance('');
    setShowTransactionForm(false);
    setRecipientAddress('');
    setAmount('');
    setTxHash('');
    setError('');
  };

  const handleResetApp = () => {
    // For now, reset behaves the same as locking since we do not persist secrets
    handleLockWallet();
  };

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setWallets([]);
    setSelectedWalletIndex(-1);
    setBalance('');
    setError('');
  };

  const handleCreateWallet = () => {
    if (!mnemonic.trim()) {
      setError('Please generate a mnemonic first');
      return;
    }

    try {
      const newIndex = wallets.length;
      const newWallet = createWalletFromMnemonic(mnemonic, newIndex);
      setWallets([...wallets, newWallet]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    }
  };

  const handleCheckBalance = async () => {
    if (!selectedWallet) {
      setError('Please select a wallet first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const walletBalance = await getBalance(selectedWallet.address);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      setBalance('');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    if (!selectedWallet) {
      setError('Please select a wallet first');
      return;
    }

    if (!recipientAddress.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const tx = await sendTransaction(selectedWallet.privateKey, recipientAddress, amount);
      setTxHash(tx.hash);
      setError('');
      
      // Reset form
      setRecipientAddress('');
      setAmount('');
      setShowTransactionForm(false);
      
      // Update balance after transaction
      setTimeout(() => {
        handleCheckBalance();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setTxHash('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="app-main">
        <MnemonicSection
          mnemonic={mnemonic}
          copiedType={copied}
          onGenerate={handleGenerateMnemonic}
          onCopyMnemonic={handleCopyMnemonic}
        />
        <WalletSection
          wallets={wallets}
          selectedWallet={selectedWallet}
          selectedWalletIndex={selectedWalletIndex}
          balance={balance}
          loading={loading}
          copiedType={copied}
          onCreateWallet={handleCreateWallet}
          onSelectWallet={handleSelectWallet}
          onCopyAddress={handleCopyAddress}
          onCheckBalance={handleCheckBalance}
          onToggleTransactionForm={() => setShowTransactionForm(!showTransactionForm)}
          isTransactionFormOpen={showTransactionForm}
          isMnemonicAvailable={Boolean(mnemonic)}
        />
        {showTransactionForm && selectedWallet && (
          <TransactionForm
            recipientAddress={recipientAddress}
            amount={amount}
            loading={loading}
            onRecipientChange={setRecipientAddress}
            onAmountChange={setAmount}
            onSubmit={handleSendTransaction}
            onCancel={() => {
              setShowTransactionForm(false);
              setRecipientAddress('');
              setAmount('');
              setError('');
            }}
          />
        )}
        <SecurityControls onLock={handleLockWallet} onReset={handleResetApp} />
        <ErrorAlert error={error} onClose={() => setError('')} />
        <SuccessAlert txHash={txHash} onClose={() => setTxHash('')} />
      </main>
    </div>
  );
}

export default App;
