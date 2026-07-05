#!/usr/bin/env bash

# Build script for ahmetcetinkaya.me project
# Usage: ./scripts/build.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=./packages/acore-scripts/src/logger.sh
source "$ROOT_DIR/packages/acore-scripts/src/logger.sh"

acore_log_header "🏗️  Building ahmetcetinkaya.me project"

# Check if dependencies are installed
if [ ! -d "$ROOT_DIR/node_modules" ] || [ ! -d "$ROOT_DIR/src/presentation/node_modules" ]; then
	acore_log_section "📦 Dependencies not found. Installing..."
	"$ROOT_DIR/scripts/install-all.sh"
fi

acore_log_section "🏗️  Building presentation layer"
(cd "$ROOT_DIR/src/presentation" && bun run build)

acore_log_success "✅ Build completed successfully!"
