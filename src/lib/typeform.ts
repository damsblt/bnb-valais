import { normalizeGuestAnswerLabels } from "@/lib/guest-answer-labels";
import { parseGuestCount } from "@/lib/night-pricing";
import {
  getTypeformGuestCountFieldKey,
  getTypeformStayTotalFieldKey,
  TYPEFORM_PARAM_ARRIVAL,
  TYPEFORM_PARAM_DEPARTURE,
} from "@/lib/typeform-refs";

/** ID « Live embed » (data-tf-live) — affichage sur /reservations */
export const TYPEFORM_LIVE_EMBED_ID = "01JN38VBCPQKPJFGQK77ZR4JDG";

/** ID API du formulaire « Formulaire de réservation » (admin.typeform.com/form/…) */
export const TYPEFORM_DEFAULT_API_FORM_ID = "ZD3ppqKS";

type TypeformField = {
  id: string;
  ref: string;
  title: string;
  type: string;
  properties?: { fields?: TypeformField[] };
};

type TypeformAnswer = {
  field: { id: string; type: string; ref?: string };
  type: string;
  text?: string;
  email?: string;
  phone_number?: string;
  date?: string;
  boolean?: boolean;
  number?: number;
  choice?: { label: string };
  choices?: { labels: string[] };
};

export type ReservationAnswer = {
  label: string;
  value: string;
};

export type StayDates = {
  checkIn: string;
  checkOut: string;
};

export type ReservationRequest = {
  id: string;
  submittedAt: string;
  answers: ReservationAnswer[];
  stayDates: StayDates | null;
  hidden?: Record<string, string>;
  guestEmail: string | null;
  guestName: string | null;
  summaryLine: string;
};

export type TypeformFormSummary = {
  id: string;
  title: string;
};

export class TypeformConfigError extends Error {
  forms: TypeformFormSummary[];

  constructor(message: string, forms: TypeformFormSummary[]) {
    super(message);
    this.name = "TypeformConfigError";
    this.forms = forms;
  }
}

function isLiveEmbedId(id: string): boolean {
  return /^01[A-Z0-9]{24}$/i.test(id);
}

function flattenFields(fields: TypeformField[]): TypeformField[] {
  const out: TypeformField[] = [];
  for (const field of fields) {
    const nested =
      (field.type === "group" || field.type === "contact_info") &&
      field.properties?.fields?.length;
    if (nested) {
      out.push(...flattenFields(field.properties!.fields!));
    } else {
      out.push(field);
    }
  }
  return out;
}

type FieldRegistry = {
  flat: TypeformField[];
  byKey: Map<string, TypeformField>;
};

function buildFieldRegistry(fields: TypeformField[]): FieldRegistry {
  const flat = flattenFields(fields);
  const byKey = new Map<string, TypeformField>();
  for (const field of flat) {
    byKey.set(field.id, field);
    if (field.ref) byKey.set(field.ref, field);
  }
  return { flat, byKey };
}

function findAnswerForField(
  field: TypeformField,
  answers: TypeformAnswer[],
): TypeformAnswer | undefined {
  return answers.find(
    (a) =>
      a.field.id === field.id ||
      (a.field.ref && a.field.ref === field.ref) ||
      a.field.id === field.ref,
  );
}

function isGenericLabel(title: string | undefined): boolean {
  const t = title?.trim() ?? "";
  return (
    !t ||
    /^champ$/i.test(t) ||
    /^field$/i.test(t) ||
    /^question$/i.test(t) ||
    /^réponse$/i.test(t) ||
    /^reponse$/i.test(t)
  );
}

function labelFromContactHint(hint: string): string | null {
  if (/first_name|first name|prénom|prenom|\bfirst\b/i.test(hint)) {
    return "Prénom";
  }
  if (
    /last_name|last name|nom de famille|nom.?famille|family.?name|\blast\b/i.test(
      hint,
    )
  ) {
    return "Nom de famille";
  }
  return null;
}

function defaultLabelForTextField(
  field: TypeformField,
  textFieldIndex: number,
): string {
  const hint = `${field.title ?? ""} ${field.ref ?? ""}`;
  const fromContact = labelFromContactHint(hint);
  if (fromContact) return fromContact;
  if (/prénom|prenom|first/i.test(hint)) return "Prénom";
  if (/(^|\s)nom(\s|$)|last.?name|family/i.test(hint)) return "Nom de famille";
  if (textFieldIndex === 0) return "Prénom";
  if (textFieldIndex === 1) return "Nom de famille";
  return field.title?.trim() || "Champ";
}

