import type { FC } from 'react';

type MnemonicSectionProps = {
  mnemonic: string;
  copiedType: string;
  onGenerate: () => void;
  onCopyMnemonic: () => void;
};

export const MnemonicSection: FC<MnemonicSectionProps> = ({
  mnemonic,
  copiedType,
  onGenerate,
  onCopyMnemonic,
}) => (
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
            onClick={onCopyMnemonic}
            className="copy-button"
            title="Copy mnemonic"
            type="button"
          >
            {copiedType === 'mnemonic' ? '✓ Copied!' : '📋 Copy'}
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
    <button onClick={onGenerate} className="primary-button generate-button" type="button">
      <span>✨</span>
      Generate Seed Phrase
    </button>
  </section>
);

