import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BloomCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function BloomCard({
  title,
  children,
  className,
  headerAction,
}: BloomCardProps) {
  return (
    <Card
      className={cn(
        "border-l-4 border-l-bloom-cyan shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {title && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-heading font-bold text-bloom-blue">
            {title}
          </CardTitle>
          {headerAction}
        </CardHeader>
      )}
      <CardContent className={cn(!title && "pt-6")}>{children}</CardContent>
    </Card>
  );
}
