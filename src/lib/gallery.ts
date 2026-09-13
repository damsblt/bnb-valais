export type GalleryPhoto = {
  src: string;
  alt: {
    fr: string;
    en: string;
  };
};

export const propertyPhotos: GalleryPhoto[] = [
  {
    src: "/images/new/DJI_0057.JPG",
    alt: { fr: "Vue aérienne de Maison La Sittelle", en: "Aerial view of Maison La Sittelle" },
  },
  {
    src: "/images/new/DJI_0055.JPG",
    alt: { fr: "Vue drone sur les Alpes", en: "Drone view of the Alps" },
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
    src: "/images/new/IMG_9136.JPG",
    alt: { fr: "Chambre avec vue", en: "Bedroom with a view" },
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
    alt: { fr: "Terrasse avec pelouse", en: "Terrace with lawn" },
  },
  {
    src: "/images/new/IMG_4022.JPEG",
    alt: { fr: "Espace extérieur", en: "Outdoor space" },
  },
  {
    src: "/images/new/IMG_6631.jpg",
    alt: { fr: "Vue depuis la terrasse", en: "View from the terrace" },
  },
  {
    src: "/images/new/IMG_7944.JPG",
    alt: { fr: "Appartement", en: "Apartment" },
  },
  {
    src: "/images/new/IMG_7974.JPG",
    alt: { fr: "Intérieur de l'appartement", en: "Apartment interior" },
  },
  {
    src: "/images/new/DSC00895.JPG",
    alt: { fr: "Ambiance chaleureuse", en: "Warm atmosphere" },
  },
];

export const heroImage = propertyPhotos[0].src;
export const splitImages = {
  alps: propertyPhotos[1].src,
  apartment: propertyPhotos[7].src,
} as const;
