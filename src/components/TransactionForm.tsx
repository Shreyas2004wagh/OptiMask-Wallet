import type { FC } from 'react';

type TransactionFormProps = {
  recipientAddress: string;
  amount: string;
  loading: boolean;
  onRecipientChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const TransactionForm: FC<TransactionFormProps> = ({
  recipientAddress,
  amount,
  loading,
  onRecipientChange,
  onAmountChange,
  onSubmit,
  onCancel,
}) => (
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
            onChange={(e) => onRecipientChange(e.target.value)}
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
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            className="input-field"
          />
        </div>
      </div>
      <div className="button-group">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="primary-button send-button"
          type="button"
        >
          {loading ? (
            <>
              <div className="loading-spinner small" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Send Transaction</span>
            </>
          )}
        </button>
        <button onClick={onCancel} className="secondary-button" type="button">
          Cancel
        </button>
      </div>
    </div>
  </section>
);

