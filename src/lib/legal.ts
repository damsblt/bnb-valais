import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { SITE_BRAND, SITE_EMAIL, SITE_NAME, SITE_PHONE } from "@/lib/site";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPageCopy = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export function privacyPath(locale: Locale) {
  const slug =
    locale === "fr"
      ? "/protection-des-donnees"
      : locale === "de"
        ? "/datenschutz"
        : "/privacy";
  return localePath(locale, slug);
}

export function cookiesPath(locale: Locale) {
  return localePath(locale, "/cookies");
}

export function getCookieBannerCopy(locale: Locale) {
  if (locale === "en") {
    return {
      text: "We use essential cookies to run the site. Google Analytics and Google Maps are loaded only with your consent. Payments are processed by Stripe on a secure page.",
      acceptAll: "Accept all",
      essentialOnly: "Essential only",
      privacy: "Privacy",
      cookies: "Cookies",
    };
  }
  if (locale === "de") {
    return {
      text: "Wir verwenden notwendige Cookies für den Betrieb der Website. Google Analytics und Google Maps werden nur mit Ihrer Zustimmung geladen. Zahlungen werden von Stripe auf einer sicheren Seite verarbeitet.",
      acceptAll: "Alle akzeptieren",
      essentialOnly: "Nur notwendige",
      privacy: "Datenschutz",
      cookies: "Cookies",
    };
  }
  return {
    text: "Nous utilisons des cookies nécessaires au fonctionnement du site. Google Analytics et Google Maps ne sont chargés qu’avec votre accord. Les paiements sont traités par Stripe sur une page sécurisée.",
    acceptAll: "Tout accepter",
    essentialOnly: "Nécessaires uniquement",
    privacy: "Protection des données",
    cookies: "Cookies",
  };
}

export function getMapConsentCopy(locale: Locale) {
  if (locale === "en") {
    return {
      message: "The map is provided by Google and uses optional cookies.",
      action: "Show the map",
    };
  }
  if (locale === "de") {
    return {
      message: "Die Karte wird von Google bereitgestellt und verwendet optionale Cookies.",
      action: "Karte anzeigen",
    };
  }
  return {
    message: "La carte est fournie par Google et utilise des cookies optionnels.",
    action: "Afficher la carte",
  };
}

