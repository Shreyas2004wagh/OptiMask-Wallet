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
        <div className="logo-container">
          <div className="logo-icon">🔷</div>
          <h1>OptiMask Wallet</h1>
        </div>
        <p className="subtitle">Secure Ethereum wallet interface</p>
      </header>

      <main className="app-main">
        {/* Mnemonic Section */}
        <section className="card mnemonic-card">
          <div className="card-header">
            <h2>
              <span className="icon">🔐</span>
              Mnemonic Seed Phrase
            </h2>
          </div>
          <div className="mnemonic-container">
            {mnemonic ? (
              <>
                <div className="mnemonic-display">
                  {mnemonic.split(' ').map((word, index) => (
                    <span key={index} className="mnemonic-word">
                      <span className="word-number">{index + 1}</span>
                      <span className="word-text">{word}</span>
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => copyToClipboard(mnemonic, 'mnemonic')} 
                  className="copy-button"
                  title="Copy mnemonic"
                >
                  {copied === 'mnemonic' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </>
            ) : (
              <div className="placeholder-container">
                <div className="placeholder-icon">🔑</div>
                <p className="placeholder">No mnemonic generated yet</p>
                <p className="placeholder-hint">Generate a seed phrase to get started</p>
              </div>
            )}
          </div>
          <button onClick={handleGenerateMnemonic} className="primary-button generate-button">
            <span>✨</span>
            Generate Seed Phrase
          </button>
        </section>

        {/* Wallet Management Section */}
        <section className="card wallet-card">
          <div className="card-header">
            <h2>
              <span className="icon">💼</span>
              Wallet Management
            </h2>
            {wallets.length > 0 && (
              <span className="wallet-count">{wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'}</span>
            )}
          </div>
          
          <button onClick={handleCreateWallet} className="primary-button create-wallet-button" disabled={!mnemonic}>
            <span>➕</span>
            Create New Wallet
          </button>
          
          {wallets.length > 0 && (
            <div className="wallet-selector">
              <label htmlFor="wallet-select">
                <span className="label-icon">👛</span>
                Select Wallet:
              </label>
              <select
                id="wallet-select"
                value={selectedWalletIndex}
                onChange={(e) => {
                  setSelectedWalletIndex(parseInt(e.target.value));
                  setBalance('');
                }}
                className="wallet-select"
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
              <div className="wallet-details">
                <div className="info-row address-row">
                  <div className="info-label">
                    <span className="label-icon">📍</span>
                    <strong>Address:</strong>
                  </div>
                  <div className="address-container">
                    <span className="address">{wallets[selectedWalletIndex].address}</span>
                    <button 
                      onClick={() => copyToClipboard(wallets[selectedWalletIndex].address, 'address')}
                      className="icon-button"
                      title="Copy address"
                    >
                      {copied === 'address' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
                <div className="info-row balance-row">
                  <div className="info-label">
                    <span className="label-icon">💰</span>
                    <strong>Balance:</strong>
                  </div>
                  <div className="balance-container">
                    {loading ? (
                      <div className="loading-spinner"></div>
                    ) : balance ? (
                      <span className="balance">{parseFloat(balance).toFixed(4)} ETH</span>
                    ) : (
                      <span className="balance-placeholder">--</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="button-group">
                <button onClick={handleCheckBalance} disabled={loading} className="secondary-button">
                  <span>🔄</span>
                  {loading ? 'Checking...' : 'Check Balance'}
                </button>
                <button 
                  onClick={() => setShowTransactionForm(!showTransactionForm)} 
                  className="secondary-button"
                >
                  <span>📤</span>
                  Send Transaction
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Transaction Form */}
        {showTransactionForm && selectedWalletIndex !== -1 && (
          <section className="card transaction-form">
            <div className="card-header">
              <h2>
                <span className="icon">📨</span>
                Send Transaction
              </h2>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="recipient">
                  <span className="label-icon">👤</span>
                  Recipient Address:
                </label>
                <div className="input-wrapper">
                  <input
                    id="recipient"
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="amount">
                  <span className="label-icon">💵</span>
                  Amount (ETH):
                </label>
                <div className="input-wrapper">
                  <input
                    id="amount"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="button-group">
                <button onClick={handleSendTransaction} disabled={loading} className="primary-button send-button">
                  {loading ? (
                    <>
                      <div className="loading-spinner small"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Send Transaction</span>
                    </>
                  )}
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
            </div>
          </section>
        )}

        {/* Error Display */}
        {error && (
          <div className="alert-message error-message">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{error}</span>
            <button onClick={() => setError('')} className="alert-close">×</button>
          </div>
        )}

        {/* Transaction Hash Display */}
        {txHash && (
          <div className="alert-message success-message">
            <span className="alert-icon">✅</span>
            <div className="alert-content">
              <span className="alert-text">Transaction sent successfully!</span>
              <a 
                href={`https://etherscan.io/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="tx-link"
              >
                View on Etherscan
                <span className="external-icon">↗</span>
              </a>
            </div>
            <button onClick={() => setTxHash('')} className="alert-close">×</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
