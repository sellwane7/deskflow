import React from 'react';

// Icon mark: a resolved-ticket motif (rounded tile + checkmark stroke).
// theme="dark" is for use on the ink-colored brand panel; theme="light" for white surfaces.
const Logo = ({ theme = 'light', size = 'md', showWordmark = true }) => {
  const dims = size === 'lg' ? 40 : size === 'sm' ? 24 : 32;
  const wordmarkClass = `logo-wordmark logo-wordmark--${theme} logo-wordmark--${size}`;

  return (
    <div className="logo">
      <svg width={dims} height={dims} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="11" fill="#0E7C86" />
        <path
          d="M12 20.5L17.2 25.7L28 13"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className={wordmarkClass}>
          Desk<span className="logo-wordmark-accent">Flow</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
