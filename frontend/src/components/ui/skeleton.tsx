import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[8px] bg-[#161B26] border border-[#1E2433]", className)}
      {...props}
    />
  );
}

export { Skeleton };
