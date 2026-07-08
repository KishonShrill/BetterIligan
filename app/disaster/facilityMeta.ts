import type { DisasterFacility } from "@/validations/disasterSchema";

export type Category = DisasterFacility["category"];

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
    evacuation: { label: "Evacuation", color: "#059669" },
    medical: { label: "Medical", color: "#dc2626" },
    fire: { label: "Fire", color: "#ea580c" },
    police: { label: "Police", color: "#2563eb" },
    government: { label: "Government", color: "#4f46e5" },
    utility: { label: "Utilities", color: "#475569" },
    barangay: { label: "Barangay", color: "#7c3aed" },
};

export const CATEGORY_ORDER: Category[] = [
    "evacuation",
    "medical",
    "fire",
    "police",
    "government",
    "utility",
    "barangay",
];

// LGU-published landlines are 7-digit local numbers; prepend the Iligan area
// code so tap-to-call routes from mobile phones. Mirrors HotlinesSection.
export function telHref(display: string): string {
    const cleaned = display.replace(/[^+\d]/g, "");
    return `tel:${cleaned.length === 7 ? `063${cleaned}` : cleaned}`;
}
