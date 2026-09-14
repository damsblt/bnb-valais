import { TYPEFORM_DEFAULT_API_FORM_ID } from "@/lib/typeform";
import {
  TYPEFORM_PARAM_ARRIVAL,
  TYPEFORM_PARAM_DEPARTURE,
} from "@/lib/typeform-refs";

type FormField = {
  type: string;
  title?: string;
  properties?: { fields?: FormField[] };
  [key: string]: unknown;
};

type TypeformForm = {
  hidden?: string[];
  fields?: FormField[];
  [key: string]: unknown;
};

export type TypeformFormSyncResult = {
  ok: boolean;
  detail: string;
  dateQuestionsBefore: number;
  dateQuestionsAfter: number;
  hiddenConfigured: boolean;
};

async function typeformFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = process.env.TYPEFORM_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("TYPEFORM_ACCESS_TOKEN missing");
  }
  return fetch(`https://api.typeform.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

function removeDateQuestions(fields: FormField[]): FormField[] {
  return fields
    .filter((field) => field.type !== "date")
    .map((field) => {
      if (field.type === "group" && field.properties?.fields?.length) {
        return {
          ...field,
          properties: {
            ...field.properties,
            fields: removeDateQuestions(field.properties.fields),
          },
        };
      }
      return field;
    });
}

export function countDateQuestions(fields: FormField[] | undefined): number {
  if (!fields) return 0;
  let count = 0;
  for (const field of fields) {
    if (field.type === "date") count += 1;
    if (field.type === "group" && field.properties?.fields) {
      count += countDateQuestions(field.properties.fields);
    }
  }
  return count;
}

function buildUpdatePayload(form: TypeformForm): Record<string, unknown> {
  const writableKeys = [
    "title",
    "type",
    "settings",
    "theme",
    "variables",
    "hidden",
    "fields",
    "logic",
    "welcome_screens",
    "thankyou_screens",
  ] as const;

  const payload: Record<string, unknown> = {};
  for (const key of writableKeys) {
    if (form[key] !== undefined) {
      payload[key] = form[key];
    }
  }

  payload.hidden = [
    ...new Set([
      ...(form.hidden ?? []),
      TYPEFORM_PARAM_ARRIVAL,
      TYPEFORM_PARAM_DEPARTURE,
    ]),
  ];
  payload.fields = removeDateQuestions(form.fields ?? []);

  return payload;
}

async function updateForm(
  formId: string,
  payload: Record<string, unknown>,
): Promise<Response> {
  const patch = await typeformFetch(`/forms/${formId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (patch.ok || patch.status !== 405) {
    return patch;
  }

  return typeformFetch(`/forms/${formId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getTypeformFormDateStatus(): Promise<{
  dateQuestions: number;
  hiddenConfigured: boolean;
}> {
  const formId = TYPEFORM_DEFAULT_API_FORM_ID;
  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    throw new Error(`lecture formulaire HTTP ${getRes.status}`);
  }
  const form = (await getRes.json()) as TypeformForm;
  const hidden = form.hidden ?? [];
  return {
    dateQuestions: countDateQuestions(form.fields),
    hiddenConfigured:
      hidden.includes(TYPEFORM_PARAM_ARRIVAL) &&
      hidden.includes(TYPEFORM_PARAM_DEPARTURE),
  };
}

/**
 * Typeform ne permet pas de préremplir les champs « date ».
 * On enregistre date_arrivee / date_depart en hidden et on retire les questions date du formulaire.
 */
export async function ensureTypeformPrefillOnForm(): Promise<TypeformFormSyncResult> {
  const formId = TYPEFORM_DEFAULT_API_FORM_ID;
  const hiddenParams = [TYPEFORM_PARAM_ARRIVAL, TYPEFORM_PARAM_DEPARTURE];

  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    return {
      ok: false,
      detail: `lecture formulaire HTTP ${getRes.status}`,
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      hiddenConfigured: false,
    };
  }

  const form = (await getRes.json()) as TypeformForm;
  const before = countDateQuestions(form.fields);
  const currentHidden = form.hidden ?? [];
  const hiddenOk = hiddenParams.every((p) => currentHidden.includes(p));

  if (hiddenOk && before === 0) {
    return {
      ok: true,
      detail: "formulaire déjà adapté (hidden + sans questions date)",
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      hiddenConfigured: true,
    };
  }

  const payload = buildUpdatePayload(form);
  const updateRes = await updateForm(formId, payload);

  if (updateRes.ok) {
    const verify = await typeformFetch(`/forms/${formId}`);
    const updated = verify.ok ? ((await verify.json()) as TypeformForm) : form;
    const after = countDateQuestions(updated.fields);

    return {
      ok: after === 0,
      detail:
        after === 0
          ? "questions date retirées du Typeform ; dates via le calendrier du site"
          : `mise à jour envoyée mais ${after} question(s) date encore présente(s) — réessayez ou supprimez-les dans Typeform`,
      dateQuestionsBefore: before,
      dateQuestionsAfter: after,
      hiddenConfigured: true,
    };
  }

  const errText = await updateRes.text();
  if (updateRes.status === 403) {
    return {
      ok: false,
      detail:
        "token sans forms:write — créez un token Typeform avec « Write forms », mettez-le sur Vercel, puis cliquez « Adapter le formulaire » dans /admin",
      dateQuestionsBefore: before,
      dateQuestionsAfter: before,
      hiddenConfigured: hiddenOk,
    };
  }

  return {
    ok: false,
    detail: errText || `mise à jour HTTP ${updateRes.status}`,
    dateQuestionsBefore: before,
    dateQuestionsAfter: before,
    hiddenConfigured: hiddenOk,
  };
}
