import type { Metadata } from "next";
import RoomsContent from "@/components/RoomsContent";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: `${getContent("fr").rooms.title} — BnB Valais`,
  description: getContent("fr").meta.description,
};

export default function ChambresPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <RoomsContent locale="fr" />
    </SiteLayout>
  );
}
