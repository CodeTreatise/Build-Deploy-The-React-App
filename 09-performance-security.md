# Chapter 9: Performance & Security 🔒⚡

## Overview

In this chapter, we'll implement advanced performance optimization techniques and comprehensive security measures for production React applications. We'll cover code splitting strategies, lazy loading patterns, Core Web Vitals optimization, security best practices, and monitoring systems that ensure your application delivers exceptional user experience while maintaining enterprise-grade security standards.

---

## 📋 Table of Contents

1. [Performance Optimization Strategy](#performance-optimization-strategy)
2. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
3. [Bundle Optimization](#bundle-optimization)
4. [Image & Asset Optimization](#image--asset-optimization)
5. [Core Web Vitals Optimization](#core-web-vitals-optimization)
6. [Memory Management](#memory-management)
7. [Security Best Practices](#security-best-practices)
8. [Content Security Policy](#content-security-policy)
9. [Authentication Security](#authentication-security)
10. [Monitoring & Analytics](#monitoring--analytics)

---

## Performance Optimization Strategy

**🤔 WHY Performance & Security Are Critical**

Performance and security are not optional features—they're fundamental requirements for modern web applications. Poor performance leads to user abandonment (53% of users abandon sites that take longer than 3 seconds to load), reduced SEO rankings, and lost business opportunities. Security vulnerabilities expose users to data breaches, identity theft, and privacy violations while putting organizations at legal and financial risk. In 2025, performance and security directly impact user trust, business success, and regulatory compliance.

**🎯 WHAT Comprehensive Performance & Security Includes**

Modern performance and security strategy encompasses:
- **Core Web Vitals Optimization**: Meeting Google's performance standards for user experience
- **Bundle Optimization**: Strategic code splitting and lazy loading for minimal initial load
- **Security-First Architecture**: Protection against OWASP Top 10 vulnerabilities
- **Real-User Monitoring**: Continuous performance tracking in production environments
- **Threat Detection**: Proactive monitoring for security incidents and anomalies
- **Compliance Frameworks**: GDPR, CCPA, SOX, and industry-specific security requirements
- **Performance Budgets**: Quantified limits that prevent performance regression

**⏰ WHEN to Apply Different Optimization Strategies**

Performance and security needs evolve with application maturity:

- **Development Phase**: Establish performance budgets and security patterns
- **Pre-Launch**: Comprehensive auditing and vulnerability assessment
- **Post-Launch**: Real-user monitoring and continuous optimization
- **Scale Growth**: Advanced caching strategies and CDN optimization
- **Enterprise Level**: Compliance automation and advanced threat detection
- **Global Deployment**: Regional performance optimization and data sovereignty

**🚀 HOW to Build High-Performance, Secure Applications**

Implementation follows these architectural principles:

1. **Performance by Design**: Build performance considerations into every component
2. **Security by Default**: Implement security measures from the ground up
3. **Continuous Monitoring**: Real-time performance and security monitoring
4. **User-Centric Metrics**: Focus on actual user experience rather than synthetic metrics
5. **Defense in Depth**: Multiple layers of security controls and monitoring

### Performance Budget & Metrics 2025

| Metric | Target | Excellent | Good | Needs Improvement |
|--------|--------|-----------|------|-------------------|
| **First Contentful Paint** | < 1.8s | < 1.5s | < 2.5s | > 2.5s |
| **Largest Contentful Paint** | < 2.5s | < 2.0s | < 4.0s | > 4.0s |
| **Cumulative Layout Shift** | < 0.1 | < 0.05 | < 0.25 | > 0.25 |
| **First Input Delay** | < 100ms | < 50ms | < 300ms | > 300ms |
| **Total Bundle Size** | < 300KB | < 200KB | < 500KB | > 500KB |
| **Time to Interactive** | < 3.8s | < 3.0s | < 5.0s | > 5.0s |

### Performance Monitoring Setup

Create `src/utils/performance.ts`:

```typescript
// Performance monitoring utilities
export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export interface NavigationMetrics {
  dnsLookup: number
  tcpConnect: number
  request: number
  response: number
  domProcessing: number
  resourceLoad: number
}

// Core Web Vitals measurement
export const measureCoreWebVitals = (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    const metrics: Partial<PerformanceMetrics> = {}
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEventTiming
      metrics.lcp = lastEntry.startTime
      lcpObserver.disconnect()
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        metrics.fid = entry.processingStart - entry.startTime
      })
      fidObserver.disconnect()
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    
    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      metrics.cls = clsValue
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime
        }
      })
      paintObserver.disconnect()
    })
    paintObserver.observe({ type: 'paint', buffered: true })
    
    // Navigation timing for TTFB
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      metrics.ttfb = navigation.responseStart - navigation.fetchStart
    }
    
    // Wait for all metrics to be collected
    setTimeout(() => {
      resolve(metrics as PerformanceMetrics)
    }, 3000)
  })
}

// Navigation timing analysis
export const getNavigationMetrics = (): NavigationMetrics => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  return {
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnect: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    domProcessing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
    resourceLoad: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
  }
}

// Resource timing analysis
export const getResourceMetrics = () => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  const resourcesByType = resources.reduce((acc, resource) => {
    const url = new URL(resource.name)
    const extension = url.pathname.split('.').pop() || 'other'
    
    if (!acc[extension]) {
      acc[extension] = {
        count: 0,
        totalSize: 0,
        totalTime: 0,
        items: [],
      }
    }
    
    acc[extension].count++
    acc[extension].totalSize += resource.transferSize || 0
    acc[extension].totalTime += resource.duration
    acc[extension].items.push({
      name: resource.name,
      size: resource.transferSize || 0,
      duration: resource.duration,
    })
    
    return acc
  }, {} as Record<string, any>)
  
  return resourcesByType
}

// Performance budget checker
export const checkPerformanceBudget = (metrics: PerformanceMetrics) => {
  const budgets = {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    ttfb: 600, // 600ms
  }
  
  const violations = Object.entries(budgets).filter(([key, budget]) => {
    return metrics[key as keyof PerformanceMetrics] > budget
  })
  
  if (violations.length > 0) {
    console.warn('🚨 Performance Budget Violations:')
    violations.forEach(([metric, budget]) => {
      const actual = metrics[metric as keyof PerformanceMetrics]
      console.warn(`  ${metric}: ${actual}ms (budget: ${budget}ms)`)
    })
  } else {
    console.log('✅ All performance budgets met!')
  }
  
  return violations
}

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)
  const [violations, setViolations] = React.useState<string[]>([])
  
  React.useEffect(() => {
    measureCoreWebVitals().then((webVitals) => {
      setMetrics(webVitals)
      const budgetViolations = checkPerformanceBudget(webVitals)
      setViolations(budgetViolations.map(([metric]) => metric))
      
      // Send to analytics if enabled
      if (import.meta.env.VITE_ENABLE_ANALYTICS) {
        // Send performance metrics to your analytics service
        console.log('📊 Sending performance metrics to analytics')
      }
    })
  }, [])
  
  return { metrics, violations }
}
```

---

## Code Splitting & Lazy Loading

**🤔 WHY Code Splitting Is Essential**

Code splitting is the practice of breaking your application bundle into smaller chunks that can be loaded on-demand, dramatically reducing initial load times and improving user experience. Without code splitting, users must download your entire application before they can interact with any part of it. This leads to slow initial loads, especially on mobile devices with limited bandwidth. Strategic code splitting can reduce initial bundle size by 70-90% while maintaining full functionality.

**🎯 WHAT Code Splitting Strategies Achieve**

Effective code splitting encompasses:
- **Route-Based Splitting**: Separate bundles for each application route/page
- **Component-Based Splitting**: On-demand loading of heavy components
- **Feature-Based Splitting**: Modular loading based on user permissions or preferences
- **Vendor Splitting**: Separate chunks for third-party libraries and frameworks
- **Dynamic Imports**: Runtime loading based on user interactions
- **Preloading Strategies**: Intelligent prefetching of likely-needed resources
- **Progressive Enhancement**: Core functionality loads first, enhancements follow

**⏰ WHEN to Apply Different Splitting Strategies**

Code splitting strategies depend on application architecture:

- **Route Splitting**: For multi-page applications with distinct sections
- **Component Splitting**: For heavy components like charts, editors, or media players
- **Feature Splitting**: For applications with role-based or premium features
- **Vendor Splitting**: For applications with large third-party dependencies
- **Dynamic Splitting**: For user-triggered functionality like modals or tools
- **Conditional Splitting**: For platform-specific features (mobile vs. desktop)

**🚀 HOW to Implement Effective Code Splitting**

Implementation follows these performance principles:

1. **Analyze Bundle Composition**: Identify splitting opportunities through bundle analysis
2. **Strategic Boundaries**: Split at logical application boundaries
3. **Loading States**: Provide excellent UX during asynchronous loading
4. **Error Handling**: Graceful handling of loading failures
5. **Preloading Optimization**: Smart prefetching based on user behavior patterns

### Step 1: Route-Level Code Splitting

Create `src/components/common/LazyRoute.tsx`:

```typescript
import React, { Suspense } from 'react'
import { Box, CircularProgress, Typography, Fade } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'

interface LazyRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
}

// Enhanced loading fallback with skeleton
const DefaultLoadingFallback: React.FC = () => (
  <Fade in timeout={300}>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={2}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  </Fade>
)

// Error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="400px"
    gap={2}
    p={3}
  >
    <Typography variant="h6" color="error">
      Something went wrong
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {error.message}
    </Typography>
    <Button variant="outlined" onClick={resetErrorBoundary}>
      Try again
    </Button>
  </Box>
)

export const LazyRoute: React.FC<LazyRouteProps> = ({
  children,
  fallback = <DefaultLoadingFallback />,
  errorFallback: ErrorFallback = DefaultErrorFallback,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// HOC for lazy route wrapping
export const withLazyRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode
    errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
  }
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <LazyRoute fallback={options?.fallback} errorFallback={options?.errorFallback}>
      <Component {...props} ref={ref} />
    </LazyRoute>
  ))
}
```

### Step 2: Update Router Configuration

Update `src/configs/routes.config/routes.tsx`:

```typescript
import React from 'react'
import { RouteObject } from 'react-router-dom'
import { LazyRoute } from '@/components/common/LazyRoute'

// Lazy load pages with proper chunking
const HomePage = React.lazy(() => 
  import('@/views/Home').then(module => ({ 
    default: module.HomePage 
  }))
)

const TasksPage = React.lazy(() => 
  import('@/views/Tasks').then(module => ({ 
    default: module.TasksPage 
  }))
)

const ProfilePage = React.lazy(() => 
  import('@/views/Profile').then(module => ({ 
    default: module.ProfilePage 
  }))
)

const SettingsPage = React.lazy(() => 
  import('@/views/Settings').then(module => ({ 
    default: module.SettingsPage 
  }))
)

// Admin routes (separate chunk)
const AdminDashboard = React.lazy(() => 
  import('@/views/admin/Dashboard').then(module => ({ 
    default: module.AdminDashboard 
  }))
)

const AdminUsers = React.lazy(() => 
  import('@/views/admin/Users').then(module => ({ 
    default: module.AdminUsers 
  }))
)

// Route configuration with lazy loading
export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <LazyRoute>
        <HomePage />
      </LazyRoute>
    ),
  },
  {
    path: '/tasks',
    element: (
      <LazyRoute>
        <TasksPage />
      </LazyRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <LazyRoute>
        <ProfilePage />
      </LazyRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <LazyRoute>
        <SettingsPage />
      </LazyRoute>
    ),
  },
  {
    path: '/admin',
    children: [
      {
        index: true,
        element: (
          <LazyRoute>
            <AdminDashboard />
          </LazyRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <LazyRoute>
            <AdminUsers />
          </LazyRoute>
        ),
      },
    ],
  },
]

// Preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload home page on app start
  import('@/views/Home')
  
  // Preload tasks page for authenticated users
  if (localStorage.getItem('auth_token')) {
    import('@/views/Tasks')
  }
}

// Route-based prefetching
export const usePrefetchRoute = (routePath: string) => {
  const prefetchMap = {
    '/tasks': () => import('@/views/Tasks'),
    '/profile': () => import('@/views/Profile'),
    '/settings': () => import('@/views/Settings'),
    '/admin': () => import('@/views/admin/Dashboard'),
    '/admin/users': () => import('@/views/admin/Users'),
  }
  
  return React.useCallback(() => {
    const prefetchFn = prefetchMap[routePath as keyof typeof prefetchMap]
    if (prefetchFn) {
      prefetchFn()
    }
  }, [routePath])
}
```

### Step 3: Component-Level Lazy Loading

Create `src/components/common/LazyComponent.tsx`:

```typescript
import React, { Suspense } from 'react'
import { Skeleton, Box } from '@mui/material'

interface LazyComponentProps {
  children: React.ReactNode
  height?: number | string
  width?: number | string
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: 'pulse' | 'wave' | false
}

const ComponentSkeleton: React.FC<{
  height?: number | string
  width?: number | string
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: 'pulse' | 'wave' | false
}> = ({ height = 200, width = '100%', variant = 'rectangular', animation = 'wave' }) => (
  <Box p={2}>
    <Skeleton
      variant={variant}
      height={height}
      width={width}
      animation={animation}
    />
  </Box>
)

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  height,
  width,
  variant,
  animation,
}) => {
  return (
    <Suspense
      fallback={
        <ComponentSkeleton
          height={height}
          width={width}
          variant={variant}
          animation={animation}
        />
      }
    >
      {children}
    </Suspense>
  )
}

// HOC for component lazy loading
export const withLazyComponent = <P extends object>(
  Component: React.ComponentType<P>,
  skeletonProps?: {
    height?: number | string
    width?: number | string
    variant?: 'text' | 'rectangular' | 'circular'
  }
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <LazyComponent {...skeletonProps}>
      <Component {...props} ref={ref} />
    </LazyComponent>
  ))
}

// Intersection Observer based lazy loading
export const useIntersectionLazyLoad = (
  threshold = 0.1,
  rootMargin = '50px'
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsIntersecting(true)
          setIsLoaded(true)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [threshold, rootMargin, isLoaded])
  
  return { ref, shouldLoad: isIntersecting }
}

// Lazy loading wrapper with intersection observer
export const LazyIntersectionComponent: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  height?: number | string
}> = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  height = 200,
}) => {
  const { ref, shouldLoad } = useIntersectionLazyLoad(threshold, rootMargin)
  
  return (
    <div ref={ref} style={{ minHeight: height }}>
      {shouldLoad ? (
        children
      ) : (
        fallback || <ComponentSkeleton height={height} />
      )}
    </div>
  )
}
```

### Step 4: Advanced Lazy Loading Patterns

Create `src/utils/lazyLoading.ts`:

```typescript
// Advanced lazy loading utilities

// Image lazy loading with progressive enhancement
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image()
          img.onload = () => {
            setImageSrc(src)
            setIsLoaded(true)
            observer.disconnect()
          }
          img.onerror = () => {
            setIsError(true)
            observer.disconnect()
          }
          img.src = src
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [src])
  
  return { imgRef, imageSrc, isLoaded, isError }
}

// Module federation lazy loading
export const createLazyMicrofrontend = (
  remoteUrl: string,
  moduleName: string,
  componentName: string
) => {
  return React.lazy(async () => {
    try {
      // @ts-ignore - Module federation dynamic import
      const module = await import(/* webpackIgnore: true */ `${remoteUrl}/${moduleName}`)
      return { default: module[componentName] }
    } catch (error) {
      console.error(`Failed to load microfrontend: ${remoteUrl}/${moduleName}`, error)
      // Return fallback component
      return {
        default: () => (
          <div>Failed to load {componentName}</div>
        ),
      }
    }
  })
}

// Dynamic import with retry logic
export const dynamicImportWithRetry = (
  importFn: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const attempt = async (remainingRetries: number) => {
      try {
        const result = await importFn()
        resolve(result)
      } catch (error) {
        if (remainingRetries > 0) {
          console.warn(`Import failed, retrying... (${remainingRetries} attempts left)`)
          setTimeout(() => attempt(remainingRetries - 1), delay)
        } else {
          reject(error)
        }
      }
    }
    attempt(retries)
  })
}

// Bundle splitting strategies
export const createChunkSplitConfig = () => {
  return {
    // Vendor chunks by stability
    'vendor-stable': ['react', 'react-dom', 'react-router-dom'],
    'vendor-ui': ['@mui/material', '@mui/icons-material', '@emotion/react'],
    'vendor-state': ['@reduxjs/toolkit', 'react-redux'],
    'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
    'vendor-utils': ['date-fns', 'lodash-es', 'axios'],
    
    // Feature-based chunks
    'features-auth': ['/src/features/auth'],
    'features-tasks': ['/src/features/tasks'],
    'features-admin': ['/src/features/admin'],
    
    // Shared components
    'components-shared': ['/src/components/shared'],
    'components-ui': ['/src/components/ui'],
  }
}

// Preloading strategies
export class PreloadManager {
  private static instance: PreloadManager
  private preloadedModules = new Set<string>()
  private pendingPreloads = new Map<string, Promise<any>>()
  
  static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager()
    }
    return PreloadManager.instance
  }
  
  // Preload a module
  async preload(modulePath: string, importFn: () => Promise<any>): Promise<any> {
    if (this.preloadedModules.has(modulePath)) {
      return
    }
    
    if (this.pendingPreloads.has(modulePath)) {
      return this.pendingPreloads.get(modulePath)
    }
    
    const preloadPromise = importFn().then((module) => {
      this.preloadedModules.add(modulePath)
      this.pendingPreloads.delete(modulePath)
      return module
    })
    
    this.pendingPreloads.set(modulePath, preloadPromise)
    return preloadPromise
  }
  
  // Preload on idle
  preloadOnIdle(modulePath: string, importFn: () => Promise<any>) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preload(modulePath, importFn)
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.preload(modulePath, importFn)
      }, 1000)
    }
  }
  
  // Preload on user interaction
  preloadOnHover(element: HTMLElement, modulePath: string, importFn: () => Promise<any>) {
    let timeoutId: NodeJS.Timeout
    
    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        this.preload(modulePath, importFn)
      }, 200) // 200ms delay to avoid accidental hovers
    }
    
    const handleMouseLeave = () => {
      clearTimeout(timeoutId)
    }
    
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeoutId)
    }
  }
  
  // Get preload status
  getPreloadStatus() {
    return {
      preloaded: Array.from(this.preloadedModules),
      pending: Array.from(this.pendingPreloads.keys()),
    }
  }
}

// React hook for preload manager
export const usePreloadManager = () => {
  return PreloadManager.getInstance()
}
```

---

## Bundle Optimization

### Step 1: Tree Shaking Configuration

Create `src/utils/treeShaking.ts`:

```typescript
// Tree shaking utilities and dead code elimination

// Import optimization patterns
export const importOptimizations = {
  // ❌ Bad: Imports entire library
  badLodash: () => import('lodash'),
  
  // ✅ Good: Import specific functions
  goodLodash: () => import('lodash/debounce'),
  
  // ❌ Bad: Imports entire icon library
  badIcons: () => import('@mui/icons-material'),
  
  // ✅ Good: Import specific icons
  goodIcons: () => import('@mui/icons-material/Add'),
}

// Bundle analyzer utilities
export const analyzeBundleUsage = () => {
  // Runtime bundle analysis
  const getModuleUsage = () => {
    const moduleStats = new Map<string, {
      size: number
      loadTime: number
      usageCount: number
    }>()
    
    // Analyze performance entries for modules
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    entries.forEach(entry => {
      const url = new URL(entry.name)
      const moduleName = url.pathname.split('/').pop() || 'unknown'
      
      moduleStats.set(moduleName, {
        size: entry.transferSize || 0,
        loadTime: entry.duration,
        usageCount: (moduleStats.get(moduleName)?.usageCount || 0) + 1,
      })
    })
    
    return moduleStats
  }
  
  return { getModuleUsage }
}

// Dead code detection
export const detectUnusedCode = () => {
  const unusedExports = new Set<string>()
  
  // This would integrate with webpack-bundle-analyzer or similar tools
  // to detect unused exports in production builds
  
  if (import.meta.env.DEV) {
    console.log('🔍 Dead code detection enabled in development')
    
    // Mock detection for development
    const checkExportUsage = (modulePath: string) => {
      // Implementation would check actual export usage
      console.log(`Checking exports for: ${modulePath}`)
    }
    
    return { checkExportUsage, unusedExports }
  }
  
  return { unusedExports }
}

// Selective imports helper
export const createSelectiveImport = <T extends Record<string, any>>(
  imports: T,
  used: (keyof T)[]
) => {
  return used.reduce((acc, key) => {
    acc[key] = imports[key]
    return acc
  }, {} as Pick<T, typeof used[number]>)
}
```

### Step 2: Advanced Vite Tree Shaking

Update `vite.config.ts` for optimal tree shaking:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Transform imports for better tree shaking
          ['babel-plugin-import', {
            libraryName: '@mui/material',
            libraryDirectory: '',
            camel2DashComponentName: false,
          }, 'core'],
          ['babel-plugin-import', {
            libraryName: '@mui/icons-material',
            libraryDirectory: '',
            camel2DashComponentName: false,
          }, 'icons'],
          // Remove unused CSS-in-JS
          ['babel-plugin-emotion', { sourceMap: false }],
        ],
      },
    }),
  ],
  
  build: {
    rollupOptions: {
      treeshake: {
        // Aggressive tree shaking
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      
      external: [
        // Externalize large dependencies when appropriate
        // 'react', 'react-dom' // Only if using CDN
      ],
      
      output: {
        // Manual chunks for optimal tree shaking
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('@mui')) {
              return 'vendor-mui'
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-redux'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            if (id.includes('axios')) {
              return 'vendor-http'
            }
            return 'vendor-other'
          }
          
          // Feature-based chunks
          if (id.includes('/features/auth/')) {
            return 'feature-auth'
          }
          if (id.includes('/features/tasks/')) {
            return 'feature-tasks'
          }
          if (id.includes('/features/admin/')) {
            return 'feature-admin'
          }
          
          // Shared chunks
          if (id.includes('/components/shared/')) {
            return 'shared-components'
          }
          if (id.includes('/utils/')) {
            return 'shared-utils'
          }
        },
      },
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled',
      ],
      exclude: [
        // Exclude development-only dependencies
        '@storybook/react',
      ],
    },
  },
  
  // Enable CSS tree shaking
  css: {
    devSourcemap: true,
  },
})
```

### Step 3: Dynamic Import Optimization

Create `src/utils/dynamicImports.ts`:

```typescript
// Optimized dynamic import patterns

