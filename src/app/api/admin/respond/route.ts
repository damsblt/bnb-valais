import {
  isAcceptedStorageConfigured,
  recordReservationOutcome,
} from "@/lib/accepted-stays-store";
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
    reservation,
    action,
  );

  let stateSaved = false;
  let stateError: string | undefined;
  let calendarWarning: string | undefined;

  try {
    await recordReservationOutcome({
      responseId,
      action,
      stay:
        action === "accept" && reservation.stayDates
          ? {
              checkIn: reservation.stayDates.checkIn,
              checkOut: reservation.stayDates.checkOut,
              guestLabel:
                reservation.guestName ?? reservation.guestEmail ?? undefined,
            }
          : undefined,
    });
    stateSaved = true;
    if (action === "accept" && !reservation.stayDates) {
      calendarWarning =
        "Décision enregistrée, mais pas de dates calendrier — le calendrier public n’a pas été mis à jour.";
    }
  } catch (err) {
    stateError =
      err instanceof Error ? err.message : "Impossible d’enregistrer la décision.";
  }

  return Response.json({
    action,
    responseId,
    mailto,
    emailSent: emailResult.sent,
    emailError: emailResult.error,
    stateSaved,
    stateError,
    calendarWarning,
    calendarUpdated: stateSaved && action === "accept" && Boolean(reservation.stayDates),
    calendarError: calendarWarning ?? stateError,
    calendarStorageConfigured: isAcceptedStorageConfigured(),
  });
}
