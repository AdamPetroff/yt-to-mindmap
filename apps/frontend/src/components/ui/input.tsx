"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-1 h-10 rounded-full border border-blue-500 bg-slate-100/90 px-4 focus:outline-none focus:ring-2",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export function InputWithEndAddition({
  children,
  wrapperClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> &
  React.PropsWithChildren & { wrapperClassName?: string }) {
  return (
    <div className={cn(wrapperClassName, "relative flex")}>
      <Input {...props} />
      <div className="absolute right-0 grid h-full place-items-center px-[2px]">
        {children}
      </div>
    </div>
  );
}

export { Input };