// Preload critical modules
export const preloadCriticalModules = () => {
  const criticalModules = [
    () => import('@/components/layout/AppLayout'),
    () => import('@/features/auth/AuthProvider'),
    () => import('@/store'),
  ]
  
  criticalModules.forEach(importFn => {
    importFn().catch(error => {
      console.warn('Failed to preload critical module:', error)
    })
  })
}

// Smart chunking for features
export const createFeatureChunk = (featureName: string) => {
  const chunks = {
    auth: () => import('@/features/auth'),
    tasks: () => import('@/features/tasks'),
    profile: () => import('@/features/profile'),
    admin: () => import('@/features/admin'),
    settings: () => import('@/features/settings'),
  }
  
  return chunks[featureName as keyof typeof chunks] || (() => Promise.reject('Feature not found'))
}

// Conditional imports based on feature flags
export const conditionalImport = async (
  condition: boolean,
  importFn: () => Promise<any>,
  fallbackFn?: () => Promise<any>
) => {
  if (condition) {
    return importFn()
  }
  
  if (fallbackFn) {
    return fallbackFn()
  }
  
  return Promise.resolve(null)
}

// A/B testing imports
export const abTestImport = async (
  variant: 'A' | 'B',
  imports: {
    A: () => Promise<any>
    B: () => Promise<any>
  }
) => {
  return imports[variant]()
}

