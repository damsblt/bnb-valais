export const TYPEFORM_FORM_ID =
  process.env.TYPEFORM_FORM_ID?.trim() || "01JN38VBCPQKPJFGQK77ZR4JDG";

type TypeformField = {
  id: string;
  title: string;
  type: string;
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

function answerToString(answer: TypeformAnswer, fieldTitle: string): string | null {
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

export async function fetchReservationRequests(): Promise<ReservationRequest[]> {
  const formId = TYPEFORM_FORM_ID;
  const formRes = await typeformFetch(`/forms/${formId}`);
  if (!formRes.ok) {
    throw new Error(`Typeform form HTTP ${formRes.status}`);
  }

  const formJson = (await formRes.json()) as {
    fields?: TypeformField[];
  };
  const fieldTitles = new Map<string, string>();
  for (const field of formJson.fields ?? []) {
    fieldTitles.set(field.id, field.title);
  }

  const responsesRes = await typeformFetch(
    `/forms/${formId}/responses?page_size=50&sort=submitted_at,desc`,
  );
  if (!responsesRes.ok) {
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
        const value = answerToString(answer, label);
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
