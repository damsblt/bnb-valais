#!/usr/bin/env bash
# Checklist Vercel (après `vercel login` + `vercel link` dans web/)
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Vercel — variables recommandées (Production) ==="
echo ""
echo "Obligatoires déjà utilisées par le site :"
echo "  ADMIN_PASSWORD, TYPEFORM_ACCESS_TOKEN, TYPEFORM_API_FORM_ID"
echo "  BOOKING_ICAL_URL, AIRBNB_ICAL_URL"
echo "  RESEND_API_KEY"
echo "  BLOB_READ_WRITE_TOKEN (store bnb-valais-blob)"
echo ""
echo "Recommandées (bonnes pratiques) :"
echo "  NEXT_PUBLIC_SITE_URL=https://www.bnb-valais.ch"
echo "  RESERVATION_FROM_EMAIL=Le Nid de la Sittelle <reservations@bnb-valais.ch>"
echo "  NEWSLETTER_FROM_EMAIL=Le Nid de la Sittelle <newsletter@bnb-valais.ch>"
echo "  HOST_CONTACT_EMAIL=info@bnb-valais.ch"
echo "  RESEND_NEWSLETTER_SEGMENT_ID=<from npm run setup:resend>"
echo "  RESEND_NEWSLETTER_TOPIC_ID=<from npm run setup:resend>"
echo ""
echo "Ajout via CLI (exemple) :"
echo '  vercel env add NEXT_PUBLIC_SITE_URL production'
echo ""
echo "Puis : vercel --prod  ou redeploy depuis le dashboard"
echo ""
if command -v vercel >/dev/null 2>&1; then
  if vercel whoami >/dev/null 2>&1; then
    echo "Connecté à Vercel : $(vercel whoami 2>/dev/null)"
    echo "Projet lié :"
    vercel env ls 2>/dev/null | head -25 || true
  else
    echo "→ Exécutez : vercel login"
  fi
else
  echo "→ Installez Vercel CLI : npm i -g vercel"
fi
