import type { Locale } from "./i18n";

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
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
    title: string;
    showAll: string;
    morePhotos: string;
  };
  admin: {
    title: string;
    subtitle: string;
    loginTitle: string;
    loginHint: string;
    loginButton: string;
    logoutButton: string;
    requestsTitle: string;
    requestsEmpty: string;
    requestsRefresh: string;
    acceptButton: string;
    rejectButton: string;
    noEmailError: string;
    emailSent: string;
    openMailClient: string;
    setupMissing: string;
    checklistTitle: string;
    checklist: string[];
    linksTitle: string;
    bookingLabel: string;
    airbnbLabel: string;
    tip: string;
  };
  reservations: {
    title: string;
    subtitle: string;
    calendarTitle: string;
    legendFree: string;
    legendBusy: string;
    latencyNote: string;
    notConfiguredNote: string;
    formTitle: string;
    formNote: string;
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

const content: Record<Locale, SiteContent> = {
  fr: {
    meta: {
      title: "BnB Valais — Votre prochain séjour en Valais",
      description:
        "Appartement de 2 chambres avec vue sur les Alpes, au cœur du Valais. Réservez votre séjour au BnB Valais.",
    },
    nav: {
      home: "Accueil",
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
        cta: "Réserver",
        ctaHref: "/reservations",
      },
      apartment: {
        title: "Appartements avec vues sur les montagnes",
        paragraphs: [
          "L'appartement est composé de 2 chambres, de 2 WC, d'une salle de bain ainsi que d'un espace cuisine et salon.",
          "Avec leurs grandes baies vitrées, les chambres donnent directement sur les terrasses.",
          "Vous profiterez ainsi d'une vue exceptionnelle sur les Alpes à votre réveil.",
        ],
        cta: "Réserver",
      },
      location: {
        title: "Situation géographique",
        description:
          "Au cœur du Valais, entre plaine et montagne, le BnB se trouve à distance égale de Sion et d'Anzère (15 min). Idéal pour des activités sportives et culturelles.",
      },
    },
    gallery: {
      title: "Galerie photos",
      showAll: "Afficher toutes les photos",
      morePhotos: "+{count} photos",
    },
    admin: {
      title: "Gestion des réservations",
      subtitle:
        "Demandes directes (Typeform), réponses aux clients et synchronisation Booking / Airbnb.",
      loginTitle: "Accès administrateur",
      loginHint: "Mot de passe défini dans les variables Vercel (ADMIN_PASSWORD).",
      loginButton: "Se connecter",
      logoutButton: "Déconnexion",
      requestsTitle: "Demandes de réservation (site)",
      requestsEmpty: "Aucune demande pour le moment.",
      requestsRefresh: "Actualiser",
      acceptButton: "Accepter et envoyer",
      rejectButton: "Refuser et envoyer",
      noEmailError: "Pas d'e-mail sur cette demande — répondez depuis Typeform.",
      emailSent: "E-mail envoyé au client.",
      openMailClient: "Ouvrir dans votre messagerie",
      setupMissing:
        "Configuration incomplète : ajoutez ADMIN_PASSWORD et TYPEFORM_ACCESS_TOKEN sur Vercel, puis redéployez.",
      checklistTitle: "Checklist — réservation Booking / Airbnb",
      checklist: [
        "Notification reçue (Booking.com ou Airbnb)",
        "Ouvrir le calendrier de l'autre plateforme via les liens ci-dessous",
        "Bloquer les dates correspondantes",
        "Vérifier qu'il n'y a pas de chevauchement",
      ],
      linksTitle: "Accès rapide aux calendriers",
      bookingLabel: "Calendrier Booking.com",
      airbnbLabel: "Calendrier Airbnb",
      tip: "Astuce : réagir dans les 30 minutes réduit fortement le risque de double réservation. Cette page n'est pas indexée par les moteurs de recherche.",
    },
    reservations: {
      title: "Demande de réservation",
      subtitle:
        "Consultez les disponibilités puis envoyez votre demande via le formulaire ci-dessous.",
      calendarTitle: "Disponibilités",
      legendFree: "Libre",
      legendBusy: "Occupé (Booking / Airbnb)",
      latencyNote:
        "Calendrier synchronisé via iCal (Booking.com et Airbnb). Délai habituel : 2 à 6 heures.",
      notConfiguredNote:
        "Les liens iCal Booking/Airbnb ne sont pas encore configurés sur le serveur — toutes les dates apparaissent libres.",
      formTitle: "Formulaire de réservation",
      formNote:
        "Indiquez vos dates et vos coordonnées : nous vous confirmons la disponibilité par retour.",
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
        cta: "Book now",
        ctaHref: "/en/reservations",
      },
      apartment: {
        title: "Apartments with mountain views",
        paragraphs: [
          "The apartment comprises 2 bedrooms, 2 WCs, a bathroom and a kitchen and living area.",
          "With their large picture windows, the rooms open directly onto the terraces.",
          "You'll wake up to an exceptional view of the Alps.",
        ],
        cta: "Book now",
      },
      location: {
        title: "Geographical location",
        description:
          "In the heart of Valais, between plains and mountains, the BnB is equidistant from Sion and Anzère (15 min). Ideal for sporting and cultural activities.",
      },
    },
    gallery: {
      title: "Photo gallery",
      showAll: "Show all photos",
      morePhotos: "+{count} photos",
    },
    admin: {
      title: "Reservation management",
      subtitle:
        "Direct requests (Typeform), guest replies, and Booking / Airbnb sync.",
      loginTitle: "Admin access",
      loginHint: "Password is set in Vercel environment variables (ADMIN_PASSWORD).",
      loginButton: "Sign in",
      logoutButton: "Sign out",
      requestsTitle: "Booking requests (website)",
      requestsEmpty: "No requests yet.",
      requestsRefresh: "Refresh",
      acceptButton: "Accept and send",
      rejectButton: "Decline and send",
      noEmailError: "No email on this request — reply from Typeform.",
      emailSent: "Email sent to the guest.",
      openMailClient: "Open in your mail app",
      setupMissing:
        "Missing setup: add ADMIN_PASSWORD and TYPEFORM_ACCESS_TOKEN on Vercel, then redeploy.",
      checklistTitle: "Checklist — Booking / Airbnb reservation",
      checklist: [
        "Notification received (Booking.com or Airbnb)",
        "Open the other platform's calendar using the links below",
        "Block the corresponding dates",
        "Check there is no overlap",
      ],
      linksTitle: "Quick access to calendars",
      bookingLabel: "Booking.com calendar",
      airbnbLabel: "Airbnb calendar",
      tip: "Tip: reacting within 30 minutes greatly reduces double-booking risk. This page is not indexed by search engines.",
    },
    reservations: {
      title: "Booking request",
      subtitle:
        "Check availability, then send your request using the form below.",
      calendarTitle: "Availability",
      legendFree: "Available",
      legendBusy: "Occupied (Booking / Airbnb)",
      latencyNote:
        "Calendar synced via iCal (Booking.com and Airbnb). Typical delay: 2 to 6 hours.",
      notConfiguredNote:
        "Booking/Airbnb iCal links are not configured on the server yet — all dates show as available.",
      formTitle: "Booking form",
      formNote:
        "Enter your dates and contact details — we will confirm availability by reply.",
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
