# Chapter 6: API Integration 🌐

## Overview

In this chapter, we'll implement a robust API integration layer using Axios with interceptors, error handling, retry logic, and seamless integration with Redux Toolkit Query. We'll establish patterns for handling authentication, request/response transformation, caching, and optimistic updates that scale from simple CRUD operations to complex real-time applications.

---

## 📋 Table of Contents

1. [Why Axios in 2025?](#why-axios-in-2025)
2. [Installation & Basic Setup](#installation--basic-setup)
3. [Axios Configuration & Interceptors](#axios-configuration--interceptors)
4. [Error Handling & Retry Logic](#error-handling--retry-logic)
5. [Authentication Integration](#authentication-integration)
6. [RTK Query Integration](#rtk-query-integration)
7. [API Response Patterns](#api-response-patterns)
8. [Optimistic Updates](#optimistic-updates)
9. [File Upload & Download](#file-upload--download)
10. [Real-Time Features](#real-time-features)

---

## Why Axios in 2025?

### 💡 Understanding API Integration in Modern React

**The API Integration Challenge:**
```javascript
// ❌ Manual API calls (error-prone, inconsistent)
function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/tasks')
      .then(response => {
        if (!response.ok) throw new Error('Network error')
        return response.json()
      })
      .then(data => setTasks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])
  
  // No caching, no retry, no auth handling, no request deduplication
  // Error handling scattered throughout components
  // Loading states manually managed everywhere
}

// ✅ Modern API integration (declarative, cached, optimized)
function TaskList() {
  const { data: tasks, isLoading, error } = useGetTasksQuery()
  
  // Automatic caching ✅ Background refetching ✅ 
  // Global error handling ✅ Request deduplication ✅
  // Loading states automatic ✅ TypeScript integration ✅
}
```

**Core API Integration Concepts:**
1. **Client-Side Data Fetching**: How SPAs request data from servers
2. **State Synchronization**: Keeping client state in sync with server state
3. **Error Handling**: Categorizing and responding to different error types
4. **Caching Strategies**: When to cache, invalidate, and refresh data
5. **Authentication Flow**: Token management, refresh, and security
6. **Request Lifecycle**: Interceptors, transformations, and middleware

**API Integration Evolution:**
```javascript
// React 2013-2016: Manual fetch in componentDidMount
componentDidMount() {
  fetch('/api/data').then(...)
}

// React 2017-2019: useEffect + fetch
useEffect(() => {
  fetch('/api/data').then(...)
}, [])

// React 2020-2021: Custom hooks + SWR/React Query  
const { data, error } = useSWR('/api/data', fetcher)

// React 2022+: RTK Query + Axios (enterprise-grade)
const { data, error, isLoading } = useGetDataQuery()
```

**Why Modern API Integration Matters:**
- **User Experience**: Instant loading with cached data, optimistic updates
- **Performance**: Request deduplication, background sync, intelligent caching
- **Reliability**: Automatic retry, error recovery, offline support
- **Security**: Token management, request signing, CSRF protection
- **Developer Experience**: TypeScript integration, debugging tools, DevTools

### 💡 Understanding Client-Server Data Flow

**Traditional Server-Side Rendering:**
```
Browser → Server → HTML with data → Browser renders complete page
```

**Modern SPA API Pattern:**
```
Browser → HTML shell → JavaScript loads → API calls → Data → UI updates
```

**Key Challenges in SPA API Integration:**
1. **Race Conditions**: Multiple components requesting same data
2. **State Staleness**: Cached data becoming outdated
3. **Error Boundaries**: Handling API failures gracefully
4. **Loading States**: Managing loading indicators across components
5. **Memory Leaks**: Cleaning up cancelled requests
6. **Authentication**: Managing token lifecycles and refresh flows

**Modern Solutions:**
```javascript
// 🎯 RTK Query solves these challenges:
- Race conditions → Request deduplication
- State staleness → Background refetching with tags
- Error boundaries → Global error handling + local error states
- Loading states → Automatic loading state management
- Memory leaks → Automatic cleanup on unmount
- Authentication → Interceptors + automatic token refresh
```

### Axios vs Alternatives

| Feature | Axios | Fetch API | SWR | TanStack Query |
|---------|-------|-----------|-----|----------------|
| **Bundle Size** | 13KB | 0KB (native) | 4KB | 37KB |
| **Request/Response Interceptors** | ✅ Excellent | ❌ Manual | ❌ Limited | ✅ Good |
| **Automatic JSON Parsing** | ✅ Yes | ❌ Manual | ✅ Yes | ✅ Yes |
| **Request/Response Transform** | ✅ Built-in | ❌ Manual | ❌ Limited | ✅ Good |
| **Timeout Support** | ✅ Built-in | ❌ Manual | ❌ Limited | ✅ Good |
| **Concurrent Request Cancellation** | ✅ Built-in | ✅ AbortController | ✅ Built-in | ✅ Built-in |
| **Error Handling** | ✅ Excellent | ❌ Basic | ✅ Good | ✅ Excellent |
| **TypeScript Support** | ✅ Excellent | ✅ Good | ✅ Good | ✅ Excellent |
| **Redux Integration** | ✅ Perfect | ❌ Manual | ❌ Limited | ✅ Good |

### Why Choose Axios + RTK Query?

1. **Interceptor Power**: Global request/response transformation and error handling
2. **Authentication**: Seamless token management and refresh logic
3. **Error Handling**: Comprehensive error categorization and retry mechanisms
4. **Performance**: Request deduplication, caching, and background updates
5. **Developer Experience**: Excellent debugging tools and TypeScript support
6. **Ecosystem**: Extensive middleware and plugin ecosystem
7. **Redux Integration**: Perfect synergy with RTK Query for complex state management

### When to Use This Stack

### 🎯 WHEN to Choose Different API Integration Solutions

**API Complexity Decision Tree:**
```javascript
// 📱 Simple Apps (few API calls, basic CRUD)
// Use: Fetch API + useState/useEffect
function SimpleProfile() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetch('/api/user/me').then(res => res.json()).then(setUser)
  }, [])
  
  return <div>{user?.name}</div>
}

// 🏢 Medium Apps (multiple endpoints, some caching needed)
// Use: Axios + SWR/TanStack Query
const { data: user, error } = useSWR('/api/user/me', fetcher)

// 🏭 Enterprise Apps (complex auth, global state, real-time)
// Use: Axios + RTK Query + Redux
const { data: user, isLoading, error } = useGetUserQuery()
```

**Authentication Complexity Guide:**
```javascript
// 🔓 No Auth Required - WHEN:
// - Public APIs only
// - Static content or public data
// - Simple contact forms
fetch('/api/public/posts')

// 🔐 Simple Auth (API key/Basic) - WHEN:
// - Single tenant applications
// - Server handles session management
// - Minimal security requirements
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// 🛡️ Complex Auth (JWT refresh, multi-tenant) - WHEN:
// - Token expiration handling needed
// - Multi-tenant with different permissions
// - Enterprise security requirements
// → Use Axios interceptors + RTK Query
```

**Data Synchronization Needs:**
```javascript
// 🔄 Real-time Updates - WHEN:
// - Collaborative applications (Google Docs style)
// - Live dashboards with changing data
// - Chat applications, notifications
// → Use WebSockets + RTK Query + optimistic updates

// 📊 Periodic Updates - WHEN:
// - Dashboard data that changes hourly/daily
// - User profiles, settings
// - Analytics data
// → Use RTK Query with background refetching

// 💾 Cache-Heavy - WHEN:
// - Reference data (countries, categories)
// - User preferences
// - Static content with infrequent changes
// → Use RTK Query with long cache times
```

**Error Handling Requirements:**
```javascript
// 🚨 Basic Error Handling - WHEN:
// - Simple forms with basic validation
// - Internal tools with tech-savvy users
// - Prototypes and MVPs
try { await fetch('/api/data') } catch (error) { showError(error) }

// 🔧 Advanced Error Handling - WHEN:
// - User-facing applications
// - E-commerce, financial applications
// - Need for retry logic and recovery
// → Use Axios interceptors + global error boundaries

// 🏥 Enterprise Error Handling - WHEN:
// - Compliance requirements (HIPAA, SOX)
// - Mission-critical applications
// - Detailed error tracking and monitoring
// → Use Axios + RTK Query + error tracking service
```

**Performance Requirements:**
```javascript
// ⚡ High Performance Needs - WHEN:
// - Mobile applications (slow networks)
// - Large datasets requiring pagination
// - Multiple API calls per page
// → Use RTK Query with:
//   - Request deduplication
//   - Background prefetching
//   - Optimistic updates
//   - Intelligent caching

// 📶 Offline Support - WHEN:
// - Mobile-first applications
// - Users in areas with poor connectivity
// - Critical business applications
// → Use RTK Query + service workers + local storage
```

**Team and Project Considerations:**
```javascript
// 👤 Solo Developer - WHEN:
// - Rapid prototyping → Fetch API
// - Medium complexity → Axios + SWR
// - Full-featured app → Axios + RTK Query

// 👥 Small Team (2-5 developers) - WHEN:
// - Consistent patterns needed → Axios + RTK Query
// - Quick delivery → SWR/TanStack Query
// - Enterprise features → RTK Query

// 🏢 Large Team (5+ developers) - WHEN:
// - Always → Axios + RTK Query (consistency, scalability)
// - Global state management critical
// - Long-term maintainability important
```

✅ **Use Axios + RTK Query when you have:**
- Complex authentication requirements
- Need for request/response transformation
- Global error handling requirements
- Background synchronization needs
- Large applications with complex API interactions

❌ **Consider alternatives when you have:**
- Very simple API requirements
- Bundle size is critical priority
- Team prefers native web APIs
- Simple apps without complex state management

---

## Installation & Basic Setup

**🤔 WHY Proper Setup Matters**

The foundation of any robust API integration starts with proper setup and configuration. A well-structured setup prevents common pitfalls like inconsistent error handling, security vulnerabilities, and maintenance nightmares. Modern applications require a systematic approach to API configuration that considers TypeScript integration, environment management, security headers, and developer experience from day one.

**🎯 WHAT Constitutes Proper API Setup**

Comprehensive API setup includes:
- **Type Definitions**: End-to-end TypeScript integration for request/response contracts
- **Environment Configuration**: Secure management of API endpoints and secrets
- **Base Client Configuration**: Consistent headers, timeouts, and defaults
- **Dependency Management**: Strategic selection of packages for functionality vs. bundle size
- **Security Configuration**: CORS, CSP, and authentication setup
- **Development Tools**: Debugging, logging, and monitoring integration

**⏰ WHEN to Establish API Patterns**

Setup timing is critical:
- **Project Initialization**: Establish patterns before first API call
- **Team Onboarding**: Consistent patterns reduce learning curve
- **Scaling Preparation**: Structure that accommodates growing complexity
- **Security Reviews**: Early establishment of security best practices

**🚀 HOW to Structure API Foundation**

Implementation follows these architectural principles:

1. **Type-First Approach**: Define contracts before implementation
2. **Environment Separation**: Clear distinction between dev/staging/production
3. **Security by Default**: Implement security headers and practices upfront
4. **Developer Experience**: Optimize for debugging and monitoring
5. **Performance Baseline**: Establish caching and optimization patterns

### Step 1: Install Dependencies

```bash
# Install Axios for HTTP client
npm install axios

# Install additional utilities
npm install axios-retry
npm install axios-rate-limit

# For file uploads
npm install axios-upload-progress

# For debugging (development only)
npm install --save-dev axios-logger
```

### Step 2: Create API Types

Create `src/types/api.ts`:

```typescript
// Base API response structure
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Error response structure
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
  path: string
  status: number
}

// Request configuration
export interface ApiRequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
  skipAuth?: boolean
  skipErrorHandling?: boolean
  uploadProgress?: (progress: number) => void
  downloadProgress?: (progress: number) => void
}

// Authentication types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
  tokenType: 'Bearer'
}

export interface RefreshTokenResponse {
  accessToken: string
  expiresAt: number
}

// API endpoint types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  assigneeId?: string
  projectId?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'archived'
  ownerId: string
  memberIds: string[]
  createdAt: string
  updatedAt: string
}

// Request/Response types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority: Task['priority']
  dueDate?: string
  projectId?: string
  tags?: string[]
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: Task['status']
}

export interface TaskFilters {
  status?: Task['status'][]
  priority?: Task['priority'][]
  assigneeId?: string
  projectId?: string
  search?: string
  tags?: string[]
  dueBefore?: string
  dueAfter?: string
}

export interface TasksResponse {
  tasks: Task[]
  pagination: PaginationInfo
  filters: TaskFilters
}

// File upload types
export interface FileUploadRequest {
  file: File
  category?: 'avatar' | 'document' | 'image'
  tags?: string[]
}

export interface FileUploadResponse {
  id: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  url: string
  thumbnailUrl?: string
  createdAt: string
}

// Webhook/real-time types
export interface WebSocketMessage<T = any> {
  type: string
  data: T
  timestamp: string
  userId?: string
}

export interface TaskUpdateEvent {
  taskId: string
  changes: Partial<Task>
  updatedBy: string
}

export interface NotificationEvent {
  id: string
  type: 'task_assigned' | 'task_completed' | 'deadline_approaching'
  title: string
  message: string
  data?: Record<string, any>
  createdAt: string
}
```

### Step 3: Environment Configuration

Create `src/config/api.config.ts`:

```typescript
// API configuration based on environment
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  RATE_LIMIT: {
    maxRequests: 100,
    perMilliseconds: 60000, // per minute
  },
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  
  // Authentication
  AUTH: {
    TOKEN_STORAGE_KEY: 'auth_tokens',
    REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh 5 minutes before expiry
    MAX_REFRESH_ATTEMPTS: 3,
  },
  
  // File upload
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: {
      avatar: ['image/jpeg', 'image/png', 'image/webp'],
      document: ['application/pdf', 'application/msword', 'text/plain'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },
    CHUNK_SIZE: 1024 * 1024, // 1MB chunks
  },
  
  // WebSocket
  WEBSOCKET: {
    URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws',
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 2000,
    HEARTBEAT_INTERVAL: 30000,
  },
  
  // Development
  DEBUG: import.meta.env.DEV,
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
} as const

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    PREFERENCES: '/users/preferences',
  },
  
  // Tasks
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    BY_PROJECT: (projectId: string) => `/tasks?projectId=${projectId}`,
    STATISTICS: '/tasks/statistics',
    EXPORT: '/tasks/export',
  },
  
  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    INVITE: (id: string) => `/projects/${id}/invite`,
  },
  
  // Files
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: string) => `/files/${id}/download`,
    DELETE: (id: string) => `/files/${id}`,
    METADATA: (id: string) => `/files/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    PREFERENCES: '/notifications/preferences',
  },
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]
```

---

## Axios Configuration & Interceptors

**🤔 WHY Interceptors Are Essential**

Interceptors are the middleware layer of HTTP communication, providing a centralized point for cross-cutting concerns like authentication, logging, error handling, and request transformation. Without interceptors, these concerns scatter throughout your application, creating maintenance nightmares and inconsistent behavior. Modern applications require systematic handling of authentication tokens, error responses, request retries, and performance monitoring—all of which interceptors elegantly solve.

**🎯 WHAT Interceptors Enable**

Interceptors provide comprehensive request/response lifecycle management:
- **Authentication Injection**: Automatic token attachment and refresh
- **Request Transformation**: Consistent headers, formatting, and validation
- **Response Processing**: Data normalization, error standardization, caching
- **Error Handling**: Centralized error categorization and recovery
- **Performance Monitoring**: Request timing, success rates, and debugging
- **Security Features**: Request signing, CSRF protection, rate limiting

**⏰ WHEN to Implement Different Interceptor Patterns**

Interceptor strategies vary by application needs:

- **Authentication Apps**: Token injection and refresh interceptors
- **Enterprise Apps**: Comprehensive logging and audit trails
- **Performance-Critical Apps**: Caching and request deduplication
- **Offline-Capable Apps**: Request queuing and retry mechanisms
- **Multi-Tenant Apps**: Tenant context injection and routing

**🚀 HOW Interceptors Transform API Communication**

Implementation follows the middleware pattern:

1. **Request Pipeline**: Authentication → Headers → Validation → Logging
2. **Response Pipeline**: Error Handling → Transformation → Caching → Monitoring
3. **Error Recovery**: Retry Logic → Token Refresh → Fallback Strategies
4. **Performance Optimization**: Deduplication → Compression → Caching
5. **Security Layer**: Token Management → Request Signing → Rate Limiting

### Step 1: Create Base Axios Instance

Create `src/services/api/client.ts`:

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import rateLimit from 'axios-rate-limit'
import { API_CONFIG, ERROR_CODES, HTTP_STATUS } from '@/config/api.config'
import { ApiError, ApiResponse, AuthTokens } from '@/types/api'

// Custom error class
export class ApiException extends Error {
  constructor(
    public code: string,
    public message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiException'
  }
}

// Token management
class TokenManager {
  private tokens: AuthTokens | null = null
  private refreshPromise: Promise<string> | null = null

  setTokens(tokens: AuthTokens | null) {
    this.tokens = tokens
    if (tokens) {
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY, JSON.stringify(tokens))
    } else {
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)
    }
  }

  getTokens(): AuthTokens | null {
    if (!this.tokens) {
      const stored = localStorage.getItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)
      if (stored) {
        try {
          this.tokens = JSON.parse(stored)
        } catch {
          this.clearTokens()
        }
      }
    }
    return this.tokens
  }

  clearTokens() {
    this.tokens = null
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)
  }

  isTokenExpired(): boolean {
    const tokens = this.getTokens()
    if (!tokens) return true
    
    const expiresAt = tokens.expiresAt
    const now = Date.now()
    const threshold = API_CONFIG.AUTH.REFRESH_THRESHOLD
    
    return now >= expiresAt - threshold
  }

  async refreshTokens(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const tokens = this.getTokens()
    if (!tokens) {
      throw new ApiException(ERROR_CODES.AUTHENTICATION_ERROR, 'No refresh token available')
    }

    this.refreshPromise = this.performRefresh(tokens.refreshToken)
    
    try {
      const newAccessToken = await this.refreshPromise
      return newAccessToken
    } finally {
      this.refreshPromise = null
    }
  }

  private async performRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post('/auth/refresh', { refreshToken })
      const { accessToken, expiresAt } = response.data
      
      const newTokens: AuthTokens = {
        ...this.tokens!,
        accessToken,
        expiresAt,
      }
      
      this.setTokens(newTokens)
      return accessToken
    } catch (error) {
      this.clearTokens()
      throw new ApiException(ERROR_CODES.AUTHENTICATION_ERROR, 'Token refresh failed')
    }
  }
}

// Create token manager instance
const tokenManager = new TokenManager()

// Create base axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  // Apply rate limiting
  const rateLimitedInstance = rateLimit(instance, {
    maxRequests: API_CONFIG.RATE_LIMIT.maxRequests,
    perMilliseconds: API_CONFIG.RATE_LIMIT.perMilliseconds,
  })

  // Configure retry logic
  axiosRetry(rateLimitedInstance, {
    retries: API_CONFIG.RETRY_ATTEMPTS,
    retryDelay: (retryCount) => {
      return Math.min(1000 * (2 ** retryCount), 10000) // Exponential backoff, max 10s
    },
    retryCondition: (error) => {
      // Retry on network errors, timeouts, and 5xx errors
      return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
             (error.response?.status || 0) >= 500
    },
    onRetry: (retryCount, error, requestConfig) => {
      if (API_CONFIG.DEBUG) {
        console.log(`Retrying request ${requestConfig.url} (attempt ${retryCount})`)
      }
    },
  })

  return rateLimitedInstance
}

// Create API client instance
export const apiClient = createAxiosInstance()

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth for certain endpoints
    const skipAuth = config.metadata?.skipAuth || 
                    config.url?.includes('/auth/login') ||
                    config.url?.includes('/auth/register')

    if (!skipAuth) {
      const tokens = tokenManager.getTokens()
      
      if (tokens) {
        // Check if token needs refresh
        if (tokenManager.isTokenExpired()) {
          try {
            const newAccessToken = await tokenManager.refreshTokens()
            config.headers.Authorization = `Bearer ${newAccessToken}`
          } catch (error) {
            // Redirect to login on refresh failure
            tokenManager.clearTokens()
            window.location.href = '/auth/login'
            return Promise.reject(error)
          }
        } else {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
      }
    }

    // Add request timestamp
    config.metadata = {
      ...config.metadata,
      startTime: Date.now(),
    }

    // Log request in development
    if (API_CONFIG.DEBUG) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      })
    }

    return config
  },
  (error) => {
    if (API_CONFIG.DEBUG) {
      console.error('Request interceptor error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = Date.now() - (response.config.metadata?.startTime || 0)

    // Log response in development
    if (API_CONFIG.DEBUG) {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data,
      })
    }

    // Transform successful response
    const apiResponse: ApiResponse = {
      data: response.data.data || response.data,
      message: response.data.message,
      success: true,
      timestamp: new Date().toISOString(),
      pagination: response.data.pagination,
    }

    return { ...response, data: apiResponse }
  },
  async (error: AxiosError) => {
    const duration = Date.now() - (error.config?.metadata?.startTime || 0)

    // Log error in development
    if (API_CONFIG.DEBUG) {
      console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response

      // Handle authentication errors
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        tokenManager.clearTokens()
        
        // Don't redirect if already on auth page
        if (!window.location.pathname.includes('/auth/')) {
          window.location.href = '/auth/login'
        }
        
        throw new ApiException(
          ERROR_CODES.AUTHENTICATION_ERROR,
          'Authentication required',
          status,
          data
        )
      }

      // Handle authorization errors
      if (status === HTTP_STATUS.FORBIDDEN) {
        throw new ApiException(
          ERROR_CODES.AUTHORIZATION_ERROR,
          'Access denied',
          status,
          data
        )
      }

      // Handle validation errors
      if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        throw new ApiException(
          ERROR_CODES.VALIDATION_ERROR,
          data.message || 'Validation failed',
          status,
          data
        )
      }

      // Handle not found errors
      if (status === HTTP_STATUS.NOT_FOUND) {
        throw new ApiException(
          ERROR_CODES.NOT_FOUND_ERROR,
          'Resource not found',
          status,
          data
        )
      }

      // Handle conflict errors
      if (status === HTTP_STATUS.CONFLICT) {
        throw new ApiException(
          ERROR_CODES.CONFLICT_ERROR,
          data.message || 'Conflict detected',
          status,
          data
        )
      }

      // Handle rate limiting
      if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        throw new ApiException(
          ERROR_CODES.RATE_LIMIT_ERROR,
          'Too many requests',
          status,
          data
        )
      }

      // Handle server errors
      if (status >= 500) {
        throw new ApiException(
          ERROR_CODES.SERVER_ERROR,
          'Server error occurred',
          status,
          data
        )
      }

      // Generic client error
      throw new ApiException(
        ERROR_CODES.UNKNOWN_ERROR,
        data.message || 'Request failed',
        status,
        data
      )
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new ApiException(
        ERROR_CODES.TIMEOUT_ERROR,
        'Request timeout'
      )
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      throw new ApiException(
        ERROR_CODES.NETWORK_ERROR,
        'Network error occurred'
      )
    }

    // Unknown error
    throw new ApiException(
      ERROR_CODES.UNKNOWN_ERROR,
      error.message || 'Unknown error occurred'
    )
  }
)

// Export token manager for external use
export { tokenManager }

// Export typed API client
export default apiClient

// Add TypeScript declaration for metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      skipAuth?: boolean
      skipErrorHandling?: boolean
      startTime?: number
      [key: string]: any
    }
  }
}
```

### Step 2: Create API Service Layer

Create `src/services/api/base.service.ts`:

```typescript
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import apiClient from './client'
import { ApiResponse, ApiRequestConfig } from '@/types/api'

export class BaseApiService {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Generic request method
  protected async request<T = any>(
    config: AxiosRequestConfig & ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.request({
      ...config,
      url: config.url?.startsWith('http') ? config.url : `${this.baseUrl}${config.url}`,
    })
    
    return response.data
  }

  // GET request
  protected async get<T = any>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url,
    })
  }

  // POST request
  protected async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data,
    })
  }

  // PUT request
  protected async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url,
      data,
    })
  }

  // PATCH request
  protected async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url,
      data,
    })
  }

  // DELETE request
  protected async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url,
    })
  }

  // Upload file with progress
  protected async upload<T = any>(
    url: string,
    file: File,
    config?: ApiRequestConfig & {
      onUploadProgress?: (progress: number) => void
      additionalData?: Record<string, any>
    }
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (config?.additionalData) {
      Object.entries(config.additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (config?.onUploadProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100
          config.onUploadProgress(Math.round(progress))
        }
      },
      ...config,
    })
  }

  // Download file
  protected async download(
    url: string,
    filename?: string,
    config?: ApiRequestConfig & {
      onDownloadProgress?: (progress: number) => void
    }
  ): Promise<void> {
    const response = await apiClient.request({
      method: 'GET',
      url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (config?.onDownloadProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100
          config.onDownloadProgress(Math.round(progress))
        }
      },
      ...config,
    })

    // Create download link
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

export default BaseApiService
```

---

## Error Handling & Retry Logic

**🤔 WHY Error Handling Matters**

Error handling in API integration is like having a comprehensive insurance policy for your application. In a world where network failures, server downtime, and data inconsistencies are inevitable, robust error handling transforms potential disasters into manageable situations. Modern applications must gracefully handle everything from momentary network hiccups to catastrophic server failures while maintaining user trust and data integrity.

**🎯 WHAT Is Strategic Error Handling**

Strategic error handling encompasses:
- **Graceful Degradation**: Maintaining core functionality during failures
- **User Communication**: Clear, actionable error messages without technical jargon
- **Automatic Recovery**: Intelligent retry mechanisms with exponential backoff
- **Error Classification**: Distinguishing between recoverable and non-recoverable errors
- **State Management**: Preventing UI inconsistencies during error scenarios
- **Logging & Monitoring**: Comprehensive error tracking for debugging and analytics

**⏰ WHEN to Apply Different Error Strategies**

Different scenarios require different approaches:

- **Network Timeouts**: Automatic retry with exponential backoff
- **Authentication Failures**: Immediate redirect to login, token refresh attempts
- **Validation Errors**: Immediate user feedback, no retries
- **Server Errors (5xx)**: Retry with backoff, fallback content
- **Client Errors (4xx)**: User notification, possible fallback actions
- **Rate Limiting**: Respect retry-after headers, queue requests
- **Offline Scenarios**: Queue operations, sync when online

**🚀 HOW to Implement Comprehensive Error Handling**

The implementation follows a layered approach:

1. **Detection Layer**: Classify and categorize errors
2. **Strategy Layer**: Apply appropriate recovery mechanisms
3. **Communication Layer**: Provide meaningful user feedback
4. **Recovery Layer**: Attempt automatic resolution when appropriate
5. **Monitoring Layer**: Track patterns and performance

### Step 1: Create Error Handler

Create `src/services/api/errorHandler.ts`:

```typescript
import { toast } from 'react-hot-toast'
import { ApiException } from './client'
import { ERROR_CODES } from '@/config/api.config'

export interface ErrorHandlerOptions {
  showToast?: boolean
  customMessage?: string
  silent?: boolean
  retryCallback?: () => Promise<void>
}

export class ErrorHandler {
  static handle(error: unknown, options: ErrorHandlerOptions = {}) {
    const {
      showToast = true,
      customMessage,
      silent = false,
      retryCallback,
    } = options

    let message = 'An unexpected error occurred'
    let code = ERROR_CODES.UNKNOWN_ERROR
    let status = 0

    if (error instanceof ApiException) {
      message = error.message
      code = error.code
      status = error.status || 0
    } else if (error instanceof Error) {
      message = error.message
    }

    const finalMessage = customMessage || message

    if (!silent) {
      console.error('API Error:', {
        code,
        message: finalMessage,
        status,
        error,
      })
    }

    if (showToast) {
      this.showErrorToast(code, finalMessage, retryCallback)
    }

    return {
      code,
      message: finalMessage,
      status,
      canRetry: this.canRetry(code),
    }
  }

  private static showErrorToast(
    code: string,
    message: string,
    retryCallback?: () => Promise<void>
  ) {
    const isRetryable = this.canRetry(code)
    
    if (isRetryable && retryCallback) {
      toast.error(
        (t) => (
          <div>
            <div>{message}</div>
            <div className="mt-2 flex gap-2">
              <button
                className="text-sm bg-white text-gray-800 px-2 py-1 rounded"
                onClick={() => {
                  toast.dismiss(t.id)
                  retryCallback()
                }}
              >
                Retry
              </button>
              <button
                className="text-sm text-gray-500 px-2 py-1 rounded"
                onClick={() => toast.dismiss(t.id)}
              >
                Dismiss
              </button>
            </div>
          </div>
        ),
        { duration: 8000 }
      )
    } else {
      toast.error(message, {
        duration: this.getToastDuration(code),
      })
    }
  }

  private static canRetry(code: string): boolean {
    return [
      ERROR_CODES.NETWORK_ERROR,
      ERROR_CODES.TIMEOUT_ERROR,
      ERROR_CODES.SERVER_ERROR,
      ERROR_CODES.RATE_LIMIT_ERROR,
    ].includes(code)
  }

  private static getToastDuration(code: string): number {
    switch (code) {
      case ERROR_CODES.VALIDATION_ERROR:
        return 6000
      case ERROR_CODES.AUTHENTICATION_ERROR:
      case ERROR_CODES.AUTHORIZATION_ERROR:
        return 4000
      case ERROR_CODES.NETWORK_ERROR:
      case ERROR_CODES.TIMEOUT_ERROR:
        return 8000
      default:
        return 5000
    }
  }

  static createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    maxRetries = 3,
    delay = 1000
  ): T {
    return (async (...args: Parameters<T>) => {
      let lastError: any
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn(...args)
        } catch (error) {
          lastError = error
          
          if (attempt === maxRetries) {
            break
          }
          
          if (error instanceof ApiException && !this.canRetry(error.code)) {
            break
          }
          
          // Wait before retrying with exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, delay * Math.pow(2, attempt))
          )
        }
      }
      
      throw lastError
    }) as T
  }
}

// Hook for error handling
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: unknown, options?: ErrorHandlerOptions) => {
    return ErrorHandler.handle(error, options)
  }, [])

  const createRetryableRequest = React.useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    maxRetries = 3,
    delay = 1000
  ) => {
    return ErrorHandler.createRetryWrapper(fn, maxRetries, delay)
  }, [])

  return {
    handleError,
    createRetryableRequest,
  }
}

export default ErrorHandler
```

### Step 2: Create Loading State Management

Create `src/hooks/useApiState.ts`:

```typescript
import { useState, useCallback } from 'react'
import { ErrorHandler, ErrorHandlerOptions } from '@/services/api/errorHandler'

interface ApiState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  success: boolean
}

interface UseApiStateOptions {
  initialData?: any
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  errorOptions?: ErrorHandlerOptions
}

export const useApiState = <T = any>(options: UseApiStateOptions = {}) => {
  const {
    initialData = null,
    onSuccess,
    onError,
    errorOptions = {},
  } = options

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    success: false,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }))
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null, success: true }))
    onSuccess?.(data)
  }, [onSuccess])

  const setError = useCallback((error: unknown) => {
    const errorInfo = ErrorHandler.handle(error, errorOptions)
    setState(prev => ({ 
      ...prev, 
      error: errorInfo.message, 
      loading: false, 
      success: false 
    }))
    onError?.(error)
  }, [onError, errorOptions])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      success: false,
    })
  }, [initialData])

  const execute = useCallback(async <R = T>(
    apiCall: () => Promise<R>,
    options: {
      silent?: boolean
      onSuccess?: (data: R) => void
      onError?: (error: any) => void
    } = {}
  ) => {
    const { silent = false, onSuccess: localOnSuccess, onError: localOnError } = options

    try {
      if (!silent) setLoading(true)
      const result = await apiCall()
      setData(result as unknown as T)
      localOnSuccess?.(result)
      return result
    } catch (error) {
      setError(error)
      localOnError?.(error)
      throw error
    }
  }, [setLoading, setData, setError])

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
    execute,
  }
}

export default useApiState
```

---

## Authentication Integration

**🤔 WHY Authentication Integration Is Critical**

Authentication integration is the security backbone of modern web applications, determining who can access what resources and when. In today's security-conscious environment, authentication must balance robust security with seamless user experience. Poor authentication implementation leads to security vulnerabilities, user frustration, and potential data breaches. Modern authentication goes beyond simple login/logout to include token management, session persistence, role-based access control, and secure state synchronization across application components.

**🎯 WHAT Is Comprehensive Authentication**

Modern authentication integration encompasses:
- **JWT Token Management**: Secure storage, automatic refresh, and expiration handling
- **State Synchronization**: Keeping authentication state consistent across the application
- **Route Protection**: Securing sensitive areas based on authentication status
- **Role-Based Access Control (RBAC)**: Granular permissions based on user roles
- **Session Persistence**: Maintaining login state across browser sessions
- **Security Best Practices**: HTTPS, secure storage, token rotation
- **Error Handling**: Graceful handling of authentication failures

**⏰ WHEN to Apply Different Auth Strategies**

Authentication strategies vary by use case:

- **Public APIs**: Token-based authentication with refresh mechanisms
- **Enterprise Apps**: OAuth 2.0/OpenID Connect with identity providers
- **Simple Apps**: Session-based authentication with secure cookies
- **Mobile Apps**: Long-lived refresh tokens with short-lived access tokens
- **Multi-tenant Apps**: Tenant-aware authentication with scope management
- **Real-time Apps**: WebSocket authentication with token validation

**🚀 HOW to Implement Secure Authentication**

Implementation follows security-first principles:

1. **Token Management**: Secure storage and automatic refresh
2. **State Management**: Centralized authentication state
3. **Route Protection**: Conditional rendering and navigation guards
4. **Error Handling**: Graceful authentication failure management
5. **Security Headers**: CORS, CSP, and security best practices

### Step 1: Create Auth Service

Create `src/services/api/auth.service.ts`:

```typescript
import { BaseApiService } from './base.service'
import { API_ENDPOINTS } from '@/config/api.config'
import {
  LoginRequest,
  LoginResponse,
  User,
  RefreshTokenResponse,
  AuthTokens,
} from '@/types/api'
import { tokenManager } from './client'

export class AuthService extends BaseApiService {
  constructor() {
    super('')
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { skipAuth: true }
    )

    // Store tokens
    if (response.data.tokens) {
      tokenManager.setTokens(response.data.tokens)
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Always clear tokens, even if logout request fails
      tokenManager.clearTokens()
    }
  }

  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<User> {
    const response = await this.post<User>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      { skipAuth: true }
    )

    return response.data
  }

  async refreshToken(): Promise<string> {
    const tokens = tokenManager.getTokens()
    if (!tokens) {
      throw new Error('No refresh token available')
    }

    const response = await this.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken: tokens.refreshToken },
      { skipAuth: true }
    )

    const newTokens: AuthTokens = {
      ...tokens,
      accessToken: response.data.accessToken,
      expiresAt: response.data.expiresAt,
    }

    tokenManager.setTokens(newTokens)
    return response.data.accessToken
  }

  async forgotPassword(email: string): Promise<void> {
    await this.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      { skipAuth: true }
    )
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password: newPassword },
      { skipAuth: true }
    )
  }

  async verifyEmail(token: string): Promise<void> {
    await this.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      { token },
      { skipAuth: true }
    )
  }

  getCurrentUser(): User | null {
    const tokens = tokenManager.getTokens()
    if (!tokens) return null

    try {
      // Decode JWT payload (basic implementation)
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]))
      return payload.user
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    const tokens = tokenManager.getTokens()
    return !!(tokens && !tokenManager.isTokenExpired())
  }

  getAccessToken(): string | null {
    const tokens = tokenManager.getTokens()
    return tokens?.accessToken || null
  }
}

// Create singleton instance
export const authService = new AuthService()
export default authService
```

### Step 2: Create Auth Hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/api/auth.service'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setUser, clearUser, setLoading } from '@/store/slices/authSlice'
import { User, LoginRequest } from '@/types/api'
import { useApiState } from './useApiState'

export const useAuth = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { user, isAuthenticated, loading } = useAppSelector(state => state.auth)
  
  const loginState = useApiState<User>({
    onSuccess: (userData) => {
      dispatch(setUser(userData))
      navigate('/dashboard')
    },
  })

  const logoutState = useApiState({
    onSuccess: () => {
      dispatch(clearUser())
      navigate('/auth/login')
    },
  })

  const registerState = useApiState<User>({
    onSuccess: () => {
      navigate('/auth/login', {
        state: { message: 'Registration successful! Please log in.' }
      })
    },
  })

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(setLoading(true))
      
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            dispatch(setUser(currentUser))
          } else {
            dispatch(clearUser())
          }
        } else {
          dispatch(clearUser())
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        dispatch(clearUser())
      } finally {
        dispatch(setLoading(false))
      }
    }

    checkAuthStatus()
  }, [dispatch])

  const login = useCallback(async (credentials: LoginRequest) => {
    return loginState.execute(async () => {
      const response = await authService.login(credentials)
      return response.user
    })
  }, [loginState])

  const logout = useCallback(async () => {
    return logoutState.execute(async () => {
      await authService.logout()
    })
  }, [logoutState])

  const register = useCallback(async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => {
    return registerState.execute(async () => {
      return await authService.register(userData)
    })
  }, [registerState])

  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword(email)
  }, [])

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    await authService.resetPassword(token, newPassword)
  }, [])

  return {
    // State
    user,
    isAuthenticated,
    loading: loading || loginState.loading || logoutState.loading || registerState.loading,
    
    // Login state
    loginError: loginState.error,
    loginLoading: loginState.loading,
    
    // Register state
    registerError: registerState.error,
    registerLoading: registerState.loading,
    
    // Logout state
    logoutLoading: logoutState.loading,
    
    // Actions
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    
    // Utilities
    getAccessToken: authService.getAccessToken.bind(authService),
  }
}

