import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ListItemProps {
    title: string;
    category: string;
    description: string;
    href?: string;
}

function isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}

export default function ListItem({ title, category, description, href }: ListItemProps) {
    const content = (
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{title}</h4>
                    <p className="mt-2 text-sm text-gray-600">{description}</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-sm bg-gray-100 text-gray-800">
                        {category}
                    </span>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 shrink-0" aria-hidden="true" />
            </div>
        </div>
    );

    if (!href) return content;

    if (isExternalUrl(href)) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className="block">
            {content}
        </Link>
    );
}
