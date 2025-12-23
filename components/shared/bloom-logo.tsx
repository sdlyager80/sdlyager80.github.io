import { cn } from "@/lib/utils";

interface BloomLogoProps {
  variant?: "full" | "icon";
  className?: string;
}

export function BloomLogo({ variant = "full", className }: BloomLogoProps) {
  if (variant === "icon") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="w-10 h-10 bg-bloom-cyan rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-heading font-bold text-xl">B</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-10 h-10 bg-bloom-cyan rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-heading font-bold text-xl">B</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-heading font-bold text-bloom-blue leading-none">
          Bloom
        </span>
        <span className="text-xs text-bloom-grey leading-none mt-0.5">
          Insurance
        </span>
      </div>
    </div>
  );
}
