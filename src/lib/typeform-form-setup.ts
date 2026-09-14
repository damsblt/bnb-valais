import { TYPEFORM_DEFAULT_API_FORM_ID } from "@/lib/typeform";
import {
  TYPEFORM_PARAM_ARRIVAL,
  TYPEFORM_PARAM_DEPARTURE,
} from "@/lib/typeform-refs";

type FormField = {
  type: string;
  properties?: { fields?: FormField[] };
  [key: string]: unknown;
};

type TypeformForm = {
  hidden?: string[];
  fields?: FormField[];
  [key: string]: unknown;
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

function formHasDateQuestions(fields: FormField[] | undefined): boolean {
  if (!fields) return false;
  for (const field of fields) {
    if (field.type === "date") return true;
    if (field.type === "group" && field.properties?.fields) {
      if (formHasDateQuestions(field.properties.fields)) return true;
    }
  }
  return false;
}

/**
 * Typeform ne permet pas de préremplir les champs « date ».
 * On enregistre date_arrivee / date_depart en hidden et on retire les questions date du formulaire.
 */
export async function ensureTypeformPrefillOnForm(): Promise<{
  ok: boolean;
  detail: string;
}> {
  const formId = TYPEFORM_DEFAULT_API_FORM_ID;
  const hiddenParams = [TYPEFORM_PARAM_ARRIVAL, TYPEFORM_PARAM_DEPARTURE];

  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    return { ok: false, detail: `lecture formulaire HTTP ${getRes.status}` };
  }

  const form = (await getRes.json()) as TypeformForm;
  const currentHidden = form.hidden ?? [];
  const hiddenOk = hiddenParams.every((p) => currentHidden.includes(p));
  const hasDates = formHasDateQuestions(form.fields);

  if (hiddenOk && !hasDates) {
    return { ok: true, detail: "formulaire déjà adapté (hidden + sans questions date)" };
  }

  const payload: TypeformForm = {
    hidden: [...new Set([...currentHidden, ...hiddenParams])],
  };

  if (hasDates && form.fields) {
    payload.fields = removeDateQuestions(form.fields);
  }

  const patchRes = await typeformFetch(`/forms/${formId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (patchRes.ok) {
    return {
      ok: true,
      detail: hasDates
        ? "questions date retirées ; dates via calendrier + hidden fields"
        : "hidden fields date_arrivee / date_depart ajoutés",
    };
  }

  const errText = await patchRes.text();
  if (patchRes.status === 403) {
    return {
      ok: false,
      detail:
        "token sans forms:write — dates affichées sur le site et envoyées en hidden si configuré manuellement dans Typeform",
    };
  }

  return { ok: false, detail: errText || `PATCH HTTP ${patchRes.status}` };
}
