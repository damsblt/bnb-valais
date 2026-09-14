import { isAcceptedStorageConfigured } from "@/lib/accepted-stays-store";
import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/admin-session";

export async function GET() {
  return Response.json({
    authenticated: await isAdminAuthenticated(),
    passwordConfigured: isAdminPasswordConfigured(),
    typeformConfigured: Boolean(process.env.TYPEFORM_ACCESS_TOKEN?.trim()),
    emailConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    calendarStorageConfigured: isAcceptedStorageConfigured(),
  });
}
