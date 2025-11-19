# Development Setup

This guide will help you set up a development environment and contribute to the Ahmet Çetinkaya personal website project.

## Prerequisites

### Required Tools

- **Bun**: This project exclusively uses Bun as package manager and runtime
- **Git**: For version control and submodule management
- **VS Code** (recommended): With TypeScript and TailwindCSS extensions

### Installation

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

## Initial Setup

### 1. Clone the Repository

```bash
# Clone with submodules (required for core packages)
git clone --recurse-submodules https://github.com/ahmet-cetinkaya/ahmetcetinkaya.github.io.git

# Navigate to project directory
cd ahmetcetinkaya.github.io
```

### 2. Install Dependencies

```bash
# Install dependencies for all workspaces
bun install-all

# This command finds all package.json files and runs bun install in each directory
```

### 3. Start Development Server

```bash
# Start the development server
bun start

# The site will be available at http://localhost:4321
# With --host flag for network access
```

## Development Workflow

### Root Level Commands

From the project root:

```bash
# Install all dependencies across workspaces
bun install-all

# Build the entire project
bun build

# Start development server
bun start

# Lint all code
bun lint

# Format all code (excludes presentation layer which has its own formatter)
bun format
```

### Presentation Layer Commands

Navigate to `src/presentation/` for presentation-specific commands:

```bash
cd src/presentation

# Development server with hot reload
bun dev
bun start          # equivalent, runs with --host

# Build for production
bun build

# Type checking
bun check

# Preview production build
bun preview

# Format code
bun format
```

## Project Structure

### Workspace Organization

This is a monorepo with multiple workspaces:

```
/
├── packages/                    # Core packages
│   ├── acore-ts/               # TypeScript utilities
│   ├── acore-solidjs/          # SolidJS integrations
│   └── acore-astro/            # Astro utilities
├── src/
│   ├── core/                   # Business logic
│   │   ├── domain/             # Domain models
│   │   └── application/        # Application services
│   └── presentation/           # Frontend application
│       ├── src/
│       │   ├── features/       # Feature modules
│       │   ├── pages/          # Astro pages
│       │   └── shared/         # Shared components
│       └── public/             # Static assets
```

### Path Aliases

The project uses extensive path aliases defined in `src/presentation/astro.config.mjs`:

```javascript
"@": "./src"
"@packages": "../../packages"
"@domain": "../../src/core/domain"
"@application": "../../src/core/application"
"@presentation": "."
"@presentation/src": "./src"
"@shared": "./src/shared"
```

Always use these aliases instead of relative paths when working with imports.

## Development Guidelines

### Code Organization

1. **Feature-Based Development**: Organize code by features, not file types
2. **Clean Architecture**: Respect the layer boundaries (domain → application → presentation)
3. **Shared Packages**: Use core packages for reusable functionality

### Adding New Features

1. **Domain Models**: Create in `src/core/domain/models/`
2. **Application Services**: Implement in `src/core/application/features/[feature]/`
3. **UI Components**: Build in `src/presentation/src/features/[feature]/`
4. **Terminal Commands**: Add to `src/core/application/features/system/commands/`

### Styling Guidelines

- Use **TailwindCSS** classes exclusively
- Follow existing component patterns in `src/shared/components/ui/`
- Maintain responsive, mobile-first design
- Preserve the OS-like desktop aesthetic

### 3D Model Integration

- Place models in `src/presentation/public/models/`
- Use DRACO compression for optimization
- Follow existing patterns in `src/shared/components/ThreeDimensionalModel/`

## Common Development Tasks

### Adding a New Terminal Command

```typescript
// src/core/application/features/system/commands/[Command]Command.ts
export class [Command]Command implements ICIProgram {
  public name = "[command]";
  public description = "Command description";

  async execute(args: string[]): Promise<string> {
    // Command implementation
    return result;
  }
}
```

### Creating a New Page

```astro
---
// src/presentation/src/pages/new-page.astro
import Layout from '@presentation/src/shared/layouts/Layout.astro';
---

<Layout title="New Page">
  <main>
    <!-- Page content -->
  </main>
</Layout>
```

### Adding 3D Models

```typescript
// Use existing ThreeDimensionalModel component
import ThreeDimensionalModel from '@shared/components/ThreeDimensionalModel/ThreeDimensionalModel';

<ThreeDimensionalModel
  modelPath="/models/your-model.glb"
  position={[0, 0, 0]}
  scale={[1, 1, 1]}
/>
```

## Git Workflow

### Working with Submodules

```bash
# Update submodules
git submodule update --remote --merge

# Pull latest changes including submodule updates
git pull --recurse-submodules
```

### Committing Changes

```bash
# Check status
git status

# Stage changes
git add .

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push changes
git push
```

### Branch Strategy

- `main`: Production branch
- `develop`: Development branch
- `feature/[name]`: Feature-specific branches
- `fix/[name]`: Bug fix branches

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage

# Run tests for specific package
cd packages/acore-ts && bun test
```

### Writing Tests

- Unit tests for domain logic and services
- Integration tests for component interactions
- E2E tests for user workflows

## Building and Deployment

### Local Build

```bash
# Build for production
bun build

# Preview production build locally
bun preview
```

### Production Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## Troubleshooting

### Common Issues

1. **Submodule Issues**:

   ```bash
   git submodule update --init --recursive
   ```

2. **Dependency Issues**:

   ```bash
   rm -rf node_modules bun.lockb
   bun install-all
   ```

3. **Build Errors**:

   ```bash
   cd src/presentation
   bun clean
   bun install
   bun build
   ```

4. **Port Conflicts**:
   ```bash
   # Kill processes on port 4321
   lsof -ti:4321 | xargs kill
   ```

### Getting Help

- Check the [main documentation](./README.md)
- Review the [architecture overview](./ARCHITECTURE_OVERVIEW.md)
- Open an issue on GitHub
- Check the existing [README.md](../README.md) for project-specific details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the guidelines
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

Thank you for contributing to the project!
