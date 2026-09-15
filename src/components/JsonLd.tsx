import type { Locale } from "@/lib/i18n";

type JsonLdProps = {
  locale: Locale;
};

export function JsonLdOrganization() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://www.bnb-valais.ch/#organization",
    name: "BnB Valais - Le Nid de la Sittelle",
    alternateName: ["BnB Valais", "Bed and Breakfast Valais", "Le Nid de la Sittelle"],
    description:
      "Location appartement vacances en Valais avec vue panoramique sur les Alpes. Hébergement de qualité proche Sion et Anzère.",
    url: "https://www.bnb-valais.ch",
    logo: "https://www.bnb-valais.ch/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
    image: "https://www.bnb-valais.ch/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valais",
      addressRegion: "Valais",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.2333,
      longitude: 7.3667,
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Vue sur les Alpes", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cuisine équipée", value: true },
      { "@type": "LocationFeatureSpecification", name: "Terrasse", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi gratuit", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    ],
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLdAccommodation({ locale }: JsonLdProps) {
  const isFr = locale === "fr";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: isFr
      ? "Appartement vacances BnB Valais - Le Nid de la Sittelle"
      : "Holiday apartment BnB Valais - Le Nid de la Sittelle",
    description: isFr
      ? "Appartement de 2 chambres avec vue panoramique sur les Alpes au cœur du Valais. Location semaine ou week-end, proche Sion et Anzère."
      : "2-bedroom apartment with panoramic Alps view in the heart of Valais. Weekly or weekend rental, near Sion and Anzère.",
    url: isFr ? "https://www.bnb-valais.ch" : "https://www.bnb-valais.ch/en",
    image: "https://www.bnb-valais.ch/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
    numberOfRooms: 2,
    numberOfBedrooms: 2,
    numberOfBathroomsTotal: 1,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: 4,
    },
    floorSize: {
      "@type": "QuantitativeValue",
      unitCode: "MTK",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: isFr ? "Vue sur les Alpes" : "Alps view", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "Cuisine équipée" : "Equipped kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "Terrasse ensoleillée" : "Sunny terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "Exposition plein Sud" : "South-facing", value: true },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valais",
      addressRegion: "Valais",
      addressCountry: "CH",
    },
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: "BnB Valais",
      url: "https://www.bnb-valais.ch",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLdBreadcrumb({ locale, page }: JsonLdProps & { page?: "reservations" }) {
  const isFr = locale === "fr";
  const baseUrl = "https://www.bnb-valais.ch";
  const langPath = isFr ? "" : "/en";

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: isFr ? "Accueil" : "Home",
      item: `${baseUrl}${langPath || "/"}`,
    },
  ];

  if (page === "reservations") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: isFr ? "Réservations" : "Bookings",
      item: `${baseUrl}${langPath}/reservations`,
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLdWebSite() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BnB Valais",
    alternateName: "Le Nid de la Sittelle",
    url: "https://www.bnb-valais.ch",
    inLanguage: ["fr-CH", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.bnb-valais.ch/reservations",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLdFAQ({ locale }: JsonLdProps) {
  const isFr = locale === "fr";

  const faqItems = isFr
    ? [
        {
          question: "Où se situe l'appartement BnB Valais ?",
          answer:
            "L'appartement est situé au cœur du Valais, à distance égale de Sion et d'Anzère (15 minutes). Idéal pour les activités sportives et culturelles.",
        },
        {
          question: "Combien de personnes peuvent séjourner dans l'appartement ?",
          answer:
            "L'appartement peut accueillir jusqu'à 4 personnes avec 2 chambres, 2 WC et une salle de bain.",
        },
        {
          question: "Quels équipements sont disponibles ?",
          answer:
            "L'appartement dispose d'une cuisine entièrement équipée, d'un salon, de terrasses avec vue sur les Alpes, et d'une exposition plein Sud.",
        },
        {
          question: "Comment réserver un séjour ?",
          answer:
            "Vous pouvez réserver directement sur notre site via la page Réservations, ou via Booking.com et Airbnb.",
        },
      ]
    : [
        {
          question: "Where is BnB Valais apartment located?",
          answer:
            "The apartment is located in the heart of Valais, equidistant from Sion and Anzère (15 minutes). Ideal for sports and cultural activities.",
        },
        {
          question: "How many people can stay in the apartment?",
          answer:
            "The apartment can accommodate up to 4 people with 2 bedrooms, 2 toilets and a bathroom.",
        },
        {
          question: "What amenities are available?",
          answer:
            "The apartment features a fully equipped kitchen, living room, terraces with Alps view, and south-facing exposure.",
        },
        {
          question: "How can I book a stay?",
          answer:
            "You can book directly on our website via the Reservations page, or through Booking.com and Airbnb.",
        },
      ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
