import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-500 text-[#090A0F] hover:bg-emerald-400 shadow-sm font-semibold tracking-tight shadow-emerald-500/20 hover:shadow-emerald-500/30",
        secondary:
          "bg-[#161B26] text-[#F8FAFC] hover:bg-[#1E2433] border border-[#1E2433] hover:border-emerald-500/40",
        outline:
          "border border-[#1E2433] bg-transparent text-[#F8FAFC] hover:bg-[#0F1219] hover:border-emerald-500/50",
        ghost:
          "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161B26]",
        danger:
          "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50",
        brandGhost:
          "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-xs gap-1.5",
        default: "h-9 px-4 py-2 gap-2",
        lg: "h-11 px-6 text-base gap-2.5",
        icon: "h-9 w-9 p-0",
        iconSm: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
