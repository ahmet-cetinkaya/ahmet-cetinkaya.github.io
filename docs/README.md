# Ahmet Çetinkaya Personal Website - Documentation

Welcome to the documentation for Ahmet Çetinkaya's personal website project. This site is built as an interactive operating system-like portfolio experience.

## Quick Links

- [Getting Started](./DEVELOPMENT_SETUP.md) - Setup and development instructions
- [Architecture](./ARCHITECTURE_OVERVIEW.md) - Technical architecture and design patterns
- [Features](./FEATURES_OVERVIEW.md) - Feature documentation and implementation details

## Project Overview

This is a personal website built to emulate a modern operating system, serving as an interactive digital portfolio. The site introduces Ahmet Çetinkaya, showcases selected works, and publishes technical blog posts in a cohesive desktop-like environment.

### Technology Stack

- **Frontend**: Astro 5.11.1 with SolidJS integration
- **Styling**: TailwindCSS 3.4.17
- **3D Graphics**: Three.js 0.181.2
- **Build Tool**: Vite with custom path aliases
- **Package Manager**: Bun (required)
- **Runtime**: Bun for development and build processes

### Key Features

- **Desktop-like Interface**: Complete OS simulation with taskbar, windows, and file manager
- **Terminal Commands**: Functional terminal with command system
- **3D Models**: Interactive 3D components using Three.js
- **Portfolio Sections**: About me, projects, and blog functionality
- **Responsive Design**: Mobile-compatible experience

## Documentation Structure

```
docs/
├── README.md              # This file - main documentation index
├── DEVELOPMENT_SETUP.md   # Development setup and guides
├── ARCHITECTURE_OVERVIEW.md # Technical architecture documentation
└── FEATURES_OVERVIEW.md   # Feature-specific documentation
```

## Development Requirements

- **Bun**: This project requires Bun as package manager and runtime
- **Node.js**: Not used - this project runs entirely on Bun

## Repository Structure

The project follows a hexagonal/clean architecture pattern:

- `src/core/domain/` - Business entities and data models
- `src/core/application/` - Use cases, services, and command implementations
- `src/presentation/` - Astro-based UI with SolidJS components
- `packages/` - Shared libraries (`acore-ts`, `acore-solidjs`, `acore-astro`)

## Quick Start

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/ahmet-cetinkaya/ahmetcetinkaya.github.io.git

# Install dependencies
bun install-all

# Start development server
bun start
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
