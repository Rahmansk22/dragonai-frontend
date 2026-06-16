import React, { useId } from "react";

export default function Spinner({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const strokeWidth = Math.max(2, size / 16);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradId = useId();
  
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer ambient glow circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          border: `${strokeWidth}px solid rgba(212, 162, 79, 0.04)`,
          boxShadow: "0 0 15px rgba(212, 162, 79, 0.05)",
        }}
      />

      {/* Rotating gradient track sweep - Premium SaaS look */}
      <svg
        className="absolute animate-spin"
        style={{
          width: size,
          height: size,
          animationDuration: "1s",
          animationTimingFunction: "linear",
        }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A24F" stopOpacity="1" />
            <stop offset="50%" stopColor="#D4A24F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4A24F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        />
      </svg>

      {/* Inner counter-rotating thin ring */}
      <svg
        className="absolute animate-spin"
        style={{
          width: size * 0.65,
          height: size * 0.65,
          animationDuration: "2s",
          animationTimingFunction: "ease-in-out",
          animationDirection: "reverse",
        }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size * 0.65 - strokeWidth) / 2}
          stroke="#D4A24F"
          strokeWidth={Math.max(1, strokeWidth / 2.5)}
          fill="none"
          strokeDasharray={`${circumference * 0.15} ${circumference * 0.35}`}
          opacity="0.3"
        />
      </svg>

      {/* Center glowing energy dot */}
      <div
        className="absolute rounded-full bg-[#D4A24F] animate-pulse"
        style={{
          width: size * 0.18,
          height: size * 0.18,
          boxShadow: "0 0 10px 2px rgba(212, 162, 79, 0.75)",
        }}
      />
    </div>
  );
}


