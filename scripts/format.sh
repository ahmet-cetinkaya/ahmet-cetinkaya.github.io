#!/usr/bin/env bash

# Format script for ahmetcetinkaya.me project
# Formats all code in the project using appropriate formatters

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../packages/acore-scripts/src/logger.sh"

acore_log_header "🎨 Formatting ahmetcetinkaya.me project"

acore_log_section "🐚 Formatting shell scripts with shfmt"
shfmt -w .
acore_log_success "✅ Shell scripts formatted"

acore_log_section "🔧 Running ESLint auto-fix on root project files"
bunx eslint --fix .
acore_log_success "✅ ESLint auto-fix completed"

acore_log_section "🧹 Running fallow fix --yes"
fallow fix --yes
acore_log_success "✅ fallow fix --yes completed"

acore_log_section "📝 Formatting root project files"
prettier --write . "!src/presentation/**/*"
acore_log_success "✅ Formatting completed for root project files"

acore_log_section "🎯 Formatting presentation layer"
(
	cd src/presentation
	bun format
)
acore_log_success "✅ Presentation layer formatted"

acore_log_success "✅ Formatting completed successfully!"
