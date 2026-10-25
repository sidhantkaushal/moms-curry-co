#!/usr/bin/env bash
# Sync .env.local → Vercel production (run after vercel link). Never commit .env.local.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v vercel >/dev/null && ! command -v npx >/dev/null; then
  echo "Install Vercel CLI: npm i -g vercel"
  exit 1
fi

VCMD="npx vercel"
if command -v vercel >/dev/null; then VCMD="vercel"; fi

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local"
  exit 1
fi

# Keys required for production (see .env.example)
KEYS=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  SUPABASE_SERVICE_ROLE_KEY
  ORDER_TOKEN_PEPPER
)

for key in "${KEYS[@]}"; do
  val=$(grep -E "^${key}=" .env.local | head -1 | cut -d= -f2- || true)
  if [[ -z "$val" ]]; then
    echo "Skip (empty): $key"
    continue
  fi
  echo "$val" | $VCMD env add "$key" production --force
  echo "Set production: $key"
done

# SITE_URL: set after first deploy when you know the URL
echo "After deploy, run:"
echo "  vercel env add NEXT_PUBLIC_SITE_URL production"
echo "  (use your https://....vercel.app URL)"
