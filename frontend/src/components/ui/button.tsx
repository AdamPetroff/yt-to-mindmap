"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { BeatLoader } from "react-spinners";
import { cn } from "@/lib/utils";

export function ButtonLoader({ color }: { color?: string }) {
  return <BeatLoader size={"3px"} loading={true} color={color} />;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-80",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-slate-50 shadow hover:bg-blue-700/90 active:bg-blue-900/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loadWhenClicked?: boolean;
  loading?: boolean;
  onClick?: () => any | Promise<any>;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loadWhenClicked = true,
      loading,
      disabled,
      children,
      onClick,
      asChild,
      ...props
    },
    ref,
  ) => {
    const [_loading, setLoading] = React.useState(false);

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || _loading}
        onClick={
          !loadWhenClicked
            ? onClick
            : onClick && !disabled
            ? () => {
                const click = onClick();

                // is promise?
                if (loadWhenClicked && click && click.then) {
                  setLoading(true);
                  click
                    .then(() => setLoading(false))
                    .catch(() => setLoading(false));
                }
              }
            : onClick
        }
        {...props}
      >
        {_loading || loading ? <ButtonLoader color={"white"} /> : children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
