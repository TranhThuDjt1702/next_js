import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex outline-none h-10 rounded-lg pr-2 pl-2 w-full text-sm border border-gray-200 focus:border-purple-700 transition-all",
          "bg-gray-100 text-gray-900", 
          "dark:bg-white dark:text-gray-900 dark:border-gray-300 dark:focus:border-purple-500", 
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
