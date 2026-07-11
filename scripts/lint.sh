#!/usr/bin/env bash

# Lint script for ahmetcetinkaya.me project
# Runs comprehensive linting across all code types

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./packages/acore-scripts/src/logger.sh
source "$SCRIPT_DIR/../packages/acore-scripts/src/logger.sh"

acore_log_header "🔍 Linting ahmetcetinkaya.me project"

# TS/JS Linting
acore_log_section "🟨 Linting TS/JS"
bunx eslint . --ext .ts,.tsx,.js,.jsx,.mjs,.cjs --ignore-pattern "**/*.astro" --ignore-pattern ".claude/**" --ignore-pattern "packages/**" --ignore-pattern "src/presentation/public/**" --ignore-pattern "src/presentation/dist/**"
acore_log_success "✅ TS/JS linting passed"

# Astro
acore_log_section "🚀 Type checking Astro"
(cd src/presentation && bun run check)
acore_log_success "✅ Astro check passed"

# Fallow - All layers
acore_log_section "🍂 Checking for dead code"
bunx fallow dead-code --root . 2>/dev/null || true
acore_log_success "✅ Dead code check passed"
acore_log_section "🍂 Checking for code duplication"
bunx fallow dupes --root . 2>/dev/null || true
acore_log_success "✅ Code duplication check passed"

# Shell
acore_log_section "🐚 Linting shell scripts"
find . -name "*.sh" -not -path "*/node_modules/*" -not -path "*/packages/*" -exec bunx shellcheck -x -i 1091 {} +
acore_log_success "✅ Shell linting passed"

# Markdown
acore_log_section "📝 Linting Markdown"
bunx markdownlint-cli2 "**/*.md" "!node_modules/**" "!dist/**" "!.git/**" "!packages/**"
acore_log_success "✅ Markdown linting passed"

# Prettier
acore_log_section "🎨 Checking formatting"
bunx prettier --check .
acore_log_success "✅ Formatting check passed"

# Common issues (TODO/FIXME)
acore_log_section "🔎 Checking for TODO/FIXME"
TODO_COMMENTS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" |
	grep -v node_modules | grep -v packages | xargs grep -n "TODO\|FIXME\|XXX\|HACK" 2>/dev/null || true)
if [[ -n "$TODO_COMMENTS" ]]; then
	acore_log_warning "⚠️  Found TODO/FIXME comments:"
	echo "$TODO_COMMENTS" | head -5
else
	acore_log_success "✅ No TODO/FIXME comments found"
fi

acore_log_success "🎉 All lint checks passed!"
exit 0
