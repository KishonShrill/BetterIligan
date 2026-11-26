import { Metadata } from "next";
import IliganClient from "./IliganClient";

export const metadata: Metadata = {
  title: "Iligan Directory",
  description:
    "Browse essential information about Iligan City, from local profiles and officials to barangays and public services.",
};

export default function IliganDirectoriesPage() {
  return <IliganClient />;
}
