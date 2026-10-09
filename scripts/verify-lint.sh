#!/usr/bin/env bash
# Proves the FSD lint rules catch violations and allow the documented exemptions.
# Each fixture lives in scripts/lint-fixtures/<pass|fail>-<name>/src/**. It is copied
# into src/, linted with oxlint, then removed. "fail-*" fixtures must make oxlint report
# the rule named in their `expected-rule` file (so an unrelated error, or "No files found",
# never counts as caught); "pass-*" fixtures must lint clean.
set -euo pipefail
cd "$(dirname "$0")/.."

oxlint=./node_modules/.bin/oxlint
created=()

cleanup() {
  for dir in "${created[@]:-}"; do
    if [ -n "$dir" ]; then rm -rf "$dir"; fi
  done
  created=()
}
trap cleanup EXIT

problems=0
for fixture in scripts/lint-fixtures/*/; do
  name=$(basename "$fixture")
  expect=${name%%-*}

  while IFS= read -r slice_dir; do
    target="src/${slice_dir#"${fixture}src/"}"
    if [ -e "$target" ]; then
      echo "refusing to overwrite existing $target" >&2
      exit 2
    fi
    created+=("$target")
  done < <(find "${fixture}src" -mindepth 2 -maxdepth 2 -type d)

  cp -R "${fixture}src/." src/
  files=$(cd "$fixture" && find src -type f | sort)

  # shellcheck disable=SC2086
  if output=$($oxlint $files 2>&1); then status=0; else status=$?; fi

  expected_rule=""
  if [ -f "${fixture}expected-rule" ]; then expected_rule=$(cat "${fixture}expected-rule"); fi

  if [ "$expect" = "fail" ] && [ -z "$expected_rule" ]; then
    echo "FAIL $name: missing ${fixture}expected-rule"
    problems=$((problems + 1))
  elif [ "$expect" = "fail" ] && { [ "$status" -eq 0 ] || [[ "$output" != *"$expected_rule"* ]]; }; then
    echo "FAIL $name: expected a $expected_rule error, got:"
    echo "$output"
    problems=$((problems + 1))
  elif [ "$expect" = "pass" ] && [ "$status" -ne 0 ]; then
    echo "FAIL $name: expected clean lint, got:"
    echo "$output"
    problems=$((problems + 1))
  else
    echo "ok   $name"
  fi
  cleanup
done

if [ "$problems" -gt 0 ]; then
  echo "$problems fixture(s) failed"
  exit 1
fi
echo "all lint fixtures behaved as expected"
