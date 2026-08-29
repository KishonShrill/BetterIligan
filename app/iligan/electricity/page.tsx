import { Metadata } from "next";
import ElectricityClient from "./ElectricityClient";

export const metadata: Metadata = {
  title: "Iligan City Electricity Information",
  description:
    "Learn about Iligan City's electricity providers, management, and use our utility calculator.",
};

export default function ElectricityPage() {
  return <ElectricityClient />;
}
