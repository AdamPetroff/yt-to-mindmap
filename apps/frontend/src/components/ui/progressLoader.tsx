import React from "react";

interface ProgressLoaderProps {
  progress: number; // Progress percentage (0-100)
  className?: string; // Optional class for additional styling
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress,
  className,
}) => {
  return (
    <div className={`relative h-4 w-full rounded bg-gray-200 ${className}`}>
      <div
        style={{ width: `${progress}%` }}
        className="absolute h-4 rounded bg-green-500"
      ></div>
    </div>
  );
};

export default ProgressLoader;
