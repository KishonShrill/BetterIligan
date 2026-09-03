import { Metadata } from "next";
import MugnaMapClient from "./MugnaMapClient";
import ReferencesFooter from "@/components/ui/ReferencesFooter";

// 1. Define your SEO Metadata
export const metadata: Metadata = {
  title: "Mugna sa Iligan 2026 | Traffic Routes & Parking",
  description:
    "Interactive map for MUGNA SA ILIGAN 2026 traffic routes, one-way streets, parking restrictions, and event zones.",
  openGraph: {
    title: "Mugna sa Iligan 2026 | Traffic Routes & Parking",
    description:
      "Interactive map for MUGNA SA ILIGAN 2026 traffic routes and parking restrictions.",
    type: "website",
  },
};

const REFERENCES = [
  {
    title:
      "City Government of Iligan - 𝐌𝐔𝐆𝐍𝐀 𝐒𝐀 𝐈𝐋𝐈𝐆𝐀𝐍 𝐓𝐑𝐀𝐅𝐅𝐈𝐂 𝐑𝐎𝐔𝐓𝐄𝐒 & 𝐏𝐀𝐑𝐊𝐈𝐍𝐆 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍𝐒",
    url: "https://www.facebook.com/photo?fbid=1075954835191568",
  },
  {
    title:
      "𝐓𝐑𝐀𝐅𝐅𝐈𝐂 𝐔𝐏𝐃𝐀𝐓𝐄: 𝐈𝐂𝐓𝐏𝐌𝐎, 𝐆𝐈-𝐑𝐄𝐀𝐒𝐒𝐄𝐒𝐒 𝐀𝐍𝐆 𝐏𝐀𝐃𝐔𝐋𝐎𝐍𝐆 𝐔𝐆 𝐏𝐀𝐆𝐆𝐀𝐖𝐀𝐒 𝐒𝐀 𝐌𝐔𝐆𝐍𝐀",
    url: "https://www.facebook.com/photo?fbid=1077815181672200",
  },
];

export default function MugnaMapPage() {
  return (
    <div className="bg-white">
      <MugnaMapClient />

      {/* Static Footer: Server rendered */}
      <div className="container mx-auto mt-4 mb-8 px-4">
        <ReferencesFooter
          references={REFERENCES}
          disclaimer="Information is gathered from official Facebook announcements and pages published by the Local Government Unit (LGU) of Iligan City. Details are based on publicly available information from these official sources and may be updated as new announcements are released."
        />
      </div>
    </div>
  );
}
