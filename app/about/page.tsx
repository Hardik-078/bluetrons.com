import type { Metadata } from "next";
import AboutZoomGate from "@/components/about/AboutZoomGate";
import AboutStatement from "@/components/about/AboutStatement";
import Engagement from "@/components/sections/Engagement";

export const metadata: Metadata = {
  title: "About — BLUETRON INFOTECH LLP",
  description:
    "Technology. Reliability. Commitment. Bluetron Infotech LLP is a technology solutions and IT infrastructure company serving Corporate, Government, PSU, Education and Enterprise customers.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — BLUETRON INFOTECH LLP",
    description:
      "Technology. Reliability. Commitment. The approach behind Bluetron Infotech LLP.",
    url: "https://bluetrons.com/about",
    siteName: "BLUETRON INFOTECH LLP",
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="sec-page flex w-full flex-col">
      {/* The camera pushes into the mark and passes between the bars */}
      <AboutZoomGate />

      {/* Who we are */}
      <AboutStatement />

      {/* The six stages the statement names, one partner through all of them */}
      <Engagement />
    </div>
  );
}
