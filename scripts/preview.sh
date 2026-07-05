#!/usr/bin/env bash

# Preview production build script for ahmetcetinkaya.me project
# Usage: ./scripts/preview.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=./packages/acore-scripts/src/logger.sh
source "$ROOT_DIR/packages/acore-scripts/src/logger.sh"

acore_log_header "🔍 Previewing production build"

acore_log_section "🚀 Starting Astro preview server"
(cd "$ROOT_DIR/src/presentation" && bun run preview)
