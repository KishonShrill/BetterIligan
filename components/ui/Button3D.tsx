import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ElementType, type Ref } from 'react';

interface Button3DProps {
    text: string;
    href?: string;
    onClick?: () => void;
    icon?: ElementType;
    ref?: Ref<HTMLAnchorElement | HTMLButtonElement>;
    hasArrow?: boolean;
    iconPosition?: 'left' | 'right';
    variant?: 'white' | 'blue' | 'slate';
    size?: 'sm' | 'md' | 'lg';
    className?: string; // For passing extra classes like w-full
}

export default function Button3D({
    text,
    href,
    onClick,
    icon: IconComponent,
    ref,
    iconPosition = 'right',
    hasArrow = false,
    variant = 'white',
    size = 'md',
    className = '',
}: Button3DProps) {

    // --- SIZE DICTIONARY ---
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3.5 md:py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    // --- COLOR VARIANT DICTIONARY ---
    // This maps the default, hover, and active states perfectly for each theme
    const variantClasses = {
        white: `
            bg-white text-blue-700 
            shadow-[0_4px_0_0_#bfdbfe] 
            hover:bg-blue-50 hover:shadow-[0_8px_0_0_#93c5fd] 
            active:shadow-[0_0px_0_0_#93c5fd]
        `,
        blue: `
            bg-blue-600 text-white 
            shadow-[0_4px_0_0_#1e3a8a] 
            hover:bg-blue-500 hover:shadow-[0_8px_0_0_#1e3a8a] 
            active:shadow-[0_0px_0_0_#1e3a8a]
        `,
        slate: `
            bg-slate-800 text-white 
            shadow-[0_4px_0_0_#0f172a] 
            hover:bg-slate-700 hover:shadow-[0_8px_0_0_#0f172a] 
            active:shadow-[0_0px_0_0_#0f172a]
        `
    };

    // --- SHARED BASE CLASSES ---
    const baseClasses = `
        relative group flex items-center justify-center gap-2 font-bold 
        transform transition-all duration-150 
        hover:-translate-y-1 active:translate-y-1
        before:absolute before:inset-0 before:-bottom-4 before:content-['']
    `;

    // Combine them all together safely
    const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim().replace(/\s+/g, ' ');
    const iconSizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    const hoverTranslateClass = iconPosition === 'right' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1';

    const renderIcon = IconComponent
        ? <IconComponent className={`transition-transform ${hoverTranslateClass} ${iconSizeClass}`} />
        : hasArrow ? <ArrowRight className={`group-hover:translate-x-1 transition-transform ${hoverTranslateClass} ${iconSizeClass}`} /> : null;

    const InnerContent = (
        <>
            {iconPosition === 'left' && renderIcon}
            {text}
            {iconPosition === 'right' && renderIcon}
        </>
    );

    // If an href is provided, render a Next.js Link
    if (href) {
        return (
            <Link ref={ref as Ref<HTMLAnchorElement>} href={href} className={finalClasses}>
                {InnerContent}
            </Link>
        );
    }

    // Otherwise, render a standard HTML button
    return (
        <button ref={ref as Ref<HTMLButtonElement>} onClick={onClick} className={finalClasses}>
            {InnerContent}
        </button>
    );
}
