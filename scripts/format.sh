#!/usr/bin/env bash

# Format script for ahmetcetinkaya.me project
# Formats all code in the project using appropriate formatters

set -e

# Source universal logger
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../packages/acore-scripts/src/logger.sh"

acore_log_header "🎨 Formatting ahmetcetinkaya.me project"

# Check if prettier is available
if ! command -v prettier &>/dev/null; then
	acore_log_error "prettier is not installed or not in PATH"
	exit 1
fi

acore_log_info "🐚 Formatting shell scripts with shfmt..."
# Format shell scripts with shfmt
if command -v shfmt &>/dev/null; then
	find . -name "*.sh" -not -path "*/node_modules/*" -exec shfmt -w {} \; 2>/dev/null || {
		acore_log_warning "⚠️  shfmt formatting failed"
	}
else
	acore_log_warning "⚠️  shfmt not found, skipping shell script formatting"
	acore_log_info "💡 Install shfmt: go install mvdan.cc/sh/v3/cmd/shfmt@latest"
fi

acore_log_info "🔧 Running ESLint auto-fix on root project files"
# Run ESLint auto-fix on root project files, excluding presentation layer
if command -v bun &>/dev/null; then
	if bunx eslint --fix . --ext .js,.jsx,.ts,.tsx "!src/presentation/**/*" 2>/dev/null; then
		acore_log_success "✅ ESLint auto-fix completed successfully"
	else
		acore_log_warning "⚠️  ESLint auto-fix failed or found unfixable issues"
	fi
else
	acore_log_error "❌ bun is required for this project"
	acore_log_info "💡 Install bun: https://bun.sh"
	exit 1
fi

acore_log_info "📝 Formatting root project files (excluding presentation layer)"
# Format root project files, excluding presentation layer (hide unchanged messages)
if prettier --write . "!src/presentation/**/*" 2>/dev/null | grep -v "unchanged" || true; then
	acore_log_success "✅ Root files formatted successfully"
else
	acore_log_warning "⚠️  Root formatting failed, might be due to missing dependencies"
fi

acore_log_info "🎯 Formatting presentation layer with bun"
# Go to presentation layer and format with bun
cd src/presentation
if command -v bun &>/dev/null; then
	if bun format 2>/dev/null | grep -v "unchanged" || true; then
		acore_log_success "✅ Presentation layer formatted successfully"
	else
		acore_log_warning "⚠️  Presentation layer formatting failed - dependencies might be missing"
		acore_log_info "💡 Try running 'bun install-all' first"
	fi

	acore_log_info "🔧 Running ESLint auto-fix on presentation layer"
	# Run ESLint auto-fix on presentation layer
	if bun run lint --fix 2>/dev/null; then
		acore_log_success "✅ Presentation layer ESLint auto-fix completed successfully"
	else
		acore_log_warning "⚠️  Presentation layer ESLint auto-fix failed or found unfixable issues"
	fi
else
	acore_log_error "❌ bun is required for this project"
	acore_log_info "💡 Install bun: https://bun.sh"
	exit 1
fi

cd - >/dev/null

acore_log_success "✅ Formatting completed successfully!"
acore_log_info "💡 All code has been formatted according to project standards"
