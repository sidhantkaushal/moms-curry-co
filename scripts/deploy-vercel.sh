#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

VCMD="npx vercel"
if command -v vercel >/dev/null; then VCMD="vercel"; fi

if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  export VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
  export VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"
  $VCMD deploy --prod --token "$VERCEL_TOKEN" --yes
else
  if ! $VCMD whoami >/dev/null 2>&1; then
    echo "Run: npx vercel login   OR   export VERCEL_TOKEN=..."
    exit 1
  fi
  $VCMD deploy --prod --yes
fi

echo ""
echo "Set NEXT_PUBLIC_SITE_URL to your production URL, then redeploy."
echo "Update Supabase Auth redirect URLs (see docs/DEPLOY_VERCEL.md)."
