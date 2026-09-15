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
      promoOptionalLabel: "Code promo (facultatif)",
      promoPlaceholder: "Ex. NOV2026-10",
      promoApplyButton: "Vérifier le code",
      promoApplying: "Vérification…",
      promoValidBadge: "Code accepté",
      promoClearButton: "Retirer",
      promoInvalidHint:
        "Code invalide ou non valable pour ces dates. Corrigez ou laissez le champ vide.",
      legendPricePerNight:
        "Montant affiché = prix par nuit pour le nombre de personnes choisi",
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
      promoOptionalLabel: "Promo code (optional)",
      promoPlaceholder: "E.g. NOV2026-10",
      promoApplyButton: "Verify code",
      promoApplying: "Checking…",
      promoValidBadge: "Code accepted",
      promoClearButton: "Remove",
      promoInvalidHint:
        "Invalid code or not valid for these dates. Fix it or leave the field empty.",
      legendPricePerNight:
        "Amount shown = nightly rate for the selected number of guests",
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
