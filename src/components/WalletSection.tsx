import type { FC } from 'react';
import type { Wallet } from '../utils/wallet';

type WalletSectionProps = {
  wallets: Wallet[];
  selectedWallet: Wallet | undefined;
  selectedWalletIndex: number;
  balance: string;
  loading: boolean;
  copiedType: string;
  onCreateWallet: () => void;
  onSelectWallet: (index: number) => void;
  onCopyAddress: () => void;
  onCheckBalance: () => void;
  onToggleTransactionForm: () => void;
  isTransactionFormOpen: boolean;
  isMnemonicAvailable: boolean;
};

export const WalletSection: FC<WalletSectionProps> = ({
  wallets,
  selectedWallet,
  selectedWalletIndex,
  balance,
  loading,
  copiedType,
  onCreateWallet,
  onSelectWallet,
  onCopyAddress,
  onCheckBalance,
  onToggleTransactionForm,
  isTransactionFormOpen,
  isMnemonicAvailable,
}) => (
  <section className="card wallet-card">
    <div className="card-header">
      <h2>
        <span className="icon">💼</span>
        Wallet Management
      </h2>
      {wallets.length > 0 && (
        <span className="wallet-count">
          {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'}
        </span>
      )}
    </div>

    <button
      onClick={onCreateWallet}
      className="primary-button create-wallet-button"
      disabled={!isMnemonicAvailable}
      type="button"
    >
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
          onChange={(e) => onSelectWallet(parseInt(e.target.value, 10))}
          className="wallet-select"
        >
          <option value={-1}>-- Select a wallet --</option>
          {wallets.map((wallet, index) => (
            <option key={wallet.address} value={index}>
              Wallet {index + 1}: {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
            </option>
          ))}
        </select>
      </div>
    )}

    {selectedWallet && (
      <div className="wallet-info">
        <div className="wallet-details">
          <div className="info-row address-row">
            <div className="info-label">
              <span className="label-icon">📍</span>
              <strong>Address:</strong>
            </div>
            <div className="address-container">
              <span className="address">{selectedWallet.address}</span>
              <button
                onClick={onCopyAddress}
                className="icon-button"
                title="Copy address"
                type="button"
              >
                {copiedType === 'address' ? '✓' : '📋'}
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
                <div className="loading-spinner" />
              ) : balance ? (
                <span className="balance">{parseFloat(balance).toFixed(4)} ETH</span>
              ) : (
                <span className="balance-placeholder">--</span>
              )}
            </div>
          </div>
        </div>
        <div className="button-group">
          <button
            onClick={onCheckBalance}
            disabled={loading}
            className="secondary-button"
            type="button"
          >
            <span>🔄</span>
            {loading ? 'Checking...' : 'Check Balance'}
          </button>
          <button
            onClick={onToggleTransactionForm}
            className="secondary-button"
            type="button"
          >
            <span>📤</span>
            {isTransactionFormOpen ? 'Hide Transaction' : 'Send Transaction'}
          </button>
        </div>
      </div>
    )}
  </section>
);