export function getPrivacyCopy(locale: Locale): LegalPageCopy {
  if (locale === "de") {
    return {
      title: "Datenschutz und Datenweitergabe",
      updated: "Letzte Aktualisierung: 20. September 2026",
      intro: `${SITE_BRAND} (${SITE_NAME}) erklärt hier, wie personenbezogene Daten auf bnb-valais.ch verarbeitet werden.`,
      sections: [
        {
          title: "Wer verantwortlich ist",
          paragraphs: [
            `Verantwortlich für die Bearbeitung ist ${SITE_BRAND} — ${SITE_NAME}, Wallis, Schweiz.`,
            `Kontakt: ${SITE_EMAIL} · ${SITE_PHONE}`,
          ],
        },
        {
          title: "Welche Daten wir bearbeiten",
          paragraphs: [
            "Nutzung: technische Protokolle, die für die Anzeige der Seiten nötig sind (IP-Adresse, Browser, Datum), aufbewahrt durch unseren Hosting-Anbieter.",
            "Newsletter: E-Mail-Adresse, Sprache und Ihre Einwilligung, nach doppelter Bestätigung per E-Mail.",
            "Buchungen: Identität, Kontaktdaten, Aufenthaltsdaten, Personenanzahl und Zahlungsdaten, von Stripe verarbeitet, um den Aufenthalt zu bestätigen.",
            "Wir erstellen keine Werbeprofile und verkaufen Ihre Daten nicht.",
          ],
        },
        {
          title: "Weshalb wir sie bearbeiten",
          paragraphs: [
            "Eine Buchung entgegenzunehmen, die Zahlung einzuziehen und den Aufenthalt zu verwalten (Vertragserfüllung).",
            "Nachrichten zu senden, wenn Sie sich angemeldet haben (Einwilligung, jederzeit widerrufbar).",
            "Die Website zu betreiben, zu sichern und zu verbessern (berechtigte Interessen).",
          ],
        },
        {
          title: "Mit wem wir sie teilen",
          paragraphs: [
            "Daten werden nur an Dienstleister weitergegeben, die für den Service nötig sind:",
            "Stripe (Zahlungen und Rechnungen), Resend (E-Mails), Vercel (Hosting und Dateispeicher), Google (Karte und Analytics, nur wenn Sie optionale Cookies akzeptieren).",
            "Diese Dienstleister handeln in unserem Auftrag. Einige können Daten ausserhalb der Schweiz bearbeiten (zum Beispiel in der EU oder den USA), mit angemessenen Garantien.",
            "Wir geben Daten nicht an Werbetreibende oder Datenhändler weiter.",
          ],
        },
        {
          title: "Aufbewahrungsdauer",
          paragraphs: [
            "Newsletter: bis zu Ihrer Abmeldung, danach eine kurze technische Frist, um diesem Wunsch nachzukommen.",
            "Buchungsanfragen: so lange, wie es für den Aufenthalt und gesetzliche Pflichten nötig ist (insbesondere Buchhaltung).",
            "Serverprotokolle: für eine begrenzte Dauer, aus Sicherheitsgründen.",
          ],
        },
        {
          title: "Ihre Rechte",
          paragraphs: [
            "Nach dem schweizerischen Datenschutzgesetz (nDSG) können Sie Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen und bestimmten Bearbeitungen widersprechen, soweit anwendbar.",
            `Schreiben Sie an ${SITE_EMAIL}. Sie können auch den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) kontaktieren.`,
          ],
        },
        {
          title: "Cookies",
          paragraphs: [
            "Einzelheiten zu Cookies und Drittdiensten stehen auf der Cookie-Seite.",
          ],
        },
      ],
    };
  }

  if (locale === "en") {
    return {
      title: "Privacy and data sharing",
      updated: "Last updated: 20 September 2026",
      intro: `${SITE_BRAND} (${SITE_NAME}) explains here how personal data is processed on bnb-valais.ch.`,
      sections: [
        {
          title: "Who is responsible",
          paragraphs: [
            `The data controller is ${SITE_BRAND} — ${SITE_NAME}, Valais, Switzerland.`,
            `Contact: ${SITE_EMAIL} · ${SITE_PHONE}`,
          ],
        },
        {
          title: "What data we process",
          paragraphs: [
            "Browsing data: technical logs needed to serve the pages (IP address, browser, date), kept by our hosting provider.",
            "Newsletter: email address, language, and your consent, after double confirmation by email.",
            "Bookings: identity, contact details, stay dates, number of guests and payment data, processed by Stripe to confirm the stay.",
            "We do not create marketing profiles and we do not sell your data.",
          ],
        },
        {
          title: "Why we process it",
          paragraphs: [
            "To take a booking, collect payment and manage the stay (performance of a contract).",
            "To send news if you have subscribed (consent, which you can withdraw at any time).",
            "To operate, secure and improve the website (legitimate interest).",
          ],
        },
        {
          title: "Who we share data with",
          paragraphs: [
            "Data is shared only with providers needed to run the service:",
            "Stripe (payments and invoices), Resend (emails), Vercel (hosting and file storage), Google (map and Analytics, only if you accept optional cookies).",
            "These providers act on our instructions. Some may process data outside Switzerland (for example in the EU or the United States), with appropriate safeguards.",
            "We do not share data with advertisers or data brokers.",
          ],
        },
        {
          title: "How long we keep it",
          paragraphs: [
            "Newsletter: until you unsubscribe, then a short technical period to honour that request.",
            "Booking requests: for the time needed to handle the stay and meet legal obligations (in particular accounting).",
            "Server logs: for a short period, as required for security.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "Under Swiss data protection law (nFADP), you may ask to access, correct or delete your data, and object to or restrict certain processing, where applicable.",
            `Write to ${SITE_EMAIL}. You may also contact the Federal Data Protection and Information Commissioner (FDPIC).`,
          ],
        },
        {
          title: "Cookies",
          paragraphs: [
            "Details of cookies and third-party services are on the Cookies page.",
          ],
        },
      ],
    };
  }

  return {
    title: "Protection des données",
    updated: "Dernière mise à jour : 20 septembre 2026",
    intro: `${SITE_BRAND} (${SITE_NAME}) explique ici comment les données personnelles sont traitées sur le site bnb-valais.ch.`,
    sections: [
      {
        title: "Qui est responsable",
        paragraphs: [
          `Le responsable du traitement est ${SITE_BRAND} — ${SITE_NAME}, Valais, Suisse.`,
          `Contact : ${SITE_EMAIL} · ${SITE_PHONE}`,
        ],
      },
      {
        title: "Quelles données nous traitons",
        paragraphs: [
          "Navigation : journaux techniques nécessaires à l’affichage des pages (adresse IP, navigateur, date), conservés par l’hébergeur.",
          "Newsletter : adresse e-mail, langue et votre consentement, après double confirmation par e-mail.",
          "Réservations : identité, coordonnées, dates du séjour, nombre de personnes et données de paiement, traitées par Stripe pour confirmer le séjour.",
          "Nous ne constituons pas de profils publicitaires et nous ne vendons pas vos données.",
        ],
      },
      {
        title: "Pourquoi nous les traitons",
        paragraphs: [
          "Prendre une réservation, encaisser le paiement et gérer le séjour (exécution d’un contrat).",
          "Envoyer des actualités si vous vous y êtes inscrit (consentement, révocable à tout moment).",
          "Faire fonctionner, sécuriser et améliorer le site (intérêt légitime).",
        ],
      },
      {
        title: "Avec qui nous les partageons",
        paragraphs: [
          "Les données sont transmises uniquement aux prestataires nécessaires au service :",
          "Stripe (paiements et factures), Resend (envoi des e-mails), Vercel (hébergement et stockage), Google (carte et Analytics, uniquement si vous acceptez les cookies optionnels).",
          "Ces prestataires agissent pour notre compte. Certains peuvent traiter des données hors de Suisse (par exemple dans l’UE ou aux États-Unis), avec des garanties appropriées.",
          "Nous ne transmettons pas vos données à des publicitaires ni à des courtiers en données.",
        ],
      },
      {
        title: "Durée de conservation",
        paragraphs: [
          "Newsletter : jusqu’à votre désinscription, puis un court délai technique pour honorer cette demande.",
          "Demandes de réservation : le temps nécessaire au séjour et aux obligations légales (notamment comptables).",
          "Journaux serveur : une durée limitée, pour la sécurité du site.",
        ],
      },
      {
        title: "Vos droits",
        paragraphs: [
          "Selon la loi suisse sur la protection des données (nLPD), vous pouvez demander l’accès, la rectification ou la suppression de vos données, et vous opposer à certains traitements le cas échéant.",
          `Écrivez à ${SITE_EMAIL}. Vous pouvez aussi contacter le Préposé fédéral à la protection des données et à la transparence (PFPDT).`,
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Le détail des cookies et des services tiers figure sur la page Cookies.",
        ],
      },
    ],
  };
}

