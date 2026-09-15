import type { Locale } from "@/lib/i18n";

type JsonLdProps = {
  locale: Locale;
};

export function JsonLdOrganization() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://www.bnb-valais.ch/#organization",
    name: "bnb Valais - by La Sittelle",
    alternateName: [
      "BnB Valais",
      "Le Nid de la Sittelle",
      "Bed and Breakfast Valais",
      "Hébergement Sion",
      "Location vacances Anzère",
      "Apparthotel Valais",
      "Gîte Valais",
    ],
    description:
      "Location appartement vacances en Valais entre Sion et Anzère (15 min). Hébergement 2 chambres avec vue panoramique sur les Alpes. Location semaine ou week-end, idéal ski et randonnée. Tarifs dès 109 CHF/nuit.",
    url: "https://www.bnb-valais.ch",
    logo: "https://www.bnb-valais.ch/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
    image: "https://www.bnb-valais.ch/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
    priceRange: "CHF 109 - CHF 289",
    currenciesAccepted: "CHF",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valais",
      addressRegion: "Valais",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.2833,
      longitude: 7.3500,
    },
    areaServed: [
      { "@type": "City", name: "Sion" },
      { "@type": "City", name: "Anzère" },
      { "@type": "AdministrativeArea", name: "Valais" },
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Vue sur les Alpes", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cuisine équipée", value: true },
      { "@type": "LocationFeatureSpecification", name: "Terrasse plein Sud", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi gratuit", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Proche station ski Anzère", value: true },
      { "@type": "LocationFeatureSpecification", name: "15 min de Sion", value: true },
    ],
    checkinTime: "15:00",
    checkoutTime: "10:00",
    numberOfRooms: 2,
    petsAllowed: false,
    starRating: {
      "@type": "Rating",
      ratingValue: "3",
    },
    sameAs: [],
    knowsAbout: [
      "Location appartement Valais",
      "Hébergement vacances Sion",
      "Location semaine Anzère",
      "Ski Anzère",
      "Randonnée Valais",
    ],
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
      ? "Appartement vacances bnb Valais - by La Sittelle - Proche Sion et Anzère"
      : "Holiday apartment bnb Valais - by La Sittelle - Near Sion and Anzère",
    description: isFr
      ? "Appartement de 2 chambres avec vue panoramique sur les Alpes au cœur du Valais. Location semaine ou week-end, à 15 min de Sion et de la station de ski d'Anzère. Tarifs dès 109 CHF/nuit."
      : "2-bedroom apartment with panoramic Alps view in the heart of Valais. Weekly or weekend rental, 15 min from Sion and Anzère ski resort. Rates from CHF 109/night.",
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
      { "@type": "LocationFeatureSpecification", name: isFr ? "Vue panoramique sur les Alpes" : "Panoramic Alps view", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "Cuisine entièrement équipée" : "Fully equipped kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "Terrasse plein Sud" : "South-facing terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "15 min de Sion" : "15 min from Sion", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "15 min station ski Anzère" : "15 min from Anzère ski resort", value: true },
      { "@type": "LocationFeatureSpecification", name: isFr ? "Location semaine disponible" : "Weekly rental available", value: true },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valais",
      addressRegion: "Valais",
      addressCountry: "CH",
    },
    tourBookingPage: isFr ? "https://www.bnb-valais.ch/reservations" : "https://www.bnb-valais.ch/en/reservations",
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: "bnb Valais - by La Sittelle",
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