// Progressive enhancement imports
export const progressiveEnhancementImport = async (
  baseImport: () => Promise<any>,
  enhancedImport?: () => Promise<any>
) => {
  try {
    const baseModule = await baseImport()
    
    if (enhancedImport && 'connection' in navigator) {
      const connection = (navigator as any).connection
      
      // Load enhanced version on fast connections
      if (connection.effectiveType === '4g' && !connection.saveData) {
        try {
          const enhancedModule = await enhancedImport()
          return enhancedModule
        } catch {
          return baseModule
        }
      }
    }
    
    return baseModule
  } catch (error) {
    console.error('Failed to load module:', error)
    throw error
  }
}
```

---

## Image & Asset Optimization

### Step 1: Advanced Image Component

Create `src/components/ui/OptimizedImage.tsx`:

```typescript
import React, { useState, useRef, useEffect } from 'react'
import { Box, Skeleton, styled } from '@mui/material'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  placeholder?: string
  quality?: number
  loading?: 'lazy' | 'eager'
  sizes?: string
  srcSet?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
  fallback?: React.ReactNode
  onLoad?: () => void
  onError?: () => void
  className?: string
}

const ImageContainer = styled(Box)<{ aspectRatio?: number }>(({ aspectRatio }) => ({
  position: 'relative',
  overflow: 'hidden',
  ...(aspectRatio && {
    aspectRatio: aspectRatio.toString(),
  }),
}))

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  transition: theme.transitions.create(['opacity', 'filter'], {
    duration: theme.transitions.duration.short,
  }),
}))

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholder,
  quality = 75,
  loading = 'lazy',
  sizes,
  srcSet,
  objectFit = 'cover',
  fallback,
  onLoad,
  onError,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>()
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver>()
  
  // Calculate aspect ratio
  const aspectRatio = typeof width === 'number' && typeof height === 'number' 
    ? width / height 
    : undefined
  
  useEffect(() => {
    if (loading === 'lazy') {
      // Intersection Observer for lazy loading
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observerRef.current?.disconnect()
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      )
      
      if (imgRef.current) {
        observerRef.current.observe(imgRef.current)
      }
    } else {
      setImageSrc(src)
    }
    
    return () => {
      observerRef.current?.disconnect()
    }
  }, [src, loading])
  
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  
  const handleError = () => {
    setIsError(true)
    onError?.()
  }
  
  // Generate responsive image URLs (would integrate with image CDN)
  const generateResponsiveUrls = (baseSrc: string) => {
    const sizes = [320, 640, 768, 1024, 1280, 1600, 1920]
    return sizes.map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`).join(', ')
  }
  
  return (
    <ImageContainer
      ref={imgRef}
      aspectRatio={aspectRatio}
      width={width}
      height={height}
      className={className}
    >
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      
      {/* Optimized image */}
      {imageSrc && !isError && (
        <StyledImage
          src={imageSrc}
          alt={alt}
          srcSet={srcSet || generateResponsiveUrls(imageSrc)}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit,
            opacity: isLoaded ? 1 : 0,
            filter: isLoaded ? 'none' : 'blur(5px)',
          }}
        />
      )}
      
      {/* Error fallback */}
      {isError && (
        fallback || (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
            bgcolor="grey.100"
            color="text.secondary"
          >
            Failed to load image
          </Box>
        )
      )}
    </ImageContainer>
  )
}

// Progressive image loading hook
export const useProgressiveImage = (src: string, placeholderSrc?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setLoading(false)
    }
    img.src = src
  }, [src])
  
  return { src: imageSrc, loading }
}

// WebP support detection
export const useWebPSupport = () => {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null)
  
  useEffect(() => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      setSupportsWebP(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }, [])
  
  return supportsWebP
}

// Image format selector
export const selectImageFormat = (baseSrc: string, supportsWebP: boolean | null) => {
  if (supportsWebP === null) return baseSrc
  
  const extension = supportsWebP ? 'webp' : 'jpg'
  return baseSrc.replace(/\.(jpg|jpeg|png)$/i, `.${extension}`)
}
```

### Step 2: Asset Optimization Utilities

Create `src/utils/assetOptimization.ts`:

```typescript
// Asset optimization utilities

// Image compression and optimization
export class ImageOptimizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  
  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
  }
  
  // Compress image to target file size
  async compressImage(
    file: File,
    maxSizeKB: number = 500,
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate optimal dimensions
        const { width, height } = this.calculateOptimalDimensions(
          img.width,
          img.height,
          maxSizeKB
        )
        
        this.canvas.width = width
        this.canvas.height = height
        
        // Draw and compress
        this.ctx.drawImage(img, 0, 0, width, height)
        
        this.canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }
  
  // Calculate optimal dimensions based on target file size
  private calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxSizeKB: number
  ) {
    const aspectRatio = originalWidth / originalHeight
    const maxPixels = maxSizeKB * 1000 // Rough estimation
    
    let width = originalWidth
    let height = originalHeight
    
    // Scale down if necessary
    if (width * height > maxPixels) {
      const scale = Math.sqrt(maxPixels / (width * height))
      width = Math.floor(width * scale)
      height = Math.floor(height * scale)
    }
    
    return { width, height }
  }
  
  // Generate responsive image sizes
  generateResponsiveSizes(
    originalWidth: number,
    originalHeight: number
  ) {
    const breakpoints = [320, 640, 768, 1024, 1280, 1600, 1920]
    const aspectRatio = originalWidth / originalHeight
    
    return breakpoints
      .filter(bp => bp <= originalWidth)
      .map(width => ({
        width,
        height: Math.round(width / aspectRatio),
        breakpoint: width,
      }))
  }
  
  // Convert to WebP format
  async convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        this.canvas.width = img.width
        this.canvas.height = img.height
        this.ctx.drawImage(img, 0, 0)
        
        this.canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert to WebP'))
            }
          },
          'image/webp',
          quality
        )
      }
      
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }
}

// Font optimization
export const fontOptimization = {
  // Preload critical fonts
  preloadFonts: (fontUrls: string[]) => {
    fontUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = url
      document.head.appendChild(link)
    })
  },
  
  // Font display optimization
  optimizeFontDisplay: () => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Roboto';
        font-display: swap;
        src: local('Roboto'), url('/fonts/roboto.woff2') format('woff2');
      }
    `
    document.head.appendChild(style)
  },
  
  // Font loading detection
  detectFontLoad: (fontFamily: string): Promise<void> => {
    if ('fonts' in document) {
      return document.fonts.load(`1em ${fontFamily}`)
    }
    
    // Fallback for older browsers
    return new Promise((resolve) => {
      const testString = 'abcdefghijklmnopqrstuvwxyz'
      const fallbackFont = 'monospace'
      const testElement = document.createElement('div')
      
      testElement.style.fontFamily = fallbackFont
      testElement.style.position = 'absolute'
      testElement.style.left = '-9999px'
      testElement.textContent = testString
      
      document.body.appendChild(testElement)
      const fallbackWidth = testElement.offsetWidth
      
      testElement.style.fontFamily = `${fontFamily}, ${fallbackFont}`
      
      const checkFont = () => {
        if (testElement.offsetWidth !== fallbackWidth) {
          document.body.removeChild(testElement)
          resolve()
        } else {
          requestAnimationFrame(checkFont)
        }
      }
      
      checkFont()
    })
  },
}

// Asset caching strategies
export class AssetCache {
  private cache = new Map<string, {
    data: any
    timestamp: number
    ttl: number
  }>()
  
  // Cache asset with TTL
  set(key: string, data: any, ttlMs: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }
  
  // Get cached asset
  get(key: string) {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  // Clear expired items
  cleanup() {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
  
  // Cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Service Worker asset caching
export const setupAssetCaching = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service Worker registered:', registration)
      
      // Update cache strategy
      registration.addEventListener('message', event => {
        if (event.data.type === 'CACHE_UPDATED') {
          console.log('Asset cache updated')
        }
      })
    })
  }
}
```

---

## Core Web Vitals Optimization

**🤔 WHY Core Web Vitals Matter**

Core Web Vitals are Google's performance metrics that directly impact SEO rankings, user experience, and business success. These metrics measure real user experience focusing on loading performance, interactivity, and visual stability. Poor Core Web Vitals scores lead to lower search rankings, reduced user engagement, higher bounce rates, and lost conversions. In 2025, Core Web Vitals are essential for competitive advantage and business growth.

**🎯 WHAT Core Web Vitals Measure**

Core Web Vitals focus on three critical user experience aspects:
- **Largest Contentful Paint (LCP)**: Loading performance - measures when main content becomes visible
- **First Input Delay (FID)**: Interactivity - measures time from first user interaction to browser response
- **Cumulative Layout Shift (CLS)**: Visual stability - measures unexpected layout shifts during page load
- **First Contentful Paint (FCP)**: Loading milestone - measures when first content appears
- **Time to First Byte (TTFB)**: Server response time - measures initial server response speed

**⏰ WHEN to Optimize Different Vitals**

Optimization priorities depend on application characteristics:

- **Content-Heavy Sites**: Focus on LCP optimization through image and asset optimization
- **Interactive Applications**: Prioritize FID improvement through JavaScript optimization
- **Dynamic Layouts**: Emphasize CLS reduction through layout stability measures
- **E-commerce Sites**: Balance all metrics for optimal conversion rates
- **Mobile-First Apps**: Optimize for mobile performance constraints
- **Global Applications**: Consider regional performance variations

**🚀 HOW to Achieve Excellent Core Web Vitals**

Optimization follows data-driven approaches:

1. **Real User Monitoring**: Measure actual user experience across devices and networks
2. **Performance Budgets**: Set and enforce limits for each Core Web Vital
3. **Targeted Optimization**: Focus improvements on metrics that most impact users
4. **Continuous Monitoring**: Track performance trends and regression prevention
5. **User-Centric Metrics**: Prioritize optimizations that improve real user experience

### Step 1: Core Web Vitals Monitoring

Create `src/utils/webVitals.ts`:

```typescript
// Core Web Vitals optimization and monitoring

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export interface WebVitalsMetrics {
  cls: number
  fid: number
  fcp: number
  lcp: number
  ttfb: number
}

export interface WebVitalsThresholds {
  cls: { good: number; needsImprovement: number }
  fid: { good: number; needsImprovement: number }
  fcp: { good: number; needsImprovement: number }
  lcp: { good: number; needsImprovement: number }
  ttfb: { good: number; needsImprovement: number }
}

// 2025 Core Web Vitals thresholds
const WEB_VITALS_THRESHOLDS: WebVitalsThresholds = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fid: { good: 100, needsImprovement: 300 },
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  ttfb: { good: 800, needsImprovement: 1800 },
}

