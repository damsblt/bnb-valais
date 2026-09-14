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
  field: { id: string; type: string };
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

export type ReservationRequest = {
  id: string;
  submittedAt: string;
  answers: ReservationAnswer[];
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
    if (field.type === "group" && field.properties?.fields?.length) {
      out.push(...flattenFields(field.properties.fields));
    } else {
      out.push(field);
    }
  }
  return out;
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

function buildSummary(answers: ReservationAnswer[]): string {
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

function dateFieldRefsFromForm(fields: TypeformField[]): {
  checkIn?: string;
  checkOut?: string;
} {
  const dates = flattenFields(fields).filter((f) => f.type === "date");
  let checkIn: string | undefined;
  let checkOut: string | undefined;

  for (const field of dates) {
    const ref = field.ref || field.id;
    const title = field.title.toLowerCase();
    if (/arriv|check.?in|d[eé]but|debut/.test(title)) checkIn = ref;
    if (/d[eé]part|check.?out|fin/.test(title)) checkOut = ref;
  }

  if (!checkIn && dates[0]) checkIn = dates[0].ref || dates[0].id;
  if (!checkOut && dates[1]) checkOut = dates[1].ref || dates[1].id;

  return { checkIn, checkOut };
}

/** Clés passées à Typeform (refs de blocs ou paramètres URL) pour préremplir les dates */
export async function resolvePrefillFieldKeys(): Promise<{
  checkIn: string;
  checkOut: string;
  source: "env" | "api" | "default";
}> {
  const envCheckIn = process.env.TYPEFORM_PARAM_CHECKIN?.trim();
  const envCheckOut = process.env.TYPEFORM_PARAM_CHECKOUT?.trim();
  if (envCheckIn && envCheckOut) {
    return { checkIn: envCheckIn, checkOut: envCheckOut, source: "env" };
  }

  const token = process.env.TYPEFORM_ACCESS_TOKEN?.trim();
  if (token) {
    const formId =
      process.env.TYPEFORM_API_FORM_ID?.trim() ||
      process.env.TYPEFORM_FORM_ID?.trim() ||
      TYPEFORM_DEFAULT_API_FORM_ID;

    if (!isLiveEmbedId(formId)) {
      try {
        const res = await typeformFetch(`/forms/${formId}`);
        if (res.ok) {
          const formJson = (await res.json()) as { fields?: TypeformField[] };
          const refs = dateFieldRefsFromForm(formJson.fields ?? []);
          if (refs.checkIn && refs.checkOut) {
            return {
              checkIn: refs.checkIn,
              checkOut: refs.checkOut,
              source: "api",
            };
          }
        }
      } catch {
        // fall through to defaults
      }
    }
  }

  return {
    checkIn: envCheckIn || "date_arrivee",
    checkOut: envCheckOut || "date_depart",
    source: "default",
  };
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
async function resolveApiFormId(): Promise<string> {
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
  const formId = await resolveApiFormId();

  const formRes = await typeformFetch(`/forms/${formId}`);
  if (!formRes.ok) {
    throw new Error(`Typeform form HTTP ${formRes.status}`);
  }

  const formJson = (await formRes.json()) as {
    fields?: TypeformField[];
  };
  const fieldTitles = new Map<string, string>();
  for (const field of flattenFields(formJson.fields ?? [])) {
    fieldTitles.set(field.id, field.title);
  }

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
      answers?: TypeformAnswer[];
    }[];
  };

  return (responsesJson.items ?? []).map((item) => {
    const answers: ReservationAnswer[] = (item.answers ?? [])
      .map((answer) => {
        const label = fieldTitles.get(answer.field.id) ?? "Champ";
        const value = answerToString(answer);
        if (!value) return null;
        return { label, value };
      })
      .filter((a): a is ReservationAnswer => a !== null);

    const guestEmail =
      answers.find((a) => /email|e-mail|mail/i.test(a.label))?.value ??
      (item.answers ?? []).find((a) => a.type === "email")?.email ??
      null;

    const guestName = pickGuestName(answers);

    return {
      id: item.response_id,
      submittedAt: item.submitted_at,
      answers,
      guestEmail,
      guestName,
      summaryLine: buildSummary(answers),
    };
  });
}

export async function fetchReservationRequest(
  responseId: string,
): Promise<ReservationRequest | null> {
  const all = await fetchReservationRequests();
  return all.find((r) => r.id === responseId) ?? null;
}
