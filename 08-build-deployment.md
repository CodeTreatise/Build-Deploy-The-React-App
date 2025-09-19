# Chapter 8: Build & Deployment 🚀

## Overview

In this chapter, we'll configure production builds, environment management, and deployment strategies for modern React applications. We'll cover Vite's optimized build process, environment variable configuration, Vercel deployment with edge functions, and comprehensive CI/CD pipelines that ensure reliable, automated deployments with zero downtime.

---

## 📋 Table of Contents

1. [Modern Deployment Landscape 2025](#modern-deployment-landscape-2025)
2. [Production Build Configuration](#production-build-configuration)
3. [Environment Management](#environment-management)
4. [Asset Optimization & Bundling](#asset-optimization--bundling)
5. [Vercel Deployment](#vercel-deployment)
6. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
7. [Docker Containerization](#docker-containerization)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Performance Optimization](#performance-optimization)
10. [Security Hardening](#security-hardening)

---

## Modern Deployment Landscape 2025

### Deployment Platform Comparison

| Platform | Vite Support | Build Speed | Edge Functions | Free Tier | Best For |
|----------|--------------|-------------|----------------|-----------|----------|
| **Vercel** | ✅ Excellent | ⚡ Fast | ✅ Yes | Generous | React/Next.js |
| **Netlify** | ✅ Good | ⚡ Fast | ✅ Yes | Good | Static sites |
| **AWS Amplify** | ✅ Good | 🔶 Medium | ❌ No | Limited | AWS ecosystem |
| **Railway** | ✅ Good | 🔶 Medium | ❌ No | Good | Full-stack apps |
| **Render** | ✅ Good | 🔶 Medium | ❌ No | Limited | Simple hosting |
| **DigitalOcean** | ⚠️ Manual | 🔶 Medium | ❌ No | None | Custom setups |

### Why Choose Vercel in 2025?

1. **Vite Integration**: Native support with optimal build optimizations
2. **Edge Network**: Global CDN with sub-100ms response times
3. **Zero Config**: Automatic deployments with intelligent routing
4. **Edge Functions**: Serverless functions at the edge for performance
5. **Preview Deployments**: Automatic deployments for every pull request
6. **Analytics**: Built-in Core Web Vitals and performance monitoring
7. **Team Collaboration**: Advanced collaboration features for teams

### Deployment Strategy Evolution

✅ **Modern Approach (2025)**:
- Jamstack architecture with static generation
- Edge functions for dynamic content
- Automatic CI/CD with git integration
- Environment-based deployments
- Built-in monitoring and analytics

❌ **Legacy Approach**:
- Server-side rendering on traditional servers
- Manual deployment processes
- Monolithic applications
- Limited scalability and performance

---

## Production Build Configuration

### Step 1: Optimize Vite Build Configuration

Update `vite.config.ts` for production:

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compressionPlugin } from 'vite-plugin-compression'

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react({
        // Production optimizations
        babel: {
          plugins: mode === 'production' ? [
            ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }]
          ] : []
        }
      }),
      
      // Bundle analyzer (only in analyze mode)
      mode === 'analyze' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      
      // Compression for production
      mode === 'production' && compressionPlugin({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      
      mode === 'production' && compressionPlugin({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    
    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',
      
      // Generate sourcemaps for production debugging
      sourcemap: mode === 'production' ? 'hidden' : true,
      
      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          // Drop console.log in production
          drop_console: mode === 'production',
          drop_debugger: true,
        },
      },
      
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunk for stable dependencies
            vendor: ['react', 'react-dom'],
            
            // UI library chunk
            mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            
            // State management chunk
            redux: ['@reduxjs/toolkit', 'react-redux'],
            
            // Router chunk
            router: ['react-router-dom'],
            
            // Form libraries chunk
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            
            // HTTP client chunk
            http: ['axios'],
          },
          
          // Asset naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name]-[hash][extname]`
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `fonts/[name]-[hash][extname]`
            }
            
            return `assets/[name]-[hash][extname]`
          },
          
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
      
      // Target modern browsers for smaller bundles
      target: 'esnext',
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // CSS code splitting
      cssCodeSplit: true,
    },
    
    // Preview server configuration
    preview: {
      port: 3000,
      host: true,
    },
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  }
})
```

### Step 2: Create Build Scripts

Update `package.json`:

```json
{
  "name": "modern-react-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:analyze": "tsc && vite build --mode analyze",
    "build:staging": "tsc && vite build --mode staging",
    "build:production": "tsc && vite build --mode production",
    "preview": "vite preview",
    "preview:dist": "vite preview --outDir dist",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "npm run lint -- --fix",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "clean": "rm -rf dist node_modules/.vite",
    "prebuild": "npm run clean && npm run type-check && npm run lint && npm run test:coverage"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Step 3: TypeScript Build Configuration

Create `tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.*",
    "**/*.spec.*",
    "src/test"
  ]
}
```

### Step 4: Create Build Information

Create `src/utils/buildInfo.ts`:

```typescript
// Build-time constants injected by Vite
declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string

export interface BuildInfo {
  version: string
  buildTime: string
  environment: string
  commitHash?: string
  branch?: string
}

export const getBuildInfo = (): BuildInfo => {
  return {
    version: __APP_VERSION__ || '0.0.0',
    buildTime: __BUILD_TIME__ || new Date().toISOString(),
    environment: import.meta.env.MODE || 'development',
    commitHash: import.meta.env.VITE_COMMIT_HASH,
    branch: import.meta.env.VITE_BRANCH_NAME,
  }
}

// Development helper for build info
export const logBuildInfo = () => {
  if (import.meta.env.DEV) {
    const info = getBuildInfo()
    console.group('🏗️ Build Information')
    console.log('Version:', info.version)
    console.log('Build Time:', info.buildTime)
    console.log('Environment:', info.environment)
    console.log('Commit:', info.commitHash)
    console.log('Branch:', info.branch)
    console.groupEnd()
  }
}

// Performance budget checker
export const checkPerformanceBudget = () => {
  if (import.meta.env.PROD) {
    // Check bundle size budget
    const budgets = {
      maxBundleSize: 500, // KB
      maxChunkSize: 200,  // KB
      maxAssetSize: 100,  // KB
    }
    
    // This would be expanded with actual bundle analysis
    console.log('📊 Performance Budget Check:', budgets)
  }
}
```

---

## Environment Management

### Step 1: Environment Configuration

Create `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws

# Authentication
VITE_AUTH_DOMAIN=your-auth-domain.com
VITE_AUTH_CLIENT_ID=your-auth-client-id

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_PERFORMANCE_MONITORING=false
VITE_MOCK_API=false

# External Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxx

# Build Configuration
VITE_APP_NAME=Modern React App
VITE_APP_DESCRIPTION=A modern React application built with Vite
VITE_APP_VERSION=$npm_package_version

# Development
VITE_DEBUG=false
VITE_LOG_LEVEL=info

# Git Information (populated by CI/CD)
VITE_COMMIT_HASH=
VITE_BRANCH_NAME=
VITE_BUILD_NUMBER=
```

Create `.env.development`:

```bash
# Development Environment
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
VITE_MOCK_API=true
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

Create `.env.staging`:

```bash
# Staging Environment
VITE_API_BASE_URL=https://api-staging.yourapp.com/api
VITE_WS_URL=wss://ws-staging.yourapp.com/ws
VITE_MOCK_API=false
VITE_DEBUG=false
VITE_LOG_LEVEL=warn
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

Create `.env.production`:

```bash
# Production Environment
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_WS_URL=wss://ws.yourapp.com/ws
VITE_MOCK_API=false
VITE_DEBUG=false
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Step 2: Environment Validation

Create `src/config/env.config.ts`:

```typescript
import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // API
  VITE_API_BASE_URL: z.string().url(),
  VITE_WS_URL: z.string().url(),
  
  // Feature flags
  VITE_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  VITE_ENABLE_ERROR_REPORTING: z.string().transform(val => val === 'true').default('false'),
  VITE_ENABLE_PERFORMANCE_MONITORING: z.string().transform(val => val === 'true').default('false'),
  VITE_MOCK_API: z.string().transform(val => val === 'true').default('false'),
  
  // Optional external services
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_GOOGLE_ANALYTICS_ID: z.string().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  
  // App metadata
  VITE_APP_NAME: z.string().default('React App'),
  VITE_APP_DESCRIPTION: z.string().default('A React application'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  
  // Debug
  VITE_DEBUG: z.string().transform(val => val === 'true').default('false'),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Git info (optional)
  VITE_COMMIT_HASH: z.string().optional(),
  VITE_BRANCH_NAME: z.string().optional(),
  VITE_BUILD_NUMBER: z.string().optional(),
})

