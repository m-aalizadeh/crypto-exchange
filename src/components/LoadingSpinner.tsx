import { cn } from "../lib/utils";

export const LoadingSpinner = ({
  fullScreen = false,
  className = "",
  size = "default",
}: {
  fullScreen?: boolean;
  className?: string;
  size?: "small" | "default" | "large";
}) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    default: "h-12 w-12 border-[3px]",
    large: "h-16 w-16 border-4",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "h-screen w-screen" : "h-full w-full",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          "border-t-indigo-500 dark:border-t-indigo-400",
          "border-r-indigo-500/30 dark:border-r-indigo-400/30",
          "border-b-indigo-500 dark:border-b-indigo-400",
          "border-l-indigo-500/30 dark:border-l-indigo-400/30",
          "transition-colors duration-200"
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
