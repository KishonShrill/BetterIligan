import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
        hoverable &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      className={cn("border-b border-gray-200 p-4 md:p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div className={cn("p-4 md:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "border-t border-gray-200 bg-gray-50 p-4 md:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