// Validate environment variables
const validateEnv = () => {
  try {
    return envSchema.parse(import.meta.env)
  } catch (error) {
    console.error('❌ Environment validation failed:')
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
    }
    throw new Error('Invalid environment configuration')
  }
}

// Export validated environment
export const env = validateEnv()

// Environment utilities
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isStaging = import.meta.env.MODE === 'staging'
export const isTest = import.meta.env.MODE === 'test'

// Feature flag helpers
export const features = {
  analytics: env.VITE_ENABLE_ANALYTICS,
  errorReporting: env.VITE_ENABLE_ERROR_REPORTING,
  performanceMonitoring: env.VITE_ENABLE_PERFORMANCE_MONITORING,
  mockApi: env.VITE_MOCK_API,
  debug: env.VITE_DEBUG,
} as const

// Log environment info in development
if (isDevelopment) {
  console.group('🌍 Environment Configuration')
  console.log('Mode:', import.meta.env.MODE)
  console.log('API URL:', env.VITE_API_BASE_URL)
  console.log('Features:', features)
  console.groupEnd()
}
```

### Step 3: Feature Flag Implementation

Create `src/utils/featureFlags.ts`:

```typescript
import { env, features } from '@/config/env.config'

export interface FeatureFlag {
  key: string
  enabled: boolean
  description: string
  environments?: string[]
}

