import { Metadata } from "next";
import { MapPin } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import { disasterFacilities } from "@/data/disaster";
import DisasterMapView from "./DisasterMapView";

export const metadata: Metadata = {
    title: "Iligan City Emergency Facilities Map",
    description: "Interactive map of hospitals, fire and police stations, utilities, and evacuation landmarks across Iligan City.",
};

export default function DisasterMapPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <SubpageNav href="/disaster" text="Back to Disaster Hub" />

            <div className="container mx-auto px-4 md:px-6 py-6">
                <div className="mb-4">
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                        <MapPin className="w-6 h-6 text-emerald-600" aria-hidden />
                        Emergency Facilities Map
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tap a pin or list item for its number and directions. Pin
                        locations are community-sourced from OpenStreetMap and are
                        approximate — confirm official evacuation centers with the
                        Iligan City CDRRMO.
                    </p>
                </div>

                <DisasterMapView facilities={disasterFacilities} />
            </div>
        </main>
    );
}
