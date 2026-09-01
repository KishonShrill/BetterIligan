import { Metadata } from "next";
import MapWrapper from "./MapWrapper";

export const metadata: Metadata = {
  title: "Jeepney Routes",
  description:
    "Interactive map of Iligan City jeepney routes and transportation guides.",
};

export default function TransportationPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* The heavy lifting happens inside this client component */}
      <MapWrapper />
    </main>
  );
}