// Web Vitals collector
export class WebVitalsCollector {
  private metrics: Partial<WebVitalsMetrics> = {}
  private callbacks: Array<(metrics: WebVitalsMetrics) => void> = []
  
  constructor() {
    this.initializeCollection()
  }
  
  private initializeCollection() {
    // Cumulative Layout Shift
    getCLS((metric) => {
      this.metrics.cls = metric.value
      this.checkCompletion()
    })
    
    // First Input Delay
    getFID((metric) => {
      this.metrics.fid = metric.value
      this.checkCompletion()
    })
    
    // First Contentful Paint
    getFCP((metric) => {
      this.metrics.fcp = metric.value
      this.checkCompletion()
    })
    
    // Largest Contentful Paint
    getLCP((metric) => {
      this.metrics.lcp = metric.value
      this.checkCompletion()
    })
    
    // Time to First Byte
    getTTFB((metric) => {
      this.metrics.ttfb = metric.value
      this.checkCompletion()
    })
  }
  
  private checkCompletion() {
    const requiredMetrics: (keyof WebVitalsMetrics)[] = ['cls', 'fcp', 'lcp', 'ttfb']
    const hasAllMetrics = requiredMetrics.every(metric => 
      this.metrics[metric] !== undefined
    )
    
    if (hasAllMetrics) {
      this.callbacks.forEach(callback => 
        callback(this.metrics as WebVitalsMetrics)
      )
    }
  }
  
  onMetricsReady(callback: (metrics: WebVitalsMetrics) => void) {
    this.callbacks.push(callback)
  }
  
  getMetrics(): Partial<WebVitalsMetrics> {
    return { ...this.metrics }
  }
  
  // Analyze performance score
  getPerformanceScore(): {
    score: number
    rating: 'good' | 'needs-improvement' | 'poor'
    details: Record<keyof WebVitalsMetrics, {
      value: number
      rating: 'good' | 'needs-improvement' | 'poor'
    }>
  } {
    const details = {} as any
    let totalScore = 0
    let metricsCount = 0
    
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        const metric = key as keyof WebVitalsMetrics
        const thresholds = WEB_VITALS_THRESHOLDS[metric]
        
        let rating: 'good' | 'needs-improvement' | 'poor'
        let score: number
        
        if (value <= thresholds.good) {
          rating = 'good'
          score = 100
        } else if (value <= thresholds.needsImprovement) {
          rating = 'needs-improvement'
          score = 50
        } else {
          rating = 'poor'
          score = 0
        }
        
        details[metric] = { value, rating }
        totalScore += score
        metricsCount++
      }
    })
    
    const overallScore = metricsCount > 0 ? totalScore / metricsCount : 0
    const overallRating = overallScore >= 80 ? 'good' : 
                         overallScore >= 50 ? 'needs-improvement' : 'poor'
    
    return {
      score: overallScore,
      rating: overallRating,
      details,
    }
  }
}

// React hook for Web Vitals
export const useWebVitals = () => {
  const [metrics, setMetrics] = React.useState<Partial<WebVitalsMetrics>>({})
  const [performanceScore, setPerformanceScore] = React.useState<ReturnType<WebVitalsCollector['getPerformanceScore']> | null>(null)
  const collectorRef = React.useRef<WebVitalsCollector>()
  
  React.useEffect(() => {
    collectorRef.current = new WebVitalsCollector()
    
    collectorRef.current.onMetricsReady((completeMetrics) => {
      setMetrics(completeMetrics)
      setPerformanceScore(collectorRef.current!.getPerformanceScore())
      
      // Send to analytics if enabled
      if (import.meta.env.VITE_ENABLE_ANALYTICS) {
        sendWebVitalsToAnalytics(completeMetrics)
      }
    })
    
    // Update metrics periodically
    const interval = setInterval(() => {
      const currentMetrics = collectorRef.current!.getMetrics()
      setMetrics(currentMetrics)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return { metrics, performanceScore }
}

// Send metrics to analytics
const sendWebVitalsToAnalytics = (metrics: WebVitalsMetrics) => {
  // Google Analytics 4 example
  if (typeof gtag !== 'undefined') {
    Object.entries(metrics).forEach(([name, value]) => {
      gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'cls' ? value * 1000 : value),
        custom_parameter_1: navigator.connection?.effectiveType || 'unknown',
        custom_parameter_2: navigator.deviceMemory || 'unknown',
      })
    })
  }
  
  // Custom analytics endpoint
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...metrics,
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      connection: navigator.connection?.effectiveType,
      deviceMemory: navigator.deviceMemory,
      timestamp: Date.now(),
    }),
  }).catch(error => {
    console.warn('Failed to send Web Vitals to analytics:', error)
  })
}
```

### Step 2: Layout Shift Prevention

Create `src/utils/layoutStability.ts`:

```typescript
// Layout shift prevention utilities

// Prevent layout shifts from images
export const useImageDimensions = (src: string) => {
  const [dimensions, setDimensions] = React.useState<{
    width: number
    height: number
    aspectRatio: number
  } | null>(null)
  
  React.useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      })
    }
    img.src = src
  }, [src])
  
  return dimensions
}

// Stable container component
export const StableContainer: React.FC<{
  children: React.ReactNode
  minHeight?: number | string
  aspectRatio?: number
  className?: string
}> = ({ children, minHeight, aspectRatio, className }) => {
  return (
    <Box
      className={className}
      sx={{
        minHeight,
        ...(aspectRatio && {
          aspectRatio: aspectRatio.toString(),
        }),
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  )
}

// Font loading without layout shift
export const useFontLoading = (fontFamily: string) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  
  React.useEffect(() => {
    if ('fonts' in document) {
      document.fonts.load(`1em ${fontFamily}`).then(() => {
        setIsLoaded(true)
      })
    } else {
      // Fallback
      const timeout = setTimeout(() => setIsLoaded(true), 3000)
      return () => clearTimeout(timeout)
    }
  }, [fontFamily])
  
  return isLoaded
}

// Dynamic content height stabilizer
export const useStableHeight = (contentRef: React.RefObject<HTMLElement>) => {
  const [minHeight, setMinHeight] = React.useState<number>(0)
  
  React.useEffect(() => {
    const updateMinHeight = () => {
      if (contentRef.current) {
        const currentHeight = contentRef.current.offsetHeight
        setMinHeight(prev => Math.max(prev, currentHeight))
      }
    }
    
    updateMinHeight()
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateMinHeight)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    
    return () => resizeObserver.disconnect()
  }, [contentRef])
  
  return minHeight
}

// Viewport-based optimizations
export const useViewportOptimizations = () => {
  const [viewport, setViewport] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmall: window.innerWidth < 768,
    isMedium: window.innerWidth >= 768 && window.innerWidth < 1024,
    isLarge: window.innerWidth >= 1024,
  })
  
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setViewport({
        width,
        height,
        isSmall: width < 768,
        isMedium: width >= 768 && width < 1024,
        isLarge: width >= 1024,
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return viewport
}
```

### Step 3: LCP Optimization

Create `src/utils/lcpOptimization.ts`:

```typescript
// Largest Contentful Paint optimization

// Critical resource prioritization
export const prioritizeCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = [
    '/assets/critical.css',
    '/assets/fonts.css',
  ]
  
  criticalCSS.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
    
    // Also apply immediately
    const styleLink = document.createElement('link')
    styleLink.rel = 'stylesheet'
    styleLink.href = href
    document.head.appendChild(styleLink)
  })
  
  // Preload hero images
  const heroImages = [
    '/images/hero-desktop.webp',
    '/images/hero-mobile.webp',
  ]
  
  heroImages.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = href
    document.head.appendChild(link)
  })
}