export default useAuth
```

---

## RTK Query Integration

**🤔 WHY RTK Query with Axios**

RTK Query represents the evolution from manual state management to declarative data fetching. It eliminates the boilerplate of managing loading states, errors, and cache invalidation while providing powerful features like automatic refetching, optimistic updates, and background synchronization. Combined with Axios, it creates a robust API layer that handles everything from simple CRUD operations to complex real-time applications with enterprise-grade reliability.

**🎯 WHAT RTK Query Provides**

RTK Query offers comprehensive data fetching capabilities:
- **Automatic Cache Management**: Intelligent caching with configurable invalidation
- **Background Synchronization**: Keep data fresh without user intervention
- **Request Deduplication**: Prevent redundant API calls
- **Optimistic Updates**: Instant UI updates with rollback on error
- **Normalized State**: Efficient storage and updates of relational data
- **DevTools Integration**: Powerful debugging and monitoring capabilities
- **TypeScript Integration**: End-to-end type safety from API to UI

**⏰ WHEN to Use RTK Query**

RTK Query excels in specific scenarios:

- **Data-Heavy Applications**: Apps with complex state relationships
- **Real-Time Requirements**: Background sync and live updates
- **Performance Critical**: Need for efficient caching and deduplication
- **Team Projects**: Consistent patterns across large development teams
- **Enterprise Applications**: Reliability, monitoring, and debugging requirements

**Alternative Considerations:**
- **Simple Apps**: SWR or React Query might be sufficient
- **Non-Redux Apps**: React Query provides similar benefits
- **Static Data**: Basic fetch or Axios without RTK Query

**🚀 HOW RTK Query Transforms Development**

The transformation follows these principles:

1. **Declarative Queries**: Replace imperative fetch logic with declarative hooks
2. **Automatic State Management**: Eliminate manual loading/error state management
3. **Smart Caching**: Configure cache behavior based on data characteristics
4. **Background Updates**: Keep data fresh through polling and invalidation
5. **Optimistic Patterns**: Implement instant user feedback with error recovery

### Step 1: Configure RTK Query with Axios

Create `src/services/api/rtkQuery.ts`:

```typescript
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, AxiosError } from 'axios'
import apiClient, { ApiException } from './client'
import { ApiResponse } from '@/types/api'

