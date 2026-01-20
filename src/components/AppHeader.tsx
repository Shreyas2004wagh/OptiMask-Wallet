import type { FC } from 'react';

export const AppHeader: FC = () => (
  <header className="app-header">
    <div className="logo-container">
      <div className="logo-icon">🔷</div>
      <h1>OptiMask Wallet</h1>
    </div>
    <p className="subtitle">Secure Ethereum wallet interface</p>
  </header>
);