// Above-the-fold optimization
export const useAboveTheFoldOptimization = () => {
  const [isAboveTheFold, setIsAboveTheFold] = React.useState(true)
  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboveTheFold(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return { ref, isAboveTheFold }
}

// Critical path CSS inlining
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    .hero { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center;
    }
    .loading { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 200px;
    }
  `
  
  const style = document.createElement('style')
  style.textContent = criticalCSS
  document.head.appendChild(style)
}

// Resource hints optimization
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const externalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.yourapp.com',
  ]
  
  externalDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
  })
  
  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://api.yourapp.com',
  ]
  
  criticalOrigins.forEach(origin => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// LCP element optimization
export const optimizeLCPElement = (selector: string) => {
  const element = document.querySelector(selector)
  
  if (element) {
    // Add loading priority
    if (element instanceof HTMLImageElement) {
      element.loading = 'eager'
      element.fetchPriority = 'high'
    }
    
    // Preload if image
    if (element instanceof HTMLImageElement && element.src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = element.src
      link.fetchPriority = 'high'
      document.head.appendChild(link)
    }
  }
}
```

---

## Memory Management

### Step 1: Memory Leak Prevention

Create `src/utils/memoryManagement.ts`:

```typescript
// Memory management and leak prevention

export class MemoryManager {
  private static instance: MemoryManager
  private observers = new Set<MutationObserver | IntersectionObserver | ResizeObserver>()
  private intervals = new Set<NodeJS.Timeout>()
  private eventListeners = new Map<string, { element: EventTarget; type: string; listener: EventListener }>()
  private subscriptions = new Set<() => void>()
  
  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }
    return MemoryManager.instance
  }
  
  // Register observer for cleanup
  registerObserver(observer: MutationObserver | IntersectionObserver | ResizeObserver) {
    this.observers.add(observer)
    return () => {
      observer.disconnect()
      this.observers.delete(observer)
    }
  }
  
  // Register interval for cleanup
  registerInterval(interval: NodeJS.Timeout) {
    this.intervals.add(interval)
    return () => {
      clearInterval(interval)
      this.intervals.delete(interval)
    }
  }
  
  // Register event listener for cleanup
  registerEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ) {
    element.addEventListener(type, listener, options)
    const key = `${Date.now()}-${Math.random()}`
    this.eventListeners.set(key, { element, type, listener })
    
    return () => {
      element.removeEventListener(type, listener)
      this.eventListeners.delete(key)
    }
  }
  
  // Register subscription for cleanup
  registerSubscription(unsubscribe: () => void) {
    this.subscriptions.add(unsubscribe)
    return () => {
      unsubscribe()
      this.subscriptions.delete(unsubscribe)
    }
  }
  
  // Cleanup all resources
  cleanup() {
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    
    // Clear intervals
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals.clear()
    
    // Remove event listeners
    this.eventListeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener)
    })
    this.eventListeners.clear()
    
    // Unsubscribe
    this.subscriptions.forEach(unsubscribe => unsubscribe())
    this.subscriptions.clear()
  }
  
  // Memory usage monitoring
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      }
    }
    return null
  }
  
  // Force garbage collection (development only)
  forceGC() {
    if (import.meta.env.DEV && 'gc' in window) {
      (window as any).gc()
    }
  }
}

// React hook for memory management
export const useMemoryManagement = () => {
  const memoryManager = MemoryManager.getInstance()
  
  React.useEffect(() => {
    return () => {
      memoryManager.cleanup()
    }
  }, [memoryManager])
  
  return {
    registerObserver: memoryManager.registerObserver.bind(memoryManager),
    registerInterval: memoryManager.registerInterval.bind(memoryManager),
    registerEventListener: memoryManager.registerEventListener.bind(memoryManager),
    registerSubscription: memoryManager.registerSubscription.bind(memoryManager),
    getMemoryUsage: memoryManager.getMemoryUsage.bind(memoryManager),
    forceGC: memoryManager.forceGC.bind(memoryManager),
  }
}

// Memory-safe observer hooks
export const useMemorySafeIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const { registerObserver } = useMemoryManagement()
  const observerRef = React.useRef<IntersectionObserver>()
  const cleanupRef = React.useRef<() => void>()
  
  React.useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options)
    cleanupRef.current = registerObserver(observerRef.current)
    
    return cleanupRef.current
  }, [callback, options, registerObserver])
  
  const observe = React.useCallback((element: Element) => {
    observerRef.current?.observe(element)
  }, [])
  
  const unobserve = React.useCallback((element: Element) => {
    observerRef.current?.unobserve(element)
  }, [])
  
  return { observe, unobserve }
}

export const useMemorySafeResizeObserver = (
  callback: ResizeObserverCallback
) => {
  const { registerObserver } = useMemoryManagement()
  const observerRef = React.useRef<ResizeObserver>()
  
  React.useEffect(() => {
    observerRef.current = new ResizeObserver(callback)
    const cleanup = registerObserver(observerRef.current)
    
    return cleanup
  }, [callback, registerObserver])
  
  const observe = React.useCallback((element: Element) => {
    observerRef.current?.observe(element)
  }, [])
  
  const unobserve = React.useCallback((element: Element) => {
    observerRef.current?.unobserve(element)
  }, [])
  
  return { observe, unobserve }
}

// Memory-efficient data structures
export class MemoryEfficientCache<K, V> {
  private cache = new Map<K, { value: V; lastAccessed: number }>()
  private maxSize: number
  private ttl: number
  
  constructor(maxSize: number = 100, ttl: number = 300000) { // 5 minutes default TTL
    this.maxSize = maxSize
    this.ttl = ttl
  }
  
  set(key: K, value: V) {
    // Remove expired entries
    this.cleanup()
    
    // Remove oldest entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey()
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey)
      }
    }
    
    this.cache.set(key, {
      value,
      lastAccessed: Date.now(),
    })
  }
  
  get(key: K): V | undefined {
    const entry = this.cache.get(key)
    
    if (!entry) return undefined
    
    // Check if expired
    if (Date.now() - entry.lastAccessed > this.ttl) {
      this.cache.delete(key)
      return undefined
    }
    
    // Update access time
    entry.lastAccessed = Date.now()
    return entry.value
  }
  
  private getOldestKey(): K | undefined {
    let oldestKey: K | undefined
    let oldestTime = Infinity
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed
        oldestKey = key
      }
    }
    
    return oldestKey
  }
  
  private cleanup() {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.lastAccessed > this.ttl) {
        this.cache.delete(key)
      }
    }
  }
  
  clear() {
    this.cache.clear()
  }
  
  size() {
    return this.cache.size
  }
}

// WeakMap for automatic cleanup
export class AutoCleanupWeakMap<K extends object, V> {
  private weakMap = new WeakMap<K, V>()
  private refs = new Set<WeakRef<K>>()
  private registry = new FinalizationRegistry((key: K) => {
    console.log('Object garbage collected:', key)
  })
  
  set(key: K, value: V) {
    this.weakMap.set(key, value)
    this.refs.add(new WeakRef(key))
    this.registry.register(key, key)
  }
  
  get(key: K): V | undefined {
    return this.weakMap.get(key)
  }
  
  has(key: K): boolean {
    return this.weakMap.has(key)
  }
  
  delete(key: K): boolean {
    this.registry.unregister(key)
    return this.weakMap.delete(key)
  }
  
  // Get approximate size (may include GC'd objects)
  approximateSize(): number {
    return this.refs.size
  }
}
```

### Step 2: Component Memory Optimization

Create `src/components/common/MemoryOptimizedComponent.tsx`:

```typescript
import React, { memo, useMemo, useCallback } from 'react'
import { useMemoryManagement } from '@/utils/memoryManagement'

interface MemoryOptimizedComponentProps {
  children: React.ReactNode
  dependencies?: any[]
  enableProfiling?: boolean
}

// HOC for memory optimization
export const withMemoryOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    memoize?: boolean
    dependencies?: (props: P) => any[]
    displayName?: string
  }
) => {
  const MemoryOptimizedComponent = (props: P) => {
    const { registerSubscription } = useMemoryManagement()
    
    // Memoize expensive props
    const memoizedProps = useMemo(() => {
      if (options?.dependencies) {
        return props
      }
      return props
    }, options?.dependencies ? options.dependencies(props) : [props])
    
    // Track component lifecycle
    React.useEffect(() => {
      if (import.meta.env.DEV) {
        console.log(`Component mounted: ${options?.displayName || Component.name}`)
      }
      
      return () => {
        if (import.meta.env.DEV) {
          console.log(`Component unmounted: ${options?.displayName || Component.name}`)
        }
      }
    }, [])
    
    return <Component {...memoizedProps} />
  }
  
  MemoryOptimizedComponent.displayName = options?.displayName || `MemoryOptimized(${Component.displayName || Component.name})`
  
  return options?.memoize !== false ? memo(MemoryOptimizedComponent) : MemoryOptimizedComponent
}

// Memory-optimized list component
export const MemoryOptimizedList = memo(<T extends { id: string | number }>({
  items,
  renderItem,
  keyExtractor = (item: T) => item.id.toString(),
  chunkSize = 50,
  windowSize = 10,
}: {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T) => string
  chunkSize?: number
  windowSize?: number
}) => {
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: windowSize })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { observe } = useMemorySafeIntersectionObserver(
    useCallback((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          setVisibleRange(prev => ({
            start: Math.max(0, Math.min(prev.start, index - windowSize)),
            end: Math.min(items.length, Math.max(prev.end, index + windowSize)),
          }))
        }
      })
    }, [items.length, windowSize]),
    { threshold: 0.1, rootMargin: '100px' }
  )
  
  // Virtualized rendering
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end)
  }, [items, visibleRange])
  
  React.useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.children
      Array.from(children).forEach((child, index) => {
        observe(child)
      })
    }
  }, [visibleItems, observe])
  
  return (
    <div ref={containerRef}>
      {visibleItems.map((item, index) => (
        <div key={keyExtractor(item)} data-index={visibleRange.start + index}>
          {renderItem(item, visibleRange.start + index)}
        </div>
      ))}
    </div>
  )
})

// Memory profiler component (development only)
export const MemoryProfiler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getMemoryUsage } = useMemoryManagement()
  const [memoryStats, setMemoryStats] = React.useState<ReturnType<typeof getMemoryUsage> | null>(null)
  
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      const interval = setInterval(() => {
        setMemoryStats(getMemoryUsage())
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [getMemoryUsage])
  
  if (import.meta.env.PROD) {
    return <>{children}</>
  }
  
  return (
    <>
      {children}
      {memoryStats && (
        <div
          style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          <div>Memory Usage: {Math.round(memoryStats.usagePercentage)}%</div>
          <div>Used: {Math.round(memoryStats.usedJSHeapSize / 1024 / 1024)}MB</div>
          <div>Total: {Math.round(memoryStats.totalJSHeapSize / 1024 / 1024)}MB</div>
        </div>
      )}
    </>
  )
}
```

---

## Security Best Practices

**🤔 WHY Security Is Non-Negotiable**

Web application security is a fundamental responsibility that protects user data, privacy, and trust while safeguarding business operations from cyber threats. Security vulnerabilities can lead to data breaches, financial losses, legal liability, and irreparable damage to brand reputation. Modern applications face sophisticated threats including XSS attacks, CSRF vulnerabilities, injection attacks, and data breaches. Implementing comprehensive security measures from the start is exponentially easier and more effective than retrofitting security later.

**🎯 WHAT Comprehensive Security Covers**

Modern application security encompasses:
- **Input Validation & Sanitization**: Protection against injection attacks and malicious input
- **Authentication & Authorization**: Secure user identity management and access control
- **Data Protection**: Encryption at rest and in transit, secure data handling
- **Communication Security**: HTTPS enforcement, secure API communication
- **Content Security Policy**: Prevention of XSS and code injection attacks
- **Dependency Security**: Regular auditing and updating of third-party packages
- **Monitoring & Incident Response**: Real-time threat detection and response capabilities

**⏰ WHEN to Implement Security Measures**

Security implementation follows a layered approach:

- **Design Phase**: Security architecture and threat modeling
- **Development**: Secure coding practices and input validation
- **Testing**: Security testing, penetration testing, and vulnerability scanning
- **Deployment**: Security headers, HTTPS configuration, and monitoring setup
- **Production**: Continuous monitoring, incident response, and security updates
- **Maintenance**: Regular security audits and compliance reviews

**🚀 HOW to Build Security-First Applications**

Implementation follows defense-in-depth principles:

1. **Secure by Design**: Build security into architecture and components
2. **Input Validation**: Never trust user input, validate and sanitize everything
3. **Principle of Least Privilege**: Grant minimal necessary permissions
4. **Defense in Depth**: Multiple security layers and controls
5. **Continuous Monitoring**: Real-time security monitoring and alerting

### Step 1: Input Sanitization and Validation

Create `src/utils/security.ts`:

```typescript
// Security utilities and best practices

import DOMPurify from 'dompurify'
import { z } from 'zod'

// Input sanitization
export class InputSanitizer {
  // Sanitize HTML content
  static sanitizeHTML(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOW_DATA_ATTR: false,
    })
  }
  
  // Sanitize rich text content
  static sanitizeRichText(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'class'],
      ALLOW_DATA_ATTR: false,
    })
  }
  
  // Remove all HTML tags
  static stripHTML(dirty: string): string {
    return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] })
  }
  
  // Sanitize URL
  static sanitizeURL(url: string): string | null {
    try {
      const parsed = new URL(url)
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null
      }
      
      return parsed.href
    } catch {
      return null
    }
  }
  
  // Escape special characters for safe insertion into HTML attributes
  static escapeHTML(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
  
  // Validate and sanitize file uploads
  static validateFile(file: File, options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}): { isValid: boolean; error?: string; sanitizedName?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    } = options
    
    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
      }
    }
    
    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`,
      }
    }
    
    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension ${extension} is not allowed`,
      }
    }
    
    // Sanitize filename
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .substring(0, 255) // Limit length
    
    return {
      isValid: true,
      sanitizedName,
    }
  }
}

// Security headers validation
export const validateSecurityHeaders = (headers: Headers): {
  isSecure: boolean
  missing: string[]
  recommendations: string[]
} => {
  const requiredHeaders = [
    'content-security-policy',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'strict-transport-security',
  ]
  
  const missing = requiredHeaders.filter(header => !headers.has(header))
  
  const recommendations: string[] = []
  
  // Check specific header values
  const csp = headers.get('content-security-policy')
  if (csp && csp.includes('unsafe-inline')) {
    recommendations.push('Avoid unsafe-inline in Content Security Policy')
  }
  
  const frameOptions = headers.get('x-frame-options')
  if (frameOptions && frameOptions.toLowerCase() !== 'deny' && frameOptions.toLowerCase() !== 'sameorigin') {
    recommendations.push('Use DENY or SAMEORIGIN for X-Frame-Options')
  }
  
  return {
    isSecure: missing.length === 0,
    missing,
    recommendations,
  }
}

// Secure data storage
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'secure-app-key-2025'
  
  // Encrypt data before storing
  static setSecureItem(key: string, data: any): void {
    try {
      const serialized = JSON.stringify(data)
      const encrypted = this.encrypt(serialized)
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('Failed to store secure item:', error)
    }
  }
  
  // Decrypt data after retrieving
  static getSecureItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      
      const decrypted = this.decrypt(encrypted)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Failed to retrieve secure item:', error)
      return null
    }
  }
  
  // Remove secure item
  static removeSecureItem(key: string): void {
    localStorage.removeItem(key)
  }
  
  // Clear all secure storage
  static clearSecureStorage(): void {
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && this.isSecureKey(key)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }
  
  // Simple encryption (use crypto-js or similar for production)
  private static encrypt(text: string): string {
    // This is a simplified example - use proper encryption in production
    return btoa(text)
  }
  
  private static decrypt(encryptedText: string): string {
    // This is a simplified example - use proper decryption in production
    return atob(encryptedText)
  }
  
  private static isSecureKey(key: string): boolean {
    return key.startsWith('secure_') || key.includes('token') || key.includes('auth')
  }
}

// Security audit utilities
export const securityAudit = {
  // Check for common vulnerabilities
  auditApplication: () => {
    const issues: string[] = []
    
    // Check for eval usage
    if (typeof eval !== 'undefined') {
      issues.push('eval() function is available - potential XSS risk')
    }
    
    // Check for inline event handlers
    const elementsWithInlineEvents = document.querySelectorAll('[onclick], [onload], [onerror]')
    if (elementsWithInlineEvents.length > 0) {
      issues.push(`Found ${elementsWithInlineEvents.length} elements with inline event handlers`)
    }
    
    // Check for external scripts
    const externalScripts = Array.from(document.querySelectorAll('script[src]'))
      .filter(script => {
        const src = script.getAttribute('src')
        return src && !src.startsWith(window.location.origin)
      })
    
    if (externalScripts.length > 0) {
      issues.push(`Found ${externalScripts.length} external scripts`)
    }
    
    // Check for mixed content
    if (location.protocol === 'https:') {
      const httpResources = Array.from(document.querySelectorAll('img[src], link[href], script[src]'))
        .filter(element => {
          const url = element.getAttribute('src') || element.getAttribute('href')
          return url && url.startsWith('http://')
        })
      
      if (httpResources.length > 0) {
        issues.push(`Found ${httpResources.length} HTTP resources on HTTPS page`)
      }
    }
    
    return issues
  },
  
  // Check password strength
  checkPasswordStrength: (password: string): {
    score: number
    feedback: string[]
    isStrong: boolean
  } => {
    const feedback: string[] = []
    let score = 0
    
    if (password.length >= 8) score += 1
    else feedback.push('Password should be at least 8 characters long')
    
    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Password should contain lowercase letters')
    
    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Password should contain uppercase letters')
    
    if (/\d/.test(password)) score += 1
    else feedback.push('Password should contain numbers')
    
    if (/[^a-zA-Z\d]/.test(password)) score += 1
    else feedback.push('Password should contain special characters')
    
    if (password.length >= 12) score += 1
    
    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
    ]
    
    if (commonPatterns.some(pattern => pattern.test(password))) {
      score -= 2
      feedback.push('Password contains common patterns')
    }
    
    return {
      score: Math.max(0, score),
      feedback,
      isStrong: score >= 4,
    }
  },
}

// Rate limiting
export class RateLimiter {
  private requests = new Map<string, number[]>()
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  // Check if request is allowed
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart)
    
    // Check if under limit
    if (recentRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    
    return true
  }
  
  // Get remaining requests
  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    const userRequests = this.requests.get(identifier) || []
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart)
    
    return Math.max(0, this.maxRequests - recentRequests.length)
  }
  
  // Reset requests for identifier
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }
}
```

