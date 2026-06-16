import React from 'react';

interface EmbercrestEmblemProps {
  className?: string;
  size?: number;
}

const EmbercrestEmblem: React.FC<EmbercrestEmblemProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="#D4A24F"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />
      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="#D4A24F"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* Decorative dots around circle */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 42 * Math.cos(rad);
        const y = 50 + 42 * Math.sin(rad);
        return (
          <circle
            key={angle}
            cx={x}
            cy={y}
            r="2"
            fill="#D4A24F"
            opacity="0.7"
          />
        );
      })}
      {/* Dragon head silhouette */}
      <path
        d="M50 22 
           C48 22, 46 23, 45 25 
           C44 27, 44 29, 45 31 
           C43 30, 41 30, 40 31 
           C38 32, 38 34, 39 36 
           C37 35, 35 36, 34 38 
           C33 40, 34 42, 36 43 
           C35 44, 35 46, 36 48 
           C37 50, 39 51, 41 50 
           C41 52, 42 54, 44 55 
           C45 56, 47 56, 48 55 
           C49 57, 50 58, 50 60 
           C50 58, 51 57, 52 55 
           C53 56, 55 56, 56 55 
           C58 54, 59 52, 59 50 
           C61 51, 63 50, 64 48 
           C65 46, 65 44, 64 43 
           C66 42, 67 40, 66 38 
           C65 36, 63 35, 61 36 
           C62 34, 62 32, 60 31 
           C59 30, 57 30, 55 31 
           C56 29, 56 27, 55 25 
           C54 23, 52 22, 50 22Z"
        fill="#D4A24F"
        opacity="0.15"
        stroke="#D4A24F"
        strokeWidth="0.8"
      />
      {/* Dragon eye */}
      <ellipse
        cx="47"
        cy="38"
        rx="2.5"
        ry="2"
        fill="#D4A24F"
        opacity="0.9"
      />
      <ellipse
        cx="53"
        cy="38"
        rx="2.5"
        ry="2"
        fill="#D4A24F"
        opacity="0.9"
      />
      {/* Flames below dragon */}
      <path
        d="M42 62 
           C42 60, 44 58, 46 60 
           C47 58, 49 57, 50 59 
           C51 57, 53 58, 54 60 
           C56 58, 58 60, 58 62 
           C58 65, 55 68, 50 70 
           C45 68, 42 65, 42 62Z"
        fill="#D4A24F"
        opacity="0.2"
        stroke="#D4A24F"
        strokeWidth="0.6"
      />
      {/* Center gem */}
      <polygon
        points="50,35 52,39 50,43 48,39"
        fill="#D4A24F"
        opacity="0.6"
      />
    </svg>
  );
};

export default EmbercrestEmblem;
