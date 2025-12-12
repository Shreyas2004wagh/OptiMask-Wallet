import { useState, useEffect } from 'react';
import { generateMnemonic, createWalletFromMnemonic, getBalance, sendTransaction } from './utils/wallet';
import type { Wallet } from './utils/wallet';
import './App.css';

function App() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number>(-1);
  const [balance, setBalance] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Transaction form state
  const [showTransactionForm, setShowTransactionForm] = useState<boolean>(false);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  // Load mnemonic from localStorage on mount
  useEffect(() => {
    const savedMnemonic = localStorage.getItem('optimask_mnemonic');
    const savedWallets = localStorage.getItem('optimask_wallets');
    
    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }
    
    if (savedWallets) {
      try {
        setWallets(JSON.parse(savedWallets));
      } catch (e) {
        console.error('Failed to load wallets from localStorage', e);
      }
    }
  }, []);

  // Save wallets to localStorage whenever they change
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem('optimask_wallets', JSON.stringify(wallets));
    }
  }, [wallets]);

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    localStorage.setItem('optimask_mnemonic', newMnemonic);
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
    if (selectedWalletIndex === -1) {
      setError('Please select a wallet first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const wallet = wallets[selectedWalletIndex];
      const walletBalance = await getBalance(wallet.address);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      setBalance('');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    if (selectedWalletIndex === -1) {
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
      const wallet = wallets[selectedWalletIndex];
      const tx = await sendTransaction(wallet.privateKey, recipientAddress, amount);
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
      <header className="app-header">
        <h1>🔷 OptiMask Wallet</h1>
        <p className="subtitle">A MetaMask-like Ethereum wallet interface</p>
      </header>

      <main className="app-main">
        {/* Mnemonic Section */}
        <section className="card">
          <h2>Mnemonic Seed Phrase</h2>
          <div className="mnemonic-container">
            {mnemonic ? (
              <div className="mnemonic-display">
                {mnemonic.split(' ').map((word, index) => (
                  <span key={index} className="mnemonic-word">
                    {index + 1}. {word}
                  </span>
                ))}
              </div>
            ) : (
              <p className="placeholder">No mnemonic generated yet</p>
            )}
          </div>
          <button onClick={handleGenerateMnemonic} className="primary-button">
            Generate Seed Phrase
          </button>
        </section>

        {/* Wallet Management Section */}
        <section className="card">
          <h2>Wallet Management</h2>
          <button onClick={handleCreateWallet} className="primary-button" disabled={!mnemonic}>
            Create New Wallet
          </button>
          
          {wallets.length > 0 && (
            <div className="wallet-selector">
              <label htmlFor="wallet-select">Select Wallet:</label>
              <select
                id="wallet-select"
                value={selectedWalletIndex}
                onChange={(e) => {
                  setSelectedWalletIndex(parseInt(e.target.value));
                  setBalance('');
                }}
              >
                <option value="-1">-- Select a wallet --</option>
                {wallets.map((wallet, index) => (
                  <option key={index} value={index}>
                    Wallet {index + 1}: {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedWalletIndex !== -1 && wallets[selectedWalletIndex] && (
            <div className="wallet-info">
              <div className="info-row">
                <strong>Address:</strong>
                <span className="address">{wallets[selectedWalletIndex].address}</span>
              </div>
              <div className="info-row">
                <strong>Balance:</strong>
                <span className="balance">
                  {loading ? 'Loading...' : balance ? `${parseFloat(balance).toFixed(4)} ETH` : '--'}
                </span>
              </div>
              <div className="button-group">
                <button onClick={handleCheckBalance} disabled={loading} className="secondary-button">
                  Check Balance
                </button>
                <button 
                  onClick={() => setShowTransactionForm(!showTransactionForm)} 
                  className="secondary-button"
                >
                  Send Transaction
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Transaction Form */}
        {showTransactionForm && selectedWalletIndex !== -1 && (
          <section className="card transaction-form">
            <h2>Send Transaction</h2>
            <div className="form-group">
              <label htmlFor="recipient">Recipient Address:</label>
              <input
                id="recipient"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount (ETH):</label>
              <input
                id="amount"
                type="number"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="input-field"
              />
            </div>
            <div className="button-group">
              <button onClick={handleSendTransaction} disabled={loading} className="primary-button">
                {loading ? 'Sending...' : 'Send'}
              </button>
              <button 
                onClick={() => {
                  setShowTransactionForm(false);
                  setRecipientAddress('');
                  setAmount('');
                  setError('');
                }} 
                className="secondary-button"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Transaction Hash Display */}
        {txHash && (
          <div className="success-message">
            ✅ Transaction sent! Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
