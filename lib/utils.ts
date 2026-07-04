import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

/**
 * Safely serialize JSON-LD for injection into a <script type="application/ld+json"> tag.
 * Escapes `<` as `\u003c` to prevent `</script>` injection via malicious data.
 */
export function safeJsonLd(data: Record<string, unknown>): string {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}
