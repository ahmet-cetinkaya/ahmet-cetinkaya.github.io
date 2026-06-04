#!/usr/bin/env bash

# Lint script for ahmetcetinkaya.me project
# Runs comprehensive linting across all code types

set -e

# Source universal logger
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../packages/acore-scripts/src/logger.sh"

acore_log_header "🔍 Linting ahmetcetinkaya.me project"

LINT_FAILED=0

# Check if ESLint is available
if ! command -v eslint &>/dev/null; then
	acore_log_warning "⚠️  ESLint not found in PATH"
	acore_log_info "💡 Run 'bun install-all' to install ESLint"
	LINT_FAILED=1
fi

# 1. TypeScript/JavaScript linting
acore_log_info "🟨 Running ESLint for TypeScript/JavaScript files..."
ESLINT_CMD=""
if [[ -f "./node_modules/.bin/eslint" ]]; then
	ESLINT_CMD="./node_modules/.bin/eslint"
elif command -v eslint &>/dev/null; then
	ESLINT_CMD="eslint"
elif command -v npx &>/dev/null; then
	ESLINT_CMD="npx eslint"
fi

if [[ -n "$ESLINT_CMD" ]]; then
	# Run ESLint on all TS/JS files excluding node_modules and Astro files
	if $ESLINT_CMD . --ext .ts,.tsx,.js,.jsx,.mjs,.cjs --ignore-pattern "**/*.astro" 2>/dev/null; then
		acore_log_success "✅ ESLint checks passed"
	else
		acore_log_error "❌ ESLint found issues"
		LINT_FAILED=1
	fi
else
	acore_log_warning "⚠️  Skipping ESLint - not available"
	acore_log_info "💡 Run 'bun install-all' to install ESLint"
	LINT_FAILED=1
fi

# 2. Astro file type checking
acore_log_info "🚀 Running Astro type checking..."
if command -v bun &>/dev/null; then
	if (cd src/presentation && bun run check) 2>/dev/null; then
		acore_log_success "✅ Astro type checks passed"
	else
		acore_log_error "❌ Astro type checking found issues"
		LINT_FAILED=1
	fi
else
	acore_log_warning "⚠️  Bun not found, skipping Astro type checking"
fi

# 3. Shell script linting with shellcheck
acore_log_info "🐚 Running ShellCheck for shell scripts..."
if command -v shellcheck &>/dev/null; then
	# Run shellcheck from scripts directory to properly resolve source files
	if (cd scripts && shellcheck -x ../packages/acore-scripts/src/logger.sh ./*.sh) 2>/dev/null; then
		acore_log_success "✅ ShellScript checks passed"
	else
		acore_log_error "❌ ShellCheck found issues"
		LINT_FAILED=1
	fi
else
	acore_log_warning "⚠️  ShellCheck not found, skipping shell script linting"
	acore_log_info "💡 Install ShellCheck: apt-get install shellcheck or brew install shellcheck"
fi

# 4. Markdown linting with markdownlint-cli2
acore_log_info "📝 Running Markdownlint for Markdown files..."
# Check for markdownlint-cli2 in PATH or local node_modules/.bin
MARKDOWNLINT_CMD=""
if command -v markdownlint-cli2 &>/dev/null; then
	MARKDOWNLINT_CMD="markdownlint-cli2"
elif [[ -f "./node_modules/.bin/markdownlint-cli2" ]]; then
	MARKDOWNLINT_CMD="./node_modules/.bin/markdownlint-cli2"
elif command -v npx &>/dev/null; then
	MARKDOWNLINT_CMD="npx markdownlint-cli2"
fi

if [[ -n "$MARKDOWNLINT_CMD" ]]; then
	# Run markdownlint-cli2 with appropriate glob patterns
	if $MARKDOWNLINT_CMD "**/*.md" "#node_modules" "#dist" "#.git" 2>/dev/null; then
		acore_log_success "✅ Markdown files passed linting"
	else
		acore_log_error "❌ Markdownlint found issues"
		LINT_FAILED=1
		acore_log_info "💡 Run '$MARKDOWNLINT_CMD --fix **/*.md' to fix markdown issues"
	fi
else
	acore_log_warning "⚠️  markdownlint-cli2 not found, skipping markdown linting"
	acore_log_info "💡 Install markdownlint-cli2: npm install -g markdownlint-cli2"
	acore_log_info "💡 Or install locally: npm install markdownlint-cli2 --save-dev"
fi

# 5. Prettier format check
acore_log_info "🎨 Checking code formatting with Prettier..."
if command -v prettier &>/dev/null; then
	# Check if files are formatted (dry run)
	if prettier --check . "!src/presentation/**/*" 2>/dev/null; then
		acore_log_success "✅ Code formatting is correct"
	else
		acore_log_error "❌ Files need formatting"
		LINT_FAILED=1
		acore_log_info "💡 Run 'bun format' to fix formatting issues"
	fi
else
	acore_log_warning "⚠️  Prettier not found, skipping format check"
fi

# 6. Check for common issues
acore_log_info "🔎 Checking for common issues..."

# Check for TODO/FIXME comments
TODO_COMMENTS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" |
	grep -v node_modules |
	xargs grep -n "TODO\|FIXME\|XXX\|HACK" 2>/dev/null || true)

if [[ -n "$TODO_COMMENTS" ]]; then
	acore_log_warning "⚠️  Found TODO/FIXME comments:"
	echo "$TODO_COMMENTS" | head -5
fi

# Summary
echo
if [[ $LINT_FAILED -eq 0 ]]; then
	acore_log_success "🎉 All lint checks passed!"
	acore_log_info "💡 Code quality looks good"
	exit 0
else
	acore_log_error "❌ Lint checks failed!"
	acore_log_error "💡 Please fix the issues above before committing"
	exit 1
fi
