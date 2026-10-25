#!/usr/bin/env bash
# One-time: create personal GitHub repo and push main + iteration branches.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! gh auth status >/dev/null 2>&1; then
  echo "Log in first: gh auth login"
  exit 1
fi

REPO_NAME="${1:-moms-curry-co}"

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already set."
else
  gh repo create "$REPO_NAME" --private --source=. --remote=origin --description "Mom's Curry Co. — personal direct-ordering app"
fi

git push -u origin main
git push -u origin \
  iteration/2-admin-catalogue \
  iteration/3-business-settings \
  iteration/4-promotions-reviews \
  iteration/5-payments \
  iteration/6-notifications-analytics \
  iteration/7-loyalty-membership \
  iteration/8-hardening

echo "Done: https://github.com/$(gh api user -q .login)/${REPO_NAME}"
