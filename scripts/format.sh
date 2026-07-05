#!/usr/bin/env bash

# Format script for ahmetcetinkaya.me project
# Formats code layer by layer with proper organization

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./packages/acore-scripts/src/logger.sh
source "$SCRIPT_DIR/../packages/acore-scripts/src/logger.sh"

acore_log_header "🎨 Formatting ahmetcetinkaya.me project"

acore_log_section "🔧 Running ESLint auto-fix on root project files"
bunx eslint --fix . --ignore-pattern "packages/**" --ignore-pattern "src/presentation/public/**"
acore_log_success "✅ ESLint auto-fix completed"

acore_log_section "🧹 Running fallow fix --yes"
fallow fix --yes
acore_log_success "✅ fallow fix --yes completed"

# Format root directory first (excluding layers that have their own config)
acore_log_section "📝 Formatting root directory"
OUTPUT=$(prettier --write . --ignore-path .gitignore --ignore-path .prettierignore)
if [[ -n "$OUTPUT" ]]; then
	echo "$OUTPUT" | grep -v "unchanged" || true
fi
acore_log_success "✅ Root directory formatted"

# Format domain layer
if [ -d "src/core/domain" ]; then
	acore_log_section "📝 Formatting domain layer"
	OUTPUT=$(cd src/core/domain && prettier --write .)
	if [[ -n "$OUTPUT" ]]; then
		echo "$OUTPUT" | grep -v "unchanged" || true
	fi
	acore_log_success "✅ Domain layer formatted"
fi

# Format application layer
if [ -d "src/core/application" ]; then
	acore_log_section "📝 Formatting application layer"
	OUTPUT=$(cd src/core/application && prettier --write .)
	if [[ -n "$OUTPUT" ]]; then
		echo "$OUTPUT" | grep -v "unchanged" || true
	fi
	acore_log_success "✅ Application layer formatted"
fi

# Format presentation layer (has its own prettier config)
if [ -d "src/presentation" ]; then
	acore_log_section "📝 Formatting presentation layer"
	OUTPUT=$(cd src/presentation && prettier --write .)
	if [[ -n "$OUTPUT" ]]; then
		echo "$OUTPUT" | grep -v "unchanged" || true
	fi
	acore_log_success "✅ Presentation layer formatted"
fi

# Format packages directory
if [ -d "packages" ] && [ "$(ls -A packages)" ]; then
	acore_log_section "📦 Formatting packages directory"
	OUTPUT=$(prettier --write packages/)
	if [[ -n "$OUTPUT" ]]; then
		echo "$OUTPUT" | grep -v "unchanged" || true
	fi
	acore_log_success "✅ Packages formatted with Prettier"

	acore_log_section "🐚 Formatting package shell scripts"
	find packages -name "*.sh" -exec shfmt -w {} +
	acore_log_success "✅ Package shell scripts formatted"
else
	acore_log_info "ℹ️  No packages to format"
fi

# Format shell scripts
acore_log_section "🐚 Formatting root shell scripts with shfmt"
find . -name "*.sh" -not -path "*/node_modules/*" -not -path "*/packages/*" -exec shfmt -w {} +
acore_log_success "✅ Root shell scripts formatted"

acore_log_success "✅ Formatting completed successfully!"
