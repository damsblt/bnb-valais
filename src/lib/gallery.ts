export type GalleryPhoto = {
  src: string;
  alt: {
    fr: string;
    en: string;
  };
};

export const heroImage = "/images/new/chambres/IMG_9432.JPG";
export const heroImageMobile = "/images/new/chambres/IMG_9428.JPG";

export const heroImages = {
  desktop: heroImage,
  mobile: heroImageMobile,
} as const;

function photo(src: string, fr: string, en: string): GalleryPhoto {
  return { src, alt: { fr, en } };
}

export const galleryPhotos = {
  exterieur: [
    photo(
      "/images/new/exterieur/IMG_9118.JPG",
      "Coin salon de jardin avec vue sur les Alpes",
      "Garden seating with a view of the Alps",
    ),
    photo(
      "/images/new/exterieur/Terrasse Nid_2.JPEG",
      "Terrasse ensoleillée avec vue sur les montagnes",
      "Sunny terrace with mountain views",
    ),
    photo(
      "/images/new/exterieur/IMG_4022.JPEG",
      "Terrasse ombragée ouverte sur la vallée",
      "Shaded terrace opening onto the valley",
    ),
    photo(
      "/images/new/exterieur/IMG_9271.JPG",
      "Pelouse et panorama sur les Alpes",
      "Lawn and panorama over the Alps",
    ),
    photo(
      "/images/new/exterieur/IMG_9272.JPG",
      "Façade de l'appartement et jardin",
      "Apartment façade and garden",
    ),
    photo(
      "/images/new/exterieur/IMG_9273.JPG",
      "Jardin fleuri le long de l'appartement",
      "Flower garden along the apartment",
    ),
    photo(
      "/images/new/exterieur/IMG_9265.JPG",
      "Jardin avec chaises colorées",
      "Garden with colourful chairs",
    ),
    photo(
      "/images/new/exterieur/IMG_9481.JPG",
      "Façade et terrasse illuminées au crépuscule",
      "Façade and terrace lit at dusk",
    ),
    photo(
      "/images/new/exterieur/IMG_9487.JPG",
      "Table de terrasse couverte le soir",
      "Covered terrace table in the evening",
    ),
    photo(
      "/images/new/exterieur/IMG_7974.JPG",
      "Terrasse enneigée et soleil d'hiver",
      "Snowy terrace in winter sun",
    ),
    photo(
      "/images/new/exterieur/DSC00895.JPG",
      "Vallée enneigée vue depuis le Nid",
      "Snowy valley seen from Le Nid",
    ),
  ],
  sejour: [
    photo(
      "/images/new/sejour/IMG_9456.JPG",
      "Cuisine ouverte sur le salon et la vue Alpes",
      "Kitchen opening onto the living room and Alpine views",
    ),
    photo(
      "/images/new/sejour/IMG_9286.JPG",
      "Salon avec vue sur les Alpes",
      "Living room with Alpine views",
    ),
    photo(
      "/images/new/sejour/IMG_9457.JPG",
      "Séjour, coin nuit et baie vitrée sur le jardin",
      "Living area, sleeping nook and garden window",
    ),
    photo(
      "/images/new/sejour/IMG_9463.jpg",
      "Cuisine équipée avec plaques et évier",
      "Equipped kitchen with hob and sink",
    ),
    photo(
      "/images/new/sejour/IMG_9488.JPG",
      "Salle à manger et cuisine",
      "Dining area and kitchen",
    ),
    photo(
      "/images/new/sejour/IMG_9493.JPG",
      "Salon, table à manger et mur en bois",
      "Living room, dining table and wood-panelled wall",
    ),
    photo(
      "/images/new/sejour/IMG_9471.JPG",
      "Buanderie avec réfrigérateur et lave-linge",
      "Utility room with fridge and laundry sink",
    ),
  ],
  chambres: [
    photo(
      "/images/new/chambres/IMG_9432.JPG",
      "Vue sur les Alpes depuis le lit",
      "Alpine view from the bed",
    ),
    photo(
      "/images/new/chambres/IMG_9428.JPG",
      "Chambre avec baie vitrée ouverte sur la terrasse",
      "Bedroom with sliding doors open onto the terrace",
    ),
    photo(
      "/images/new/chambres/IMG_9445.JPG",
      "Chambre avec lit en bois et rangements",
      "Bedroom with wooden bed and storage",
    ),
    photo(
      "/images/new/chambres/chambre-enfant.JPEG",
      "Chambre avec deux lits simples",
      "Bedroom with two single beds",
    ),
    photo(
      "/images/new/chambres/IMG_9511.JPG",
      "Seconde chambre avec deux lits et placard",
      "Second bedroom with twin beds and wardrobe",
    ),
  ],
  batiment: [
    photo(
      "/images/new/batiment/DJI_0057.JPG",
      "Vue aérienne du Nid de la Sittelle",
      "Aerial view of Le Nid de la Sittelle",
    ),
    photo(
      "/images/new/batiment/DJI_0055.JPG",
      "Façade et jardin en terrasse",
      "Façade and terraced garden",
    ),
    photo(
      "/images/new/batiment/DJI_0052.JPG",
      "Le bâtiment et ses terrasses",
      "The house and its terraces",
    ),
    photo(
      "/images/new/batiment/DJI_0064.JPG",
      "Vue drone sur les terrasses et le jardin",
      "Drone view of the terraces and garden",
    ),
  ],
} as const satisfies Record<string, GalleryPhoto[]>;

export const propertyPhotos: GalleryPhoto[] = [
  ...galleryPhotos.exterieur,
  ...galleryPhotos.sejour,
  ...galleryPhotos.chambres,
  ...galleryPhotos.batiment,
];
