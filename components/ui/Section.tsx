import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("bg-white py-12 font-sans", className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
