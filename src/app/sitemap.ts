import type { MetadataRoute } from "next";

const BASE_URL = "https://www.bnb-valais.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          fr: BASE_URL,
          en: `${BASE_URL}/en`,
        },
      },
    },
    {
      url: `${BASE_URL}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          fr: BASE_URL,
          en: `${BASE_URL}/en`,
        },
      },
    },
    {
      url: `${BASE_URL}/reservations`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE_URL}/reservations`,
          en: `${BASE_URL}/en/reservations`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/reservations`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE_URL}/reservations`,
          en: `${BASE_URL}/en/reservations`,
        },
      },
    },
  ];
}
