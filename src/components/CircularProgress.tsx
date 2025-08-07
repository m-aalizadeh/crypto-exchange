import React from "react";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 24,
  strokeWidth = 3,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className={`transform -rotate-90 ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="text-gray-300"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-blue-500 transition-all duration-300 ease-in-out"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: strokeDashoffset,
        }}
      />
    </svg>
  );
};

export default CircularProgress;
