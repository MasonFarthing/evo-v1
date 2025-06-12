import React from 'react';

interface EvoLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const EvoLogo: React.FC<EvoLogoProps> = ({ 
  className = "", 
  width = 114, 
  height = 57 
}) => {
  
  // The SVG is designed to naturally fit its viewBox, so no extra
  // runtime translation/scale math is necessary.  We let the viewBox
  // and ordinary layout utilities (flex, mx-auto, etc.) handle all
  // positioning just like a typical icon.

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 152 60"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "none", overflow: "visible" }}
    >
      <defs>
        {/* Quantum Shell Gradient */}
        <linearGradient id="quantumShell" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="50%" stopColor="#0080ff" />
          <stop offset="100%" stopColor="#8000ff" />
        </linearGradient>

        {/* Stellar Glow Effect */}
        <filter id="stellarGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Logo group */}
      <g filter="url(#stellarGlow)" transform="translate(0 30)">
        {/* E */}
        <g>
          <rect x="0" y="-30" width="35" height="8" fill="url(#quantumShell)" />
          <rect x="0" y="-6" width="28" height="6" fill="url(#quantumShell)" />
          <rect x="0" y="22" width="35" height="8" fill="url(#quantumShell)" />
          <rect x="0" y="-30" width="8" height="60" fill="url(#quantumShell)" />
        </g>

        {/* V */}
        <g transform="translate(50 0)">
          <polygon points="0,-30 6,-30 18,30 12,30" fill="url(#quantumShell)" />
          <polygon points="32,-30 38,-30 26,30 18,30" fill="url(#quantumShell)" />
        </g>

        {/* O */}
        <g transform="translate(105 0)">
          <circle cx="19" cy="0" r="28" fill="none" stroke="url(#quantumShell)" strokeWidth="8" />
          <circle cx="19" cy="0" r="15" fill="none" stroke="url(#quantumShell)" strokeWidth="2" opacity="0.7" />
        </g>
      </g>
    </svg>
  );
};

export default EvoLogo; 