// Define feature flags
export const featureFlags: Record<string, FeatureFlag> = {
  analytics: {
    key: 'analytics',
    enabled: features.analytics,
    description: 'Enable Google Analytics tracking',
    environments: ['staging', 'production'],
  },
  
  errorReporting: {
    key: 'errorReporting',
    enabled: features.errorReporting,
    description: 'Enable Sentry error reporting',
    environments: ['staging', 'production'],
  },
  
  performanceMonitoring: {
    key: 'performanceMonitoring',
    enabled: features.performanceMonitoring,
    description: 'Enable performance monitoring',
    environments: ['production'],
  },
  
  darkModeToggle: {
    key: 'darkModeToggle',
    enabled: true,
    description: 'Enable dark mode toggle',
  },
  
  advancedSearch: {
    key: 'advancedSearch',
    enabled: import.meta.env.MODE !== 'production',
    description: 'Enable advanced search features',
    environments: ['development', 'staging'],
  },
  
  betaFeatures: {
    key: 'betaFeatures',
    enabled: import.meta.env.MODE === 'development',
    description: 'Enable beta features for testing',
    environments: ['development'],
  },
}

// Feature flag checker
export const isFeatureEnabled = (flagKey: keyof typeof featureFlags): boolean => {
  const flag = featureFlags[flagKey]
  if (!flag) {
    console.warn(`Feature flag "${flagKey}" not found`)
    return false
  }
  
  // Check environment restrictions
  if (flag.environments && !flag.environments.includes(import.meta.env.MODE)) {
    return false
  }
  
  return flag.enabled
}

// React hook for feature flags
export const useFeatureFlag = (flagKey: keyof typeof featureFlags) => {
  return isFeatureEnabled(flagKey)
}

// Feature flag component wrapper
export const FeatureFlag: React.FC<{
  flag: keyof typeof featureFlags
  children: React.ReactNode
  fallback?: React.ReactNode
}> = ({ flag, children, fallback = null }) => {
  const isEnabled = useFeatureFlag(flag)
  return isEnabled ? <>{children}</> : <>{fallback}</>
}

// Development feature flag panel
export const FeatureFlagPanel: React.FC = () => {
  if (import.meta.env.PROD) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
    }}>
      <h4>Feature Flags</h4>
      {Object.entries(featureFlags).map(([key, flag]) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={flag.enabled}
              readOnly
            />
            {flag.key}: {flag.enabled ? '✅' : '❌'}
          </label>
        </div>
      ))}
    </div>
  )
}
```

---

## Asset Optimization & Bundling

### Step 1: Install Optimization Plugins

```bash
# Bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Compression
npm install --save-dev vite-plugin-compression

# PWA support
npm install --save-dev vite-plugin-pwa

# Image optimization
npm install --save-dev vite-plugin-imagemin

