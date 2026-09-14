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
    emailAutoActive: string;
    emailAutoInactive: string;
    emailAutoFailed: string;
    openMailFallback: string;
    calendarStorageActive: string;
    calendarStorageInactive: string;
    calendarMarkedOnAccept: string;
    releaseDatesButton: string;
    releaseDatesSuccess: string;
    orangeCalendarTitle: string;
    orangeCalendarHint: string;
    orangeCalendarOrphan: string;
    orangeCalendarLoading: string;
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
    legendAccepted: string;
    latencyNote: string;
    notConfiguredNote: string;
    formTitle: string;
    formNote: string;
    formPrefillNote: string;
    formLockedTitle: string;
    formLockedHint: string;
    formLockedAction: string;
    calendarSelectHint: string;
    selectedRangeLabel: string;
    clearRangeLabel: string;
    rangeInvalidHint: string;
    rangeMinNightsHint: string;
  };
  footer: {
    contact: string;
    copyright: string;
    credits: string;
  };
  newsletter: {
    title: string;
    description: string;
    emailPlaceholder: string;
    consentLabel: string;
    submitButton: string;
    submitting: string;
    successInbox: string;
    errorGeneric: string;
  };
  newsletterConfirm: {
    successTitle: string;
    successBody: string;
    alreadyTitle: string;
    alreadyBody: string;
    expiredTitle: string;
    expiredBody: string;
    invalidTitle: string;
    invalidBody: string;
    errorTitle: string;
    errorBody: string;
    backHome: string;
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
      emailSent: "E-mail envoyé au client via Resend.",
      openMailClient: "Votre messagerie s’ouvre avec le message pré-rempli — cliquez Envoyer.",
      emailAutoActive: "Envoi automatique (Resend) : actif sur ce serveur.",
      emailAutoInactive:
        "Envoi automatique désactivé : ajoutez RESEND_API_KEY sur Vercel (coche Production), domaine vérifié sur resend.com, puis redéployez.",
      emailAutoFailed:
        "Resend n’a pas pu envoyer l’e-mail. Corrigez la config ou utilisez le bouton ci-dessous.",
      openMailFallback: "Ouvrir dans ma messagerie",
      calendarStorageActive:
        "Calendrier site : les séjours acceptés s’affichent en orange sur /reservations.",
      calendarStorageInactive:
        "Calendrier orange : liez le Blob « bnb-valais-blob » au projet Vercel (Storage → Connect → Production), puis redéployez.",
      calendarMarkedOnAccept: "Dates marquées en orange sur le calendrier public.",
      releaseDatesButton: "Libérer les dates (revenir au vert)",
      releaseDatesSuccess:
        "Dates retirées du calendrier public — elles s’affichent à nouveau en vert.",
      orangeCalendarTitle: "Dates orange sur le calendrier public",
      orangeCalendarHint:
        "Ces séjours viennent des acceptations admin (Blob). Supprimer une réponse dans Typeform ne les retire pas ici.",
      orangeCalendarOrphan: "Typeform supprimé",
      orangeCalendarLoading: "Chargement du calendrier orange…",
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
      legendAccepted: "Réservation directe confirmée",
      latencyNote:
        "Calendrier synchronisé via iCal (Booking.com et Airbnb). Délai habituel : 2 à 6 heures.",
      notConfiguredNote:
        "Les liens iCal Booking/Airbnb ne sont pas encore configurés sur le serveur — toutes les dates apparaissent libres.",
      formTitle: "Formulaire de réservation",
      formNote:
        "Choisissez d’abord vos dates sur le calendrier (minimum 2 nuits), puis complétez le formulaire.",
      formPrefillNote:
        "Vos dates sont enregistrées ci-dessous. Complétez le reste du formulaire (coordonnées, nombre de personnes, message).",
      formLockedTitle: "Formulaire verrouillé",
      formLockedHint:
        "Sélectionnez une date d’arrivée et une date de départ sur le calendrier (séjour d’au moins 2 nuits) pour envoyer votre demande.",
      formLockedAction: "Revenir au calendrier",
      calendarSelectHint:
        "Cliquez une date d'arrivée puis une date de départ (minimum 2 nuits, jours libres uniquement).",
      selectedRangeLabel: "Séjour :",
      clearRangeLabel: "Effacer",
      rangeInvalidHint:
        "Cette plage chevauche des dates déjà réservées — choisissez d'autres jours.",
      rangeMinNightsHint:
        "Séjour minimum de 2 nuits — choisissez une date de départ au moins deux jours après l'arrivée.",
    },
    footer: {
      contact: "Contact",
      copyright: "Copyright 2025",
      credits: "Site réalisé par db marketing",
    },
    newsletter: {
      title: "Actualités",
      description:
        "Recevez des nouvelles du Nid de la Sittelle (double confirmation par e-mail).",
      emailPlaceholder: "Votre adresse e-mail",
      consentLabel:
        "J'accepte de recevoir des e-mails d'information de BnB Valais. Je peux me désinscrire à tout moment.",
      submitButton: "S'inscrire",
      submitting: "Envoi…",
      successInbox:
        "Consultez votre boîte mail et cliquez sur le lien de confirmation (valable 7 jours).",
      errorGeneric: "Impossible d'envoyer l'e-mail pour le moment. Réessayez plus tard.",
    },
    newsletterConfirm: {
      successTitle: "Inscription confirmée",
      successBody:
        "Merci ! Vous recevrez nos prochaines actualités. Vous pourrez vous désinscrire depuis chaque e-mail.",
      alreadyTitle: "Déjà inscrit",
      alreadyBody: "Cette adresse est déjà inscrite à nos actualités.",
      expiredTitle: "Lien expiré",
      expiredBody:
        "Ce lien de confirmation a expiré. Inscrivez-vous à nouveau depuis le pied de page du site.",
      invalidTitle: "Lien invalide",
      invalidBody:
        "Ce lien n'est pas valide ou a déjà été utilisé. Inscrivez-vous à nouveau si besoin.",
      errorTitle: "Confirmation incomplète",
      errorBody:
        "Votre clic a été enregistré mais l'ajout à la liste a échoué. Contactez-nous ou réessayez.",
      backHome: "Retour à l'accueil",
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
      emailSent: "Email sent to the guest via Resend.",
      openMailClient: "Your mail app opens with a pre-filled message — click Send.",
      emailAutoActive: "Automatic sending (Resend): enabled on this server.",
      emailAutoInactive:
        "Automatic sending is off: add RESEND_API_KEY on Vercel (Production checked), verify your domain on resend.com, then redeploy.",
      emailAutoFailed:
        "Resend could not send the email. Fix the configuration or use the button below.",
      openMailFallback: "Open in my mail app",
      calendarStorageActive:
        "Site calendar: accepted stays show in orange on /reservations.",
      calendarStorageInactive:
        "Orange calendar: connect Blob store « bnb-valais-blob » to the Vercel project (Storage → Connect → Production), then redeploy.",
      calendarMarkedOnAccept: "Dates marked orange on the public calendar.",
      releaseDatesButton: "Release dates (back to green)",
      releaseDatesSuccess:
        "Dates removed from the public calendar — they show as available again.",
      orangeCalendarTitle: "Orange dates on the public calendar",
      orangeCalendarHint:
        "These stays come from admin acceptances (Blob). Deleting a Typeform response does not remove them here.",
      orangeCalendarOrphan: "Typeform deleted",
      orangeCalendarLoading: "Loading orange calendar entries…",
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
      legendAccepted: "Confirmed direct booking",
      latencyNote:
        "Calendar synced via iCal (Booking.com and Airbnb). Typical delay: 2 to 6 hours.",
      notConfiguredNote:
        "Booking/Airbnb iCal links are not configured on the server yet — all dates show as available.",
      formTitle: "Booking form",
      formNote:
        "Pick your dates on the calendar first (minimum 2 nights), then complete the form.",
      formPrefillNote:
        "Your dates are saved below. Complete the rest of the form (contact details, guests, message).",
      formLockedTitle: "Form locked",
      formLockedHint:
        "Select check-in and check-out on the calendar (at least 2 nights) before you can submit a request.",
      formLockedAction: "Back to calendar",
      calendarSelectHint:
        "Click a check-in date, then a check-out date (minimum 2 nights, available days only).",
      selectedRangeLabel: "Stay:",
      clearRangeLabel: "Clear",
      rangeInvalidHint:
        "This range overlaps booked dates — please choose different days.",
      rangeMinNightsHint:
        "Minimum stay is 2 nights — pick a check-out at least two days after check-in.",
    },
    footer: {
      contact: "Contact",
      copyright: "Copyright 2025",
      credits: "Website designed by db marketing",
    },
    newsletter: {
      title: "Newsletter",
      description:
        "News from Le Nid de la Sittelle (double opt-in confirmation email).",
      emailPlaceholder: "Your email address",
      consentLabel:
        "I agree to receive informational emails from BnB Valais. I can unsubscribe at any time.",
      submitButton: "Subscribe",
      submitting: "Sending…",
      successInbox:
        "Check your inbox and click the confirmation link (valid for 7 days).",
      errorGeneric: "Could not send the email right now. Please try again later.",
    },
    newsletterConfirm: {
      successTitle: "Subscription confirmed",
      successBody:
        "Thank you! You will receive our updates. You can unsubscribe from any email.",
      alreadyTitle: "Already subscribed",
      alreadyBody: "This address is already on our mailing list.",
      expiredTitle: "Link expired",
      expiredBody:
        "This confirmation link has expired. Please subscribe again from the website footer.",
      invalidTitle: "Invalid link",
      invalidBody:
        "This link is not valid or was already used. Subscribe again if needed.",
      errorTitle: "Confirmation incomplete",
      errorBody:
        "Your click was recorded but adding you to the list failed. Contact us or try again.",
      backHome: "Back to home",
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
