export type GalleryPhoto = {
  src: string;
  alt: {
    fr: string;
    en: string;
  };
};

/** Used in hero, split sections & booking — shown at end of gallery */
export const heroImage = "/images/new/DJI_0057.JPG";
export const bookingImage = heroImage;

export const splitImages = {
  alps: "/images/new/DJI_0055.JPG",
  apartment: "/images/new/IMG_9136.JPG",
} as const;

const layoutImages = new Set<string>([
  heroImage,
  splitImages.alps,
  splitImages.apartment,
]);

const allPhotos: GalleryPhoto[] = [
  {
    src: "/images/new/terrasse-valais.png",
    alt: {
      fr: "Terrasse avec vue sur les Alpes",
      en: "Terrace with Alpine views",
    },
  },
  {
    src: "/images/new/DJI_0052.JPG",
    alt: { fr: "Panorama sur le Valais", en: "Panorama over Valais" },
  },
  {
    src: "/images/new/DJI_0064.JPG",
    alt: { fr: "Environnement alpin", en: "Alpine surroundings" },
  },
  {
    src: "/images/new/IMG_9119.JPG",
    alt: { fr: "Salon lumineux", en: "Bright living room" },
  },
  {
    src: "/images/new/IMG_9118.JPG",
    alt: { fr: "Espace de vie", en: "Living area" },
  },
  {
    src: "/images/new/IMG_9117.JPG",
    alt: { fr: "Cuisine équipée", en: "Equipped kitchen" },
  },
  {
    src: "/images/new/IMG_9138.JPG",
    alt: { fr: "Chambre adulte", en: "Master bedroom" },
  },
  {
    src: "/images/new/IMG_9140.JPG",
    alt: { fr: "Chambre enfant", en: "Children's bedroom" },
  },
  {
    src: "/images/new/IMG_9142.JPG",
    alt: { fr: "Détail de la chambre", en: "Bedroom detail" },
  },
  {
    src: "/images/new/Terrasse Nid_2.JPEG",
    alt: { fr: "Terrasse ensoleillée", en: "Sunny terrace" },
  },
  {
    src: "/images/new/IMG_4021.JPEG",
    alt: { fr: "Jardin avec vue sur les montagnes", en: "Garden with mountain view" },
  },
  {
    src: "/images/new/IMG_4022.JPEG",
    alt: { fr: "Terrasse ombragée", en: "Shaded terrace" },
  },
  {
    src: "/images/new/IMG_6631.jpg",
    alt: { fr: "Chambre avec accès terrasse", en: "Bedroom with terrace access" },
  },
  {
    src: "/images/new/IMG_7944.JPG",
    alt: { fr: "Appartement en hiver", en: "Apartment in winter" },
  },
  {
    src: "/images/new/IMG_7974.JPG",
    alt: { fr: "Intérieur de l'appartement", en: "Apartment interior" },
  },
  {
    src: "/images/new/DSC00895.JPG",
    alt: { fr: "Vallée enneigée", en: "Snowy valley" },
  },
  {
    src: "/images/new/DJI_0057.JPG",
    alt: { fr: "Vue aérienne de Maison La Sittelle", en: "Aerial view of Maison La Sittelle" },
  },
  {
    src: "/images/new/DJI_0055.JPG",
    alt: { fr: "Vue drone sur les Alpes", en: "Drone view of the Alps" },
  },
  {
    src: "/images/new/IMG_9136.JPG",
    alt: { fr: "Chambre avec vue", en: "Bedroom with a view" },
  },
];

export const propertyPhotos: GalleryPhoto[] = [
  ...allPhotos.filter((p) => !layoutImages.has(p.src)),
  ...allPhotos.filter((p) => layoutImages.has(p.src)),
];
