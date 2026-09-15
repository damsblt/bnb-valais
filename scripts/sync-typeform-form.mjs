#!/usr/bin/env node
/**
 * Sync Typeform hidden fields + remove date questions.
 * Usage: TYPEFORM_ACCESS_TOKEN=tfp_… npm run typeform:sync
 */

const FORM_ID = process.env.TYPEFORM_API_FORM_ID?.trim() || "ZD3ppqKS";

const HIDDEN = [
  process.env.TYPEFORM_PARAM_CHECKIN?.trim() || "date_arrivee",
  process.env.TYPEFORM_PARAM_CHECKOUT?.trim() || "date_depart",
  process.env.TYPEFORM_PARAM_GUESTS?.trim() || "nombre_personnes",
  process.env.TYPEFORM_PARAM_STAY_TOTAL?.trim() || "montant_total",
  process.env.TYPEFORM_PARAM_PROMO_CODE?.trim() || "code_promo",
  process.env.TYPEFORM_PARAM_PROMO_PERCENT?.trim() || "reduction_pct",
];

const READ_ONLY = new Set([
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

async function api(path, init = {}) {
  const token = process.env.TYPEFORM_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("TYPEFORM_ACCESS_TOKEN missing");
  const res = await fetch(`https://api.typeform.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${init.method || "GET"} ${path} → ${res.status}: ${text}`);
  }
  return json;
}

function countDates(fields) {
  if (!fields) return 0;
  let n = 0;
  for (const f of fields) {
    if (f.type === "date") n++;
    if (f.type === "group" && f.properties?.fields) {
      n += countDates(f.properties.fields);
    }
  }
  return n;
}

function removeDates(fields) {
  return (fields || [])
    .filter((f) => f.type !== "date")
    .map((f) => {
      if (f.type === "group" && f.properties?.fields?.length) {
        return {
          ...f,
          properties: {
            ...f.properties,
            fields: removeDates(f.properties.fields),
          },
        };
      }
      return f;
    });
}

function collectDateRefs(fields, refs = new Set()) {
  for (const f of fields || []) {
    if (f.type === "date" && f.ref) refs.add(f.ref);
    if (f.type === "group") collectDateRefs(f.properties?.fields, refs);
  }
  return refs;
}

function stripLogic(logic, removedRefs) {
  if (!logic?.length || !removedRefs.size) return logic;
  return logic.filter((entry) => {
    const text = JSON.stringify(entry);
    for (const ref of removedRefs) {
      if (text.includes(ref)) return false;
    }
    return true;
  });
}

function buildPutBody(form) {
  const body = {};
  for (const [key, value] of Object.entries(form)) {
    if (!READ_ONLY.has(key) && value !== undefined) body[key] = value;
  }
  const removedRefs = collectDateRefs(form.fields);
  body.hidden = [...new Set([...(form.hidden || []), ...HIDDEN])];
  body.fields = removeDates(form.fields || []);
  body.logic = stripLogic(form.logic, removedRefs);
  return body;
}

async function main() {
  if (!process.env.TYPEFORM_ACCESS_TOKEN?.trim()) {
    console.log("Skip Typeform sync (TYPEFORM_ACCESS_TOKEN not set).");
    return;
  }

  const form = await api(`/forms/${FORM_ID}`);
  const before = countDates(form.fields);
  const hiddenBefore = form.hidden || [];
  const hiddenOk = HIDDEN.every((h) => hiddenBefore.includes(h));

  console.log("Form:", FORM_ID);
  console.log("Hidden before:", hiddenBefore.join(", ") || "(none)");
  console.log("Date questions before:", before);

  if (hiddenOk && before === 0) {
    console.log("Already up to date.");
    return;
  }

  const putBody = buildPutBody(form);
  await api(`/forms/${FORM_ID}`, {
    method: "PUT",
    body: JSON.stringify(putBody),
  });

  const updated = await api(`/forms/${FORM_ID}`);
  const after = countDates(updated.fields);
  console.log("Hidden after:", (updated.hidden || []).join(", "));
  console.log("Date questions after:", after);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
