import { Metadata } from 'next';
import BudgetClient from './BudgetClient';

export const metadata: Metadata = {
    title: 'Budget & Finances',
    description: "See where Iligan City's revenue comes from and where it's spent, sourced from official BLGF fiscal reports.",
    openGraph: {
        title: 'Iligan City Budget & Finances',
        description: "See where Iligan City's revenue comes from and where it's spent.",
        url: 'https://betteriligancity.org/transparency/budget',
        type: 'website',
    },
};

export default function BudgetPage() {
    return <BudgetClient />;
}
