import { Metadata } from "next";
import GovernmentClient from "./GovernmentClient";

export const metadata: Metadata = {
  title: "Government & Departments | BetterIliganCity",
  description:
    "Access government directories, departmental profiles, public services, and contact information for the Iligan City local government unit.",
};

export default function GovernmentDirectory() {
  return <GovernmentClient />;
}
