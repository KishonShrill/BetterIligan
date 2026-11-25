import Link from "next/link";

/**
 * Parses description text with special link syntax and converts to React elements.
 *
 * Link syntax: {{link:/path/to/page|Link Text}}
 * Email syntax: {{email:user@example.com|Display Text}} or {{email:user@example.com}}
 *
 * Examples:
 * - "Go to {{link:/travel/transportation/jeepney|Jeepney Routes}} to find routes."
 * - "Contact us at {{email:hello@betteriligancity.org|our email}}."
 * - "Email {{email:support@betteriligancity.org}} for help."
 */
export function parseDescription(description: string): React.ReactNode {
  // Regex for both links and emails, with optional display text
  const pattern = /\{\{(link|email):([^|}]+)(?:\|([^}]+))?\}\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(description)) !== null) {
    // Add text before the link/email
    if (match.index > lastIndex) {
      parts.push(description.slice(lastIndex, match.index));
    }

    const type = match[1]; // "link" or "email"
    const value = match[2]; // URL or email address
    const text = match[3] || (type === "email" ? value : value); // Use value as default for email

    // Determine href based on type
    const href = type === "email" ? `mailto:${value}` : value;

    // Add the link component
    parts.push(
      <Link
        key={`${type}-${key++}`}
        href={href}
        className="font-medium text-blue-600 underline hover:text-blue-700"
        {...(type === "link" && value.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {text}
      </Link>,
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last link
  if (lastIndex < description.length) {
    parts.push(description.slice(lastIndex));
  }

  return parts.length > 0 ? parts : description;
}
