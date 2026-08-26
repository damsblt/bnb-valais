import type { Locale } from "./i18n";

export type PricingTier = {
  label: string;
  prices: { guests: number; price: number }[];
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    rooms: string;
    reservations: string;
  };
  hero: {
    title: string;
    subtitle: string;
    paragraphs: string[];
  };
  sections: {
    alps: {
      title: string;
      paragraphs: string[];
      cta: string;
      ctaHref: string;
    };
    apartment: {
      title: string;
      paragraphs: string[];
      cta: string;
    };
    location: {
      title: string;
      description: string;
    };
  };
  gallery: {
    alt: string[];
  };
  reservations: {
    title: string;
    pricingTitle: string;
    pricingIntro: string;
    lowSeason: string;
    highSeason: string;
    notes: string[];
    formTitle: string;
    formNote: string;
  };
  rooms: {
    title: string;
    description: string;
    cta: string;
    ctaNote: string;
  };
  footer: {
    contact: string;
    copyright: string;
    credits: string;
  };
  language: {
    label: string;
    switchTo: string;
  };
};

const pricing = {
  fr: {
    lowSeason: [
      { guests: 1, price: 100 },
      { guests: 2, price: 140 },
      { guests: 3, price: 190 },
      { guests: 4, price: 245 },
    ],
    highSeason: [
      { guests: 1, price: 110 },
      { guests: 2, price: 154 },
      { guests: 3, price: 209 },
      { guests: 4, price: 269 },
    ],
  },
  en: {
    lowSeason: [
      { guests: 1, price: 100 },
      { guests: 2, price: 140 },
      { guests: 3, price: 190 },
      { guests: 4, price: 245 },
    ],
    highSeason: [
      { guests: 1, price: 110 },
      { guests: 2, price: 154 },
      { guests: 3, price: 209 },
      { guests: 4, price: 269 },
    ],
  },
};

export function getPricing(locale: Locale) {
  return pricing[locale];
}

