import { TYPEFORM_DEFAULT_API_FORM_ID } from "@/lib/typeform";
import { getRequiredTypeformHiddenFields } from "@/lib/typeform-refs";

function resolveSyncFormId(): string {
  const fromEnv =
    process.env.TYPEFORM_API_FORM_ID?.trim() ||
    process.env.TYPEFORM_FORM_ID?.trim();
  if (fromEnv && !fromEnv.startsWith("01")) {
    return fromEnv;
  }
  return TYPEFORM_DEFAULT_API_FORM_ID;
}

type FormField = {
  type: string;
  title?: string;
  ref?: string;
  properties?: { fields?: FormField[] };
  [key: string]: unknown;
};

type TypeformForm = {
  hidden?: string[];
  fields?: FormField[];
  logic?: unknown[];
  [key: string]: unknown;
};

export type TypeformFormSyncResult = {
  ok: boolean;
  detail: string;
  dateQuestionsBefore: number;
  dateQuestionsAfter: number;
  hiddenConfigured: boolean;
};

const READ_ONLY_FORM_KEYS = new Set([
  "id",
  "_links",
  "created_at",
  "last_updated_at",
  "published_at",
  "display_url",
  "public_url",
  "link_display",
  "version",
]);

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

function collectDateFieldRefs(fields: FormField[] | undefined): Set<string> {
  const refs = new Set<string>();
  if (!fields) return refs;
  for (const field of fields) {
    if (field.type === "date" && field.ref) refs.add(field.ref);
    if (field.type === "group" && field.properties?.fields) {
      for (const r of collectDateFieldRefs(field.properties.fields)) refs.add(r);
    }
  }
  return refs;
}

function stripLogicForRemovedDates(
  logic: unknown[] | undefined,
  removedRefs: Set<string>,
): unknown[] | undefined {
  if (!logic?.length || removedRefs.size === 0) return logic;
  return logic.filter((entry) => {
    const text = JSON.stringify(entry);
    for (const ref of removedRefs) {
      if (text.includes(ref)) return false;
    }
    return true;
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

function buildPutBody(form: TypeformForm): TypeformForm {
  const body: TypeformForm = {};
  for (const [key, value] of Object.entries(form)) {
    if (!READ_ONLY_FORM_KEYS.has(key) && value !== undefined) {
      body[key] = value;
    }
  }

  const removedRefs = collectDateFieldRefs(form.fields);
  body.hidden = [
    ...new Set([
      ...(Array.isArray(form.hidden) ? form.hidden : []),
      ...getRequiredTypeformHiddenFields(),
    ]),
  ];
  body.fields = removeDateQuestions(form.fields ?? []);
  body.logic = stripLogicForRemovedDates(form.logic, removedRefs);

  return body;
}

export async function getTypeformFormDateStatus(): Promise<{
  dateQuestions: number;
  hiddenConfigured: boolean;
  requiredHidden: string[];
  missingHidden: string[];
}> {
  const formId = resolveSyncFormId();
  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    throw new Error(`lecture formulaire HTTP ${getRes.status}`);
  }
  const form = (await getRes.json()) as TypeformForm;
  const hidden = form.hidden ?? [];
  const required = getRequiredTypeformHiddenFields();
  return {
    dateQuestions: countDateQuestions(form.fields),
    hiddenConfigured: required.every((key) => hidden.includes(key)),
    requiredHidden: required,
    missingHidden: required.filter((key) => !hidden.includes(key)),
  };
}

/** PUT complet : seule façon fiable de modifier fields + hidden (PATCH = JSON Patch limité). */
export async function ensureTypeformPrefillOnForm(): Promise<TypeformFormSyncResult> {
  const formId = resolveSyncFormId();
  const hiddenParams = getRequiredTypeformHiddenFields();

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
      detail: "formulaire déjà adapté (hidden complets + sans questions date)",
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      hiddenConfigured: true,
    };
  }

  const putBody = buildPutBody(form);
  const putRes = await typeformFetch(`/forms/${formId}`, {
    method: "PUT",
    body: JSON.stringify(putBody),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    if (putRes.status === 403) {
      return {
        ok: false,
        detail:
          "token sans forms:write — ajoutez « Write forms » au token Typeform sur Vercel",
        dateQuestionsBefore: before,
        dateQuestionsAfter: before,
        hiddenConfigured: hiddenOk,
      };
    }
    return {
      ok: false,
      detail: errText || `PUT HTTP ${putRes.status}`,
      dateQuestionsBefore: before,
      dateQuestionsAfter: before,
      hiddenConfigured: hiddenOk,
    };
  }

  const verify = await typeformFetch(`/forms/${formId}`);
  const updated = verify.ok ? ((await verify.json()) as TypeformForm) : form;
  const after = countDateQuestions(updated.fields);

  return {
    ok: after === 0,
    detail:
      after === 0
        ? `hidden fields : ${hiddenParams.join(", ")}`
        : `PUT réussi mais ${after} question(s) date restante(s)`,
    dateQuestionsBefore: before,
    dateQuestionsAfter: after,
    hiddenConfigured: true,
  };
}
