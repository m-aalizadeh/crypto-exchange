import { cn } from "../lib/utils";

export const LoadingSpinner = ({
  fullScreen = false,
  className = "",
}: {
  fullScreen?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "h-screen w-screen" : "h-full w-full",
        className
      )}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
};
