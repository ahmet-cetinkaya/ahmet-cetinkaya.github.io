# Makefile for ahmetcetinkaya.me project
# Ensures single-step build and test workflows as per Clean Code Environment Quality Rules (E1-E2)

.PHONY: build test clean install-all

all: build

build:
	./scripts/build.sh

test:
	./scripts/test.sh

clean:
	./scripts/clean.sh

install-all:
	./scripts/install-all.sh

format:
	./scripts/format.sh

lint:
	./scripts/lint.sh

dev:
	./scripts/dev.sh

preview:
	./scripts/preview.sh

help:
	@echo "📦 ahmetcetinkaya.me Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build     - Build the project (single command)"
	@echo "  test      - Run all tests (single command)"
	@echo "  clean     - Clean build artifacts"
	@echo "  install-all - Install all dependencies"
	@echo "  format    - Format code"
	@echo "  lint      - Lint code"
	@echo "  dev       - Start development server"
	@echo "  preview   - Preview production build"
	@echo "  help      - Show this help"