// Custom base query using Axios
const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
  {
    url: string
    method?: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
    meta?: any
  },
  unknown,
  unknown
> =>
async ({ url, method = 'GET', data, params, headers, meta }) => {
  try {
    const result = await apiClient.request({
      url: baseUrl + url,
      method,
      data,
      params,
      headers,
      metadata: meta,
    })
    
    return { data: result.data }
  } catch (axiosError) {
    const error = axiosError as AxiosError | ApiException
    
    return {
      error: {
        status: error instanceof ApiException ? error.status : (error.response?.status || 0),
        data: error instanceof ApiException ? error.data : error.response?.data,
        message: error.message,
      },
    }
  }
}

// Create the API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: '', // Base URL is handled by axios client
  }),
  tagTypes: ['User', 'Task', 'Project', 'Notification'],
  endpoints: () => ({}),
})

export default api
```

### Step 2: Create Task API

Create `src/services/api/tasks.api.ts`:

```typescript
import { api } from './rtkQuery'
import { API_ENDPOINTS } from '@/config/api.config'
import {
  Task,
  TasksResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
} from '@/types/api'

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get tasks with filtering and pagination
    getTasks: builder.query<TasksResponse, TaskFilters & {
      page?: number
      limit?: number
    }>({
      query: (params) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.tasks.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
      // Transform response
      transformResponse: (response: ApiResponse<TasksResponse>) => response.data,
    }),

    // Get single task
    getTask: builder.query<Task, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TASKS.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
      transformResponse: (response: ApiResponse<Task>) => response.data,
    }),

    // Create task
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (task) => ({
        url: API_ENDPOINTS.TASKS.BASE,
        method: 'POST',
        data: task,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
      transformResponse: (response: ApiResponse<Task>) => response.data,
      // Optimistic update
      onQueryStarted: async (newTask, { dispatch, queryFulfilled }) => {
        // Create optimistic task
        const optimisticTask: Task = {
          id: `temp-${Date.now()}`,
          title: newTask.title,
          description: newTask.description || '',
          status: 'todo',
          priority: newTask.priority,
          dueDate: newTask.dueDate,
          assigneeId: newTask.assigneeId,
          projectId: newTask.projectId,
          tags: newTask.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user', // Should come from auth state
        }

        // Optimistically update the cache
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
            draft.tasks.unshift(optimisticTask)
          })
        )

        try {
          await queryFulfilled
        } catch {
          // Revert optimistic update on error
          patchResult.undo()
        }
      },
    }),

    // Update task
    updateTask: builder.mutation<Task, { id: string; updates: UpdateTaskRequest }>({
      query: ({ id, updates }) => ({
        url: API_ENDPOINTS.TASKS.BY_ID(id),
        method: 'PATCH',
        data: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
      transformResponse: (response: ApiResponse<Task>) => response.data,
      // Optimistic update
      onQueryStarted: async ({ id, updates }, { dispatch, queryFulfilled }) => {
        const patchResults: any[] = []

        // Update individual task cache
        patchResults.push(
          dispatch(
            tasksApi.util.updateQueryData('getTask', id, (draft) => {
              Object.assign(draft, updates, { updatedAt: new Date().toISOString() })
            })
          )
        )

        // Update tasks list cache
        patchResults.push(
          dispatch(
            tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
              const taskIndex = draft.tasks.findIndex(task => task.id === id)
              if (taskIndex !== -1) {
                Object.assign(draft.tasks[taskIndex], updates, {
                  updatedAt: new Date().toISOString()
                })
              }
            })
          )
        )

        try {
          await queryFulfilled
        } catch {
          // Revert all optimistic updates on error
          patchResults.forEach(patchResult => patchResult.undo())
        }
      },
    }),

    // Delete task
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TASKS.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
      // Optimistic update
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResults: any[] = []

        // Remove from tasks list
        patchResults.push(
          dispatch(
            tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
              draft.tasks = draft.tasks.filter(task => task.id !== id)
            })
          )
        )

        try {
          await queryFulfilled
        } catch {
          // Revert optimistic updates on error
          patchResults.forEach(patchResult => patchResult.undo())
        }
      },
    }),

    // Bulk update tasks
    bulkUpdateTasks: builder.mutation<Task[], {
      ids: string[]
      updates: Partial<Task>
    }>({
      query: ({ ids, updates }) => ({
        url: `${API_ENDPOINTS.TASKS.BASE}/bulk`,
        method: 'PATCH',
        data: { ids, updates },
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
      transformResponse: (response: ApiResponse<Task[]>) => response.data,
    }),

    // Get task statistics
    getTaskStatistics: builder.query<{
      total: number
      todo: number
      inProgress: number
      done: number
      overdue: number
    }, { projectId?: string; assigneeId?: string }>({
      query: (params) => ({
        url: API_ENDPOINTS.TASKS.STATISTICS,
        method: 'GET',
        params,
      }),
      providesTags: ['Task'],
      transformResponse: (response: ApiResponse) => response.data,
    }),
  }),
})

