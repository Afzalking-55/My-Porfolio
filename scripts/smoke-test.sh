#!/usr/bin/env bash
# ============================================================
# Smoke test for the portfolio — run after deploying to verify
# auth, protection and the private APIs from the command line.
#
# Usage:
#   BASE_URL=https://yourdomain.com PASSWORD='your-private-password' ./scripts/smoke-test.sh
#
# Safe to run repeatedly: everything it creates it also deletes.
# Does NOT test rate limiting (to avoid locking yourself out) —
# hammer /api/auth/login 9 times deliberately if you want to verify it.
# ============================================================
set -u
B=${BASE_URL:-http://localhost:3000}
P=${PASSWORD:-}
J=$(mktemp); T=$(mktemp -d); trap 'rm -f $J; rm -rf $T' EXIT
ok=0; fail=0
t() { if [ "$2" = "$3" ]; then ok=$((ok+1)); printf '  ✓ %s\n' "$1"; else fail=$((fail+1)); printf '  ✗ %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi; }
get() { curl -s -b $J -o /dev/null -w '%{http_code}' "$1"; }

echo "== $B =="
echo "-- public --"
t "home loads"                200 $(curl -s -o /dev/null -w '%{http_code}' $B/)
t "login page loads"          200 $(curl -s -o /dev/null -w '%{http_code}' $B/login)
t "sitemap is 1 URL"          1 $(curl -s $B/sitemap.xml | grep -c '<loc>')
t "robots blocks /private"    1 $([ "$(curl -s $B/robots.txt | grep -c 'Disallow: /private')" -ge 1 ] && echo 1 || echo 0)
echo "-- protection (logged out) --"
for u in /private /private/places /private/people /private/photos /private/journal; do
  t "$u blocked"              307 $(curl -s -o /dev/null -w '%{http_code}' $B$u)
done
for a in journal content photos places people; do
  t "API /api/private/$a 401" 401 $(curl -s -o /dev/null -w '%{http_code}' $B/api/private/$a)
done
t "API write blocked"         401 $(curl -s -o /dev/null -w '%{http_code}' -X POST $B/api/private/places -H 'Content-Type: application/json' -d '{"name":"nope"}')
echo "-- auth --"
if [ -n "$P" ]; then
  t "wrong password rejected" 401 $(curl -s -o /dev/null -w '%{http_code}' -X POST $B/api/auth/login -H 'Content-Type: application/json' -d '{"password":"definitely-not-it"}')
  t "correct password 200"    200 $(curl -s -c $J -o /dev/null -w '%{http_code}' -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "{\"password\":\"$P\"}")
  t "session cookie httpOnly" 1 $(grep -c '#HttpOnly_' $J)
  echo "-- authenticated pages --"
  for u in /private /private/places /private/people /private/photos /private/journal; do
    t "$u 200"                200 $(get $B$u)
  done
  echo "-- authenticated CRUD (each test cleans up after itself) --"
  t "content readable"        200 $(get $B/api/private/content)
  # journal
  curl -s -b $J -o $T/j.json -w '%{http_code}' -X POST $B/api/private/journal -H 'Content-Type: application/json' -d '{"title":"smoke test","body":"safe to delete","tags":["smoke"]}' > $T/j.code
  t "journal create 201"      201 $(cat $T/j.code)
  JID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$T/j.json','utf8')).id)" 2>/dev/null || echo "")
  t "journal cleanup"         200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X DELETE $B/api/private/journal/$JID)
  # places
  curl -s -b $J -o $T/p.json -w '%{http_code}' -X POST $B/api/private/places -H 'Content-Type: application/json' -d '{"name":"SMOKE-TEST PLACE"}' > $T/p.code
  t "place create 201"        201 $(cat $T/p.code)
  PID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$T/p.json','utf8')).id)" 2>/dev/null || echo "")
  t "place rename 200"        200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X PATCH $B/api/private/places/$PID -H 'Content-Type: application/json' -d '{"name":"SMOKE-TEST RENAMED"}')
  # photo with a real PNG signature (1x1 px)
  echo 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' | base64 -d > $T/px.png
  printf 'not an image' > $T/fake.png
  curl -s -b $J -o $T/ph.json -w '%{http_code}' -X POST $B/api/private/photos -F "photos=@$T/px.png;type=image/png" -F "place=$PID" -F "caption=smoke" > $T/ph.code
  t "photo upload 201"        201 $(cat $T/ph.code)
  PHID=$(node -e "const a=JSON.parse(require('fs').readFileSync('$T/ph.json','utf8'));console.log((Array.isArray(a)?a[0]:a).id)" 2>/dev/null || echo "")
  t "fake-image upload rejected" 400 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X POST $B/api/private/photos -F "photos=@$T/fake.png;type=image/png")
  t "photo streams 200"       200 $(get $B/api/private/photos/$PHID)
  t "photo location save 200" 200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X PATCH $B/api/private/photos/$PHID -H 'Content-Type: application/json' -d '{"location":"smoke"}')
  t "place delete 200"        200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X DELETE $B/api/private/places/$PID)
  t "photo cleanup 200"       200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X DELETE $B/api/private/photos/$PHID)
  # people
  curl -s -b $J -o $T/pp.json -w '%{http_code}' -X POST $B/api/private/people -H 'Content-Type: application/json' -d '{"name":"SMOKE-TEST PERSON"}' > $T/pp.code
  t "person create 201"       201 $(cat $T/pp.code)
  PPOK=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$T/pp.json','utf8')).id)" 2>/dev/null || echo "")
  t "person cleanup 200"      200 $(curl -s -b $J -o /dev/null -w '%{http_code}' -X DELETE $B/api/private/people/$PPOK)
  echo "-- logout --"
  t "logout 200"              200 $(curl -s -b $J -c $J -o /dev/null -w '%{http_code}' -X POST $B/api/auth/logout)
  t "blocked after logout"    307 $(curl -s -b $J -o /dev/null -w '%{http_code}' $B/private)
else
  echo "  · skipping login tests (set PASSWORD env var)"
fi
echo; echo "RESULT: $ok passed, $fail failed"; [ $fail -eq 0 ]