const content: Record<Locale, SiteContent> = {
  fr: {
    meta: {
      title: "BnB Valais — Votre prochain séjour en Valais",
      description:
        "Appartement de 2 chambres avec vue sur les Alpes, au cœur du Valais. Réservez votre séjour au BnB Valais.",
    },
    nav: {
      home: "Accueil",
      rooms: "Chambres",
      reservations: "Réservations",
    },
    hero: {
      title: "Votre prochain séjour en Valais",
      subtitle: "Appartement de 2 chambres avec vue sur les montagnes",
      paragraphs: [
        "Appartement de 2 chambres, vue sur les Alpes et entièrement équipé avec salon et cuisine.",
        "100% de dégagement, un max de soleil !",
      ],
    },
    sections: {
      alps: {
        title: "Vue imprenable sur les Alpes",
        paragraphs: [
          "Orienté plein Sud, le Bed&Breakfast profite d'une vue complètement dégagée sur les Alpes.",
          "Sa terrasse est agréablement exposée au soleil, avec la possibilité également d'avoir un côté vert et ombragé en cas de grosse chaleur.",
        ],
        cta: "Demande de réservation",
        ctaHref: "/reservations",
      },
      apartment: {
        title: "Appartements avec vues sur les montagnes",
        paragraphs: [
          "L'appartement est composé de 2 chambres, de 2 WC, d'une salle de bain ainsi que d'un espace cuisine et salon.",
          "Avec leurs grandes baies vitrées, les chambres donnent directement sur les terrasses.",
          "Vous profiterez ainsi d'une vue exceptionnelle sur les Alpes à votre réveil.",
        ],
        cta: "Demande de réservation",
      },
      location: {
        title: "Situation géographique",
        description:
          "Au cœur du Valais, entre plaine et montagne, le BnB se trouve à distance égale de Sion et d'Anzère (15 min). Idéal pour des activités sportives et culturelles.",
      },
    },
    gallery: {
      alt: [
        "Terrasse avec pelouse",
        "Terrasse avec transats",
        "Terrasse du BnB",
        "Chambre enfant",
        "Chambre adulte",
        "Appartement",
      ],
    },
    reservations: {
      title: "Tarifs et réservation",
      pricingTitle: "Tarifs par personne",
      pricingIntro:
        "Location de l'appartement entier selon les tarifs par personne suivants :",
      lowSeason: "Basse saison",
      highSeason: "Haute saison",
      notes: [
        "Réservation possible dès 2 nuits.",
        "Le prix du petit déjeuner se monte à 15 CHF par personne et par nuit.",
      ],
      formTitle: "Formulaire de réservation",
      formNote:
        "Complétez le formulaire ci-dessous pour envoyer votre demande de réservation.",
    },
    rooms: {
      title: "Chambres",
      description:
        "L'appartement comprend 2 chambres avec grandes baies vitrées ouvrant directement sur les terrasses et une vue exceptionnelle sur les Alpes.",
      cta: "Demande de réservation",
      ctaNote:
        "Les réservations se font via le formulaire Typeform sur la page Réservations.",
    },
    footer: {
      contact: "Contact",
      copyright: "Copyright 2025",
      credits: "Site réalisé par db marketing",
    },
    language: {
      label: "Français",
      switchTo: "English",
    },
  },
  en: {
    meta: {
      title: "BnB Valais — Your next stay in Valais",
      description:
        "2-bedroom apartment with mountain views in the heart of Valais. Book your stay at BnB Valais.",
    },
    nav: {
      home: "Home",
      rooms: "Rooms",
      reservations: "Bookings",
    },
    hero: {
      title: "Your next stay in Valais",
      subtitle: "2-bedroom apartment with mountain views",
      paragraphs: [
        "2-bedroom apartment overlooking the Alps, fully equipped with living room and kitchen.",
        "100% clearance, maximum sunshine!",
      ],
    },
    sections: {
      alps: {
        title: "Breathtaking view of the Alps",
        paragraphs: [
          "Facing due south, the Bed&Breakfast enjoys a completely unobstructed view of the Alps.",
          "Its terrace is pleasantly exposed to the sun, with the option of a green, shady side for hot weather.",
        ],
        cta: "Booking request",
        ctaHref: "/en/reservations",
      },
      apartment: {
        title: "Apartments with mountain views",
        paragraphs: [
          "The apartment comprises 2 bedrooms, 2 WCs, a bathroom and a kitchen and living area.",
          "With their large picture windows, the rooms open directly onto the terraces.",
          "You'll wake up to an exceptional view of the Alps.",
        ],
        cta: "Booking request",
      },
      location: {
        title: "Geographical location",
        description:
          "In the heart of Valais, between plains and mountains, the BnB is equidistant from Sion and Anzère (15 min). Ideal for sporting and cultural activities.",
      },
    },
    gallery: {
      alt: [
        "Terrace with lawn",
        "Terrace with loungers",
        "BnB terrace",
        "Children's room",
        "Master bedroom",
        "Apartment",
      ],
    },
    reservations: {
      title: "Rates and booking",
      pricingTitle: "Rates per person",
      pricingIntro:
        "Rental of the entire apartment according to the following per-person rates:",
      lowSeason: "Low season",
      highSeason: "High season",
      notes: [
        "Bookings available from 2 nights.",
        "Breakfast costs CHF 15 per person per night.",
      ],
      formTitle: "Booking form",
      formNote: "Complete the form below to submit your booking request.",
    },
    rooms: {
      title: "Rooms",
      description:
        "The apartment has 2 bedrooms with large picture windows opening directly onto the terraces and an exceptional view of the Alps.",
      cta: "Booking request",
      ctaNote:
        "Bookings are made via the Typeform on the Reservations page.",
    },
    footer: {
      contact: "Contact",
      copyright: "Copyright 2025",
      credits: "Website designed by db marketing",
    },
    language: {
      label: "English",
      switchTo: "Français",
    },
  },
};

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

export const galleryImages = [
  "Terrasse-Pelouse-Nid-Canan-Transat-1024x768.jpeg",
  "Terrasse-Pelouse-Nid-Canan-Transat_3-1024x768.jpeg",
  "Terrasse-Nid_2-1024x768.jpeg",
  "Chambre-enfant-Nid_2-1024x768.jpeg",
  "Chambre-Adulte-Nid_3-1024x768.jpeg",
  "Appartement-Nid_5-1024x768.jpeg",
] as const;

export const roomImages = [
  "Chambre-Adulte-Nid_3-1024x768.jpeg",
  "Chambre-enfant-Nid_2-1024x768.jpeg",
  "Appartement-Nid_5-1024x768.jpeg",
] as const;
