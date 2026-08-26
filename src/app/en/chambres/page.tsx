import type { Metadata } from "next";
import RoomsContent from "@/components/RoomsContent";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: `${getContent("en").rooms.title} — BnB Valais`,
  description: getContent("en").meta.description,
};

export default function EnglishRoomsPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <RoomsContent locale="en" />
    </SiteLayout>
  );
}
