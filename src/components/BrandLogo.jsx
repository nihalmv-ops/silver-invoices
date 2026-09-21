import React, { useState } from 'react';

export function BrandLogo({ logoSrc = '/logo.webp', size = 'md', align = 'center', className = '', alt = 'Silver Catering Logo' }) {
  const [imgError, setImgError] = useState(false);

  const activeSrc = logoSrc || '/logo.webp';

  const marginStyle = align === 'left' ? '0' : align === 'right' ? '0 0 0 auto' : '0 auto';

  // If user provided a logo or we have the official website logo, render the high-res image
  if (activeSrc && !imgError) {
    const sizeStyles = {
      xs: { height: '30px', maxWidth: '100px' },
      sm: { height: '42px', maxWidth: '140px' },
      md: { height: '70px', maxWidth: '220px' },
      lg: { height: '95px', maxWidth: '280px' },
      xl: { height: '125px', maxWidth: '360px' }
    };
    const style = sizeStyles[size] || sizeStyles.md;

    return (
      <img
        src={activeSrc}
        alt={alt}
        className={`brand-logo-img ${className}`}
        onError={() => setImgError(true)}
        style={{
          ...style,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          margin: marginStyle,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))'
        }}
      />
    );
  }

  // Otherwise, render the official luxury vector emblem for Silver Catering
  const dimension = size === 'sm' ? 44 : size === 'lg' ? 96 : 72;

  return (
    <div
      className={`brand-logo-vector ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: align === 'left' ? 'flex-start' : 'center'
      }}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
      >
        <defs>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6E6E6" />
            <stop offset="40%" stopColor="#A8A8A8" />
            <stop offset="70%" stopColor="#D4D4D4" />
            <stop offset="100%" stopColor="#8A8A8A" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFCE9F" />
            <stop offset="50%" stopColor="#B59A62" />
            <stop offset="100%" stopColor="#8C7443" />
          </linearGradient>
        </defs>

        {/* Outer Laurel / Decorative Ring */}
        <circle cx="60" cy="60" r="56" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />
        <circle cx="60" cy="60" r="52" stroke="url(#silverGrad)" strokeWidth="2" />
        <circle cx="60" cy="60" r="48" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.5" />

        {/* Central Heraldic Shield / Cloche */}
        {/* Dome cloche top knob */}
        <circle cx="60" cy="34" r="3.5" fill="url(#goldGrad)" />
        <path d="M57 37.5 C 57 35, 63 35, 63 37.5 Z" fill="url(#goldGrad)" />

        {/* Dome Cloche Lid */}
        <path
          d="M36 58 C 36 43, 84 43, 84 58 Z"
          fill="url(#silverGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="1.2"
        />

        {/* Cloche rim platter */}
        <path
          d="M32 60 C 32 58.5, 88 58.5, 88 60 L 86 63 C 86 64.5, 34 64.5, 34 63 Z"
          fill="url(#goldGrad)"
        />

        {/* Cloche Base Line */}
        <line x1="28" y1="65" x2="92" y2="65" stroke="url(#silverGrad)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Ornate Star at Crown */}
        <polygon points="60,20 62,25 67,26 63,29 64,34 60,31 56,34 57,29 53,26 58,25" fill="url(#goldGrad)" />
        <circle cx="48" cy="24" r="1.5" fill="url(#goldGrad)" opacity="0.8" />
        <circle cx="72" cy="24" r="1.5" fill="url(#goldGrad)" opacity="0.8" />

        {/* Ribbon Banner at bottom */}
        <path
          d="M24 76 L 36 71 L 84 71 L 96 76 L 90 84 L 84 79 L 36 79 L 30 84 Z"
          fill="#1C1C1C"
          stroke="url(#goldGrad)"
          strokeWidth="1"
        />

        {/* Monogram 'S' in Banner */}
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fill="url(#goldGrad)"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          letterSpacing="2.5"
        >
          SILVER
        </text>

        {/* Sub-text EVENTS */}
        <text
          x="60"
          y="93"
          textAnchor="middle"
          fill="#444444"
          fontSize="6"
          fontWeight="600"
          fontFamily="sans-serif"
          letterSpacing="2"
        >
          CATERING & EVENTS
        </text>

        {/* Five rating stars */}
        <g fill="url(#goldGrad)" transform="translate(42, 97) scale(0.6)">
          <polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" />
          <polygon points="30,1 32,7 38,7 33,11 35,17 30,13 25,17 27,11 22,7 28,7" />
          <polygon points="50,1 52,7 58,7 53,11 55,17 50,13 45,17 47,11 42,7 48,7" />
        </g>
      </svg>
    </div>
  );
}

