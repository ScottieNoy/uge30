import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  textColor?: "white" | "black";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, textColor = "white", ...props }, ref) => {
    const colorClass =
      textColor === "black"
        ? "text-black placeholder-black/50"
        : "text-white placeholder-white/60";

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed",
          colorClass,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
