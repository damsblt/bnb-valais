import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: getContent("en").meta.title,
  description: getContent("en").meta.description,
};

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
