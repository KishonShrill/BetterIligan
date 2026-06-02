import { cn } from '@/lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
}

export default function Section({ children, className }: SectionProps) {
    return (
        <section className={cn('py-12 bg-white', className)}>
            <div className="container mx-auto px-4">{children}</div>
        </section>
    );
}