function isTextLikeAnswer(field: TypeformField, answer: TypeformAnswer): boolean {
  const answerType = answer.type || field.type;
  const subType = answer.field.type ?? "";
  if (labelFromContactHint(`${field.ref ?? ""} ${answer.field.ref ?? ""} ${subType}`)) {
    return true;
  }
  return (
    answerType === "text" ||
    answerType === "short_text" ||
    field.type === "short_text" ||
    field.type === "long_text" ||
    subType === "first_name" ||
    subType === "last_name"
  );
}

function shouldAdvanceTextFieldIndex(
  field: TypeformField,
  answer: TypeformAnswer,
): boolean {
  return isTextLikeAnswer(field, answer);
}

function resolveAnswerLabel(
  field: TypeformField,
  answer: TypeformAnswer,
  textFieldIndex: number,
): string {
  const contactHint = `${field.ref ?? ""} ${answer.field.ref ?? ""} ${answer.field.type ?? ""} ${field.title ?? ""}`;
  const fromContact = labelFromContactHint(contactHint);
  if (fromContact) return fromContact;

  const title = field.title?.trim();
  if (title && !isGenericLabel(title)) {
    if (/^nom$/i.test(title)) return "Nom de famille";
    return title;
  }

  const answerType = answer.type || field.type;
  if (answerType === "email") return "Adresse email";
  if (answerType === "phone_number" || field.type === "phone_number") {
    return "Téléphone";
  }
  if (
    answerType === "text" ||
    answerType === "short_text" ||
    field.type === "short_text" ||
    field.type === "long_text"
  ) {
    return defaultLabelForTextField(field, textFieldIndex);
  }

  return title || "Champ";
}

function mapFormAnswers(
  answers: TypeformAnswer[],
  registry: FieldRegistry,
): ReservationAnswer[] {
  const used = new Set<TypeformAnswer>();
  const result: ReservationAnswer[] = [];
  let textFieldIndex = 0;

  for (const field of registry.flat) {
    if (field.type === "date") continue;

    const answer = findAnswerForField(field, answers);
    if (!answer || used.has(answer)) continue;

    const value = answerToString(answer);
    if (!value) continue;

    used.add(answer);
    const label = resolveAnswerLabel(field, answer, textFieldIndex);
    if (shouldAdvanceTextFieldIndex(field, answer)) {
      textFieldIndex += 1;
    }

    result.push({ label, value });
  }

  for (const answer of answers) {
    if (used.has(answer)) continue;
    const value = answerToString(answer);
    if (!value) continue;

    const meta =
      registry.byKey.get(answer.field.id) ??
      (answer.field.ref ? registry.byKey.get(answer.field.ref) : undefined);

    if (meta?.type === "date" || answer.type === "date") continue;

    const label = meta
      ? resolveAnswerLabel(meta, answer, textFieldIndex)
      : answer.type === "email"
        ? "Adresse email"
        : resolveAnswerLabel(
            {
              id: answer.field.id,
              ref: answer.field.ref ?? "",
              title: "",
              type: answer.field.type || answer.type,
            },
            answer,
            textFieldIndex,
          );

    if (meta && shouldAdvanceTextFieldIndex(meta, answer)) {
      textFieldIndex += 1;
    } else if (
      !meta &&
      (answer.type === "text" || answer.type === "short_text")
    ) {
      textFieldIndex += 1;
    }

    result.push({ label, value });
  }

  return normalizeGuestAnswerLabels(result);
}

function answerToString(answer: TypeformAnswer): string | null {
  switch (answer.type) {
    case "email":
      return answer.email ?? null;
    case "phone_number":
      return answer.phone_number ?? null;
    case "date":
      return answer.date ?? null;
    case "text":
    case "long_text":
      return answer.text?.trim() || null;
    case "boolean":
      return answer.boolean ? "Oui" : "Non";
    case "number":
      return answer.number != null ? String(answer.number) : null;
    case "choice":
      return answer.choice?.label ?? null;
    case "choices":
      return answer.choices?.labels.join(", ") ?? null;
    default:
      if (answer.text) return answer.text;
      return null;
  }
}

function pickGuestName(answers: ReservationAnswer[]): string | null {
  const nameField = answers.find((a) =>
    /nom|name|prénom|prenom/i.test(a.label),
  );
  if (nameField?.value) return nameField.value;
  const firstText = answers.find(
    (a) => a.label && !/mail|email|téléphone|phone|date/i.test(a.label),
  );
  return firstText?.value ?? null;
}