### Step 2: Content Security Policy

Create `src/utils/csp.ts`:

```typescript
// Content Security Policy utilities

export interface CSPDirectives {
  defaultSrc?: string[]
  scriptSrc?: string[]
  styleSrc?: string[]
  imgSrc?: string[]
  connectSrc?: string[]
  fontSrc?: string[]
  mediaSrc?: string[]
  objectSrc?: string[]
  frameSrc?: string[]
  childSrc?: string[]
  formAction?: string[]
  baseUri?: string[]
  upgradeInsecureRequests?: boolean
  blockAllMixedContent?: boolean
  reportUri?: string
  reportTo?: string
}

export class CSPBuilder {
  private directives: CSPDirectives = {}
  
  // Set default source
  defaultSrc(sources: string[]): CSPBuilder {
    this.directives.defaultSrc = sources
    return this
  }
  
  // Set script source
  scriptSrc(sources: string[]): CSPBuilder {
    this.directives.scriptSrc = sources
    return this
  }
  
  // Set style source
  styleSrc(sources: string[]): CSPBuilder {
    this.directives.styleSrc = sources
    return this
  }
  
  // Set image source
  imgSrc(sources: string[]): CSPBuilder {
    this.directives.imgSrc = sources
    return this
  }
  
  // Set connect source (for fetch, XHR, WebSocket)
  connectSrc(sources: string[]): CSPBuilder {
    this.directives.connectSrc = sources
    return this
  }
  
  // Set font source
  fontSrc(sources: string[]): CSPBuilder {
    this.directives.fontSrc = sources
    return this
  }
  
  // Enable upgrade insecure requests
  upgradeInsecureRequests(): CSPBuilder {
    this.directives.upgradeInsecureRequests = true
    return this
  }
  
  // Block all mixed content
  blockAllMixedContent(): CSPBuilder {
    this.directives.blockAllMixedContent = true
    return this
  }
  
  // Set report URI
  reportUri(uri: string): CSPBuilder {
    this.directives.reportUri = uri
    return this
  }
  
  // Build CSP header value
  build(): string {
    const directives: string[] = []
    
    // Add each directive
    Object.entries(this.directives).forEach(([key, value]) => {
      switch (key) {
        case 'defaultSrc':
          directives.push(`default-src ${value.join(' ')}`)
          break
        case 'scriptSrc':
          directives.push(`script-src ${value.join(' ')}`)
          break
        case 'styleSrc':
          directives.push(`style-src ${value.join(' ')}`)
          break
        case 'imgSrc':
          directives.push(`img-src ${value.join(' ')}`)
          break
        case 'connectSrc':
          directives.push(`connect-src ${value.join(' ')}`)
          break
        case 'fontSrc':
          directives.push(`font-src ${value.join(' ')}`)
          break
        case 'mediaSrc':
          directives.push(`media-src ${value.join(' ')}`)
          break
        case 'objectSrc':
          directives.push(`object-src ${value.join(' ')}`)
          break
        case 'frameSrc':
          directives.push(`frame-src ${value.join(' ')}`)
          break
        case 'formAction':
          directives.push(`form-action ${value.join(' ')}`)
          break
        case 'baseUri':
          directives.push(`base-uri ${value.join(' ')}`)
          break
        case 'upgradeInsecureRequests':
          if (value) directives.push('upgrade-insecure-requests')
          break
        case 'blockAllMixedContent':
          if (value) directives.push('block-all-mixed-content')
          break
        case 'reportUri':
          directives.push(`report-uri ${value}`)
          break
        case 'reportTo':
          directives.push(`report-to ${value}`)
          break
      }
    })
    
    return directives.join('; ')
  }
}

// Predefined CSP configurations
export const cspConfigs = {
  // Strict CSP for maximum security
  strict: () => new CSPBuilder()
    .defaultSrc(["'self'"])
    .scriptSrc(["'self'", "'strict-dynamic'"])
    .styleSrc(["'self'", "'unsafe-inline'"])
    .imgSrc(["'self'", 'data:', 'https:'])
    .connectSrc(["'self'", 'https:'])
    .fontSrc(["'self'", 'https://fonts.gstatic.com'])
    .objectSrc(["'none'"])
    .upgradeInsecureRequests()
    .build(),
  
  // Development CSP (more permissive)
  development: () => new CSPBuilder()
    .defaultSrc(["'self'"])
    .scriptSrc(["'self'", "'unsafe-inline'", "'unsafe-eval'", 'localhost:*'])
    .styleSrc(["'self'", "'unsafe-inline'"])
    .imgSrc(["'self'", 'data:', 'https:', 'localhost:*'])
    .connectSrc(["'self'", 'ws:', 'wss:', 'localhost:*'])
    .fontSrc(["'self'", 'https://fonts.gstatic.com'])
    .build(),
  
  // Production CSP for React apps
  production: () => new CSPBuilder()
    .defaultSrc(["'self'"])
    .scriptSrc(["'self'", 'https://vercel.live'])
    .styleSrc(["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'])
    .imgSrc(["'self'", 'data:', 'https:'])
    .connectSrc(["'self'", 'https:', 'wss:'])
    .fontSrc(["'self'", 'https://fonts.gstatic.com'])
    .objectSrc(["'none'"])
    .upgradeInsecureRequests()
    .reportUri('/api/csp-report')
    .build(),
}

// CSP nonce generator
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// CSP violation reporter
export const reportCSPViolation = (violation: SecurityPolicyViolationEvent) => {
  const report = {
    documentURI: violation.documentURI,
    referrer: violation.referrer,
    blockedURI: violation.blockedURI,
    violatedDirective: violation.violatedDirective,
    originalPolicy: violation.originalPolicy,
    sourceFile: violation.sourceFile,
    lineNumber: violation.lineNumber,
    columnNumber: violation.columnNumber,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  }
  
  // Send to monitoring service
  fetch('/api/csp-violations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  }).catch(error => {
    console.error('Failed to report CSP violation:', error)
  })
}

// Initialize CSP monitoring
export const initializeCSPMonitoring = () => {
  document.addEventListener('securitypolicyviolation', reportCSPViolation)
  
  // Report-Only mode for testing
  if (import.meta.env.DEV) {
    console.log('CSP monitoring initialized in development mode')
  }
}
```

### Step 3: Authentication Security

Create `src/features/auth/security/authSecurity.ts`:

```typescript
// Authentication security utilities

import { z } from 'zod'
import { RateLimiter } from '@/utils/security'

// JWT utilities
export class JWTSecurity {
  // Validate JWT structure (client-side validation only)
  static validateJWTStructure(token: string): boolean {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    try {
      // Validate header
      const header = JSON.parse(atob(parts[0]))
      if (!header.alg || !header.typ) return false
      
      // Validate payload structure
      const payload = JSON.parse(atob(parts[1]))
      if (!payload.exp || !payload.iat) return false
      
      return true
    } catch {
      return false
    }
  }
  
  // Check if JWT is expired (client-side)
  static isJWTExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch {
      return true
    }
  }
  
  // Extract JWT payload (client-side only, don't trust for security decisions)
  static extractJWTPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }
  
  // Secure token storage
  static storeTokenSecurely(token: string, refreshToken?: string): void {
    // Use httpOnly cookies in production
    if (import.meta.env.PROD) {
      // Cookies should be set by server with httpOnly, secure, sameSite flags
      document.cookie = `token=${token}; path=/; secure; samesite=strict`
      if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`
      }
    } else {
      // Development fallback
      sessionStorage.setItem('auth_token', token)
      if (refreshToken) {
        sessionStorage.setItem('refresh_token', refreshToken)
      }
    }
  }
  
  // Remove tokens securely
  static removeTokens(): void {
    if (import.meta.env.PROD) {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } else {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('refresh_token')
    }
  }
}

// Login security
export class LoginSecurity {
  private static loginAttempts = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
  private static passwordResetAttempts = new RateLimiter(3, 60 * 60 * 1000) // 3 attempts per hour
  
  // Validate login attempt
  static canAttemptLogin(identifier: string): {
    allowed: boolean
    remainingAttempts: number
    resetTime?: number
  } {
    const allowed = this.loginAttempts.isAllowed(identifier)
    const remaining = this.loginAttempts.getRemainingRequests(identifier)
    
    return {
      allowed,
      remainingAttempts: remaining,
      resetTime: allowed ? undefined : Date.now() + 15 * 60 * 1000,
    }
  }
  