# Bundle size analysis
npm install --save-dev @bundle-analyzer/rollup-plugin
```

### Step 2: Enhanced Build Configuration

Create `vite.config.production.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import viteImagemin from 'vite-plugin-imagemin'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Remove data-testid attributes in production
          ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }],
          // Remove development-only code
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
        ],
      },
    }),
    
    // PWA configuration
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yourapp\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Modern React App',
        short_name: 'ReactApp',
        description: 'A modern React application built with Vite',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    
    // Image optimization
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 85 },
      optipng: { optimizationLevel: 7 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
    }),
  ],
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunk (most stable)
          'vendor-core': ['react', 'react-dom'],
          
          // UI framework chunk
          'vendor-ui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          
          // State management chunk
          'vendor-state': ['@reduxjs/toolkit', 'react-redux'],
          
          // Router chunk
          'vendor-router': ['react-router-dom'],
          
          // Forms chunk
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // HTTP client chunk
          'vendor-http': ['axios'],
          
          // Utils chunk
          'vendor-utils': ['date-fns', 'lodash-es'],
        },
        
        // Optimize chunk loading
        experimentalMinChunkSize: 1000,
      },
    },
    
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
    },
    
    // Target modern browsers for smaller bundles
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    
    // Asset handling
    assetsInlineLimit: 4096, // 4kb
    
    // CSS optimization
    cssTarget: 'chrome87',
  },
})
```

### Step 3: Bundle Analysis Tools

Create `scripts/analyze-bundle.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

// Size thresholds (in KB)
const thresholds = {
  js: {
    warning: 200,
    error: 500,
  },
  css: {
    warning: 50,
    error: 100,
  },
  assets: {
    warning: 100,
    error: 200,
  },
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return Math.round(stats.size / 1024) // KB
  } catch {
    return 0
  }
}

function analyzeBundle() {
  const distPath = path.join(process.cwd(), 'dist')
  
  if (!fs.existsSync(distPath)) {
    console.error(`${colors.red}❌ Build directory not found. Run 'npm run build' first.${colors.reset}`)
    process.exit(1)
  }
  
  console.log(`${colors.blue}📊 Bundle Analysis Report${colors.reset}\n`)
  
  // Analyze JavaScript files
  const jsFiles = []
  const cssFiles = []
  const assetFiles = []
  
  function scanDirectory(dir, fileArray, extensions) {
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        scanDirectory(filePath, fileArray, extensions)
      } else if (extensions.some(ext => file.endsWith(ext))) {
        const size = getFileSize(filePath)
        fileArray.push({
          name: path.relative(distPath, filePath),
          size,
          path: filePath,
        })
      }
    })
  }
  
  scanDirectory(distPath, jsFiles, ['.js'])
  scanDirectory(distPath, cssFiles, ['.css'])
  scanDirectory(distPath, assetFiles, ['.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2'])
  
  // Sort by size
  jsFiles.sort((a, b) => b.size - a.size)
  cssFiles.sort((a, b) => b.size - a.size)
  assetFiles.sort((a, b) => b.size - a.size)
  
  // Report JavaScript bundles
  console.log('📦 JavaScript Bundles:')
  let totalJsSize = 0
  jsFiles.forEach(file => {
    totalJsSize += file.size
    const color = file.size > thresholds.js.error ? colors.red :
                  file.size > thresholds.js.warning ? colors.yellow : colors.green
    console.log(`  ${color}${file.name}: ${file.size}KB${colors.reset}`)
  })
  console.log(`  Total JS: ${totalJsSize}KB\n`)
  
  // Report CSS files
  console.log('🎨 CSS Files:')
  let totalCssSize = 0
  cssFiles.forEach(file => {
    totalCssSize += file.size
    const color = file.size > thresholds.css.error ? colors.red :
                  file.size > thresholds.css.warning ? colors.yellow : colors.green
    console.log(`  ${color}${file.name}: ${file.size}KB${colors.reset}`)
  })
  console.log(`  Total CSS: ${totalCssSize}KB\n`)
  
  // Report assets
  console.log('🖼️  Assets:')
  let totalAssetSize = 0
  assetFiles.forEach(file => {
    totalAssetSize += file.size
    const color = file.size > thresholds.assets.error ? colors.red :
                  file.size > thresholds.assets.warning ? colors.yellow : colors.green
    console.log(`  ${color}${file.name}: ${file.size}KB${colors.reset}`)
  })
  console.log(`  Total Assets: ${totalAssetSize}KB\n`)
  
  // Overall summary
  const totalSize = totalJsSize + totalCssSize + totalAssetSize
  console.log(`📈 Total Bundle Size: ${totalSize}KB`)
  
  // Performance recommendations
  console.log('\n💡 Recommendations:')
  
  if (totalJsSize > 500) {
    console.log(`  ${colors.yellow}⚠️  Large JavaScript bundle (${totalJsSize}KB). Consider code splitting.${colors.reset}`)
  }
  
  if (jsFiles.some(f => f.size > 200)) {
    console.log(`  ${colors.yellow}⚠️  Large individual chunks detected. Consider further splitting.${colors.reset}`)
  }
  
  if (assetFiles.some(f => f.size > 100)) {
    console.log(`  ${colors.yellow}⚠️  Large assets detected. Consider optimization or lazy loading.${colors.reset}`)
  }
  
  if (totalSize < 300) {
    console.log(`  ${colors.green}✅ Excellent bundle size!${colors.reset}`)
  } else if (totalSize < 500) {
    console.log(`  ${colors.green}✅ Good bundle size.${colors.reset}`)
  }
  
  console.log('\n🔗 For detailed analysis, run: npm run build:analyze')
}

