import { Metadata } from 'next';
import BudgetClient from './BudgetClient';

export const metadata: Metadata = {
    title: 'Budget & Finances',
    description: "See where Iligan City's revenue comes from and where it's spent, sourced from official BLGF fiscal reports.",
};

export default function BudgetPage() {
    return <BudgetClient />;
}
