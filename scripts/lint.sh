#!/usr/bin/env bash

# Lint script for ahmetcetinkaya.me project
# Runs comprehensive linting across all code types

set -e

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_common.sh"

print_header "🔍 Linting ahmetcetinkaya.me project"

LINT_FAILED=0

# Check if ESLint is available
if ! command -v eslint &>/dev/null; then
    print_warning "⚠️  ESLint not found in PATH"
    print_info "💡 Run 'bun install-all' to install ESLint"
    LINT_FAILED=1
fi

# 1. TypeScript/JavaScript linting
print_info "🟨 Running ESLint for TypeScript/JavaScript files..."
ESLINT_CMD=""
if [[ -f "./node_modules/.bin/eslint" ]]; then
    ESLINT_CMD="./node_modules/.bin/eslint"
elif command -v eslint &>/dev/null; then
    ESLINT_CMD="eslint"
elif command -v npx &>/dev/null; then
    ESLINT_CMD="npx eslint"
fi

if [[ -n "$ESLINT_CMD" ]]; then
    # Run ESLint on all TS/JS files excluding node_modules
    if $ESLINT_CMD . --ext .ts,.tsx,.js,.jsx,.mjs,.cjs 2>/dev/null; then
        print_success "✅ ESLint checks passed"
    else
        print_error "❌ ESLint found issues"
        LINT_FAILED=1
    fi
else
    print_warning "⚠️  Skipping ESLint - not available"
    print_info "💡 Run 'bun install-all' to install ESLint"
    LINT_FAILED=1
fi

# 2. Shell script linting with shellcheck
print_info "🐚 Running ShellCheck for shell scripts..."
if command -v shellcheck &>/dev/null; then
    # Run shellcheck from scripts directory to properly resolve source files
    if (cd scripts && shellcheck -x _common.sh ./*.sh) 2>/dev/null; then
        print_success "✅ ShellScript checks passed"
    else
        print_error "❌ ShellCheck found issues"
        LINT_FAILED=1
    fi
else
    print_warning "⚠️  ShellCheck not found, skipping shell script linting"
    print_info "💡 Install ShellCheck: apt-get install shellcheck or brew install shellcheck"
fi

# 3. Markdown linting with markdownlint-cli2
print_info "📝 Running Markdownlint for Markdown files..."
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
        print_success "✅ Markdown files passed linting"
    else
        print_error "❌ Markdownlint found issues"
        LINT_FAILED=1
        print_info "💡 Run '$MARKDOWNLINT_CMD --fix **/*.md' to fix markdown issues"
    fi
else
    print_warning "⚠️  markdownlint-cli2 not found, skipping markdown linting"
    print_info "💡 Install markdownlint-cli2: npm install -g markdownlint-cli2"
    print_info "💡 Or install locally: npm install markdownlint-cli2 --save-dev"
fi

# 4. Prettier format check
print_info "🎨 Checking code formatting with Prettier..."
if command -v prettier &>/dev/null; then
    # Check if files are formatted (dry run)
    if prettier --check . "!src/presentation/**/*" 2>/dev/null; then
        print_success "✅ Code formatting is correct"
    else
        print_error "❌ Files need formatting"
        LINT_FAILED=1
        print_info "💡 Run 'bun format' to fix formatting issues"
    fi
else
    print_warning "⚠️  Prettier not found, skipping format check"
fi

# 5. Check for common issues
print_info "🔎 Checking for common issues..."

# Check for console.log statements (excluding test and dist files)
CONSOLE_LOGS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" |
    grep -v node_modules |
    grep -v test |
    grep -v dist |
    xargs grep -l "console\.log\|console\.warn\|console\.error" 2>/dev/null || true)

if [[ -n "$CONSOLE_LOGS" ]]; then
    print_warning "⚠️  Found console statements in production code:"
    echo "$CONSOLE_LOGS" | head -3
    print_info "💡 Consider removing or replacing with proper logging"
fi

# Check for TODO/FIXME comments
TODO_COMMENTS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" |
    grep -v node_modules |
    xargs grep -n "TODO\|FIXME\|XXX\|HACK" 2>/dev/null || true)

if [[ -n "$TODO_COMMENTS" ]]; then
    print_warning "⚠️  Found TODO/FIXME comments:"
    echo "$TODO_COMMENTS" | head -5
fi

# Summary
echo
if [[ $LINT_FAILED -eq 0 ]]; then
    print_success "🎉 All lint checks passed!"
    print_info "💡 Code quality looks good"
    exit 0
else
    print_error "❌ Lint checks failed!"
    print_error "💡 Please fix the issues above before committing"
    exit 1
fi
