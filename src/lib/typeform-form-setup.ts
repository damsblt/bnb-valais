import {
  resolveTypeformApiFormId,
  TypeformConfigError,
} from "@/lib/typeform";
import {
  collectGuestCountFieldRefs,
  countGuestCountQuestions,
  removeGuestCountQuestions,
} from "@/lib/typeform-guest-field";
import { getRequiredTypeformHiddenFields } from "@/lib/typeform-refs";

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
  guestQuestionsBefore: number;
  guestQuestionsAfter: number;
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

function removeSitePrefilledQuestions(fields: FormField[]): FormField[] {
  return removeGuestCountQuestions(removeDateQuestions(fields));
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

function stripLogicForRemovedFields(
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

  const removedRefs = new Set([
    ...collectDateFieldRefs(form.fields),
    ...collectGuestCountFieldRefs(form.fields),
  ]);
  body.hidden = [
    ...new Set([
      ...(Array.isArray(form.hidden) ? form.hidden : []),
      ...getRequiredTypeformHiddenFields(),
    ]),
  ];
  body.fields = removeSitePrefilledQuestions(form.fields ?? []);
  body.logic = stripLogicForRemovedFields(form.logic, removedRefs);

  return body;
}

export async function getTypeformFormDateStatus(): Promise<{
  dateQuestions: number;
  guestQuestions: number;
  hiddenConfigured: boolean;
  requiredHidden: string[];
  missingHidden: string[];
}> {
  const formId = await resolveTypeformApiFormId();
  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    throw new Error(`lecture formulaire HTTP ${getRes.status}`);
  }
  const form = (await getRes.json()) as TypeformForm;
  const hidden = form.hidden ?? [];
  const required = getRequiredTypeformHiddenFields();
  return {
    dateQuestions: countDateQuestions(form.fields),
    guestQuestions: countGuestCountQuestions(form.fields),
    hiddenConfigured: required.every((key) => hidden.includes(key)),
    requiredHidden: required,
    missingHidden: required.filter((key) => !hidden.includes(key)),
  };
}

/** PUT complet : seule façon fiable de modifier fields + hidden (PATCH = JSON Patch limité). */
export async function ensureTypeformPrefillOnForm(): Promise<TypeformFormSyncResult> {
  const hiddenParams = getRequiredTypeformHiddenFields();

  let formId: string;
  try {
    formId = await resolveTypeformApiFormId();
  } catch (err) {
    const detail =
      err instanceof TypeformConfigError || err instanceof Error
        ? err.message
        : "Formulaire Typeform introuvable";
    return {
      ok: false,
      detail,
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      guestQuestionsBefore: 0,
      guestQuestionsAfter: 0,
      hiddenConfigured: false,
    };
  }

  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    return {
      ok: false,
      detail: `lecture formulaire HTTP ${getRes.status}`,
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      guestQuestionsBefore: 0,
      guestQuestionsAfter: 0,
      hiddenConfigured: false,
    };
  }

  const form = (await getRes.json()) as TypeformForm;
  const dateBefore = countDateQuestions(form.fields);
  const guestBefore = countGuestCountQuestions(form.fields);
  const currentHidden = form.hidden ?? [];
  const hiddenOk = hiddenParams.every((p) => currentHidden.includes(p));

  if (hiddenOk && dateBefore === 0 && guestBefore === 0) {
    return {
      ok: true,
      detail: "formulaire déjà adapté (hidden OK, sans dates ni personnes)",
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      guestQuestionsBefore: 0,
      guestQuestionsAfter: 0,
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
        dateQuestionsBefore: dateBefore,
        dateQuestionsAfter: dateBefore,
        guestQuestionsBefore: guestBefore,
        guestQuestionsAfter: guestBefore,
        hiddenConfigured: hiddenOk,
      };
    }
    return {
      ok: false,
      detail: errText || `PUT HTTP ${putRes.status}`,
      dateQuestionsBefore: dateBefore,
      dateQuestionsAfter: dateBefore,
      guestQuestionsBefore: guestBefore,
      guestQuestionsAfter: guestBefore,
      hiddenConfigured: hiddenOk,
    };
  }

  const verify = await typeformFetch(`/forms/${formId}`);
  const updated = verify.ok ? ((await verify.json()) as TypeformForm) : form;
  const dateAfter = countDateQuestions(updated.fields);
  const guestAfter = countGuestCountQuestions(updated.fields);

  const ok = dateAfter === 0 && guestAfter === 0;
  return {
    ok,
    detail: ok
      ? `hidden : ${hiddenParams.join(", ")}`
      : `PUT OK — reste ${dateAfter} date(s), ${guestAfter} question(s) personnes`,
    dateQuestionsBefore: dateBefore,
    dateQuestionsAfter: dateAfter,
    guestQuestionsBefore: guestBefore,
    guestQuestionsAfter: guestAfter,
    hiddenConfigured: true,
  };
}
