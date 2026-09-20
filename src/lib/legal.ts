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
  return localePath(locale, locale === "fr" ? "/protection-des-donnees" : "/privacy");
}

export function cookiesPath(locale: Locale) {
  return localePath(locale, "/cookies");
}

export function getCookieBannerCopy(locale: Locale) {
  if (locale === "en") {
    return {
      text: "We use essential cookies to run the site. Google Maps is loaded only with your consent. Typeform is used to send a booking request.",
      acceptAll: "Accept all",
      essentialOnly: "Essential only",
      privacy: "Privacy",
      cookies: "Cookies",
    };
  }
  return {
    text: "Nous utilisons des cookies nécessaires au fonctionnement du site. La carte Google Maps n’est chargée qu’avec votre accord. Typeform sert à envoyer une demande de réservation.",
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
  return {
    message: "La carte est fournie par Google et utilise des cookies optionnels.",
    action: "Afficher la carte",
  };
}

export function getPrivacyCopy(locale: Locale): LegalPageCopy {
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
            "Booking requests: identity, contact details, stay dates, number of guests, message and any promo code, via the Typeform form.",
            "We do not create marketing profiles and we do not sell your data.",
          ],
        },
        {
          title: "Why we process it",
          paragraphs: [
            "To answer a booking request and manage the stay (performance of a contract or pre-contractual steps).",
            "To send news if you have subscribed (consent, which you can withdraw at any time).",
            "To operate, secure and improve the website (legitimate interest).",
          ],
        },
        {
          title: "Who we share data with",
          paragraphs: [
            "Data is shared only with providers needed to run the service:",
            "Typeform (booking form), Resend (emails), Vercel (hosting and file storage), Google (map, only if you accept optional cookies).",
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
          "Demandes de réservation : identité, coordonnées, dates du séjour, nombre de personnes, message et éventuellement un code promo, via le formulaire Typeform.",
          "Nous ne constituons pas de profils publicitaires et nous ne vendons pas vos données.",
        ],
      },
      {
        title: "Pourquoi nous les traitons",
        paragraphs: [
          "Répondre à une demande de réservation et gérer le séjour (exécution d’un contrat ou de mesures précontractuelles).",
          "Envoyer des actualités si vous vous y êtes inscrit (consentement, révocable à tout moment).",
          "Faire fonctionner, sécuriser et améliorer le site (intérêt légitime).",
        ],
      },
      {
        title: "Avec qui nous les partageons",
        paragraphs: [
          "Les données sont transmises uniquement aux prestataires nécessaires au service :",
          "Typeform (formulaire de réservation), Resend (envoi des e-mails), Vercel (hébergement et stockage), Google (carte, uniquement si vous acceptez les cookies optionnels).",
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
          title: "Optional cookies (Google Maps)",
          paragraphs: [
            "The homepage map is provided by Google. It is loaded only if you click “Accept all” or “Show the map”.",
            "Google may then set cookies and process connection data under its own policy.",
          ],
        },
        {
          title: "Typeform (booking form)",
          paragraphs: [
            "The booking request form is provided by Typeform. It is needed to send your request. Typeform may use cookies or similar technologies to run the form, under its own policy.",
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
        title: "Cookies optionnels (Google Maps)",
        paragraphs: [
          "La carte de la page d’accueil est fournie par Google. Elle n’est chargée que si vous cliquez sur « Tout accepter » ou « Afficher la carte ».",
          "Google peut alors déposer des cookies et traiter des données de connexion selon sa propre politique.",
        ],
      },
      {
        title: "Typeform (formulaire de réservation)",
        paragraphs: [
          "Le formulaire de demande de réservation est fourni par Typeform. Il est nécessaire pour envoyer votre demande. Typeform peut utiliser des cookies ou technologies similaires pour faire fonctionner le formulaire, selon sa propre politique.",
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