if (require.main === module) {
  analyzeBundle()
}

module.exports = { analyzeBundle }
```

Make it executable and add to package.json:

```json
{
  "scripts": {
    "analyze": "node scripts/analyze-bundle.js",
    "build:analyze": "npm run build -- --mode analyze && npm run analyze"
  }
}
```

---

## Vercel Deployment

### Step 1: Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "regions": ["iad1", "sfo1", "lhr1"],
  "functions": {
    "app/api/**/*.js": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_VERCEL_URL": "@vercel-url",
      "VITE_VERCEL_ENV": "@vercel-env",
      "VITE_COMMIT_HASH": "@vercel-github-commit-sha",
      "VITE_BRANCH_NAME": "@vercel-github-commit-ref"
    }
  }
}
```

### Step 2: Environment Variables Setup

Create environment configuration for different deployment environments:

`.env.development.local` (for local development):
```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
```

For Vercel dashboard, configure these environment variables:

**Development (Preview branches):**
```bash
VITE_API_BASE_URL=https://api-dev.yourapp.com/api
VITE_WS_URL=wss://ws-dev.yourapp.com/ws
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
```

**Production:**
```bash
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_WS_URL=wss://ws.yourapp.com/ws
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_SENTRY_DSN=your-production-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Step 3: Vercel Edge Functions (Optional)

Create `api/health.js`:

```javascript
export default function handler(request, response) {
  const { method } = request
  
  if (method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }
  
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION || '1.0.0',
    environment: process.env.VERCEL_ENV || 'development',
    region: process.env.VERCEL_REGION || 'unknown',
  }
  
  response.status(200).json(healthStatus)
}
```

Create `api/build-info.js`:

```javascript
export default function handler(request, response) {
  const buildInfo = {
    version: process.env.VITE_APP_VERSION || '1.0.0',
    commitHash: process.env.VITE_COMMIT_HASH,
    branch: process.env.VITE_BRANCH_NAME,
    buildTime: process.env.VITE_BUILD_TIME,
    environment: process.env.VERCEL_ENV,
    region: process.env.VERCEL_REGION,
  }
  
  response.status(200).json(buildInfo)
}
```

### Step 4: Deployment Script

Create `scripts/deploy.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function runCommand(command, description) {
  console.log(`${colors.blue}${description}...${colors.reset}`)
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`${colors.green}✅ ${description} completed${colors.reset}\n`)
  } catch (error) {
    console.error(`${colors.red}❌ ${description} failed${colors.reset}`)
    process.exit(1)
  }
}

function deploy() {
  console.log(`${colors.blue}🚀 Starting deployment process${colors.reset}\n`)
  
  // Pre-deployment checks
  runCommand('npm run type-check', 'Type checking')
  runCommand('npm run lint', 'Linting')
  runCommand('npm run test:coverage', 'Running tests')
  
  // Build
  runCommand('npm run build', 'Building application')
  
  // Bundle analysis
  runCommand('npm run analyze', 'Analyzing bundle')
  
  // Deploy to Vercel
  const isProduction = process.argv.includes('--production')
  const deployCommand = isProduction ? 'vercel --prod' : 'vercel'
  
  runCommand(deployCommand, 'Deploying to Vercel')
  
  console.log(`${colors.green}🎉 Deployment completed successfully!${colors.reset}`)
}