function parseStayDates(
  hidden: Record<string, string> | undefined,
): StayDates | null {
  if (!hidden) return null;
  const checkIn =
    hidden[TYPEFORM_PARAM_ARRIVAL] ?? hidden.date_arrivee ?? hidden.check_in;
  const checkOut =
    hidden[TYPEFORM_PARAM_DEPARTURE] ?? hidden.date_depart ?? hidden.check_out;
  if (checkIn && checkOut) return { checkIn, checkOut };
  return null;
}

function formatDisplayDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function hiddenToAnswers(stay: StayDates | null): ReservationAnswer[] {
  if (!stay) return [];
  return [
    { label: "Date d'arrivée", value: formatDisplayDate(stay.checkIn) },
    { label: "Date de départ", value: formatDisplayDate(stay.checkOut) },
  ];
}

function isGuestCountAnswerLabel(label: string): boolean {
  return /\b(nombre de personnes|personnes|guests?|number of guests)\b/i.test(
    label,
  );
}

function filterDuplicateGuestFormAnswers(
  formAnswers: ReservationAnswer[],
  hidden: Record<string, string> | undefined,
): ReservationAnswer[] {
  const hasHiddenGuest = Boolean(
    hidden?.[getTypeformGuestCountFieldKey()]?.trim() ||
      hidden?.nombre_personnes?.trim(),
  );
  if (!hasHiddenGuest) return formAnswers;
  return formAnswers.filter((a) => !isGuestCountAnswerLabel(a.label));
}

function hiddenGuestAndTotalToAnswers(
  hidden: Record<string, string> | undefined,
): ReservationAnswer[] {
  if (!hidden) return [];
  const out: ReservationAnswer[] = [];
  const guestRaw =
    hidden[getTypeformGuestCountFieldKey()] ?? hidden.nombre_personnes;
  if (guestRaw?.trim()) {
    const count = parseGuestCount(guestRaw, 2);
    out.push({
      label: "Nombre de personnes",
      value: count === 1 ? "1 personne" : `${count} personnes`,
    });
  }
  const totalKey = getTypeformStayTotalFieldKey();
  const totalRaw = hidden[totalKey] ?? hidden.montant_total;
  if (totalRaw?.trim()) {
    const amount = Math.round(Number(totalRaw));
    if (Number.isFinite(amount) && amount > 0) {
      out.push({
        label: "Montant du séjour",
        value: `${amount} CHF`,
      });
    }
  }
  return out;
}

function hiddenPromoToAnswers(
  hidden: Record<string, string> | undefined,
): ReservationAnswer[] {
  if (!hidden) return [];
  const code =
    hidden.code_promo ??
    hidden.promo_code ??
    hidden[process.env.TYPEFORM_PARAM_PROMO_CODE?.trim() || "code_promo"];
  const pct =
    hidden.reduction_pct ??
    hidden[process.env.TYPEFORM_PARAM_PROMO_PERCENT?.trim() || "reduction_pct"];
  const out: ReservationAnswer[] = [];
  if (code?.trim()) {
    out.push({ label: "Code promo", value: code.trim() });
  }
  if (pct?.trim()) {
    out.push({ label: "Réduction", value: `${pct.trim()} %` });
  }
  return out;
}

function buildSummary(
  answers: ReservationAnswer[],
  stay: StayDates | null,
): string {
  if (stay) {
    return `${formatDisplayDate(stay.checkIn)} → ${formatDisplayDate(stay.checkOut)}`;
  }
  const dates = answers
    .filter((a) => /date|arriv|départ|depart|séjour|sejour/i.test(a.label))
    .map((a) => `${a.label}: ${a.value}`);
  if (dates.length) return dates.join(" · ");
  const preview = answers
    .slice(0, 3)
    .map((a) => a.value)
    .filter(Boolean)
    .join(" · ");
  return preview || "Demande sans détail";
}

async function typeformFetch(path: string): Promise<Response> {
  const token = process.env.TYPEFORM_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("TYPEFORM_ACCESS_TOKEN missing");
  }

  return fetch(`https://api.typeform.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function listAccessibleForms(): Promise<TypeformFormSummary[]> {
  const res = await typeformFetch("/forms?page_size=50");
  if (!res.ok) {
    throw new Error(`Typeform list HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    items?: { id: string; title: string }[];
  };
  return (json.items ?? []).map((f) => ({ id: f.id, title: f.title }));
}

