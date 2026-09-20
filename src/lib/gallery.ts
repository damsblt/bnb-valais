export type GalleryPhoto = {
  src: string;
  alt: {
    fr: string;
    en: string;
  };
};

export const heroImage = "/images/new/header-desktop.png";
export const heroImageMobile = "/images/new/header-mobile.png";

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
      "/images/new/sejour/IMG_9286.JPG",
      "Salon avec vue sur les Alpes",
      "Living room with Alpine views",
    ),
    photo(
      "/images/new/sejour/IMG_9136.JPG",
      "Espace salon et salle à manger",
      "Living and dining area",
    ),
    photo(
      "/images/new/sejour/IMG_9281.JPG",
      "Séjour ouvert sur la terrasse",
      "Living area opening onto the terrace",
    ),
    photo(
      "/images/new/sejour/IMG_9138.JPG",
      "Cuisine, salon et accès terrasse",
      "Kitchen, living room and terrace access",
    ),
  ],
  chambres: [
    photo(
      "/images/new/chambres/main.PNG",
      "Chambre avec baie vitrée et vue sur les montagnes",
      "Bedroom with picture window and mountain views",
    ),
    photo(
      "/images/new/chambres/Chambre-enfant-Nid_2-1024x768.jpeg",
      "Chambre avec deux lits simples",
      "Bedroom with two single beds",
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
