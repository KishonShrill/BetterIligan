import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface ListItemProps {
  title: string;
  category: string;
  description: string;
  href?: string;
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function ListItem({
  title,
  category,
  description,
  href,
}: ListItemProps) {
  const content = (
    <div className="hover:border-primary-500 cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900">{title}</h4>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          <span className="mt-2 inline-block rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {category}
          </span>
        </div>
        <ExternalLink
          className="h-5 w-5 shrink-0 text-gray-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );

  if (!href) return content;

  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
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