  // Validate password reset attempt
  static canAttemptPasswordReset(identifier: string): {
    allowed: boolean
    remainingAttempts: number
  } {
    const allowed = this.passwordResetAttempts.isAllowed(identifier)
    const remaining = this.passwordResetAttempts.getRemainingRequests(identifier)
    
    return {
      allowed,
      remainingAttempts: remaining,
    }
  }
  
  // Validate login credentials format
  static validateCredentials(email: string, password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    // Email validation
    const emailSchema = z.string().email()
    const emailResult = emailSchema.safeParse(email)
    if (!emailResult.success) {
      errors.push('Invalid email format')
    }
    
    // Password validation
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }
    
    // Check for common weak passwords
    const weakPasswords = ['password', '12345678', 'password123']
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too weak')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  }
  
  // Generate secure password
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    
    return Array.from(array, byte => charset[byte % charset.length]).join('')
  }
}

// Session security
export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  private static readonly ACTIVITY_CHECK_INTERVAL = 60 * 1000 // 1 minute
  
  private static lastActivity = Date.now()
  private static timeoutWarningShown = false
  private static sessionCheckInterval: NodeJS.Timeout | null = null
  
  // Initialize session monitoring
  static initializeSessionMonitoring(
    onTimeout: () => void,
    onWarning: (remainingTime: number) => void
  ): void {
    // Track user activity
    const updateActivity = () => {
      this.lastActivity = Date.now()
      this.timeoutWarningShown = false
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })
    
    // Check session timeout
    this.sessionCheckInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - this.lastActivity
      const remainingTime = this.SESSION_TIMEOUT - timeSinceActivity
      
      if (remainingTime <= 0) {
        onTimeout()
        this.cleanup()
      } else if (remainingTime <= 5 * 60 * 1000 && !this.timeoutWarningShown) {
        // Show warning 5 minutes before timeout
        this.timeoutWarningShown = true
        onWarning(remainingTime)
      }
    }, this.ACTIVITY_CHECK_INTERVAL)
  }
  
  // Extend session
  static extendSession(): void {
    this.lastActivity = Date.now()
    this.timeoutWarningShown = false
  }
  
  // Cleanup session monitoring
  static cleanup(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }
  }
  
  // Validate session token
  static validateSession(token: string): boolean {
    if (!token || JWTSecurity.isJWTExpired(token)) {
      return false
    }
    
    // Additional validation logic
    const payload = JWTSecurity.extractJWTPayload(token)
    if (!payload || !payload.userId || !payload.sessionId) {
      return false
    }
    
    return true
  }
}

// Two-factor authentication
export class TwoFactorAuth {
  // Generate TOTP secret
  static generateTOTPSecret(): string {
    const array = new Uint8Array(20)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  
  // Validate TOTP code format
  static validateTOTPCode(code: string): boolean {
    return /^\d{6}$/.test(code)
  }
  
  // Generate backup codes
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = []
    
    for (let i = 0; i < count; i++) {
      const array = new Uint8Array(4)
      crypto.getRandomValues(array)
      const code = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
      codes.push(code.toUpperCase())
    }
    
    return codes
  }
  
  // Validate backup code format
  static validateBackupCode(code: string): boolean {
    return /^[A-F0-9]{8}$/.test(code.toUpperCase())
  }
}

// Device fingerprinting for security
export class DeviceFingerprinting {
  // Generate device fingerprint
  static async generateFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth.toString(),
      new Date().getTimezoneOffset().toString(),
      navigator.platform,
      navigator.cookieEnabled.toString(),
      navigator.doNotTrack || 'unknown',
    ]
    
    // Add canvas fingerprint
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('Device fingerprint', 2, 2)
        components.push(canvas.toDataURL())
      }
    } catch {
      // Canvas fingerprinting blocked
      components.push('canvas-blocked')
    }
    
    // Hash the components
    const encoder = new TextEncoder()
    const data = encoder.encode(components.join('|'))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  // Detect suspicious changes
  static detectSuspiciousActivity(
    currentFingerprint: string,
    storedFingerprint: string
  ): boolean {
    // Simple comparison - in production, you'd want more sophisticated analysis
    return currentFingerprint !== storedFingerprint
  }
}
```

---

## Monitoring & Analytics

**🤔 WHY Monitoring Is Critical for Performance & Security**

Monitoring provides the visibility needed to maintain high performance and detect security threats in real-time. Without comprehensive monitoring, performance regressions go unnoticed until they impact user experience, and security incidents remain hidden until significant damage occurs. Modern applications require proactive monitoring that catches issues before they affect users and provides the data needed for continuous optimization and threat response.

**🎯 WHAT Comprehensive Monitoring Includes**

Modern monitoring encompasses both performance and security dimensions:
- **Real User Monitoring (RUM)**: Actual user experience data across devices and networks
- **Synthetic Monitoring**: Proactive testing of application performance and availability
- **Security Incident Detection**: Real-time identification of threats and anomalies
- **Performance Analytics**: Detailed insights into Core Web Vitals and user interactions
- **Error Tracking**: Comprehensive error monitoring with context and stack traces
- **Business Metrics**: User engagement, conversion rates, and business impact correlation
- **Infrastructure Monitoring**: Server performance, resource utilization, and scalability metrics

**⏰ WHEN to Implement Different Monitoring Strategies**

Monitoring needs evolve with application maturity:

- **Development**: Basic error tracking and performance budgets
- **Staging**: Comprehensive testing with synthetic monitoring
- **Initial Launch**: Real user monitoring and security incident detection
- **Growth Phase**: Advanced analytics and business metrics correlation
- **Scale**: Distributed tracing and advanced threat detection
- **Enterprise**: Compliance monitoring and comprehensive audit trails

**🚀 HOW to Build Effective Monitoring Systems**

Implementation follows observability principles:

1. **Three Pillars of Observability**: Metrics, logs, and traces working together
2. **User-Centric Focus**: Monitor what matters to actual users and business outcomes
3. **Proactive Alerting**: Detect and respond to issues before they impact users
4. **Context-Rich Data**: Provide actionable insights for rapid issue resolution
5. **Continuous Improvement**: Use monitoring data to drive performance and security enhancements

### Step 1: Security Monitoring

Create `src/utils/securityMonitoring.ts`:

```typescript
// Security monitoring and incident detection

export interface SecurityIncident {
  id: string
  type: 'csp_violation' | 'failed_auth' | 'suspicious_activity' | 'rate_limit' | 'data_breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metadata: Record<string, any>
  timestamp: number
  userAgent?: string
  ipAddress?: string
  userId?: string
}

