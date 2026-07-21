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


export function getCategoryStyles(categoryName: string) {
    const styles: Record<string, { bg: string; text: string }> = {
        'Animal Welfare': { bg: '#ecfdf5', text: '#059669' },               // emerald-50, emerald-600
        'Business, Trade and Investment': { bg: '#eff6ff', text: '#2563eb' },
        'Certificates and Vital Records': { bg: '#fffbeb', text: '#d97706' },
        'Disaster Preparedness': { bg: '#fef2f2', text: '#dc2626' },        // red-50, red-600
        'Education and Scholarships': { bg: '#ecfeff', text: '#0891b2' },
        'Health and Wellness': { bg: '#fff1f2', text: '#e11d48' },
        'Infrastructure and Public Works': { bg: '#fff7ed', text: '#ea580c' },
        'Transport and Driving': { bg: '#f5f3ff', text: '#7c3aed' },
    };

    return styles[categoryName] || { bg: '#f9fafb', text: '#4b5563' };
}
