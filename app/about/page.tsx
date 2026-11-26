import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our volunteer-led civic tech initiative to make Iligan City’s government more transparent and accessible.",
};

export default function AboutPage() {
  return <AboutClient />;
}
