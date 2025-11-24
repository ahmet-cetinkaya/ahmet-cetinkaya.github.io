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

print_info "🔧 Running ESLint auto-fix on root project files"
# Run ESLint auto-fix on root project files, excluding presentation layer
if command -v bun &>/dev/null; then
    if bunx eslint --fix . --ext .js,.jsx,.ts,.tsx "!src/presentation/**/*" 2>/dev/null; then
        print_success "✅ ESLint auto-fix completed successfully"
    else
        print_warning "⚠️  ESLint auto-fix failed or found unfixable issues"
    fi
else
    print_error "❌ bun is required for this project"
    print_info "💡 Install bun: https://bun.sh"
    exit 1
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

    print_info "🔧 Running ESLint auto-fix on presentation layer"
    # Run ESLint auto-fix on presentation layer
    if bun run lint --fix 2>/dev/null; then
        print_success "✅ Presentation layer ESLint auto-fix completed successfully"
    else
        print_warning "⚠️  Presentation layer ESLint auto-fix failed or found unfixable issues"
    fi
else
    print_error "❌ bun is required for this project"
    print_info "💡 Install bun: https://bun.sh"
    exit 1
fi

cd - >/dev/null

print_success "✅ Formatting completed successfully!"
print_info "💡 All code has been formatted according to project standards"
