import type { Locale } from "./i18n";

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    reservationsTitle: string;
    reservationsDescription: string;
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
    };
    bedrooms: {
      title: string;
      paragraphs: string[];
      cta: string;
    };
    building: {
      title: string;
      paragraphs: string[];
    };
    location: {
      title: string;
      description: string;
    };
  };
  gallery: {
    showAll: string;
    morePhotos: string;
  };
  admin: {
    title: string;
    subtitle: string;
    navReservations: string;
    navPromo: string;
    navPricing: string;
    reservationsPageTitle: string;
    promoPageTitle: string;
    pricingPageTitle: string;
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
    promoTitle: string;
    promoHint: string;
    promoRefresh: string;
    promoLoading: string;
    promoEmpty: string;
    promoSaveSuccess: string;
    promoSaveError: string;
    promoLoadError: string;
    promoUnauthorized: string;
    promoStorageInactive: string;
    promoInactiveBadge: string;
    promoActivate: string;
    promoDeactivate: string;
    promoDelete: string;
    promoDeleteConfirm: string;
    promoAddTitle: string;
    promoAddButton: string;
    promoSaving: string;
    promoFormIncomplete: string;
    promoDuplicate: string;
    promoUsesLabel: string;
    promoFieldCode: string;
    promoFieldLabel: string;
    promoFieldPercent: string;
    promoFieldMaxUses: string;
    promoFieldStayFrom: string;
    promoFieldStayTo: string;
    pricingRefresh: string;
    pricingImportPilotageButton: string;
    pricingImportPilotageConfirm: string;
    pricingImportPilotageSuccess: string;
    pricingImportPilotageHint: string;
    pricingLoading: string;
    pricingEmpty: string;
    pricingSaveSuccess: string;
    pricingSaveError: string;
    pricingLoadError: string;
    pricingUnauthorized: string;
    pricingStorageInactive: string;
    pricingAddTitle: string;
    pricingAddButton: string;
    pricingSaving: string;
    pricingFormIncomplete: string;
    pricingWeekdaysRequired: string;
    pricingDelete: string;
    pricingDeleteConfirm: string;
    pricingFieldFrom: string;
    pricingFieldTo: string;
    pricingFieldPrice: string;
    pricingFieldPriceByGuests: string;
    pricingGuests1: string;
    pricingGuests2: string;
    pricingGuests3: string;
    pricingGuests4: string;
    pricingFieldWeekdays: string;
    pricingPerNight: string;
    pricingWeekdayMon: string;
    pricingWeekdayTue: string;
    pricingWeekdayWed: string;
    pricingWeekdayThu: string;
    pricingWeekdayFri: string;
    pricingWeekdaySat: string;
    pricingWeekdaySun: string;
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
    promoOptionalLabel: string;
    promoPlaceholder: string;
    promoApplyButton: string;
    promoApplying: string;
    promoValidBadge: string;
    promoClearButton: string;
    promoInvalidHint: string;
    legendPricePerNight: string;
    guestCountLabel: string;
    guestCountOne: string;
    guestCountMany: string;
    stayTotalTitle: string;
    stayTotalForOneGuest: string;
    stayTotalForGuests: string;
    stayTotalNights: string;
    stayTotalDiscount: string;
    stayTotalLabel: string;
    stayTotalIncomplete: string;
    stayTotalNoRatesForDates: string;
    payButton: string;
    payLoading: string;
    payError: string;
    payUnavailable: string;
    payDatesUnavailable: string;
    paySuccessTitle: string;
    paySuccessBody: string;
    paySuccessHome: string;
    paySuccessTransaction: string;
    paySuccessAmount: string;
    paySuccessCurrency: string;
    paySuccessEmail: string;
    payCancelTitle: string;
    payCancelBody: string;
    payCancelRetry: string;
  };
  footer: {
    contact: string;
    copyright: string;
    credits: string;
    privacy: string;
    cookies: string;
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
      title: "BnB Valais — Location appartement vacances Sion Anzère | Hébergement semaine Valais",
      description:
        "Appartement à louer en Valais entre Sion et Anzère (15 min). Réservation à la nuit, à la semaine ou au mois. 2 chambres, vue Alpes, Wi-Fi, parking, ascenseur.",
      reservationsTitle: "Réserver un appartement à louer | BnB Valais",
      reservationsDescription:
        "Appartement à louer en Valais : réservez à la nuit, à la semaine ou au mois. Consultez les disponibilités, BnB 2 chambres avec vue Alpes.",
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
        title: "Appartement tout équipé",
        paragraphs: [
          "L'appartement de 70 m2 est composé de 2 chambres, de 2 WC, d'une salle de bain ainsi que d'un espace cuisine et salon.",
          "Cuisine entièrement équipée, TV, Wi-Fi, parking et accès en ascenseur.",
          "Réservation possible à la nuit, à la semaine ou au mois.",
        ],
      },
      bedrooms: {
        title: "Chambres avec accès terrasse",
        paragraphs: [
          "Avec leurs grandes baies vitrées, les chambres donnent directement sur les terrasses.",
          "Vous profiterez ainsi d'une vue exceptionnelle sur les Alpes à votre réveil.",
        ],
        cta: "Réserver",
      },
      building: {
        title: "Le Nid, vu du ciel",
        paragraphs: [
          "Une maison contemporaine en terrasses, ouverte sur la vallée.",
        ],
      },
      location: {
        title: "Situation géographique",
        description:
          "Au cœur du Valais, entre plaine et montagne, le BnB se trouve à distance égale de Sion et d'Anzère (15 min). Idéal pour des activités sportives et culturelles.",
      },
    },
    gallery: {
      showAll: "Afficher toutes les photos",
      morePhotos: "+{count} photos",
    },
    admin: {
      title: "Administration",
      subtitle: "",
      navReservations: "Réservations",
      navPromo: "Codes promo",
      navPricing: "Tarifs",
      reservationsPageTitle: "Réservations",
      promoPageTitle: "Codes promo",
      pricingPageTitle: "Tarifs par nuit",
      loginTitle: "Accès administrateur",
      loginHint: "",
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
      promoTitle: "Codes promo (réservations directes)",
      promoHint:
        "Stockés dans Vercel Blob (promo/codes.json). Les visiteurs vérifient le code sur /reservations avant le Typeform.",
      promoRefresh: "Actualiser",
      promoLoading: "Chargement des codes…",
      promoEmpty: "Aucun code — ajoutez-en un ci-dessous.",
      promoSaveSuccess: "Codes promo enregistrés.",
      promoSaveError: "Enregistrement impossible — vérifiez les champs.",
      promoLoadError: "Impossible de charger les codes promo.",
      promoUnauthorized: "Session expirée — reconnectez-vous.",
      promoStorageInactive:
        "Blob non configuré : les changements ne seront pas persistés en production.",
      promoInactiveBadge: "inactif",
      promoActivate: "Activer",
      promoDeactivate: "Désactiver",
      promoDelete: "Supprimer",
      promoDeleteConfirm: "Supprimer ce code promo ?",
      promoAddTitle: "Ajouter un code",
      promoAddButton: "Ajouter et enregistrer",
      promoSaving: "Enregistrement…",
      promoFormIncomplete: "Code et libellé sont obligatoires.",
      promoDuplicate: "Ce code existe déjà.",
      promoUsesLabel: "utilisations",
      promoFieldCode: "Code",
      promoFieldLabel: "Libellé (affiché au client)",
      promoFieldPercent: "Réduction (%)",
      promoFieldMaxUses: "Limite d’utilisations (optionnel)",
      promoFieldStayFrom: "Première nuitée éligible",
      promoFieldStayTo: "Dernière nuitée éligible",
      pricingRefresh: "Actualiser",
      pricingImportPilotageButton: "Importer la grille Excel (2026–2027)",
      pricingImportPilotageConfirm:
        "Remplacer tous les tarifs par la grille « Pilotage prix » (sept. 2026 → déc. 2027, 112 périodes) ?",
      pricingImportPilotageSuccess:
        "Grille importée — vérifiez le calendrier sur /reservations.",
      pricingImportPilotageHint:
        "Reprise de l’onglet Calendrier du fichier Pilotage_prix (4 paliers : semaine, week-end, haute saison, événements).",
      pricingLoading: "Chargement…",
      pricingEmpty: "Aucun tarif défini.",
      pricingSaveSuccess: "Tarifs enregistrés.",
      pricingSaveError: "Enregistrement impossible.",
      pricingLoadError: "Impossible de charger les tarifs.",
      pricingUnauthorized: "Session expirée — reconnectez-vous.",
      pricingStorageInactive: "Stockage Blob non configuré.",
      pricingAddTitle: "Ajouter des tarifs (lot)",
      pricingAddButton: "Appliquer au calendrier",
      pricingSaving: "Enregistrement…",
      pricingFormIncomplete:
        "Dates valides et quatre prix (1 à 4 personnes) requis.",
      pricingWeekdaysRequired: "Choisissez au moins un jour de la semaine.",
      pricingDelete: "Supprimer",
      pricingDeleteConfirm: "Supprimer cette règle de tarif ?",
      pricingFieldFrom: "Première date",
      pricingFieldTo: "Dernière date",
      pricingFieldPrice: "Prix par nuit (CHF)",
      pricingFieldPriceByGuests: "Prix par nuit selon le nombre de personnes (CHF)",
      pricingGuests1: "1 personne",
      pricingGuests2: "2 personnes",
      pricingGuests3: "3 personnes",
      pricingGuests4: "4 personnes",
      pricingFieldWeekdays: "Jours concernés",
      pricingPerNight: "nuit",
      pricingWeekdayMon: "Lun",
      pricingWeekdayTue: "Mar",
      pricingWeekdayWed: "Mer",
      pricingWeekdayThu: "Jeu",
      pricingWeekdayFri: "Ven",
      pricingWeekdaySat: "Sam",
      pricingWeekdaySun: "Dim",
    },
    reservations: {
      title: "Réserver et payer",
      subtitle:
        "Choisissez vos dates, le nombre de personnes, puis payez le séjour en ligne (carte, Apple Pay, Google Pay).",
      calendarTitle: "Disponibilités",
      legendFree: "Libre",
      legendBusy: "Occupé (Booking / Airbnb)",
      legendAccepted: "Réservation directe confirmée",
      latencyNote: "",
      notConfiguredNote:
        "Les liens iCal Booking/Airbnb ne sont pas encore configurés sur le serveur — toutes les dates apparaissent libres.",
      formTitle: "Paiement",
      formNote:
        "Choisissez d’abord vos dates sur le calendrier (minimum 2 nuits), puis payez pour confirmer la réservation.",
      formPrefillNote:
        "Vos dates et le montant sont prêts. Le paiement se fait sur la page sécurisée Stripe.",
      formLockedTitle: "Paiement verrouillé",
      formLockedHint:
        "Sélectionnez une date d’arrivée et une date de départ sur le calendrier (séjour d’au moins 2 nuits) pour payer.",
      formLockedAction: "Revenir au calendrier",
      calendarSelectHint:
        "Cliquez une date d'arrivée puis une date de départ (minimum 2 nuits, jours libres uniquement).",
      selectedRangeLabel: "Séjour :",
      clearRangeLabel: "Effacer",
      rangeInvalidHint:
        "Cette plage chevauche des dates déjà réservées — choisissez d'autres jours.",
      rangeMinNightsHint:
        "Séjour minimum de 2 nuits — choisissez une date de départ au moins deux jours après l'arrivée.",
      promoOptionalLabel: "Code promo (facultatif)",
      promoPlaceholder: "Ex. OCT2026-10",
      promoApplyButton: "Vérifier le code",
      promoApplying: "Vérification…",
      promoValidBadge: "Code accepté",
      promoClearButton: "Retirer",
      promoInvalidHint:
        "Code invalide ou non valable pour ces dates. Corrigez ou laissez le champ vide.",
      legendPricePerNight: "",
      guestCountLabel: "Nombre de personnes",
      guestCountOne: "1 personne",
      guestCountMany: "{count} personnes",
      stayTotalTitle: "Montant du séjour",
      stayTotalForOneGuest: "Tarif pour 1 personne",
      stayTotalForGuests: "Tarif pour {count} personnes",
      stayTotalNights: "{count} nuits",
      stayTotalDiscount: "Réduction code promo",
      stayTotalLabel: "Total",
      stayTotalIncomplete:
        "Tarif manquant pour {missing} nuit(s) sur ce séjour — vérifiez les dates ou contactez-nous.",
      stayTotalNoRatesForDates: "Tarif non publié pour ces dates.",
      payButton: "Payer et confirmer la réservation",
      payLoading: "Redirection vers le paiement…",
      payError: "Le paiement n’a pas pu démarrer. Réessayez ou contactez-nous.",
      payUnavailable: "Le paiement en ligne n’est pas encore activé sur ce serveur.",
      payDatesUnavailable: "Ces dates viennent d’être prises. Choisissez une autre période.",
      paySuccessTitle: "Réservation confirmée",
      paySuccessBody:
        "Merci. Le paiement a bien été reçu. Un e-mail de confirmation et la facture vous seront envoyés.",
      paySuccessHome: "Retour à l’accueil",
      paySuccessTransaction: "N° de commande",
      paySuccessAmount: "Montant",
      paySuccessCurrency: "Devise",
      paySuccessEmail: "E-mail",
      payCancelTitle: "Paiement non terminé",
      payCancelBody: "Aucun montant n’a été débité. Vous pouvez relancer le paiement quand vous voulez.",
      payCancelRetry: "Revenir aux réservations",
    },
    footer: {
      contact: "Contact",
      copyright: "Copyright 2025",
      credits: "Site réalisé par db marketing",
      privacy: "Protection des données",
      cookies: "Cookies",
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
      title: "BnB Valais — Holiday apartment Sion Anzère | Weekly rental Valais Switzerland",
      description:
        "Apartment to rent in Valais between Sion and Anzère (15 min). Book by the night, week or month. 2 bedrooms, Alpine views, Wi-Fi, parking, lift.",
      reservationsTitle: "Book an apartment to rent | BnB Valais",
      reservationsDescription:
        "Apartment to rent in Valais: book by the night, week or month. Check availability, 2-bedroom BnB with Alpine views.",
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
        title: "Fully equipped apartment",
        paragraphs: [
          "The 70 m² apartment comprises 2 bedrooms, 2 WCs, a bathroom and a kitchen and living area.",
          "Fully equipped kitchen, TV, Wi-Fi, parking and lift access.",
          "Available to book by the night, week or month.",
        ],
      },
      bedrooms: {
        title: "Bedrooms with terrace access",
        paragraphs: [
          "With their large picture windows, the rooms open directly onto the terraces.",
          "You'll wake up to an exceptional view of the Alps.",
        ],
        cta: "Book now",
      },
      building: {
        title: "The Nid from above",
        paragraphs: [
          "A contemporary terraced house, open to the valley.",
        ],
      },
      location: {
        title: "Geographical location",
        description:
          "In the heart of Valais, between plains and mountains, the BnB is equidistant from Sion and Anzère (15 min). Ideal for sporting and cultural activities.",
      },
    },
    gallery: {
      showAll: "Show all photos",
      morePhotos: "+{count} photos",
    },
    admin: {
      title: "Administration",
      subtitle: "",
      navReservations: "Bookings",
      navPromo: "Promo codes",
      navPricing: "Rates",
      reservationsPageTitle: "Bookings",
      promoPageTitle: "Promo codes",
      pricingPageTitle: "Nightly rates",
      loginTitle: "Admin access",
      loginHint: "",
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
      promoTitle: "Promo codes (direct bookings)",
      promoHint:
        "Stored in Vercel Blob (promo/codes.json). Guests verify codes on /reservations before Typeform.",
      promoRefresh: "Refresh",
      promoLoading: "Loading codes…",
      promoEmpty: "No codes yet — add one below.",
      promoSaveSuccess: "Promo codes saved.",
      promoSaveError: "Could not save — check the fields.",
      promoLoadError: "Could not load promo codes.",
      promoUnauthorized: "Session expired — sign in again.",
      promoStorageInactive:
        "Blob not configured: changes will not persist in production.",
      promoInactiveBadge: "inactive",
      promoActivate: "Activate",
      promoDeactivate: "Deactivate",
      promoDelete: "Delete",
      promoDeleteConfirm: "Delete this promo code?",
      promoAddTitle: "Add a code",
      promoAddButton: "Add and save",
      promoSaving: "Saving…",
      promoFormIncomplete: "Code and label are required.",
      promoDuplicate: "This code already exists.",
      promoUsesLabel: "uses",
      promoFieldCode: "Code",
      promoFieldLabel: "Label (shown to guest)",
      promoFieldPercent: "Discount (%)",
      promoFieldMaxUses: "Usage limit (optional)",
      promoFieldStayFrom: "First eligible night",
      promoFieldStayTo: "Last eligible night",
      pricingRefresh: "Refresh",
      pricingImportPilotageButton: "Import Excel grid (2026–2027)",
      pricingImportPilotageConfirm:
        "Replace all rates with the « Pilotage prix » grid (Sep 2026 → Dec 2027, 112 periods)?",
      pricingImportPilotageSuccess:
        "Grid imported — check the calendar on /reservations.",
      pricingImportPilotageHint:
        "From the Excel Calendrier sheet (weekday, weekend, high season, events).",
      pricingLoading: "Loading…",
      pricingEmpty: "No rates defined yet.",
      pricingSaveSuccess: "Rates saved.",
      pricingSaveError: "Could not save.",
      pricingLoadError: "Could not load rates.",
      pricingUnauthorized: "Session expired — sign in again.",
      pricingStorageInactive: "Blob storage not configured.",
      pricingAddTitle: "Add rates (batch)",
      pricingAddButton: "Apply to calendar",
      pricingSaving: "Saving…",
      pricingFormIncomplete: "Valid dates and price required.",
      pricingWeekdaysRequired: "Select at least one weekday.",
      pricingDelete: "Delete",
      pricingDeleteConfirm: "Delete this rate rule?",
      pricingFieldFrom: "First date",
      pricingFieldTo: "Last date",
      pricingFieldPrice: "Price per night (CHF)",
      pricingFieldPriceByGuests: "Price per night by number of guests (CHF)",
      pricingGuests1: "1 guest",
      pricingGuests2: "2 guests",
      pricingGuests3: "3 guests",
      pricingGuests4: "4 guests",
      pricingFieldWeekdays: "Weekdays",
      pricingPerNight: "night",
      pricingWeekdayMon: "Mon",
      pricingWeekdayTue: "Tue",
      pricingWeekdayWed: "Wed",
      pricingWeekdayThu: "Thu",
      pricingWeekdayFri: "Fri",
      pricingWeekdaySat: "Sat",
      pricingWeekdaySun: "Sun",
    },
    reservations: {
      title: "Book and pay",
      subtitle:
        "Choose your dates and number of guests, then pay online to confirm (card, Apple Pay, Google Pay).",
      calendarTitle: "Availability",
      legendFree: "Available",
      legendBusy: "Occupied (Booking / Airbnb)",
      legendAccepted: "Confirmed direct booking",
      latencyNote: "",
      notConfiguredNote:
        "Booking/Airbnb iCal links are not configured on the server yet — all dates show as available.",
      formTitle: "Payment",
      formNote:
        "Pick your dates on the calendar first (minimum 2 nights), then pay to confirm the booking.",
      formPrefillNote:
        "Your dates and total are ready. Payment is completed on Stripe’s secure page.",
      formLockedTitle: "Payment locked",
      formLockedHint:
        "Select check-in and check-out on the calendar (at least 2 nights) before you can pay.",
      formLockedAction: "Back to calendar",
      calendarSelectHint:
        "Click a check-in date, then a check-out date (minimum 2 nights, available days only).",
      selectedRangeLabel: "Stay:",
      clearRangeLabel: "Clear",
      rangeInvalidHint:
        "This range overlaps booked dates — please choose different days.",
      rangeMinNightsHint:
        "Minimum stay is 2 nights — pick a check-out at least two days after check-in.",
      promoOptionalLabel: "Promo code (optional)",
      promoPlaceholder: "E.g. OCT2026-10",
      promoApplyButton: "Verify code",
      promoApplying: "Checking…",
      promoValidBadge: "Code accepted",
      promoClearButton: "Remove",
      promoInvalidHint:
        "Invalid code or not valid for these dates. Fix it or leave the field empty.",
      legendPricePerNight: "",
      guestCountLabel: "Number of guests",
      guestCountOne: "1 guest",
      guestCountMany: "{count} guests",
      stayTotalTitle: "Stay total",
      stayTotalForOneGuest: "Rate for 1 guest",
      stayTotalForGuests: "Rate for {count} guests",
      stayTotalNights: "{count} nights",
      stayTotalDiscount: "Promo discount",
      stayTotalLabel: "Total",
      stayTotalIncomplete:
        "Rate missing for {missing} night(s) in this stay — check dates or contact us.",
      stayTotalNoRatesForDates: "No published rate for these dates.",
      payButton: "Pay and confirm booking",
      payLoading: "Redirecting to payment…",
      payError: "Payment could not start. Please try again or contact us.",
      payUnavailable: "Online payment is not enabled on this server yet.",
      payDatesUnavailable: "These dates were just taken. Please choose another stay.",
      paySuccessTitle: "Booking confirmed",
      paySuccessBody:
        "Thank you. Payment was received. A confirmation email and invoice will be sent to you.",
      paySuccessHome: "Back to home",
      paySuccessTransaction: "Order number",
      paySuccessAmount: "Amount",
      paySuccessCurrency: "Currency",
      paySuccessEmail: "Email",
      payCancelTitle: "Payment not completed",
      payCancelBody: "You were not charged. You can start the payment again whenever you like.",
      payCancelRetry: "Back to bookings",
    },
    footer: {
      contact: "Contact",
      copyright: "Copyright 2025",
      credits: "Website designed by db marketing",
      privacy: "Privacy",
      cookies: "Cookies",
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
  de: {
    meta: {
      title: "BnB Valais — Ferienwohnung Sitten Anzère | Wochenmiete Wallis Schweiz",
      description:
        "Wohnung zur Miete im Wallis zwischen Sitten und Anzère (15 Min.). Buchung pro Nacht, Woche oder Monat. 2 Schlafzimmer, Alpenblick, WLAN, Parkplatz, Lift.",
      reservationsTitle: "Ferienwohnung buchen | BnB Valais",
      reservationsDescription:
        "Wohnung im Wallis mieten: pro Nacht, Woche oder Monat. Verfügbarkeit prüfen, BnB mit 2 Schlafzimmern und Alpenblick.",
    },
    nav: {
      home: "Startseite",
      reservations: "Reservierung",
    },
    hero: {
      title: "Ihr nächster Aufenthalt im Wallis",
      subtitle: "Wohnung mit 2 Schlafzimmern und Bergblick",
      paragraphs: [
        "Wohnung mit 2 Schlafzimmern, Blick auf die Alpen, vollständig eingerichtet mit Wohnzimmer und Küche.",
        "100 % freie Sicht, maximale Sonne!",
      ],
    },
    sections: {
      alps: {
        title: "Atemberaubender Blick auf die Alpen",
        paragraphs: [
          "Nach Süden ausgerichtet, geniesst das Bed & Breakfast einen völlig freien Blick auf die Alpen.",
          "Die Terrasse liegt angenehm in der Sonne; bei Hitze gibt es auch eine grüne, schattige Seite.",
        ],
        cta: "Reservieren",
        ctaHref: "/de/reservations",
      },
      apartment: {
        title: "Vollständig eingerichtete Wohnung",
        paragraphs: [
          "Die 70 m² grosse Wohnung umfasst 2 Schlafzimmer, 2 WCs, ein Badezimmer sowie Küche und Wohnbereich.",
          "Voll ausgestattete Küche, TV, WLAN, Parkplatz und Lift.",
          "Buchung möglich pro Nacht, Woche oder Monat.",
        ],
      },
      bedrooms: {
        title: "Schlafzimmer mit Terrassenzugang",
        paragraphs: [
          "Mit ihren grossen Fensterfronten öffnen sich die Zimmer direkt auf die Terrassen.",
          "So erwachen Sie mit einem aussergewöhnlichen Blick auf die Alpen.",
        ],
        cta: "Reservieren",
      },
      building: {
        title: "Das Nid aus der Luft",
        paragraphs: [
          "Ein zeitgenössisches Haus in Terrassen, offen zum Tal.",
        ],
      },
      location: {
        title: "Lage",
        description:
          "Im Herzen des Wallis, zwischen Ebene und Berg, liegt das BnB gleich weit von Sitten und Anzère (15 Min.). Ideal für Sport und Kultur.",
      },
    },
    gallery: {
      showAll: "Alle Fotos anzeigen",
      morePhotos: "+{count} Fotos",
    },
    admin: {
      title: "Administration",
      subtitle: "",
      navReservations: "Reservierungen",
      navPromo: "Aktionscodes",
      navPricing: "Tarife",
      reservationsPageTitle: "Reservierungen",
      promoPageTitle: "Aktionscodes",
      pricingPageTitle: "Nachtpreise",
      loginTitle: "Administratorzugang",
      loginHint: "",
      loginButton: "Anmelden",
      logoutButton: "Abmelden",
      requestsTitle: "Buchungsanfragen (Website)",
      requestsEmpty: "Noch keine Anfragen.",
      requestsRefresh: "Aktualisieren",
      acceptButton: "Annehmen und senden",
      rejectButton: "Ablehnen und senden",
      noEmailError: "Keine E-Mail zu dieser Anfrage — antworten Sie über Typeform.",
      emailSent: "E-Mail über Resend an den Gast gesendet.",
      openMailClient: "Ihre Mail-App öffnet sich mit einer vorausgefüllten Nachricht — klicken Sie auf Senden.",
      emailAutoActive: "Automatischer Versand (Resend): auf diesem Server aktiv.",
      emailAutoInactive:
        "Automatischer Versand ist aus: fügen Sie RESEND_API_KEY auf Vercel hinzu (Production aktiviert), verifizieren Sie die Domain auf resend.com und stellen Sie neu bereit.",
      emailAutoFailed:
        "Resend konnte die E-Mail nicht senden. Korrigieren Sie die Konfiguration oder nutzen Sie die Schaltfläche unten.",
      openMailFallback: "In meiner Mail-App öffnen",
      calendarStorageActive:
        "Website-Kalender: angenommene Aufenthalte erscheinen orange auf /reservations.",
      calendarStorageInactive:
        "Oranger Kalender: verbinden Sie den Blob-Store « bnb-valais-blob » mit dem Vercel-Projekt (Storage → Connect → Production) und stellen Sie neu bereit.",
      calendarMarkedOnAccept: "Daten im öffentlichen Kalender orange markiert.",
      releaseDatesButton: "Daten freigeben (wieder grün)",
      releaseDatesSuccess:
        "Daten aus dem öffentlichen Kalender entfernt — sie erscheinen wieder als frei.",
      orangeCalendarTitle: "Orange Daten im öffentlichen Kalender",
      orangeCalendarHint:
        "Diese Aufenthalte stammen von Admin-Annahmen (Blob). Das Löschen einer Typeform-Antwort entfernt sie hier nicht.",
      orangeCalendarOrphan: "Typeform gelöscht",
      orangeCalendarLoading: "Orangene Kalendereinträge werden geladen…",
      setupMissing:
        "Einrichtung unvollständig: fügen Sie ADMIN_PASSWORD und TYPEFORM_ACCESS_TOKEN auf Vercel hinzu und stellen Sie neu bereit.",
      checklistTitle: "Checkliste — Buchung Booking / Airbnb",
      checklist: [
        "Benachrichtigung erhalten (Booking.com oder Airbnb)",
        "Den Kalender der anderen Plattform über die Links unten öffnen",
        "Die entsprechenden Daten blockieren",
        "Prüfen, dass es keine Überschneidung gibt",
      ],
      linksTitle: "Schnellzugriff auf die Kalender",
      bookingLabel: "Booking.com-Kalender",
      airbnbLabel: "Airbnb-Kalender",
      tip: "Tipp: innerhalb von 30 Minuten zu reagieren senkt das Risiko einer Doppelbuchung stark. Diese Seite wird von Suchmaschinen nicht indexiert.",
      promoTitle: "Aktionscodes (Direktbuchungen)",
      promoHint:
        "Gespeichert in Vercel Blob (promo/codes.json). Gäste prüfen den Code auf /reservations vor Typeform.",
      promoRefresh: "Aktualisieren",
      promoLoading: "Codes werden geladen…",
      promoEmpty: "Noch keine Codes — fügen Sie unten einen hinzu.",
      promoSaveSuccess: "Aktionscodes gespeichert.",
      promoSaveError: "Speichern nicht möglich — prüfen Sie die Felder.",
      promoLoadError: "Aktionscodes konnten nicht geladen werden.",
      promoUnauthorized: "Sitzung abgelaufen — bitte erneut anmelden.",
      promoStorageInactive:
        "Blob nicht konfiguriert: Änderungen bleiben in der Produktion nicht erhalten.",
      promoInactiveBadge: "inaktiv",
      promoActivate: "Aktivieren",
      promoDeactivate: "Deaktivieren",
      promoDelete: "Löschen",
      promoDeleteConfirm: "Diesen Aktionscode löschen?",
      promoAddTitle: "Code hinzufügen",
      promoAddButton: "Hinzufügen und speichern",
      promoSaving: "Speichern…",
      promoFormIncomplete: "Code und Bezeichnung sind Pflicht.",
      promoDuplicate: "Dieser Code existiert bereits.",
      promoUsesLabel: "Nutzungen",
      promoFieldCode: "Code",
      promoFieldLabel: "Bezeichnung (für den Gast)",
      promoFieldPercent: "Rabatt (%)",
      promoFieldMaxUses: "Nutzungslimit (optional)",
      promoFieldStayFrom: "Erste berechtigte Nacht",
      promoFieldStayTo: "Letzte berechtigte Nacht",
      pricingRefresh: "Aktualisieren",
      pricingImportPilotageButton: "Excel-Raster importieren (2026–2027)",
      pricingImportPilotageConfirm:
        "Alle Tarife durch das Raster « Pilotage prix » ersetzen (Sept. 2026 → Dez. 2027, 112 Perioden)?",
      pricingImportPilotageSuccess:
        "Raster importiert — prüfen Sie den Kalender auf /reservations.",
      pricingImportPilotageHint:
        "Aus dem Excel-Blatt Calendrier (Wochentag, Wochenende, Hochsaison, Events).",
      pricingLoading: "Laden…",
      pricingEmpty: "Noch keine Tarife definiert.",
      pricingSaveSuccess: "Tarife gespeichert.",
      pricingSaveError: "Speichern nicht möglich.",
      pricingLoadError: "Tarife konnten nicht geladen werden.",
      pricingUnauthorized: "Sitzung abgelaufen — bitte erneut anmelden.",
      pricingStorageInactive: "Blob-Speicher nicht konfiguriert.",
      pricingAddTitle: "Tarife hinzufügen (Stapel)",
      pricingAddButton: "Auf den Kalender anwenden",
      pricingSaving: "Speichern…",
      pricingFormIncomplete: "Gültige Daten und vier Preise (1 bis 4 Personen) erforderlich.",
      pricingWeekdaysRequired: "Wählen Sie mindestens einen Wochentag.",
      pricingDelete: "Löschen",
      pricingDeleteConfirm: "Diese Tarifregel löschen?",
      pricingFieldFrom: "Erstes Datum",
      pricingFieldTo: "Letztes Datum",
      pricingFieldPrice: "Preis pro Nacht (CHF)",
      pricingFieldPriceByGuests: "Preis pro Nacht nach Personenanzahl (CHF)",
      pricingGuests1: "1 Person",
      pricingGuests2: "2 Personen",
      pricingGuests3: "3 Personen",
      pricingGuests4: "4 Personen",
      pricingFieldWeekdays: "Betroffene Tage",
      pricingPerNight: "Nacht",
      pricingWeekdayMon: "Mo",
      pricingWeekdayTue: "Di",
      pricingWeekdayWed: "Mi",
      pricingWeekdayThu: "Do",
      pricingWeekdayFri: "Fr",
      pricingWeekdaySat: "Sa",
      pricingWeekdaySun: "So",
    },
    reservations: {
      title: "Reservieren und bezahlen",
      subtitle:
        "Wählen Sie Ihre Daten und die Personenanzahl, dann bezahlen Sie den Aufenthalt online (Karte, Apple Pay, Google Pay).",
      calendarTitle: "Verfügbarkeit",
      legendFree: "Frei",
      legendBusy: "Belegt (Booking / Airbnb)",
      legendAccepted: "Bestätigte Direktbuchung",
      latencyNote: "",
      notConfiguredNote:
        "Die iCal-Links von Booking/Airbnb sind auf dem Server noch nicht konfiguriert — alle Daten erscheinen frei.",
      formTitle: "Zahlung",
      formNote:
        "Wählen Sie zuerst Ihre Daten im Kalender (mindestens 2 Nächte), dann bezahlen Sie, um die Buchung zu bestätigen.",
      formPrefillNote:
        "Ihre Daten und der Betrag sind bereit. Die Zahlung erfolgt auf der sicheren Stripe-Seite.",
      formLockedTitle: "Zahlung gesperrt",
      formLockedHint:
        "Wählen Sie Anreise- und Abreisedatum im Kalender (Aufenthalt von mindestens 2 Nächten), um zu bezahlen.",
      formLockedAction: "Zurück zum Kalender",
      calendarSelectHint:
        "Klicken Sie ein Anreisedatum, dann ein Abreisedatum (mindestens 2 Nächte, nur freie Tage).",
      selectedRangeLabel: "Aufenthalt:",
      clearRangeLabel: "Löschen",
      rangeInvalidHint:
        "Dieser Zeitraum überschneidet bereits gebuchte Daten — wählen Sie andere Tage.",
      rangeMinNightsHint:
        "Mindestaufenthalt 2 Nächte — wählen Sie ein Abreisedatum mindestens zwei Tage nach der Anreise.",
      promoOptionalLabel: "Aktionscode (optional)",
      promoPlaceholder: "z. B. OCT2026-10",
      promoApplyButton: "Code prüfen",
      promoApplying: "Prüfung…",
      promoValidBadge: "Code akzeptiert",
      promoClearButton: "Entfernen",
      promoInvalidHint:
        "Ungültiger Code oder nicht gültig für diese Daten. Korrigieren oder das Feld leer lassen.",
      legendPricePerNight: "",
      guestCountLabel: "Anzahl Personen",
      guestCountOne: "1 Person",
      guestCountMany: "{count} Personen",
      stayTotalTitle: "Aufenthaltsbetrag",
      stayTotalForOneGuest: "Tarif für 1 Person",
      stayTotalForGuests: "Tarif für {count} Personen",
      stayTotalNights: "{count} Nächte",
      stayTotalDiscount: "Rabatt Aktionscode",
      stayTotalLabel: "Total",
      stayTotalIncomplete:
        "Tarif fehlt für {missing} Nacht/Nächte in diesem Aufenthalt — prüfen Sie die Daten oder kontaktieren Sie uns.",
      stayTotalNoRatesForDates: "Kein veröffentlichter Tarif für diese Daten.",
      payButton: "Bezahlen und Buchung bestätigen",
      payLoading: "Weiterleitung zur Zahlung…",
      payError: "Die Zahlung konnte nicht gestartet werden. Bitte erneut versuchen oder uns kontaktieren.",
      payUnavailable: "Die Online-Zahlung ist auf diesem Server noch nicht aktiviert.",
      payDatesUnavailable: "Diese Daten wurden soeben vergeben. Bitte wählen Sie einen anderen Zeitraum.",
      paySuccessTitle: "Buchung bestätigt",
      paySuccessBody:
        "Danke. Die Zahlung ist eingegangen. Eine Bestätigungs-E-Mail und die Rechnung werden Ihnen zugesendet.",
      paySuccessHome: "Zurück zur Startseite",
      paySuccessTransaction: "Bestellnummer",
      paySuccessAmount: "Betrag",
      paySuccessCurrency: "Währung",
      paySuccessEmail: "E-Mail",
      payCancelTitle: "Zahlung nicht abgeschlossen",
      payCancelBody: "Es wurde kein Betrag abgebucht. Sie können die Zahlung jederzeit erneut starten.",
      payCancelRetry: "Zurück zur Reservierung",
    },
    footer: {
      contact: "Kontakt",
      copyright: "Copyright 2025",
      credits: "Website von db marketing",
      privacy: "Datenschutz",
      cookies: "Cookies",
    },
    newsletter: {
      title: "Aktuelles",
      description:
        "Nachrichten vom Nid de la Sittelle (Doppelbestätigung per E-Mail).",
      emailPlaceholder: "Ihre E-Mail-Adresse",
      consentLabel:
        "Ich bin einverstanden, Informations-E-Mails von BnB Valais zu erhalten. Ich kann mich jederzeit abmelden.",
      submitButton: "Anmelden",
      submitting: "Senden…",
      successInbox:
        "Prüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink (7 Tage gültig).",
      errorGeneric: "Die E-Mail konnte momentan nicht gesendet werden. Bitte später erneut versuchen.",
    },
    newsletterConfirm: {
      successTitle: "Anmeldung bestätigt",
      successBody:
        "Danke! Sie erhalten unsere nächsten Nachrichten. Sie können sich in jeder E-Mail abmelden.",
      alreadyTitle: "Bereits angemeldet",
      alreadyBody: "Diese Adresse ist bereits für unsere Nachrichten eingetragen.",
      expiredTitle: "Link abgelaufen",
      expiredBody:
        "Dieser Bestätigungslink ist abgelaufen. Melden Sie sich erneut über die Fusszeile der Website an.",
      invalidTitle: "Ungültiger Link",
      invalidBody:
        "Dieser Link ist ungültig oder wurde bereits verwendet. Melden Sie sich bei Bedarf erneut an.",
      errorTitle: "Bestätigung unvollständig",
      errorBody:
        "Ihr Klick wurde erfasst, aber das Hinzufügen zur Liste ist fehlgeschlagen. Kontaktieren Sie uns oder versuchen Sie es erneut.",
      backHome: "Zurück zur Startseite",
    },
    language: {
      label: "Deutsch",
      switchTo: "Français",
    },
  },
};

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}