// Export hooks
export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useBulkUpdateTasksMutation,
  useGetTaskStatisticsQuery,
  
  // Lazy queries
  useLazyGetTasksQuery,
  useLazyGetTaskQuery,
  useLazyGetTaskStatisticsQuery,
} = tasksApi

export default tasksApi
```

---

## Summary

🎉 **Congratulations!** You now have a comprehensive API integration system with:

✅ **Axios Client**: Configured with interceptors, retry logic, and global error handling  
✅ **Authentication**: Automatic token management with refresh logic  
✅ **Error Handling**: Comprehensive error categorization and user feedback  
✅ **RTK Query Integration**: Cache management with optimistic updates  
✅ **Type Safety**: End-to-end TypeScript support for all API operations  
✅ **Performance**: Request deduplication, caching, and background synchronization  
✅ **Developer Experience**: Excellent debugging tools and error reporting  

### Key Benefits Achieved

1. **Robust Error Handling**: Comprehensive error categorization with retry logic
2. **Authentication**: Seamless token management and automatic refresh
3. **Performance**: Optimistic updates and intelligent caching
4. **Type Safety**: Full TypeScript integration from request to response
5. **Developer Experience**: Excellent debugging and monitoring capabilities
6. **Scalability**: Patterns that work from simple CRUD to complex real-time apps

### Next Steps

- **Chapter 7**: Comprehensive testing strategies with Vitest
- **Chapter 8**: Production build and deployment
- **Chapter 9**: Performance optimization and security

---

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React Query vs RTK Query](https://redux-toolkit.js.org/rtk-query/comparison)

---

**Previous**: [← Chapter 5 - Forms & Validation](./05-forms-validation.md) | **Next**: [Chapter 7 - Testing Strategy →](./07-testing-strategy.md)