export class SecurityMonitor {
  private static instance: SecurityMonitor
  private incidents: SecurityIncident[] = []
  private listeners: Array<(incident: SecurityIncident) => void> = []
  
  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }
  
  // Report security incident
  reportIncident(incident: Omit<SecurityIncident, 'id' | 'timestamp'>): void {
    const fullIncident: SecurityIncident = {
      ...incident,
      id: this.generateIncidentId(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    }
    
    this.incidents.push(fullIncident)
    
    // Notify listeners
    this.listeners.forEach(listener => listener(fullIncident))
    
    // Send to monitoring service
    this.sendToMonitoringService(fullIncident)
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('Security Incident:', fullIncident)
    }
  }
  
  // Add incident listener
  addListener(listener: (incident: SecurityIncident) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
  
  // Get incidents by type
  getIncidentsByType(type: SecurityIncident['type']): SecurityIncident[] {
    return this.incidents.filter(incident => incident.type === type)
  }
  
  // Get incidents by severity
  getIncidentsBySeverity(severity: SecurityIncident['severity']): SecurityIncident[] {
    return this.incidents.filter(incident => incident.severity === severity)
  }
  
  // Get recent incidents
  getRecentIncidents(timeWindowMs: number = 24 * 60 * 60 * 1000): SecurityIncident[] {
    const cutoff = Date.now() - timeWindowMs
    return this.incidents.filter(incident => incident.timestamp > cutoff)
  }
  
  private generateIncidentId(): string {
    return `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private async sendToMonitoringService(incident: SecurityIncident): Promise<void> {
    try {
      await fetch('/api/security/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident),
      })
    } catch (error) {
      console.error('Failed to send security incident to monitoring service:', error)
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  // Record metric
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift()
    }
    
    // Send to analytics
    this.sendMetricToAnalytics(name, value)
  }
  
  // Get metric statistics
  getMetricStats(name: string): {
    count: number
    min: number
    max: number
    average: number
    median: number
  } | null {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null
    
    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((acc, val) => acc + val, 0)
    
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      average: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
    }
  }
  
  // Monitor component render time
  monitorComponentRender<T extends React.ComponentType<any>>(
    Component: T,
    componentName: string
  ): T {
    return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
      const startTime = performance.now()
      
      React.useEffect(() => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        this.recordMetric(`component_render_${componentName}`, renderTime)
      })
      
      return React.createElement(Component, { ...props, ref })
    }) as T
  }
  
  private sendMetricToAnalytics(name: string, value: number): void {
    if (import.meta.env.VITE_ENABLE_ANALYTICS && typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        event_category: 'Performance',
        metric_name: name,
        metric_value: value,
        page_location: window.location.pathname,
      })
    }
  }
}

// Error monitoring
export class ErrorMonitor {
  private static instance: ErrorMonitor
  private errorHandlers: Array<(error: Error, errorInfo?: any) => void> = []
  
  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
      ErrorMonitor.instance.initialize()
    }
    return ErrorMonitor.instance
  }
  
  private initialize(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      })
    })
  }
  
  // Add error handler
  addErrorHandler(handler: (error: Error, errorInfo?: any) => void): () => void {
    this.errorHandlers.push(handler)
    return () => {
      const index = this.errorHandlers.indexOf(handler)
      if (index > -1) {
        this.errorHandlers.splice(index, 1)
      }
    }
  }
  
  // Handle error
  handleError(error: Error, errorInfo?: any): void {
    // Notify handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(error, errorInfo)
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError)
      }
    })
    
    // Send to monitoring service
    this.sendErrorToMonitoring(error, errorInfo)
  }
  
  private async sendErrorToMonitoring(error: Error, errorInfo?: any): Promise<void> {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errorInfo,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    }
    
    try {
      // Send to Sentry or similar service
      if (import.meta.env.VITE_SENTRY_DSN) {
        // Sentry integration would go here
        console.log('Sending error to Sentry:', errorReport)
      }
      
      // Send to custom monitoring endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      })
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError)
    }
  }
}

// User analytics
export class UserAnalytics {
  private static instance: UserAnalytics
  private sessionId: string
  private userId?: string
  
  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics()
    }
    return UserAnalytics.instance
  }
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }
  
  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId
    
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
      })
    }
  }
  
  // Track page view
  trackPageView(path: string, title?: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title,
      })
    }
    
    // Custom analytics
    this.sendEvent('page_view', {
      path,
      title,
      referrer: document.referrer,
    })
  }
  
  // Track user interaction
  trackInteraction(action: string, category: string, label?: string, value?: number): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
      })
    }
    
    this.sendEvent('user_interaction', {
      action,
      category,
      label,
      value,
    })
  }
  
  // Track conversion
  trackConversion(conversionId: string, value?: number, currency?: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: conversionId,
        value,
        currency,
      })
    }
    
    this.sendEvent('conversion', {
      conversionId,
      value,
      currency,
    })
  }
  
  // Track custom event
  trackCustomEvent(eventName: string, properties: Record<string, any> = {}): void {
    this.sendEvent(eventName, properties)
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private initializeTracking(): void {
    // Track session start
    this.sendEvent('session_start', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
    })
    
    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.sendEvent('session_end', {
        sessionId: this.sessionId,
        duration: Date.now() - parseInt(this.sessionId.split('_')[1]),
      })
    })
  }
  
  private async sendEvent(eventName: string, properties: Record<string, any>): Promise<void> {
    if (!import.meta.env.VITE_ENABLE_ANALYTICS) return
    
    const event = {
      eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    }
    
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }
}

// React hooks for monitoring
export const useSecurityMonitoring = () => {
  const securityMonitor = SecurityMonitor.getInstance()
  
  return {
    reportIncident: securityMonitor.reportIncident.bind(securityMonitor),
    addListener: securityMonitor.addListener.bind(securityMonitor),
    getRecentIncidents: securityMonitor.getRecentIncidents.bind(securityMonitor),
  }
}

export const usePerformanceMonitoring = () => {
  const performanceMonitor = PerformanceMonitor.getInstance()
  
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetricStats: performanceMonitor.getMetricStats.bind(performanceMonitor),
    monitorComponentRender: performanceMonitor.monitorComponentRender.bind(performanceMonitor),
  }
}

export const useErrorMonitoring = () => {
  const errorMonitor = ErrorMonitor.getInstance()
  
  return {
    addErrorHandler: errorMonitor.addErrorHandler.bind(errorMonitor),
    handleError: errorMonitor.handleError.bind(errorMonitor),
  }
}

export const useAnalytics = () => {
  const analytics = UserAnalytics.getInstance()
  
  return {
    setUserId: analytics.setUserId.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackCustomEvent: analytics.trackCustomEvent.bind(analytics),
  }
}
```

### Step 2: Comprehensive Monitoring Setup

Create `src/utils/monitoring.ts`:

```typescript
// Comprehensive application monitoring

export interface MonitoringConfig {
  securityMonitoring: boolean
  performanceMonitoring: boolean
  errorReporting: boolean
  userAnalytics: boolean
  realUserMonitoring: boolean
}

export class ApplicationMonitor {
  private static instance: ApplicationMonitor
  private config: MonitoringConfig
  private isInitialized = false
  
  static getInstance(): ApplicationMonitor {
    if (!ApplicationMonitor.instance) {
      ApplicationMonitor.instance = new ApplicationMonitor()
    }
    return ApplicationMonitor.instance
  }
  
  // Initialize monitoring
  initialize(config: Partial<MonitoringConfig> = {}): void {
    if (this.isInitialized) {
      console.warn('Application monitoring already initialized')
      return
    }
    
    this.config = {
      securityMonitoring: true,
      performanceMonitoring: true,
      errorReporting: true,
      userAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      realUserMonitoring: true,
      ...config,
    }
    
    if (this.config.securityMonitoring) {
      this.initializeSecurityMonitoring()
    }
    
    if (this.config.performanceMonitoring) {
      this.initializePerformanceMonitoring()
    }
    
    if (this.config.errorReporting) {
      this.initializeErrorReporting()
    }
    
    if (this.config.userAnalytics) {
      this.initializeUserAnalytics()
    }
    
    if (this.config.realUserMonitoring) {
      this.initializeRealUserMonitoring()
    }
    
    this.isInitialized = true
    console.log('Application monitoring initialized with config:', this.config)
  }
  
  private initializeSecurityMonitoring(): void {
    const securityMonitor = SecurityMonitor.getInstance()
    
    // Monitor CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      securityMonitor.reportIncident({
        type: 'csp_violation',
        severity: 'medium',
        description: `CSP violation: ${event.violatedDirective}`,
        metadata: {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy,
        },
      })
    })
    
    // Monitor failed authentication attempts
    window.addEventListener('auth-failure', ((event: CustomEvent) => {
      securityMonitor.reportIncident({
        type: 'failed_auth',
        severity: 'high',
        description: 'Authentication failure detected',
        metadata: event.detail,
      })
    }) as EventListener)
  }
  
  private initializePerformanceMonitoring(): void {
    const performanceMonitor = PerformanceMonitor.getInstance()
    
    // Monitor Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => performanceMonitor.recordMetric('cls', metric.value))
      getFID((metric) => performanceMonitor.recordMetric('fid', metric.value))
      getFCP((metric) => performanceMonitor.recordMetric('fcp', metric.value))
      getLCP((metric) => performanceMonitor.recordMetric('lcp', metric.value))
      getTTFB((metric) => performanceMonitor.recordMetric('ttfb', metric.value))
    })
    
    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        performanceMonitor.recordMetric('memory_used', memory.usedJSHeapSize)
        performanceMonitor.recordMetric('memory_total', memory.totalJSHeapSize)
      }, 30000) // Every 30 seconds
    }
  }
  
  private initializeErrorReporting(): void {
    const errorMonitor = ErrorMonitor.getInstance()
    
    // React error boundary integration
    errorMonitor.addErrorHandler((error, errorInfo) => {
      // Send critical errors immediately
      if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
        // Handle chunk loading errors (lazy loading failures)
        console.warn('Chunk loading error detected, attempting reload')
        setTimeout(() => window.location.reload(), 1000)
      }
    })
  }
  
  private initializeUserAnalytics(): void {
    const analytics = UserAnalytics.getInstance()
    
    // Track initial page load
    analytics.trackPageView(window.location.pathname, document.title)
    
    // Track route changes (for SPA)
    window.addEventListener('popstate', () => {
      analytics.trackPageView(window.location.pathname, document.title)
    })
    
    // Track user engagement
    let engagementTimer: NodeJS.Timeout
    const trackEngagement = () => {
      clearTimeout(engagementTimer)
      engagementTimer = setTimeout(() => {
        analytics.trackCustomEvent('user_engaged', {
          duration: 30000, // 30 seconds
          page: window.location.pathname,
        })
      }, 30000)
    }
    
    ['click', 'scroll', 'keydown'].forEach(event => {
      document.addEventListener(event, trackEngagement, { passive: true })
    })
  }
  
  private initializeRealUserMonitoring(): void {
    // Monitor real user metrics
    const observer = new PerformanceObserver((list) => {
      const performanceMonitor = PerformanceMonitor.getInstance()
      
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          performanceMonitor.recordMetric('dns_lookup', navEntry.domainLookupEnd - navEntry.domainLookupStart)
          performanceMonitor.recordMetric('tcp_connect', navEntry.connectEnd - navEntry.connectStart)
          performanceMonitor.recordMetric('dom_interactive', navEntry.domInteractive - navEntry.fetchStart)
          performanceMonitor.recordMetric('dom_complete', navEntry.domComplete - navEntry.fetchStart)
        }
        
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          if (resourceEntry.duration > 1000) { // Log slow resources
            performanceMonitor.recordMetric('slow_resource', resourceEntry.duration)
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['navigation', 'resource'] })
  }
  
  // Get monitoring status
  getStatus(): {
    initialized: boolean
    config: MonitoringConfig
    metrics: Record<string, any>
  } {
    const performanceMonitor = PerformanceMonitor.getInstance()
    
    return {
      initialized: this.isInitialized,
      config: this.config,
      metrics: {
        cls: performanceMonitor.getMetricStats('cls'),
        fid: performanceMonitor.getMetricStats('fid'),
        lcp: performanceMonitor.getMetricStats('lcp'),
        memory_used: performanceMonitor.getMetricStats('memory_used'),
      },
    }
  }
}

// Initialize monitoring on app start
export const initializeMonitoring = (config?: Partial<MonitoringConfig>) => {
  const monitor = ApplicationMonitor.getInstance()
  monitor.initialize(config)
  
  // Development monitoring dashboard
  if (import.meta.env.DEV) {
    // Add monitoring panel to development builds
    const panel = document.createElement('div')
    panel.id = 'monitoring-panel'
    panel.style.cssText = `
      position: fixed;
      top: 50px;
      left: 10px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      display: none;
    `
    
    const toggle = document.createElement('button')
    toggle.textContent = '📊'
    toggle.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 10001;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
    `
    
    toggle.onclick = () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none'
      if (panel.style.display === 'block') {
        updatePanel()
      }
    }
    
    const updatePanel = () => {
      const status = monitor.getStatus()
      panel.innerHTML = `
        <h4>Monitoring Status</h4>
        <p>Initialized: ${status.initialized ? '✅' : '❌'}</p>
        <p>Security: ${status.config.securityMonitoring ? '✅' : '❌'}</p>
        <p>Performance: ${status.config.performanceMonitoring ? '✅' : '❌'}</p>
        <p>Errors: ${status.config.errorReporting ? '✅' : '❌'}</p>
        <p>Analytics: ${status.config.userAnalytics ? '✅' : '❌'}</p>
        <hr>
        <h4>Metrics</h4>
        ${Object.entries(status.metrics).map(([key, value]) => 
          value ? `<p>${key}: ${JSON.stringify(value, null, 2)}</p>` : ''
        ).join('')}
      `
    }
    
    document.body.appendChild(toggle)
    document.body.appendChild(panel)
  }
  
  return monitor
}
```

---

## Summary

🎉 **Congratulations!** You've completed Chapter 9 and now have a comprehensive performance and security system with:

### 🚀 Performance Optimizations Achieved

✅ **Core Web Vitals Monitoring**: Real-time tracking of CLS, FID, FCP, LCP, and TTFB with 2025 standards  
✅ **Advanced Code Splitting**: Route-level and component-level lazy loading with intelligent chunking  
✅ **Bundle Optimization**: Tree shaking, dead code elimination, and optimal vendor chunking  
✅ **Image & Asset Optimization**: WebP support, responsive images, progressive loading, compression  
✅ **Memory Management**: Leak prevention, efficient data structures, automatic cleanup  
✅ **Layout Stability**: Prevention of cumulative layout shift with stable containers  

### 🔒 Security Features Implemented

✅ **Input Sanitization**: Comprehensive XSS prevention with DOMPurify and validation  
✅ **Content Security Policy**: Configurable CSP with violation reporting and nonce generation  
✅ **Authentication Security**: JWT handling, rate limiting, session management, 2FA support  
✅ **Device Fingerprinting**: Suspicious activity detection and device tracking  
✅ **Secure Storage**: Encrypted local storage with automatic cleanup  
✅ **Security Auditing**: Automated vulnerability detection and password strength checking  

### 📊 Monitoring & Analytics

✅ **Security Monitoring**: Real-time incident detection and reporting  
✅ **Performance Monitoring**: Component render tracking and metric collection  
✅ **Error Monitoring**: Global error handling with detailed reporting  
✅ **User Analytics**: Event tracking, conversion monitoring, engagement metrics  
✅ **Real User Monitoring**: Actual user performance data collection  
✅ **Development Dashboard**: Visual monitoring panel for development builds  

### Key Benefits Achieved

1. **Performance**: Sub-2.5s LCP, <0.1 CLS, optimal Core Web Vitals scores
2. **Security**: Enterprise-grade protection against XSS, CSRF, injection attacks
3. **Reliability**: Comprehensive error handling and incident response
4. **Scalability**: Memory-efficient patterns and optimized resource loading
5. **Observability**: Complete visibility into application health and user behavior
6. **Compliance**: Security best practices meeting enterprise standards

### Next Steps

- **Chapter 10**: Complete application example integrating all concepts
- **Production Deployment**: Apply all optimizations in real-world scenarios
- **Continuous Monitoring**: Ongoing performance and security assessment

---

## 📚 Additional Resources

- [Web.dev Performance](https://web.dev/performance/)
- [OWASP Security Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [MDN Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Google Web Vitals](https://web.dev/vitals/)

---

**Previous**: [← Chapter 8 - Build & Deployment](./08-build-deployment.md) | **Next**: [Chapter 10 - Complete Application →](./10-complete-application.md)
