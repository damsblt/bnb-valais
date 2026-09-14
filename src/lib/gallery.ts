export type GalleryPhoto = {
  src: string;
  alt: {
    fr: string;
    en: string;
  };
};

export const heroImage = "/images/new/DJI_0055.JPG";

export const splitImages = {
  alps: "/images/new/DJI_0057.JPG",
} as const;

export const apartmentGalleryImages = [
  "/images/new/IMG_6631.jpg",
  "/images/new/IMG_9136.JPG",
  "/images/new/IMG_9138.JPG",
  "/images/new/IMG_9140.JPG",
] as const;

const photoMeta: Record<string, GalleryPhoto["alt"]> = {
  "/images/new/Chambre-enfant-Nid_2-1024x768.jpeg": {
    fr: "Chambre enfant",
    en: "Children's bedroom",
  },
  "/images/new/DJI_0052.JPG": { fr: "Panorama sur le Valais", en: "Panorama over Valais" },
  "/images/new/DJI_0055.JPG": { fr: "Vue drone sur les Alpes", en: "Drone view of the Alps" },
  "/images/new/DJI_0057.JPG": {
    fr: "Vue aérienne du Nid de la Sittelle",
    en: "Aerial view of Le Nid de la Sittelle",
  },
  "/images/new/DJI_0064.JPG": { fr: "Environnement alpin", en: "Alpine surroundings" },
  "/images/new/DSC00895.JPG": { fr: "Vallée enneigée", en: "Snowy valley" },
  "/images/new/IMG_4021.JPEG": {
    fr: "Jardin avec vue sur les montagnes",
    en: "Garden with mountain view",
  },
  "/images/new/IMG_4022.JPEG": { fr: "Terrasse ombragée", en: "Shaded terrace" },
  "/images/new/IMG_6631.jpg": {
    fr: "Chambre avec accès terrasse",
    en: "Bedroom with terrace access",
  },
  "/images/new/IMG_7944.JPG": { fr: "Appartement en hiver", en: "Apartment in winter" },
  "/images/new/IMG_7974.JPG": { fr: "Intérieur de l'appartement", en: "Apartment interior" },
  "/images/new/IMG_9117.JPG": { fr: "Cuisine équipée", en: "Equipped kitchen" },
  "/images/new/IMG_9118.JPG": { fr: "Espace de vie", en: "Living area" },
  "/images/new/IMG_9119.JPG": { fr: "Salon lumineux", en: "Bright living room" },
  "/images/new/IMG_9136.JPG": { fr: "Chambre avec vue", en: "Bedroom with a view" },
  "/images/new/IMG_9138.JPG": { fr: "Chambre adulte", en: "Master bedroom" },
  "/images/new/IMG_9140.JPG": { fr: "Chambre enfant", en: "Children's bedroom" },
  "/images/new/Terrasse Nid_2.JPEG": { fr: "Terrasse ensoleillée", en: "Sunny terrace" },
};

function photo(src: string): GalleryPhoto {
  return {
    src,
    alt: photoMeta[src] ?? {
      fr: "Le Nid de la Sittelle",
      en: "Le Nid de la Sittelle",
    },
  };
}

const layoutImages = new Set<string>([
  heroImage,
  splitImages.alps,
  ...apartmentGalleryImages,
]);

/** Mosaic: 1ère Terrasse, 2e salon (IMG_9119) */
const galleryLeadOrder = [
  "/images/new/Terrasse Nid_2.JPEG",
  "/images/new/IMG_9119.JPG",
];

const allFolderPhotos = Object.keys(photoMeta).map(photo);

export const propertyPhotos: GalleryPhoto[] = [
  ...galleryLeadOrder.map(photo),
  ...allFolderPhotos.filter(
    (p) =>
      !galleryLeadOrder.includes(p.src) && !layoutImages.has(p.src),
  ),
  ...allFolderPhotos.filter((p) => layoutImages.has(p.src)),
];
