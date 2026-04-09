#!/usr/bin/env bash

# Install-all script for ahmetcetinkaya.me project
# Installs dependencies across all workspace packages

set -e

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_common.sh"

print_header "📦 Installing dependencies for ahmetcetinkaya.me project"

# Check if bun is available
if ! command -v bun &>/dev/null; then
    print_error "bun is not installed or not in PATH"
    print_info "Please install bun: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

print_info "🔍 Finding all package.json files..."
PACKAGE_FILES=$(find . -name "package.json" ! -path "*/node_modules/*")

PACKAGE_COUNT=$(echo "$PACKAGE_FILES" | wc -l)
print_info "📋 Found $PACKAGE_COUNT package.json files"

# Install dependencies in each package
echo "$PACKAGE_FILES" | while read -r package_file; do
    if [[ -n "$package_file" ]]; then
        package_dir=$(dirname "$package_file")
        package_name=$(basename "$package_dir")

        if [[ "$package_name" == "." ]]; then
            package_name="root"
        fi

        print_info "📦 Installing dependencies for: $package_name"
        cd "$package_dir"

        if bun install; then
            print_success "✅ $package_name dependencies installed"
        else
            print_error "❌ Failed to install dependencies for $package_name"
            exit 1
        fi

        cd - >/dev/null
    fi
done

print_success "🎉 All dependencies installed successfully!"
print_info "💡 You can now run 'bun start' to begin development"
