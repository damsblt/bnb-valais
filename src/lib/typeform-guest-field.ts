/** Détecte la question « nombre de personnes » redondante avec le site. */

type FormFieldLike = {
  type?: string;
  title?: string;
  ref?: string;
  properties?: { fields?: FormFieldLike[] };
};

const GUEST_TITLE =
  /\b(personnes?|invités?|voyageurs?|occupants?|guests?)\b/i;
const GUEST_QUANTITY =
  /\b(combien|nombre|how many|number of)\b/i;

/** Évite de retirer nom, e-mail, message, etc. */
const NOT_GUEST =
  /\b(nom|prénom|prenom|e-?mail|mail|téléphone|telephone|phone|message|code promo|promo|adresse)\b/i;

export function isGuestCountQuestion(field: FormFieldLike): boolean {
  const title = field.title?.trim() ?? "";
  if (!title || NOT_GUEST.test(title)) return false;

  if (GUEST_TITLE.test(title)) return true;
  if (
    GUEST_QUANTITY.test(title) &&
    (field.type === "number" ||
      field.type === "opinion_scale" ||
      field.type === "multiple_choice" ||
      GUEST_TITLE.test(title))
  ) {
    return true;
  }

  return false;
}

export function countGuestCountQuestions(
  fields: FormFieldLike[] | undefined,
): number {
  if (!fields) return 0;
  let count = 0;
  for (const field of fields) {
    if (isGuestCountQuestion(field)) count += 1;
    if (field.type === "group" && field.properties?.fields) {
      count += countGuestCountQuestions(field.properties.fields);
    }
  }
  return count;
}

export function collectGuestCountFieldRefs(
  fields: FormFieldLike[] | undefined,
): Set<string> {
  const refs = new Set<string>();
  if (!fields) return refs;
  for (const field of fields) {
    if (isGuestCountQuestion(field) && field.ref) refs.add(field.ref);
    if (field.type === "group" && field.properties?.fields) {
      for (const r of collectGuestCountFieldRefs(field.properties.fields)) {
        refs.add(r);
      }
    }
  }
  return refs;
}

export function removeGuestCountQuestions<T extends FormFieldLike>(
  fields: T[],
): T[] {
  return fields
    .filter((field) => !isGuestCountQuestion(field))
    .map((field) => {
      if (field.type === "group" && field.properties?.fields?.length) {
        return {
          ...field,
          properties: {
            ...field.properties,
            fields: removeGuestCountQuestions(field.properties.fields),
          },
        };
      }
      return field;
    });
}
