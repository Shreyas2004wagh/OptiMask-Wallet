import type { FC } from 'react';

type SecurityControlsProps = {
  onLock: () => void;
  onReset: () => void;
};

export const SecurityControls: FC<SecurityControlsProps> = ({ onLock, onReset }) => (
  <section className="card security-card">
    <div className="card-header">
      <h2>
        <span className="icon">🛡️</span>
        Security Controls
      </h2>
    </div>
    <p className="security-note">
      Lock or reset the wallet to clear all sensitive data from this session&apos;s memory.
    </p>
    <div className="button-group">
      <button type="button" onClick={onLock} className="secondary-button">
        <span>🔒</span>
        Lock Wallet
      </button>
      <button type="button" onClick={onReset} className="secondary-button">
        <span>🧹</span>
        Reset Session
      </button>
    </div>
  </section>
);

