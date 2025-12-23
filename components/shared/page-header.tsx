import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-8", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-bold text-bloom-blue">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
