# Features Overview

This document outlines the main features of the Ahmet Çetinkaya personal website, their implementation details, and development considerations.

## Core Features

### 1. Desktop Interface

**Description**: Complete operating system-like desktop environment with window management, taskbar, and system interactions.

**Implementation**:

- Located in: `src/presentation/src/features/desktop/`
- Components: Taskbar, WindowManager, SystemTray, Clock
- Framework: Astro + SolidJS for reactive UI components
- Styling: TailwindCSS with custom OS-like design system

**Key Components**:

- `Taskbar.astro`: Bottom navigation bar with system icons
- `Clock.astro`: Real-time clock display
- WindowManager: Handles window creation, positioning, and z-index management

**Development Notes**:

- Uses CSS Grid and Flexbox for layout
- Implements drag-and-drop for window movement
- Maintains window state in SolidJS stores

### 2. Terminal System

**Description**: Functional command-line interface with multiple commands and filesystem navigation.

**Implementation**:

- Commands in: `src/core/application/features/system/commands/`
- Terminal UI: `src/presentation/src/features/desktop/components/Terminal/`
- Command Pattern: Each command implements `ICIProgram` interface

**Available Commands**:

- `help`: Display available commands
- `ls`: List directory contents
- `cd`: Change directory
- `cat`: Display file contents
- `clear`: Clear terminal screen
- `email`: Open email application
- `doom`: Launch Doom game
- `fastfetch`: System information display
- `terminal`: Open new terminal window

**Development**:

- Commands auto-discovered and registered
- Input parsing and argument handling
- Command output formatting and history

### 3. File Manager

**Description**: Graphical file browser with directory navigation and file operations.

**Implementation**:

- Location: `src/presentation/src/features/desktop/components/FileManager/`
- Filesystem: Virtual filesystem structure
- Integration: Works with terminal commands

**Features**:

- Directory browsing with visual representations
- File type icons and previews
- Context menus and file operations
- Integration with desktop environment

### 4. 3D Model Viewer

**Description**: Interactive 3D model display using Three.js for portfolio items and visual elements.

**Implementation**:

- 3D Components: `src/shared/components/ThreeDimensionalModel/`
- Models: `src/presentation/public/models/`
- Technology: Three.js with DRACO compression

**Key Features**:

- DRACO-compressed models for performance
- Interactive camera controls
- Lighting and material systems
- Loading states and error handling

**Model Types**:

- 3D representations of projects
- Interactive portfolio elements
- Visual assets and decorations

### 5. Portfolio Sections

**Description**: Professional portfolio showcasing projects, skills, and personal information.

**Implementation**:

- Pages: `src/presentation/src/pages/about-me/`
- Components: `src/presentation/src/features/portfolio/`
- Data: Domain models in `src/core/domain/models/`

**Sections**:

- **Bio**: Personal introduction and background
- **CV**: Resume and work experience
- **Tech**: Technical skills and technologies
- **Projects**: Showcase of work and achievements

## Interactive Features

### 1. Application Windows

**Description**: Window-based application system for different desktop applications.

**Applications**:

- **Email**: Email client interface
- **Doom**: Playable Doom game
- **Terminal**: Command-line interface
- **Welcome Wizard**: Onboarding and introduction

**Window Management**:

- Minimize, maximize, close functionality
- Window resizing and dragging
- Z-index layering and focus management
- Taskbar integration

### 2. System Tray

**Description**: System notification area with status indicators and quick actions.

**Features**:

- System status indicators
- Quick access to system functions
- Date and time display
- Network and connectivity status

### 3. Boot Sequence

**Description**: Realistic computer boot-up sequence with loading animations and system initialization.

**Implementation**:

- Boot page: `src/presentation/src/pages/_components/boot-page.astro`
- Loading states and progress indicators
- System initialization simulation

## Content Features

### 1. Multi-language Support

**Description**: Support for multiple languages (currently English and Turkish).

**Implementation**:

- Separate page routes: `/en/` and `/tr/`
- Language-specific content organization
- URL routing and language detection

### 2. Blog System

**Description**: Technical blog post publishing and management.

**Features**:

- Markdown-based blog posts
- Category organization
- Tag system
- RSS feed support
- SEO optimization

### 3. Contact Forms

**Description**: Interactive contact and communication features.

**Features**:

- Email contact form
- Social media integration
- Professional networking links

## Technical Features

### 1. Responsive Design

**Description**: Mobile-compatible design that adapts to different screen sizes.

**Implementation**:

- TailwindCSS responsive utilities
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layout systems

### 2. Performance Optimization

**Description**: Optimized loading and runtime performance.

**Techniques**:

- Code splitting and lazy loading
- Image optimization
- 3D model compression (DRACO)
- Minimal JavaScript bundles

### 3. Accessibility

**Description**: Web accessibility compliance and inclusive design.

**Features**:

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Development Features

### 1. Hot Module Replacement

**Description**: Live development with automatic reloading and state preservation.

**Implementation**:

- Vite development server
- SolidJS reactive updates
- Astro island architecture

### 2. Type Safety

**Description**: Full TypeScript implementation with strict typing.

**Features**:

- End-to-end TypeScript coverage
- Domain model typing
- API interface definitions
- Component prop validation

### 3. Testing Infrastructure

**Description**: Comprehensive testing setup for quality assurance.

**Types**:

- Unit tests for business logic
- Component integration tests
- E2E testing capabilities

## Feature Dependencies

```
Desktop Interface
├── Taskbar
├── WindowManager
├── System Tray
└── Applications
    ├── Terminal
    │   └── Commands
    ├── File Manager
    │   └── Filesystem Integration
    ├── Email Client
    └── Doom Game

Portfolio System
├── About Me Sections
├── Projects Showcase
├── Technical Skills
└── Resume/CV

3D System
├── Three.js Integration
├── Model Loading
├── DRACO Compression
└── Interactive Controls
```

---

This feature documentation serves as a guide for understanding the current capabilities and future development directions of the personal website project.
