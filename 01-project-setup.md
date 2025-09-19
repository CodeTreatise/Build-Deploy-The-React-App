# Chapter 1: Project Setup & Development Environment 🛠️

## Overview

In this chapter, we'll set up a modern React development environment using industry-standard tools. We'll start from scratch and build a solid foundation that supports TypeScript, modern tooling, and best practices.

---

## 📋 Table of Contents

1. [Technology Stack Rationale](#technology-stack-rationale)
2. [Prerequisites & System Setup](#prerequisites--system-setup)
3. [Project Initialization with Vite](#project-initialization-with-vite)
4. [TypeScript Configuration](#typescript-configuration)
5. [ESLint & Prettier Setup](#eslint--prettier-setup)
6. [Git Configuration](#git-configuration)
7. [Development Scripts](#development-scripts)
8. [Folder Structure](#folder-structure)
9. [Environment Variables](#environment-variables)
10. [Verification & Testing](#verification--testing)

---

## Technology Stack Rationale

### Why Vite over Create React App?

**Create React App (CRA) was officially deprecated in February 2025.** Here's why Vite is the modern choice:

| Feature | Create React App | Vite |
|---------|------------------|------|
| **Build Speed** | Webpack (slow) | esbuild (10-100x faster) |
| **Dev Server** | Hot reload | Hot Module Replacement (instant) |
| **Bundle Size** | Larger bundles | Optimized, smaller bundles |
| **Maintenance** | Deprecated | Actively maintained |
| **Plugin Ecosystem** | Limited | Rich plugin ecosystem |
| **TypeScript** | Additional config | Built-in support |

### Industry Adoption

- **Vite**: Used by Vue.js, Svelte, and increasingly React projects
- **Backed by**: Evan You (Vue.js creator) and active community
- **Performance**: ~20x faster cold starts compared to Webpack

---

## Prerequisites & System Setup

### Required Software

1. **Node.js 18+ (LTS)**
   ```bash
   # Check your Node.js version
   node --version
   # Should return v18.x.x or higher
   
   # Check npm version
   npm --version
   # Should return 9.x.x or higher
   ```

2. **Git**
   ```bash
   git --version
   # Should return git version 2.x.x
   ```

3. **Code Editor** (VS Code recommended)
   - Install VS Code extensions:
     - ES7+ React/Redux/React-Native snippets
     - TypeScript Importer
     - Prettier - Code formatter
     - ESLint
     - Material Icon Theme

### Optional but Recommended

- **Node Version Manager (nvm)** for managing Node.js versions
- **Yarn** as an alternative to npm

---

## Project Initialization with Vite

### Step 1: Create New Vite Project

```bash
# Create a new React project with TypeScript template
npm create vite@latest task-manager-app -- --template react-ts

# Navigate to the project directory
cd task-manager-app

# Install dependencies
npm install
```

### Step 2: Understanding the Generated Structure

Vite creates this initial structure:

```
task-manager-app/
├── public/                 # Static assets
│   └── vite.svg
├── src/                   # Source code
│   ├── assets/           # Images, fonts, etc.
│   ├── App.css
│   ├── App.tsx           # Main App component
│   ├── index.css         # Global styles
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite type definitions
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # Node.js TypeScript config
└── vite.config.ts        # Vite configuration
```

### Step 3: Test the Initial Setup

```bash
# Start the development server
npm run dev

# Open browser to http://localhost:5173
# You should see the Vite + React welcome page
```

**🎉 Success Indicator**: You should see a page with Vite and React logos, a counter button, and hot reload working when you edit files.

---

## TypeScript Configuration

### Enhanced tsconfig.json

Replace the default `tsconfig.json` with enterprise-grade configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Enhanced type checking */
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    
    /* Path mapping for cleaner imports */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/store/*": ["src/store/*"],
      "@/services/*": ["src/services/*"],
      "@/assets/*": ["src/assets/*"]
    }
  },
  "include": [
    "src",
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

### Configure Vite for Path Mapping

Update `vite.config.ts` to support TypeScript path mapping:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    }
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  }
})
```

**Why Path Mapping?**
- **Cleaner imports**: `import Button from '@/components/Button'` instead of `../../components/Button`
- **Easier refactoring**: Moving files doesn't break import paths
- **Better IDE support**: IntelliSense works better with absolute paths

---

## ESLint & Prettier Setup

### Install ESLint and Prettier

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier
```

### ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "react-refresh",
    "@typescript-eslint",
    "jsx-a11y",
    "import",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {}
    }
  }
}
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": true
}
```

Create `.prettierignore`:

```
node_modules
dist
build
.next
.cache
package-lock.json
yarn.lock
public
```

### VSCode Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

**Why These Tools?**
- **ESLint**: Catches bugs, enforces code standards, improves code quality
- **Prettier**: Consistent code formatting across team
- **TypeScript**: Type safety prevents runtime errors
- **Import ordering**: Consistent import organization

---

## Git Configuration

### Initialize Git Repository

```bash
# Initialize git repository
git init

# Create .gitignore
```

Create `.gitignore`:

```gitignore
# Dependencies
node_modules
/.pnp
.pnp.js

# Production builds
/dist
/build

# Development
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
```

### Git Hooks with Husky

```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Initialize husky
npx husky init

# Create pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

**Benefits of Git Hooks:**
- **Automatic linting**: Fixes code issues before commits
- **Consistent formatting**: Ensures all committed code follows standards
- **Prevents bad commits**: Blocks commits with linting errors

---

## Development Scripts

Update `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

### Script Explanations

- **`dev`**: Starts development server with hot reload
- **`build`**: Creates production build with type checking
- **`lint`**: Checks for linting errors
- **`lint:fix`**: Automatically fixes linting errors
- **`format`**: Formats all code with Prettier
- **`type-check`**: Validates TypeScript without emitting files

---

## Folder Structure

Create the enterprise-grade folder structure:

```bash
# Create the folder structure
mkdir -p src/{components,pages,hooks,utils,types,store,services,assets}/{__tests__,}
mkdir -p src/components/{common,forms,layout,ui}
mkdir -p src/assets/{images,fonts,styles}
mkdir -p src/types/{api,components,store}
mkdir -p public/{images,icons}

# Create index files for better imports
touch src/components/index.ts
touch src/hooks/index.ts
touch src/utils/index.ts
touch src/types/index.ts
```

Final folder structure:

```
src/
├── assets/                 # Static assets
│   ├── images/            # Image files
│   ├── fonts/             # Font files
│   └── styles/            # Global styles
├── components/            # Reusable components
│   ├── common/           # Common components (Button, Input, etc.)
│   ├── forms/            # Form-specific components
│   ├── layout/           # Layout components (Header, Sidebar, etc.)
│   ├── ui/               # UI components
│   ├── __tests__/        # Component tests
│   └── index.ts          # Component exports
├── hooks/                # Custom React hooks
│   ├── __tests__/        # Hook tests
│   └── index.ts          # Hook exports
├── pages/                # Page components
│   └── __tests__/        # Page tests
├── services/             # API services
│   ├── __tests__/        # Service tests
│   └── index.ts          # Service exports
├── store/                # Redux store
│   ├── slices/          # Redux slices
│   └── index.ts         # Store configuration
├── types/                # TypeScript types
│   ├── api/             # API types
│   ├── components/      # Component types
│   ├── store/           # Store types
│   └── index.ts         # Type exports
├── utils/                # Utility functions
│   ├── __tests__/        # Utility tests
│   └── index.ts          # Utility exports
├── App.tsx               # Main App component
├── main.tsx              # Application entry point
└── vite-env.d.ts         # Vite type definitions
```

**Benefits of This Structure:**
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Team Collaboration**: Easy to understand and navigate
- **Testing**: Tests are co-located with source code

---

## Environment Variables

### Create Environment Files

```bash
# Create environment files
touch .env.local .env.example
```

`.env.example` (commit this to git):

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# External Services
VITE_SENTRY_DSN=
VITE_GOOGLE_ANALYTICS_ID=
```

`.env.local` (add to .gitignore):

```env
# Copy from .env.example and fill with actual values
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Environment Type Definitions

Create `src/types/env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: 'development' | 'production' | 'test'
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Environment Utility

Create `src/utils/env.ts`:

```typescript
/**
 * Environment configuration utilities
 * Provides type-safe access to environment variables
 */

export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Task Manager',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // External Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  
  // Helper methods
  isDevelopment: () => import.meta.env.DEV,
  isProduction: () => import.meta.env.PROD,
  isTest: () => import.meta.env.MODE === 'test',
} as const

// Type for environment configuration
export type Environment = typeof env

// Validate required environment variables
export const validateEnv = (): void => {
  const required = ['VITE_API_URL'] as const
  
  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}
```

**Why Environment Variables?**
- **Security**: Keep secrets out of source code
- **Flexibility**: Different configs for different environments
- **Deployment**: Easy to change configs without rebuilding

---

## Verification & Testing

### Test the Complete Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   ✅ Should start on http://localhost:3000

2. **Test TypeScript Compilation**
   ```bash
   npm run type-check
   ```
   ✅ Should show no TypeScript errors

3. **Test Linting**
   ```bash
   npm run lint
   ```
   ✅ Should show no linting errors

4. **Test Formatting**
   ```bash
   npm run format:check
   ```
   ✅ Should show all files are properly formatted

5. **Test Production Build**
   ```bash
   npm run build
   ```
   ✅ Should create optimized build in `dist/` folder

6. **Test Path Mapping**
   
   Update `src/App.tsx` to test path mapping:
   
   ```typescript
   import { useState } from 'react'
   
   import { env } from '@/utils/env'
   
   import reactLogo from '@/assets/react.svg'
   import viteLogo from '/vite.svg'
   import './App.css'
   
   function App() {
     const [count, setCount] = useState(0)
   
     return (
       <div className="App">
         <div>
           <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
             <img src={viteLogo} className="logo" alt="Vite logo" />
           </a>
           <a href="https://reactjs.org" target="_blank" rel="noreferrer">
             <img src={reactLogo} className="logo react" alt="React logo" />
           </a>
         </div>
         <h1>{env.APP_NAME}</h1>
         <div className="card">
           <button onClick={() => setCount(count => count + 1)}>
             count is {count}
           </button>
           <p>
             Edit <code>src/App.tsx</code> and save to test HMR
           </p>
         </div>
         <p className="read-the-docs">
           Environment: {env.APP_ENVIRONMENT} | Version: {env.APP_VERSION}
         </p>
       </div>
     )
   }
   
   export default App
   ```
   
   ✅ Should compile without errors and show environment variables

### Common Issues & Solutions

**Issue: TypeScript path mapping not working**
```bash
# Solution: Restart VS Code or TypeScript server
# In VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

**Issue: ESLint errors on path imports**
```bash
# Solution: Install import resolver
npm install --save-dev eslint-import-resolver-typescript
```

**Issue: Vite not recognizing environment variables**
```bash
# Solution: Ensure variables start with VITE_
# Restart development server after changing .env files
```

---

## Summary

🎉 **Congratulations!** You now have a modern React development environment with:

✅ **Vite**: Fast build tool with HMR  
✅ **TypeScript**: Type safety and better IDE support  
✅ **ESLint & Prettier**: Code quality and consistent formatting  
✅ **Path Mapping**: Clean import statements  
✅ **Git Hooks**: Automated code quality checks  
✅ **Environment Variables**: Secure configuration management  
✅ **Enterprise Structure**: Scalable folder organization  

### Next Steps

- **Chapter 2**: Material-UI integration and theming
- **Chapter 3**: React Router setup and navigation
- **Chapter 4**: Redux Toolkit for state management

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

---

**Previous**: [← Table of Contents](./README.md) | **Next**: [Chapter 2 - Material-UI Setup →](./02-material-ui-setup.md)