export function JsonLdPricing({ locale }: JsonLdProps) {
  const isFr = locale === "fr";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: isFr
      ? "Séjour appartement vacances Valais - bnb Valais"
      : "Holiday apartment stay Valais - bnb Valais",
    description: isFr
      ? "Location appartement 2 chambres avec vue Alpes, entre Sion et Anzère. Tarifs selon saison et nombre de personnes."
      : "2-bedroom apartment rental with Alps view, between Sion and Anzère. Rates vary by season and number of guests.",
    image: "https://www.bnb-valais.ch/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
    brand: {
      "@type": "Brand",
      name: "bnb Valais - by La Sittelle",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CHF",
      lowPrice: 109,
      highPrice: 289,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: isFr ? "https://www.bnb-valais.ch/reservations" : "https://www.bnb-valais.ch/en/reservations",
      seller: {
        "@type": "LodgingBusiness",
        name: "bnb Valais - by La Sittelle",
        url: "https://www.bnb-valais.ch",
      },
      offerCount: 4,
      offers: [
        {
          "@type": "Offer",
          name: isFr ? "Tarif 1 personne - Basse saison" : "1 guest rate - Low season",
          price: 109,
          priceCurrency: "CHF",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 109,
            priceCurrency: "CHF",
            unitText: isFr ? "par nuit" : "per night",
          },
          availability: "https://schema.org/InStock",
          url: isFr ? "https://www.bnb-valais.ch/reservations" : "https://www.bnb-valais.ch/en/reservations",
        },
        {
          "@type": "Offer",
          name: isFr ? "Tarif 2 personnes - Basse saison" : "2 guests rate - Low season",
          price: 129,
          priceCurrency: "CHF",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 129,
            priceCurrency: "CHF",
            unitText: isFr ? "par nuit" : "per night",
          },
          availability: "https://schema.org/InStock",
          url: isFr ? "https://www.bnb-valais.ch/reservations" : "https://www.bnb-valais.ch/en/reservations",
        },
        {
          "@type": "Offer",
          name: isFr ? "Tarif 3 personnes - Basse saison" : "3 guests rate - Low season",
          price: 189,
          priceCurrency: "CHF",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 189,
            priceCurrency: "CHF",
            unitText: isFr ? "par nuit" : "per night",
          },
          availability: "https://schema.org/InStock",
          url: isFr ? "https://www.bnb-valais.ch/reservations" : "https://www.bnb-valais.ch/en/reservations",
        },
        {
          "@type": "Offer",
          name: isFr ? "Tarif 4 personnes - Basse saison" : "4 guests rate - Low season",
          price: 209,
          priceCurrency: "CHF",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 209,
            priceCurrency: "CHF",
            unitText: isFr ? "par nuit" : "per night",
          },
          availability: "https://schema.org/InStock",
          url: isFr ? "https://www.bnb-valais.ch/reservations" : "https://www.bnb-valais.ch/en/reservations",
        },
      ],
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
            "L'appartement est situé au cœur du Valais, à distance égale de Sion et d'Anzère (15 minutes en voiture). Entre plaine et montagne, c'est un emplacement idéal pour les activités sportives (ski à Anzère, randonnée) et culturelles (Sion).",
        },
        {
          question: "Quelle est la durée minimum de location ?",
          answer:
            "La durée minimum de séjour est de 2 nuits. Nous proposons des locations à la semaine, au week-end, ou pour des séjours plus courts selon disponibilité.",
        },
        {
          question: "Combien de personnes peuvent séjourner dans l'appartement ?",
          answer:
            "L'appartement peut accueillir jusqu'à 4 personnes avec 2 chambres confortables, 2 WC et une salle de bain. Idéal pour les familles ou les couples.",
        },
        {
          question: "Quels équipements sont disponibles ?",
          answer:
            "L'appartement dispose d'une cuisine entièrement équipée, d'un salon, de terrasses avec vue panoramique sur les Alpes, et d'une exposition plein Sud garantissant un ensoleillement optimal.",
        },
        {
          question: "L'hébergement est-il adapté pour le ski à Anzère ?",
          answer:
            "Oui, la station de ski d'Anzère est à seulement 15 minutes en voiture. C'est un hébergement idéal pour vos vacances de ski en Valais.",
        },
        {
          question: "Comment réserver un séjour ?",
          answer:
            "Vous pouvez réserver directement sur notre site via la page Réservations (sans commission), ou via Booking.com et Airbnb. La réservation directe vous garantit le meilleur tarif.",
        },
        {
          question: "Quelle est la distance depuis Sion ?",
          answer:
            "L'appartement est situé à 15 minutes de Sion, capitale du Valais. Vous pourrez facilement visiter la vieille ville, les châteaux de Valère et Tourbillon, et profiter des activités culturelles.",
        },
      ]
    : [
        {
          question: "Where is BnB Valais apartment located?",
          answer:
            "The apartment is located in the heart of Valais, equidistant from Sion and Anzère (15 minutes by car). Between plains and mountains, it's an ideal location for sports (skiing in Anzère, hiking) and cultural activities (Sion).",
        },
        {
          question: "What is the minimum rental duration?",
          answer:
            "The minimum stay is 2 nights. We offer weekly rentals, weekend stays, or shorter stays subject to availability.",
        },
        {
          question: "How many people can stay in the apartment?",
          answer:
            "The apartment can accommodate up to 4 people with 2 comfortable bedrooms, 2 toilets and a bathroom. Ideal for families or couples.",
        },
        {
          question: "What amenities are available?",
          answer:
            "The apartment features a fully equipped kitchen, living room, terraces with panoramic Alps view, and south-facing exposure ensuring optimal sunshine.",
        },
        {
          question: "Is the accommodation suitable for skiing in Anzère?",
          answer:
            "Yes, Anzère ski resort is only 15 minutes away by car. It's an ideal accommodation for your ski holidays in Valais.",
        },
        {
          question: "How can I book a stay?",
          answer:
            "You can book directly on our website via the Reservations page (no commission), or through Booking.com and Airbnb. Direct booking guarantees you the best rate.",
        },
        {
          question: "How far is it from Sion?",
          answer:
            "The apartment is located 15 minutes from Sion, the capital of Valais. You can easily visit the old town, Valère and Tourbillon castles, and enjoy cultural activities.",
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
