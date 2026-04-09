#!/usr/bin/env bash

# Clean script for ahmetcetinkaya.me project
# Removes all node_modules directories, build outputs, and generated files

set -e

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_common.sh"

print_header "🧹 Cleaning ahmetcetinkaya.me project"

print_info "📦 Removing node_modules directories"
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

print_info "🏗️  Removing build output directories"
find . -name "dist" -o -name ".astro" -o -name "out" -o -name "build" -type d -exec rm -rf {} + 2>/dev/null || true

print_info "📄 Removing log files"
find . -name "*.log" -delete 2>/dev/null || true

print_info "🗑️  Removing temporary files"
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true

print_info "🧪 Removing coverage reports"
find . -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".nyc_output" -type d -exec rm -rf {} + 2>/dev/null || true

print_info "🔧 Removing cache directories"
find . -name ".cache" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".vite" -type d -exec rm -rf {} + 2>/dev/null || true

print_success "✅ Clean completed successfully!"
print_info "💡 Run 'bun install-all' to reinstall dependencies"
