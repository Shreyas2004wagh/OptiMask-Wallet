import type { FC } from 'react';

type ErrorAlertProps = {
  error: string;
  onClose: () => void;
};

type SuccessAlertProps = {
  txHash: string;
  onClose: () => void;
};

export const ErrorAlert: FC<ErrorAlertProps> = ({ error, onClose }) =>
  error ? (
    <div className="alert-message error-message">
      <span className="alert-icon">⚠️</span>
      <span className="alert-text">{error}</span>
      <button onClick={onClose} className="alert-close" type="button">
        ×
      </button>
    </div>
  ) : null;

export const SuccessAlert: FC<SuccessAlertProps> = ({ txHash, onClose }) =>
  txHash ? (
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
      <button onClick={onClose} className="alert-close" type="button">
        ×
      </button>
    </div>
  ) : null;

