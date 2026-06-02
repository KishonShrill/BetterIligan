import { cn } from '@/lib/utils';

interface TextProps {
    size?: 'sm' | 'md' | 'lg';
    transform?: 'none' | 'uppercase' | 'lowercase';
    className?: string;
    children: React.ReactNode;
}

const sizeClasses = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
const transformClasses = { none: '', uppercase: 'uppercase', lowercase: 'lowercase' };

export function Text({ size = 'md', transform = 'none', className, children }: TextProps) {
    return (
        <p className={cn(sizeClasses[size], 'mb-2 max-w-lg', transformClasses[transform], className)}>
            {children}
        </p>
    );
}