/** ID court API : https://admin.typeform.com/form/{id} (≠ ID Live 01…) */
export async function resolveTypeformApiFormId(): Promise<string> {
  const fromEnv =
    process.env.TYPEFORM_API_FORM_ID?.trim() ||
    process.env.TYPEFORM_FORM_ID?.trim();

  const forms = await listAccessibleForms();

  if (fromEnv && !isLiveEmbedId(fromEnv)) {
    const exists = forms.some((f) => f.id === fromEnv);
    if (exists) return fromEnv;
    const check = await typeformFetch(`/forms/${fromEnv}`);
    if (check.ok) return fromEnv;
  }

  if (forms.length === 1) {
    return forms[0].id;
  }

  const reservationForm = forms.find((f) =>
    /formulaire de r[eé]servation/i.test(f.title),
  );
  if (reservationForm) {
    return reservationForm.id;
  }

  const titled = forms.filter((f) =>
    /sittelle|valais|r[eé]serv|booking|nid/i.test(f.title),
  );
  if (titled.length === 1) {
    return titled[0].id;
  }

  if (forms.some((f) => f.id === TYPEFORM_DEFAULT_API_FORM_ID)) {
    return TYPEFORM_DEFAULT_API_FORM_ID;
  }

  const hint = forms.map((f) => `« ${f.title} » → ${f.id}`).join(" · ");

  if (fromEnv && isLiveEmbedId(fromEnv)) {
    throw new TypeformConfigError(
      `L'ID ${fromEnv.slice(0, 10)}… est l'ID d'embed du site (Live), pas l'ID API. Ajoutez TYPEFORM_API_FORM_ID sur Vercel (ID dans l'URL admin.typeform.com/form/…). Formulaires visibles avec votre token : ${hint || "aucun"}.`,
      forms,
    );
  }

  throw new TypeformConfigError(
    `Formulaire Typeform introuvable. Définissez TYPEFORM_API_FORM_ID sur Vercel. Formulaires accessibles : ${hint || "aucun — vérifiez le token sur le bon compte"}.`,
    forms,
  );
}

export async function fetchReservationRequests(): Promise<ReservationRequest[]> {
  const formId = await resolveTypeformApiFormId();

  const formRes = await typeformFetch(`/forms/${formId}`);
  if (!formRes.ok) {
    throw new Error(`Typeform form HTTP ${formRes.status}`);
  }

  const formJson = (await formRes.json()) as {
    fields?: TypeformField[];
  };
  const registry = buildFieldRegistry(formJson.fields ?? []);

  const responsesRes = await typeformFetch(
    `/forms/${formId}/responses?page_size=50&sort=submitted_at,desc`,
  );
  if (!responsesRes.ok) {
    if (responsesRes.status === 403) {
      throw new Error(
        "Typeform responses HTTP 403 — votre token n'a pas la permission « responses:read » (lire les réponses). Sur Typeform : Account → Personal tokens → générez un nouveau token en cochant la lecture des réponses, puis mettez-le dans TYPEFORM_ACCESS_TOKEN sur Vercel et redéployez.",
      );
    }
    if (responsesRes.status === 401) {
      throw new Error(
        "Typeform responses HTTP 401 — token invalide ou expiré. Mettez à jour TYPEFORM_ACCESS_TOKEN sur Vercel.",
      );
    }
    throw new Error(`Typeform responses HTTP ${responsesRes.status}`);
  }

  const responsesJson = (await responsesRes.json()) as {
    items?: {
      response_id: string;
      submitted_at: string;
      hidden?: Record<string, string>;
      answers?: TypeformAnswer[];
    }[];
  };

  return (responsesJson.items ?? []).map((item) => {
    const stayDates = parseStayDates(item.hidden);
    const formAnswers = filterDuplicateGuestFormAnswers(
      mapFormAnswers(item.answers ?? [], registry),
      item.hidden,
    );

    const answers = [
      ...hiddenToAnswers(stayDates),
      ...hiddenGuestAndTotalToAnswers(item.hidden),
      ...hiddenPromoToAnswers(item.hidden),
      ...formAnswers,
    ];

    const guestEmail =
      formAnswers.find((a) => /email|e-mail|mail/i.test(a.label))?.value ??
      (item.answers ?? []).find((a) => a.type === "email")?.email ??
      null;

    const guestName = pickGuestName(formAnswers);

    return {
      id: item.response_id,
      submittedAt: item.submitted_at,
      answers,
      stayDates,
      hidden: item.hidden,
      guestEmail,
      guestName,
      summaryLine: buildSummary(answers, stayDates),
    };
  });
}

export async function fetchReservationRequest(
  responseId: string,
): Promise<ReservationRequest | null> {
  const all = await fetchReservationRequests();
  return all.find((r) => r.id === responseId) ?? null;
}
