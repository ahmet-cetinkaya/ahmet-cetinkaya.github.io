#!/bin/bash

# Format script for ahmetcetinkaya.me project
# Formats all code in the project using appropriate formatters

set -e

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_common.sh"

print_header "🎨 Formatting ahmetcetinkaya.me project"

# Check if prettier is available
if ! command -v prettier &>/dev/null; then
    print_error "prettier is not installed or not in PATH"
    exit 1
fi

print_info "🐚 Formatting shell scripts with shfmt..."
# Format shell scripts with shfmt
if command -v shfmt &>/dev/null; then
    find . -name "*.sh" -not -path "*/node_modules/*" -exec shfmt -w -i 4 {} \; 2>/dev/null || {
        print_warning "⚠️  shfmt formatting failed"
    }
else
    print_warning "⚠️  shfmt not found, skipping shell script formatting"
    print_info "💡 Install shfmt: go install mvdan.cc/sh/v3/cmd/shfmt@latest"
fi

print_info "📝 Formatting root project files (excluding presentation layer)"
# Format root project files, excluding presentation layer (hide unchanged messages)
if prettier --write . "!src/presentation/**/*" 2>/dev/null | grep -v "unchanged" || true; then
    print_success "✅ Root files formatted successfully"
else
    print_warning "⚠️  Root formatting failed, might be due to missing dependencies"
fi

print_info "🎯 Formatting presentation layer with bun"
# Go to presentation layer and format with bun
cd src/presentation
if command -v bun &>/dev/null; then
    if bun format 2>/dev/null | grep -v "unchanged" || true; then
        print_success "✅ Presentation layer formatted successfully"
    else
        print_warning "⚠️  Presentation layer formatting failed - dependencies might be missing"
        print_info "💡 Try running 'bun install-all' first"
    fi
else
    print_warning "bun not found, trying npm/yarn"
    if command -v npm &>/dev/null; then
        npm run format | grep -v "unchanged" || true
    elif command -v yarn &>/dev/null; then
        yarn format | grep -v "unchanged" || true
    else
        print_error "No package manager found (bun, npm, yarn)"
        exit 1
    fi
fi

cd - >/dev/null

print_success "✅ Formatting completed successfully!"
print_info "💡 All code has been formatted according to project standards"
