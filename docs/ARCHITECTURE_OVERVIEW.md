# Architecture Overview

This project follows a **hexagonal/clean architecture** pattern with clear separation of concerns, promoting maintainability, testability, and scalability.

## Core Architecture Principles

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│                (Astro + SolidJS + TailwindCSS)              │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
│              (Use Cases, Services, Commands)                │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│                (Business Entities, Models)                  │
├─────────────────────────────────────────────────────────────┤
│                    Core Packages                            │
│           (Shared Libraries & Utilities)                    │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── core/
│   ├── domain/                    # Business logic and entities
│   │   └── models/
│   │       ├── App.ts
│   │       ├── Category.ts
│   │       ├── Technology.ts
│   │       └── ...
│   └── application/               # Application logic and services
│       ├── ApplicationContainer.ts
│       └── features/
│           ├── apps/
│           ├── categories/
│           ├── technologies/
│           └── system/
│               └── commands/
├── presentation/                 # UI layer
│   ├── src/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── shared/
│   │   └── components/
│   ├── public/
│   │   └── models/              # 3D models
│   └── astro.config.mjs
└── packages/                     # Shared libraries
    ├── acore-ts/
    ├── acore-solidjs/
    └── acore-astro/
```

## Key Architectural Patterns

### 1. Dependency Inversion

- Dependencies flow inward (presentation → application → domain)
- Domain layer has no external dependencies
- Application layer depends on domain abstractions

### 2. Feature Organization

Each feature follows the pattern:

```
features/[feature-name]/
├── services/                     # Business logic
│   ├── abstraction/             # Interfaces
│   └── [Feature]Service.ts      # Implementations
├── commands/                    # Terminal commands
└── [Feature]Service.spec.ts     # Tests
```

### 3. Command Pattern

Terminal commands implement the `ICIProgram` interface:

- Each command is a separate class
- Auto-discovery and registration system
- Clean separation between command logic and execution

### 4. Package Architecture

Core packages provide shared functionality:

- `acore-ts`: Core TypeScript utilities and types
- `acore-solidjs`: SolidJS-specific integrations
- `acore-astro`: Astro-specific utilities and components

## Technology Integration

### Frontend Stack

- **Astro**: Static site generator with island architecture
- **SolidJS**: Reactive UI framework for interactive components
- **TailwindCSS**: Utility-first CSS framework
- **Three.js**: 3D graphics and model rendering

### Build System

- **Vite**: Fast build tool with custom path aliases
- **Bun**: Package manager and runtime
- **TypeScript**: Type safety and enhanced development experience

### 3D Asset Pipeline

- **DRACO Compression**: Optimized 3D model delivery
- **Three.js Integration**: Custom 3D components
- **Asset Management**: Organized model storage and loading

## Key Architectural Decisions

### 1. Bun-First Approach

- Single runtime for development and production
- Native TypeScript support
- Optimized dependency management

### 2. Island Architecture

- Astro islands for interactive components
- Minimal JavaScript bundle size
- Progressive enhancement strategy

### 3. Clean Separation

- Clear boundaries between layers
- Dependency injection through ApplicationContainer
- Testable and maintainable code structure

### 4. Modular Design

- Feature-based organization
- Reusable core packages
- Extensible command system

## Data Flow

```
User Interaction → Presentation Layer → Application Layer → Domain Layer
                    ↑                              ↓
                Response                         Business Logic
                    ↑                              ↓
                UI Update ← Presentation Layer ← Application Layer
```

## Performance Considerations

### Bundle Optimization

- Tree shaking and dead code elimination
- Dynamic imports for code splitting
- Minimal external dependencies

### 3D Performance

- DRACO compression for models
- Lazy loading of 3D assets
- Optimized Three.js usage

### Build Performance

- Vite's fast development server
- Incremental builds
- Bun's optimized package management

## Testing Strategy

### Unit Testing

- Domain layer tests (business logic)
- Application service tests
- Command implementation tests

### Integration Testing

- Component integration
- Service layer interactions
- End-to-end user flows

## Security Considerations

### Input Validation

- Command input sanitization
- File system access controls
- Content Security Policy

### Dependency Management

- Minimal external packages
- Regular security updates
- Bun's secure package resolution

This architecture provides a solid foundation for maintaining and extending the personal website while ensuring performance, security, and developer productivity.
