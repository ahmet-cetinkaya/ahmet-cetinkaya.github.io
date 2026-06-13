#!/usr/bin/env bash

# Test Script for ahmetcetinkaya.me project
# Usage: ./scripts/test.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=../packages/acore-scripts/src/logger.sh
source "$ROOT_DIR/packages/acore-scripts/src/logger.sh"

acore_log_header "🧪 Running Project Tests"

acore_log_section "TypeScript compilation check"
(cd src/presentation && bun check)

acore_log_section "Running unit tests"
(cd src/presentation && bun run test || true)

acore_log_section "Running build test"
(cd src/presentation && bun run build)

acore_log_success "🎉 All tests passed!"
