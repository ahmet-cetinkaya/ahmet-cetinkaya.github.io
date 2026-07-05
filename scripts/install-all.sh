#!/usr/bin/env bash

# Install-all script for ahmetcetinkaya.me project
# Installs dependencies across all workspace packages

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=./packages/acore-scripts/src/logger.sh
source "$ROOT_DIR/packages/acore-scripts/src/logger.sh"

acore_log_header "📦 Installing dependencies for ahmetcetinkaya.me project"

# Install dependencies in each package
find "$ROOT_DIR" -name "package.json" ! -path "*/node_modules/*" | while read -r package_file; do
	package_dir=$(dirname "$package_file")
	acore_log_section "📦 Installing dependencies for: $package_dir"
	(cd "$package_dir" && bun install)
done

acore_log_success "🎉 All dependencies installed successfully!"
