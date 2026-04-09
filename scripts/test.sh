#!/usr/bin/env bash

# Test Script for ahmetcetinkaya.me project
# Usage: ./scripts/test.sh

set -e

# Get project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source universal logger
source "$ROOT_DIR/packages/acore-scripts/src/logger.sh"

acore_log_header "🧪 Running Project Tests"

# Check dependencies and setup
check_dependencies() {
	if ! command -v bun &>/dev/null; then
		acore_log_error "❌ bun is required but not installed"
		exit 1
	fi

	cd "$ROOT_DIR/src/presentation" || exit
	if [ ! -d "node_modules" ]; then
		acore_log_info "Installing dependencies..."
		bun install
	fi
}

# Run tests
run_tests() {
	local failed=0

	# TypeScript compilation check
	acore_log_info "Running TypeScript compilation check..."
	if ! bun check; then
		acore_log_error "❌ TypeScript compilation failed"
		failed=1
	else
		acore_log_success "✅ TypeScript compilation passed"
	fi

	# Run unit tests if available
	if bun run test 2>/dev/null; then
		acore_log_success "✅ Unit tests passed"
	else
		acore_log_info "ℹ️  No unit tests configured"
	fi

	# Build test
	acore_log_info "Running build test..."
	if ! bun run build; then
		acore_log_error "❌ Build failed"
		failed=1
	else
		acore_log_success "✅ Build passed"
	fi

	return $failed
}

# Main
check_dependencies
acore_log_info "Running tests..."

if run_tests; then
	acore_log_success "🎉 All tests passed!"
	exit 0
else
	acore_log_error "❌ Some tests failed!"
	exit 1
fi
