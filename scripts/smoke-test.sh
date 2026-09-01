#!/usr/bin/env bash
# ============================================================
# Smoke test for the portfolio — run after deploying to verify
# auth, protection and the private APIs from the command line.
#
# Usage:
#   BASE_URL=https://yourdomain.com PASSWORD='your-private-password' ./scripts/smoke-test.sh
#
# Safe to run repeatedly. Does NOT test rate limiting (to avoid
# locking yourself out) — hammer /api/auth/login 9 times
# deliberately if you want to verify it.
# ============================================================
set -u
B=${BASE_URL:-http://localhost:3000}
P=${PASSWORD:-}
J=$(mktemp); trap 'rm -f $J' EXIT
ok=0; fail=0
t() { if [ "$2" = "$3" ]; then ok=$((ok+1)); printf '  ✓ %s\n' "$1"; else fail=$((fail+1)); printf '  ✗ %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }

echo "== $B =="
echo "-- public --"
t "home loads"                200 $(curl -s -o /dev/null -w '%{http_code}' $B/)
t "robots blocks /private"    1 $(curl -s $B/robots.txt | grep -c 'Disallow: /private')
echo "-- protection --"
t "/private blocked"          307 $(curl -s -o /dev/null -w '%{http_code}' $B/private)
t "/private/journal blocked"  307 $(curl -s -o /dev/null -w '%{http_code}' $B/private/journal)
t "journal API 401"           401 $(curl -s -o /dev/null -w '%{http_code}' $B/api/private/journal)
t "photos API 401"            401 $(curl -s -o /dev/null -w '%{http_code}' $B/api/private/photos)
echo "-- auth --"
if [ -n "$P" ]; then
  t "wrong password rejected" 401 $(curl -s -o /dev/null -w '%{http_code}' -X POST $B/api/auth/login -H 'Content-Type: application/json' -d '{"password":"definitely-not-it"}')
  t "correct password 200"    200 $(curl -s -c $J -o /dev/null -w '%{http_code}' -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "{\"password\":\"$P\"}")
  t "session cookie httpOnly" 1 $(grep -c '#HttpOnly_' $J)
  echo "-- authenticated --"
  t "/private 200"            200 $(curl -s -b $J -o /dev/null -w '%{http_code}' $B/private)
  t "journal create 201"      201 $(curl -s -b $J -o /tmp/smoke-j.json -w '%{http_code}' -X POST $B/api/private/journal -H 'Content-Type: application/json' -d '{"title":"smoke test","body":"safe to delete","tags":["smoke"]}')
  ID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/smoke-j.json','utf8')).id)" 2>/dev/null || echo "")
  t "journal cleanup"         200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X DELETE $B/api/private/journal/$ID)
  t "logout 200"              200 $(curl -s -b $J -c $J -o /dev/null -w '%{http_code}' -X POST $B/api/auth/logout)
  t "blocked after logout"    307 $(curl -s -b $J -o /dev/null -w '%{http_code}' $B/private)
else
  echo "  · skipping login tests (set PASSWORD env var)"
fi
echo; echo "RESULT: $ok passed, $fail failed"; [ $fail -eq 0 ]
