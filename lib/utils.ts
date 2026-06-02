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
