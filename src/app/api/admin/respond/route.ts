import { isAdminAuthenticated } from "@/lib/admin-session";
import {
  buildMailtoUrl,
  buildReplyEmail,
  sendReplyEmail,
  type ReplyAction,
} from "@/lib/reservation-reply";
import { fetchReservationRequest } from "@/lib/typeform";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    responseId?: string;
    action?: ReplyAction;
  };

  const responseId = body.responseId?.trim();
  const action = body.action;

  if (!responseId || (action !== "accept" && action !== "reject")) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  let reservation;
  try {
    reservation = await fetchReservationRequest(responseId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Typeform error";
    return Response.json({ error: message }, { status: 502 });
  }

  if (!reservation) {
    return Response.json({ error: "Response not found" }, { status: 404 });
  }

  if (!reservation.guestEmail) {
    return Response.json(
      { error: "No guest email on this response" },
      { status: 422 },
    );
  }

  const { subject, text } = buildReplyEmail(reservation, action);
  const mailto = buildMailtoUrl(reservation.guestEmail, subject, text);

  const emailResult = await sendReplyEmail(
    reservation.guestEmail,
    subject,
    text,
  );

  return Response.json({
    action,
    responseId,
    mailto,
    emailSent: emailResult.sent,
    emailError: emailResult.error,
  });
}