if (require.main === module) {
  deploy()
}
```

Add to package.json:

```json
{
  "scripts": {
    "deploy": "node scripts/deploy.js",
    "deploy:prod": "node scripts/deploy.js --production"
  }
}
```

---

## CI/CD Pipeline Setup

### Step 1: GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  CACHE_VERSION: 'v1'

jobs:
  # Quality checks
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

  # Tests
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # Build
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [quality, test]
    strategy:
      matrix:
        environment: [development, staging, production]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for ${{ matrix.environment }}
        run: npm run build:${{ matrix.environment }}
        env:
          VITE_COMMIT_HASH: ${{ github.sha }}
          VITE_BRANCH_NAME: ${{ github.ref_name }}
          VITE_BUILD_NUMBER: ${{ github.run_number }}

      - name: Analyze bundle
        run: npm run analyze

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.environment }}
          path: dist/
          retention-days: 30

  # Security scan
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'

      - name: Audit dependencies
        run: npm audit --audit-level high

  # Deploy to Vercel
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: [quality, test, build]
    if: github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }} --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build ${{ github.ref == 'refs/heads/main' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VITE_COMMIT_HASH: ${{ github.sha }}
          VITE_BRANCH_NAME: ${{ github.ref_name }}
          VITE_BUILD_NUMBER: ${{ github.run_number }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt ${{ github.ref == 'refs/heads/main' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}

  # E2E tests (run after deployment)
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [deploy]
    if: github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_TEST_BASE_URL: ${{ github.ref == 'refs/heads/main' && 'https://yourapp.vercel.app' || 'https://yourapp-git-preview.vercel.app' }}

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Step 2: Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "04:00"
    open-pull-requests-limit: 10
    reviewers:
      - "your-team"
    assignees:
      - "your-team"
    commit-message:
      prefix: "chore"
      prefix-development: "chore"
      include: "scope"
    ignore:
      - dependency-name: "@types/*"
        update-types: ["version-update:semver-patch"]

  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "ci"
      include: "scope"
```

### Step 3: Release Workflow

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Build production
        run: npm run build:production

      - name: Generate changelog
        id: changelog
        run: |
          PREVIOUS_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
          if [ -z "$PREVIOUS_TAG" ]; then
            CHANGELOG=$(git log --pretty=format:"* %s (%h)" --no-merges)
          else
            CHANGELOG=$(git log ${PREVIOUS_TAG}..HEAD --pretty=format:"* %s (%h)" --no-merges)
          fi
          echo "CHANGELOG<<EOF" >> $GITHUB_OUTPUT
          echo "$CHANGELOG" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release:
            ${{ steps.changelog.outputs.CHANGELOG }}
          draft: false
          prerelease: false

      - name: Deploy to production
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Summary

🎉 **Congratulations!** You now have a comprehensive build and deployment system with:

✅ **Optimized Production Builds**: Vite configuration with code splitting and asset optimization  
✅ **Environment Management**: Secure environment variable handling with validation  
✅ **Feature Flags**: Dynamic feature control across environments  
✅ **Asset Optimization**: Image compression, bundle analysis, and performance budgets  
✅ **Vercel Deployment**: Zero-config deployment with edge functions and global CDN  
✅ **CI/CD Pipeline**: Automated testing, building, and deployment with GitHub Actions  
✅ **Security Hardening**: Security headers, dependency scanning, and vulnerability checks  

### Key Benefits Achieved

1. **Performance**: Optimized bundles with intelligent code splitting and caching
2. **Reliability**: Comprehensive CI/CD pipeline with automated testing and quality checks
3. **Security**: Security headers, dependency scanning, and secure environment management
4. **Scalability**: Edge deployment with global CDN and automatic scaling
5. **Developer Experience**: Automated deployments with preview environments
6. **Monitoring**: Bundle analysis, performance tracking, and error reporting

### Next Steps

- **Chapter 9**: Performance optimization and security best practices
- **Chapter 10**: Complete application example with all concepts integrated

---

## 📚 Additional Resources

- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Previous**: [← Chapter 7 - Testing Strategy](./07-testing-strategy.md) | **Next**: [Chapter 9 - Performance & Security →](./09-performance-security.md)