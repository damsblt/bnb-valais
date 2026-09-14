import { TYPEFORM_DEFAULT_API_FORM_ID } from "@/lib/typeform";
import { getTypeformDateFieldKeys } from "@/lib/typeform-refs";

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

/** Déclare les refs date comme URL parameters / hidden fields sur le formulaire Typeform */
export async function ensureTypeformPrefillOnForm(): Promise<{
  ok: boolean;
  detail: string;
}> {
  const { checkIn, checkOut } = getTypeformDateFieldKeys();
  const formId = TYPEFORM_DEFAULT_API_FORM_ID;

  const getRes = await typeformFetch(`/forms/${formId}`);
  if (!getRes.ok) {
    return { ok: false, detail: `lecture formulaire HTTP ${getRes.status}` };
  }

  const form = (await getRes.json()) as { hidden?: string[]; fields?: unknown[] };
  const current = form.hidden ?? [];
  const merged = [...new Set([...current, checkIn, checkOut])];

  if (
    merged.length === current.length &&
    current.includes(checkIn) &&
    current.includes(checkOut)
  ) {
    return { ok: true, detail: "hidden fields déjà configurés" };
  }

  const patchRes = await typeformFetch(`/forms/${formId}`, {
    method: "PATCH",
    body: JSON.stringify({ hidden: merged }),
  });

  if (patchRes.ok) {
    return { ok: true, detail: "hidden fields ajoutés sur Typeform" };
  }

  const errText = await patchRes.text();
  if (patchRes.status === 403) {
    return {
      ok: false,
      detail:
        "token sans permission forms:write — le site envoie quand même les dates à l'embed",
    };
  }

  return { ok: false, detail: errText || `PATCH HTTP ${patchRes.status}` };
}
