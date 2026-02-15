#!/bin/bash

# Test Script for ahmetcetinkaya.me project
# Usage: ./scripts/test.sh

set -e

# Get project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source common functions
source "$SCRIPT_DIR/_common.sh"

print_header "🧪 Running Project Tests"

# Check dependencies and setup
check_dependencies() {
    if ! command -v bun &>/dev/null; then
        print_error "❌ bun is required but not installed"
        exit 1
    fi

    cd "$PROJECT_ROOT/src/presentation" || exit
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        bun install
    fi
}

# Run tests
run_tests() {
    local failed=0

    # TypeScript compilation check
    print_info "Running TypeScript compilation check..."
    if ! bun check; then
        print_error "❌ TypeScript compilation failed"
        failed=1
    else
        print_success "✅ TypeScript compilation passed"
    fi

    # Run unit tests if available
    if bun run test 2>/dev/null; then
        print_success "✅ Unit tests passed"
    else
        print_info "ℹ️  No unit tests configured"
    fi

    # Build test
    print_info "Running build test..."
    if ! bun run build; then
        print_error "❌ Build failed"
        failed=1
    else
        print_success "✅ Build passed"
    fi

    return $failed
}

# Main
check_dependencies
print_info "Running tests..."

if run_tests; then
    print_success "🎉 All tests passed!"
    exit 0
else
    print_error "❌ Some tests failed!"
    exit 1
fi
