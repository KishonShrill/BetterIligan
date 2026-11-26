import { Metadata } from "next";
import TravelClient from "./TravelClient";

export const metadata: Metadata = {
  title: "Travel & Transportation",
  description:
    "Navigate Iligan City with ease. Find essential information on local transportation, terminals, jeepney routes, and travel guidelines for residents and visitors.",
};

export default function TravelPage() {
  return <TravelClient />;
}
