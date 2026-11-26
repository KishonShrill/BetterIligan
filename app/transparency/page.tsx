import { Metadata } from "next";
import TransparencyClient from "./TransparencyClient";

export const metadata: Metadata = {
  title: "Transparency & Open Data",
  description:
    "Explore Iligan City's public records, budget allocations, city resolutions, and open data initiatives for accountable and transparent governance.",
};

export default function TransparencyDirectory() {
  return <TransparencyClient />;
}
