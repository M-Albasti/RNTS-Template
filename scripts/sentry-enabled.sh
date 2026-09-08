#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_LOCAL="${ROOT_DIR}/.env.local"

if [[ -f "${ENV_LOCAL}" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "${ENV_LOCAL}"
  set +a
else
  export SENTRY_DISABLE_AUTO_UPLOAD=true
fi

if [[ "${SENTRY_BUILD_KIND:-}" == "ios-archive" ]]; then
  export SENTRY_DISABLE_AUTO_UPLOAD=false
fi

if [[ "${SENTRY_BUILD_KIND:-}" == "android-release" ]]; then
  export SENTRY_DISABLE_AUTO_UPLOAD=false
fi

export SENTRY_PROPERTIES="${SENTRY_PROPERTIES:-${ROOT_DIR}/sentry.properties}"

echo "Sentry upload enabled: $([[ "${SENTRY_DISABLE_AUTO_UPLOAD:-false}" == "true" ]] && echo no || echo yes)"
echo "SENTRY_PROPERTIES=${SENTRY_PROPERTIES}"
