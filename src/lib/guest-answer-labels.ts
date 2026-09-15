import type { ReservationAnswer } from "@/lib/typeform";

const GENERIC_LABEL =
  /^(champ|field|question|réponse|reponse|your answer|votre réponse)$/i;

export function normalizeGuestAnswerLabels(
  answers: ReservationAnswer[],
): ReservationAnswer[] {
  let nameSlot = 0;
  return answers.map((a) => {
    const label = a.label.trim();
    if (!GENERIC_LABEL.test(label)) {
      if (/^nom$/i.test(label)) {
        return { ...a, label: "Nom de famille" };
      }
      return a;
    }
    if (
      /mail|email|tél|telephone|phone|date|montant|personnes|promo|réduction|reduction/i.test(
        `${a.label} ${a.value}`,
      )
    ) {
      return a;
    }
    if (a.value.includes("@")) {
      return { ...a, label: "Adresse email" };
    }
    if (nameSlot === 0) {
      nameSlot += 1;
      return { ...a, label: "Prénom" };
    }
    if (nameSlot === 1) {
      nameSlot += 1;
      return { ...a, label: "Nom de famille" };
    }
    return a;
  });
}

function detailRow(label: string, value: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  return `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#3f3f46;"><strong style="color:#18181b;">${escape(label)}</strong><br />${escape(value)}</p>`;
}

export function buildGuestIdentityHtml(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const rows: string[] = [];
  if (firstName?.trim()) rows.push(detailRow("Prénom", firstName.trim()));
  if (lastName?.trim()) rows.push(detailRow("Nom de famille", lastName.trim()));
  return rows.join("");
}

const SKIP_FOR_NAME_GUESS =
  /mail|email|e-mail|tél|telephone|phone|date|montant|personnes|promo|réduction|reduction|code/i;

export function partitionAnswersForEmail(answers: ReservationAnswer[]): {
  guestIdentityHtml: string;
  detailAnswers: ReservationAnswer[];
} {
  const consumed = new Set<number>();
  let first: ReservationAnswer | undefined;
  let last: ReservationAnswer | undefined;

  answers.forEach((a, i) => {
    const label = a.label.trim();
    if (/^prénom$/i.test(label) || /^prenom$/i.test(label)) {
      first = a;
      consumed.add(i);
    } else if (/^nom( de famille)?$/i.test(label)) {
      last = a;
      consumed.add(i);
    }
  });

  if (!first || !last) {
    const candidates = answers
      .map((a, i) => ({ a, i }))
      .filter(
        ({ a, i }) =>
          !consumed.has(i) &&
          a.value.trim() &&
          !SKIP_FOR_NAME_GUESS.test(a.label) &&
          !a.value.includes("@"),
      );
    if (!first && candidates[0]) {
      first = candidates[0].a;
      consumed.add(candidates[0].i);
    }
    if (!last && candidates[1]) {
      last = candidates[1].a;
      consumed.add(candidates[1].i);
    }
  }

  const guestIdentityHtml = buildGuestIdentityHtml(first?.value, last?.value);
  const detailAnswers = answers.filter((_, i) => !consumed.has(i));

  return { guestIdentityHtml, detailAnswers };
}