export function getCookiesCopy(locale: Locale): LegalPageCopy {
  if (locale === "de") {
    return {
      title: "Cookies",
      updated: "Letzte Aktualisierung: 20. September 2026",
      intro: "Diese Seite beschreibt die Cookies und ähnlichen Technologien, die auf der Website verwendet werden.",
      sections: [
        {
          title: "Was ein Cookie ist",
          paragraphs: [
            "Ein Cookie ist eine kleine Datei, die auf Ihrem Gerät gespeichert wird. Sie kann für den Betrieb der Website nötig sein oder optional, wenn sie von einem Drittdienst wie einer Karte stammt.",
          ],
        },
        {
          title: "Notwendige Cookies",
          paragraphs: [
            "Sie halten die Website funktionsfähig (zum Beispiel die sichere Admin-Sitzung). Sie erfordern keine vorherige Einwilligung.",
            "Die Schriften werden mit der Website gehostet: der Seitenaufruf lädt keine Google Fonts in Ihrem Browser.",
          ],
        },
        {
          title: "Optionale Cookies (Google Analytics und Google Maps)",
          paragraphs: [
            "Google Analytics misst die Besuche auf der Website (Seiten, Herkunft, Gerät). Google Tag Manager lädt diese Google-Tags. Sie werden nur geladen, wenn Sie auf «Alle akzeptieren» klicken.",
            "Die Karte auf der Startseite wird von Google bereitgestellt. Sie wird nur geladen, wenn Sie auf «Alle akzeptieren» oder «Karte anzeigen» klicken.",
            "Google kann dann Cookies setzen und Verbindungsdaten nach eigener Richtlinie verarbeiten.",
          ],
        },
        {
          title: "Stripe (Zahlung)",
          paragraphs: [
            "Kartenzahlungen werden von Stripe auf einer sicheren, von Stripe gehosteten Seite verarbeitet. Wir speichern Ihre Kartennummer nicht. Stripe kann Cookies oder ähnliche Technologien verwenden, die für die Zahlung nötig sind, nach eigener Richtlinie.",
          ],
        },
        {
          title: "Ihre Wahl",
          paragraphs: [
            "Ein Banner ermöglicht, alle Cookies zu akzeptieren oder nur notwendige Cookies zu behalten. Sie können Cookies auch im Browser blockieren; einige Funktionen können dann eingeschränkt sein.",
          ],
        },
      ],
    };
  }

  if (locale === "en") {
    return {
      title: "Cookies",
      updated: "Last updated: 20 September 2026",
      intro: "This page describes the cookies and similar technologies used on the site.",
      sections: [
        {
          title: "What is a cookie",
          paragraphs: [
            "A cookie is a small file stored on your device. It can be essential to run the site, or optional when it comes from a third-party service such as a map.",
          ],
        },
        {
          title: "Essential cookies",
          paragraphs: [
            "They keep the site working (for example the secure admin session). They do not require prior consent.",
            "The fonts are hosted with the site: visiting the pages does not call Google Fonts in your browser.",
          ],
        },
        {
          title: "Optional cookies (Google Analytics and Google Maps)",
          paragraphs: [
            "Google Analytics measures visits to the site (pages, source, device). Google Tag Manager loads these Google tags. They are loaded only if you click “Accept all”.",
            "The homepage map is provided by Google. It is loaded only if you click “Accept all” or “Show the map”.",
            "Google may then set cookies and process connection data under its own policy.",
          ],
        },
        {
          title: "Stripe (payment)",
          paragraphs: [
            "Card payments are processed by Stripe on a secure page hosted by Stripe. We do not store your card number. Stripe may use cookies or similar technologies needed to complete the payment, under its own policy.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            "A banner lets you accept all cookies or keep essential cookies only. You can change your browser settings to block cookies; some features may then be limited.",
          ],
        },
      ],
    };
  }

  return {
    title: "Cookies",
    updated: "Dernière mise à jour : 20 septembre 2026",
    intro: "Cette page décrit les cookies et technologies similaires utilisés sur le site.",
    sections: [
      {
        title: "Qu’est-ce qu’un cookie",
        paragraphs: [
          "Un cookie est un petit fichier enregistré sur votre appareil. Il peut être nécessaire au fonctionnement du site, ou optionnel lorsqu’il vient d’un service tiers comme une carte.",
        ],
      },
      {
        title: "Cookies nécessaires",
        paragraphs: [
          "Ils permettent au site de fonctionner (par exemple la session d’administration). Ils ne nécessitent pas de consentement préalable.",
          "Les polices d’écriture sont hébergées avec le site : l’affichage des pages n’appelle pas Google Fonts dans votre navigateur.",
        ],
      },
      {
        title: "Cookies optionnels (Google Analytics et Google Maps)",
        paragraphs: [
            "Google Analytics mesure les visites sur le site (pages, provenance, appareil). Google Tag Manager charge ces balises Google. Ils ne sont chargés que si vous cliquez sur « Tout accepter ».",
          "La carte de la page d’accueil est fournie par Google. Elle n’est chargée que si vous cliquez sur « Tout accepter » ou « Afficher la carte ».",
          "Google peut alors déposer des cookies et traiter des données de connexion selon sa propre politique.",
        ],
      },
      {
        title: "Stripe (paiement)",
        paragraphs: [
          "Les paiements par carte sont traités par Stripe sur une page sécurisée hébergée par Stripe. Nous ne stockons pas votre numéro de carte. Stripe peut utiliser des cookies ou technologies similaires nécessaires au paiement, selon sa propre politique.",
        ],
      },
      {
        title: "Vos choix",
        paragraphs: [
          "Un bandeau vous permet d’accepter tous les cookies ou de conserver uniquement les cookies nécessaires. Vous pouvez aussi bloquer les cookies dans votre navigateur ; certaines fonctions peuvent alors être limitées.",
        ],
      },
    ],
  };
}
