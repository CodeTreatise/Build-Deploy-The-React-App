# Chapter 7: Testing Strategy 🧪

## Overview

In this chapter, we'll implement a comprehensive testing strategy using Vitest and React Testing Library. We'll establish patterns for unit testing, integration testing, and end-to-end testing that ensure code quality, prevent regressions, and provide confidence in deployments. Our testing approach will cover components, hooks, API integration, and user workflows with modern testing practices.

---

## 📋 Table of Contents

1. [Why Vitest + React Testing Library in 2025?](#why-vitest--react-testing-library-in-2025)
2. [Installation & Configuration](#installation--configuration)
3. [Testing Environment Setup](#testing-environment-setup)
4. [Component Testing Patterns](#component-testing-patterns)
5. [Hook Testing](#hook-testing)
6. [API & Integration Testing](#api--integration-testing)
7. [Redux Store Testing](#redux-store-testing)
8. [Form Testing](#form-testing)
9. [Accessibility Testing](#accessibility-testing)
10. [E2E Testing with Playwright](#e2e-testing-with-playwright)

---

## Why Vitest + React Testing Library in 2025?

**🤔 WHY Modern Testing Matters**

Testing in modern React applications is not just about preventing bugs—it's about enabling confidence in rapid development, refactoring, and deployment. Modern testing strategies shift from implementation-focused testing to user-behavior testing, ensuring that applications work as users expect rather than as developers implement. This philosophical shift improves test reliability, reduces maintenance overhead, and provides better coverage of real-world usage scenarios.

**🎯 WHAT Constitutes Modern Testing Strategy**

Comprehensive modern testing encompasses:
- **User-Centric Testing**: Focus on user interactions and outcomes rather than internal implementation
- **Fast Feedback Loops**: Instant test execution with hot reload capabilities
- **Accessibility Integration**: Built-in accessibility testing as part of the development workflow
- **Integration Testing**: Testing component interactions and API integrations
- **Performance Testing**: Ensuring components perform well under realistic conditions
- **Visual Regression Testing**: Detecting unintended UI changes
- **End-to-End Testing**: Complete user workflow validation

**⏰ WHEN to Apply Different Testing Strategies**

Testing strategies evolve with application complexity:

- **Component Development**: Unit tests for isolated component behavior
- **Feature Development**: Integration tests for component interactions
- **API Integration**: Mock and real API testing strategies
- **User Workflows**: End-to-end testing for critical paths
- **Performance Optimization**: Load and stress testing for bottlenecks
- **Accessibility Compliance**: Automated accessibility auditing
- **Deployment**: Smoke tests and health checks

**🚀 HOW Modern Testing Transforms Development**

The modern testing approach follows these principles:

1. **Test User Behavior**: Write tests that mimic how users interact with your application
2. **Fast Feedback**: Optimize for speed to enable Test-Driven Development (TDD)
3. **Confidence in Changes**: Comprehensive coverage that enables fearless refactoring
4. **Accessibility by Default**: Integrate accessibility testing into development workflow
5. **Realistic Testing**: Use real APIs and data when possible, with strategic mocking

### Technology Comparison & Decision Framework

### Vitest vs Other Test Runners

| Feature | Vitest | Jest | Cypress | Playwright |
|---------|--------|------|---------|------------|
| **Speed** | ⚡ Fastest | Good | Slow | Good |
| **Vite Integration** | ✅ Native | ❌ Config needed | ❌ Separate | ❌ Separate |
| **ES Modules** | ✅ Native | ⚠️ Config needed | ✅ Yes | ✅ Yes |
| **TypeScript** | ✅ Zero config | ⚠️ Config needed | ✅ Good | ✅ Excellent |
| **Watch Mode** | ✅ HMR-like | ✅ Good | ✅ Good | ❌ Limited |
| **Bundle Size** | Small | Large | Large | Medium |
| **Snapshot Testing** | ✅ Built-in | ✅ Built-in | ❌ No | ❌ No |
| **Coverage** | ✅ Built-in | ✅ Built-in | ⚠️ Limited | ⚠️ Limited |
| **Mocking** | ✅ Excellent | ✅ Excellent | ⚠️ Limited | ✅ Good |

### React Testing Library vs Alternatives

| Feature | RTL | Enzyme | Testing Library |
|---------|-----|--------|----------------|
| **Philosophy** | User-focused | Implementation | User-focused |
| **React 18 Support** | ✅ Full | ❌ Limited | ✅ Full |
| **Accessibility** | ✅ Built-in | ❌ Manual | ✅ Built-in |
| **Maintenance** | ✅ Active | ❌ Deprecated | ✅ Active |
| **Learning Curve** | Easy | Medium | Easy |
| **Community** | Large | Declining | Growing |

### Why Choose This Stack?

1. **Performance**: Vitest is 2-10x faster than Jest with Vite integration
2. **Developer Experience**: Hot reload for tests, better error messages
3. **Zero Configuration**: Works out of the box with TypeScript and ES modules
4. **Modern Testing**: Focused on user behavior rather than implementation details
5. **Accessibility**: Built-in accessibility testing capabilities
6. **Ecosystem**: Great integration with modern React patterns and tools

### When to Use This Stack

✅ **Use Vitest + RTL when you have:**
- Vite-based React applications
- TypeScript projects
- Need for fast test execution
- Focus on user behavior testing
- Modern React patterns (hooks, suspense, etc.)

❌ **Consider alternatives when you have:**
- Legacy Jest setup that works well
- Heavy investment in Enzyme tests
- Need for specific testing library features
- Team unfamiliar with modern testing practices

---

## Installation & Configuration

**🤔 WHY Strategic Testing Setup Matters**

A well-configured testing environment is the foundation of a sustainable testing strategy. Poor configuration leads to flaky tests, slow feedback loops, and developer frustration. Modern testing setup requires careful consideration of browser environments, module resolution, TypeScript integration, and performance optimization. The goal is zero-friction testing where developers naturally write tests because the experience is seamless and productive.

**🎯 WHAT Comprehensive Testing Setup Includes**

Modern testing configuration encompasses:
- **Environment Simulation**: Accurate browser environment simulation with jsdom
- **Module Resolution**: Seamless handling of ES modules and TypeScript
- **Performance Optimization**: Fast test execution with intelligent caching
- **Developer Experience**: Hot reload, watch mode, and intuitive debugging
- **Coverage Integration**: Comprehensive coverage reporting with visual feedback
- **CI/CD Integration**: Reliable test execution in continuous integration environments

**⏰ WHEN to Prioritize Different Configuration Aspects**

Configuration priorities shift based on project stage:

- **Project Initialization**: Focus on basic setup and developer experience
- **Team Growth**: Emphasize consistency and shared configuration
- **Scale Challenges**: Optimize for performance and parallelization
- **Quality Gates**: Integrate coverage thresholds and quality metrics
- **Production Readiness**: Add comprehensive E2E and integration testing

**🚀 HOW to Build Robust Testing Foundation**

Implementation follows progressive enhancement:

1. **Core Setup**: Basic Vitest configuration with essential plugins
2. **Environment Configuration**: Browser simulation and module handling
3. **Developer Tools**: Watch mode, UI, and debugging capabilities
4. **Quality Gates**: Coverage thresholds and reporting
5. **Advanced Features**: Snapshot testing, visual regression, performance testing

### Step 1: Install Dependencies

```bash
# Install Vitest and testing utilities
npm install --save-dev vitest

# Install React Testing Library ecosystem
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event

# Install testing utilities for specific libraries
npm install --save-dev @testing-library/react-hooks
npm install --save-dev @redux-devtools/extension

# Install additional testing tools
npm install --save-dev jsdom
npm install --save-dev @vitest/coverage-v8
npm install --save-dev @vitest/ui

# For accessibility testing
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe

# For API mocking
npm install --save-dev msw
npm install --save-dev whatwg-fetch

# For E2E testing (optional)
npm install --save-dev @playwright/test
```

### Step 2: Configure Vitest

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test configuration
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Watch mode
    watch: {
      ignore: ['**/coverage/**', '**/dist/**'],
    },
    
    // Test files pattern
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    
    // Timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Parallel execution
    threads: true,
    maxThreads: 4,
    minThreads: 1,
  },
})
```

### Step 3: Create Test Setup

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { server } from './mocks/server'

// Mock implementations
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
global.sessionStorage = localStorageMock

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  cleanup()
  vi.clearAllMocks()
  localStorageMock.clear()
})
afterAll(() => server.close())

// Mock console methods in tests
global.console = {
  ...console,
  // Uncomment to ignore specific log levels
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Set up fake timers
vi.useFakeTimers()
```

### Step 4: Create Testing Utilities

Create `src/test/utils.tsx`:

```typescript
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { configureStore } from '@reduxjs/toolkit'
import { theme } from '@/configs/theme.config'
import { rootReducer } from '@/store/rootReducer'

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any
  store?: any
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    }),
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Set initial route
  window.history.pushState({}, 'Test page', route)

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Re-export everything
export * from '@testing-library/react'
export { renderWithProviders as render }

// Custom queries
export const getByTestId = (testId: string) => 
  document.querySelector(`[data-testid="${testId}"]`)

export const getAllByTestId = (testId: string) => 
  document.querySelectorAll(`[data-testid="${testId}"]`)

// Utility functions
export const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  })

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user' as const,
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides,
})

export const createMockTask = (overrides = {}) => ({
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  priority: 'medium' as const,
  tags: [],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  createdBy: '1',
  ...overrides,
})

// Test data builders
export class UserBuilder {
  private user = createMockUser()

  withId(id: string) {
    this.user.id = id
    return this
  }

  withEmail(email: string) {
    this.user.email = email
    return this
  }

  withName(firstName: string, lastName: string) {
    this.user.firstName = firstName
    this.user.lastName = lastName
    return this
  }

  withRole(role: 'user' | 'admin' | 'moderator') {
    this.user.role = role
    return this
  }

  build() {
    return { ...this.user }
  }
}

export class TaskBuilder {
  private task = createMockTask()

  withId(id: string) {
    this.task.id = id
    return this
  }

  withTitle(title: string) {
    this.task.title = title
    return this
  }

  withStatus(status: 'todo' | 'in-progress' | 'done') {
    this.task.status = status
    return this
  }

  withPriority(priority: 'low' | 'medium' | 'high') {
    this.task.priority = priority
    return this
  }

  withTags(tags: string[]) {
    this.task.tags = tags
    return this
  }

  build() {
    return { ...this.task }
  }
}

// Mock generators
export const generateMockUsers = (count: number) =>
  Array.from({ length: count }, (_, index) => 
    new UserBuilder()
      .withId(`user-${index + 1}`)
      .withEmail(`user${index + 1}@example.com`)
      .withName(`User${index + 1}`, `Last${index + 1}`)
      .build()
  )

export const generateMockTasks = (count: number) =>
  Array.from({ length: count }, (_, index) => 
    new TaskBuilder()
      .withId(`task-${index + 1}`)
      .withTitle(`Task ${index + 1}`)
      .build()
  )
```

### Step 5: Create MSW Mocks

Create `src/test/mocks/handlers.ts`:

```typescript
import { rest } from 'msw'
import { API_ENDPOINTS } from '@/config/api.config'
import { createMockUser, createMockTask } from '../utils'

const baseUrl = 'http://localhost:3000/api'

export const handlers = [
  // Auth endpoints
  rest.post(`${baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, (req, res, ctx) => {
    const { email, password } = req.body as any
    
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          data: {
            user: createMockUser({ email }),
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              expiresAt: Date.now() + 3600000,
              tokenType: 'Bearer' as const,
            },
          },
        })
      )
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid credentials',
        },
      })
    )
  }),

  rest.post(`${baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: null }))
  }),

  rest.post(`${baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          accessToken: 'new-mock-access-token',
          expiresAt: Date.now() + 3600000,
        },
      })
    )
  }),

  // Tasks endpoints
  rest.get(`${baseUrl}${API_ENDPOINTS.TASKS.BASE}`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1
    const limit = Number(req.url.searchParams.get('limit')) || 10
    const status = req.url.searchParams.get('status')
    
    let tasks = [
      createMockTask({ id: '1', title: 'Task 1', status: 'todo' }),
      createMockTask({ id: '2', title: 'Task 2', status: 'in-progress' }),
      createMockTask({ id: '3', title: 'Task 3', status: 'done' }),
    ]
    
    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }
    
    const startIndex = (page - 1) * limit
    const paginatedTasks = tasks.slice(startIndex, startIndex + limit)
    
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          tasks: paginatedTasks,
          pagination: {
            page,
            limit,
            total: tasks.length,
            totalPages: Math.ceil(tasks.length / limit),
            hasNext: page * limit < tasks.length,
            hasPrev: page > 1,
          },
        },
      })
    )
  }),

  rest.get(`${baseUrl}/tasks/:id`, (req, res, ctx) => {
    const { id } = req.params
    
    if (id === '404') {
      return res(
        ctx.status(404),
        ctx.json({
          error: {
            code: 'NOT_FOUND_ERROR',
            message: 'Task not found',
          },
        })
      )
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        data: createMockTask({ id: id as string }),
      })
    )
  }),

  rest.post(`${baseUrl}${API_ENDPOINTS.TASKS.BASE}`, (req, res, ctx) => {
    const taskData = req.body as any
    
    return res(
      ctx.status(201),
      ctx.json({
        data: createMockTask({
          id: `new-task-${Date.now()}`,
          ...taskData,
        }),
      })
    )
  }),

  rest.patch(`${baseUrl}/tasks/:id`, (req, res, ctx) => {
    const { id } = req.params
    const updates = req.body as any
    
    return res(
      ctx.status(200),
      ctx.json({
        data: createMockTask({
          id: id as string,
          ...updates,
          updatedAt: new Date().toISOString(),
        }),
      })
    )
  }),

  rest.delete(`${baseUrl}/tasks/:id`, (req, res, ctx) => {
    return res(ctx.status(204))
  }),

  // Error simulation endpoints
  rest.get(`${baseUrl}/error/500`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }))
  }),

  rest.get(`${baseUrl}/error/timeout`, (req, res, ctx) => {
    return res(ctx.delay('infinite'))
  }),
]
```

Create `src/test/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup MSW server for Node.js environment (testing)
export const server = setupServer(...handlers)
```

---

## Testing Environment Setup

### Step 1: Package.json Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Step 2: Create Test Configuration

Create `vitest.workspace.ts`:

```typescript
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // Unit and integration tests
  {
    test: {
      name: 'unit',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['src/**/*.e2e.{test,spec}.{ts,tsx}'],
      environment: 'jsdom',
    },
  },
  // E2E tests
  {
    test: {
      name: 'e2e',
      include: ['src/**/*.e2e.{test,spec}.{ts,tsx}'],
      environment: 'node',
    },
  },
])
```

### Step 3: TypeScript Configuration for Tests

Create `tsconfig.test.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "allowJs": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*",
    "src/**/*.test.*",
    "src/**/*.spec.*",
    "src/test/**/*"
  ],
  "exclude": ["node_modules", "dist"]
}
```

---

## Component Testing Patterns

**🤔 WHY Component Testing Is Fundamental**

Component testing forms the foundation of a reliable testing strategy because components are the building blocks of React applications. Effective component testing ensures that individual pieces work correctly in isolation while providing fast feedback during development. Unlike end-to-end tests, component tests run quickly and pinpoint exactly where failures occur, making them essential for Test-Driven Development (TDD) and continuous integration workflows.

**🎯 WHAT Effective Component Testing Covers**

Comprehensive component testing addresses:
- **User Interactions**: Click events, form submissions, keyboard navigation
- **State Changes**: Internal state updates and prop-driven behavior changes
- **Accessibility**: Screen reader compatibility, keyboard navigation, ARIA attributes
- **Error Handling**: Graceful handling of invalid props and error states
- **Edge Cases**: Empty states, loading states, and boundary conditions
- **Integration Points**: Component interactions and data flow
- **Visual Behavior**: Conditional rendering and style applications

**⏰ WHEN to Write Different Types of Component Tests**

Testing strategies vary by component complexity:

- **Simple Components**: Focus on rendering and basic interactions
- **Complex Components**: Test state management and side effects
- **Form Components**: Validate user input and validation logic
- **Connected Components**: Mock external dependencies and test integration
- **Higher-Order Components**: Test enhancement behavior and prop passing
- **Custom Hooks**: Isolate hook logic from component rendering

**🚀 HOW to Structure Effective Component Tests**

Implementation follows user-centric patterns:

1. **Arrange**: Set up component with realistic props and context
2. **Act**: Simulate user interactions (clicks, typing, navigation)
3. **Assert**: Verify expected outcomes from user perspective
4. **Accessibility**: Ensure components work with assistive technologies
5. **Error Scenarios**: Test graceful handling of error conditions

### Step 1: Basic Component Tests

Create `src/components/ui/__tests__/Button.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('btn-primary')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-secondary')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    
    render(<Button ref={ref}>Button</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
```

### Step 2: Complex Component Tests

Create `src/components/forms/__tests__/TaskForm.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, createMockTask } from '@/test/utils'
import { TaskForm } from '../TaskForm'

describe('TaskForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Creation Mode', () => {
    it('renders all form fields', () => {
      render(<TaskForm {...defaultProps} />)

      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    })

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined)

      render(<TaskForm {...defaultProps} onSubmit={mockOnSubmit} />)

      // Fill form
      await user.type(screen.getByLabelText(/task title/i), 'New Task')
      await user.type(screen.getByLabelText(/description/i), 'Task description')
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high')

      // Submit
      await user.click(screen.getByRole('button', { name: /create task/i }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'Task description',
          status: 'todo',
          priority: 'high',
          dueDate: '',
          tags: [],
        })
      })
    })

    it('shows validation errors for empty title', async () => {
      const user = userEvent.setup()

      render(<TaskForm {...defaultProps} />)

      // Try to submit without title
      await user.click(screen.getByRole('button', { name: /create task/i }))

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      })
    })

    it('allows adding and removing tags', async () => {
      const user = userEvent.setup()

      render(<TaskForm {...defaultProps} />)

      const tagInput = screen.getByLabelText(/add tag/i)
      const addButton = screen.getByRole('button', { name: /add/i })

      // Add first tag
      await user.type(tagInput, 'urgent')
      await user.click(addButton)

      expect(screen.getByText('urgent')).toBeInTheDocument()
      expect(tagInput).toHaveValue('')

      // Add second tag
      await user.type(tagInput, 'frontend')
      await user.click(addButton)

      expect(screen.getByText('frontend')).toBeInTheDocument()

      // Remove first tag
      await user.click(screen.getByLabelText(/remove urgent tag/i))

      expect(screen.queryByText('urgent')).not.toBeInTheDocument()
      expect(screen.getByText('frontend')).toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    const existingTask = createMockTask({
      id: '1',
      title: 'Existing Task',
      description: 'Existing description',
      priority: 'high',
      tags: ['existing', 'task'],
    })

    it('populates form with existing data', () => {
      render(<TaskForm {...defaultProps} initialData={existingTask} />)

      expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('high')).toBeInTheDocument()
      expect(screen.getByText('existing')).toBeInTheDocument()
      expect(screen.getByText('task')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument()
    })

    it('submits updated data', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined)

      render(
        <TaskForm 
          {...defaultProps} 
          initialData={existingTask}
          onSubmit={mockOnSubmit}
        />
      )

      // Update title
      const titleInput = screen.getByDisplayValue('Existing Task')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Task')

      // Submit
      await user.click(screen.getByRole('button', { name: /update task/i }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Updated Task',
          description: 'Existing description',
          status: 'todo',
          priority: 'high',
          dueDate: '',
          tags: ['existing', 'task'],
        })
      })
    })
  })

  describe('Loading State', () => {
    it('disables form during submission', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)))

      render(<TaskForm {...defaultProps} onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/task title/i), 'Test Task')
      await user.click(screen.getByRole('button', { name: /create task/i }))

      // Form should be disabled during submission
      expect(screen.getByLabelText(/task title/i)).toBeDisabled()
      expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled()
    })

    it('shows loading indicator', () => {
      render(<TaskForm {...defaultProps} loading />)

      expect(screen.getByTestId('form-loading')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<TaskForm {...defaultProps} />)

      // All form controls should have labels
      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    })

    it('announces validation errors to screen readers', async () => {
      const user = userEvent.setup()

      render(<TaskForm {...defaultProps} />)

      await user.click(screen.getByRole('button', { name: /create task/i }))

      await waitFor(() => {
        const errorMessage = screen.getByText(/title is required/i)
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })
  })
})
```

### Step 3: Testing Components with Context

Create `src/components/auth/__tests__/LoginForm.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    render(<LoginForm {...defaultProps} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('submits form with credentials', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByLabelText(/remember me/i))
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      })
    })
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()

    render(<LoginForm {...defaultProps} />)

    // Submit without filling fields
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows server errors', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn().mockRejectedValue(
      new Error('Invalid credentials')
    )

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('handles loading state', async () => {
    const user = userEvent.setup()
    let resolveSubmit: (value: any) => void
    const mockOnSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => { resolveSubmit = resolve })
    )

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    // Should show loading state
    expect(screen.getByRole('button', { name: /signing in.../i })).toBeDisabled()

    // Resolve the promise
    resolveSubmit!(undefined)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled()
    })
  })

  it('navigates to register page', async () => {
    const user = userEvent.setup()

    render(<LoginForm {...defaultProps} />, { route: '/auth/login' })

    await user.click(screen.getByRole('link', { name: /sign up/i }))

    expect(window.location.pathname).toBe('/auth/register')
  })
})
```

---

## Hook Testing

**🤔 WHY Hook Testing Is Critical**

Custom hooks encapsulate stateful logic and side effects, making them the nerve center of modern React applications. Testing hooks in isolation provides confidence in complex state management, API interactions, and business logic without the complexity of component rendering. Hook testing enables true unit testing of logic while ensuring that the hook's contract remains stable as implementation details change.

**🎯 WHAT Hook Testing Should Validate**

Comprehensive hook testing covers:
- **State Management**: Initial state, state transitions, and state persistence
- **Side Effects**: API calls, timers, event listeners, and cleanup
- **Dependencies**: Proper handling of dependency arrays and re-execution logic
- **Error Handling**: Graceful error recovery and error state management
- **Performance**: Memoization, debouncing, and optimization patterns
- **Lifecycle**: Mounting, updating, and unmounting behavior
- **Edge Cases**: Boundary conditions and unexpected input handling

**⏰ WHEN to Test Hooks vs Components**

Testing strategy depends on the abstraction level:

- **Hook Testing**: For isolated business logic, state management, API interactions
- **Component Testing**: For UI behavior, user interactions, accessibility
- **Integration Testing**: For hook + component interaction and data flow
- **E2E Testing**: For complete user workflows and system integration

**🚀 HOW to Structure Effective Hook Tests**

Hook testing follows these patterns:

1. **Isolation**: Test hooks independently of components
2. **Realistic Usage**: Simulate how hooks are used in real components
3. **Async Handling**: Properly test async operations and state updates
4. **Cleanup Testing**: Verify proper cleanup of side effects
5. **Performance Testing**: Validate optimization patterns and re-render behavior

### Step 1: Testing Custom Hooks

Create `src/hooks/__tests__/useApiState.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useApiState } from '../useApiState'

describe('useApiState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useApiState())

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(false)
  })

  it('initializes with custom initial data', () => {
    const initialData = { test: 'data' }
    const { result } = renderHook(() => useApiState({ initialData }))

    expect(result.current.data).toEqual(initialData)
  })

  it('handles successful API call', async () => {
    const { result } = renderHook(() => useApiState())
    const mockApiCall = vi.fn().mockResolvedValue('success data')

    await result.current.execute(mockApiCall)

    expect(result.current.data).toBe('success data')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(true)
  })

  it('handles API call errors', async () => {
    const { result } = renderHook(() => useApiState())
    const mockApiCall = vi.fn().mockRejectedValue(new Error('API Error'))

    try {
      await result.current.execute(mockApiCall)
    } catch (error) {
      // Error should be thrown
    }

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('API Error')
    expect(result.current.success).toBe(false)
  })

  it('sets loading state during API call', async () => {
    const { result } = renderHook(() => useApiState())
    let resolveApiCall: (value: any) => void
    const mockApiCall = vi.fn().mockImplementation(
      () => new Promise(resolve => { resolveApiCall = resolve })
    )

    // Start API call
    const promise = result.current.execute(mockApiCall)

    // Should be loading
    expect(result.current.loading).toBe(true)

    // Resolve API call
    resolveApiCall!('data')
    await promise

    expect(result.current.loading).toBe(false)
  })

  it('calls onSuccess callback', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useApiState({ onSuccess }))
    const mockApiCall = vi.fn().mockResolvedValue('success data')

    await result.current.execute(mockApiCall)

    expect(onSuccess).toHaveBeenCalledWith('success data')
  })

  it('calls onError callback', async () => {
    const onError = vi.fn()
    const { result } = renderHook(() => useApiState({ onError }))
    const mockApiCall = vi.fn().mockRejectedValue(new Error('API Error'))

    try {
      await result.current.execute(mockApiCall)
    } catch (error) {
      // Expected to throw
    }

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
  })

  it('resets state correctly', () => {
    const { result } = renderHook(() => useApiState())

    // Set some state
    result.current.setData('test data')
    result.current.setError('test error')

    // Reset
    result.current.reset()

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(false)
  })
})
```

### Step 2: Testing Hooks with Context

Create `src/hooks/__tests__/useAuth.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { useAuth } from '../useAuth'
import { rootReducer } from '@/store/rootReducer'

// Test wrapper
const createWrapper = (initialState = {}) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  })

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('initializes with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.loading).toBe(false)
  })

  it('handles successful login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await result.current.login({
      email: 'test@example.com',
      password: 'password',
    })

    await waitFor(() => {
      expect(result.current.user).toBeTruthy()
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.loginError).toBeNull()
    })
  })

  it('handles login failure', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    try {
      await result.current.login({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })
    } catch (error) {
      // Expected to fail
    }

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.loginError).toBeTruthy()
    })
  })

  it('handles logout', async () => {
    const initialState = {
      auth: {
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        loading: false,
      },
    }

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(initialState),
    })

    await result.current.logout()

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  it('persists authentication state', () => {
    // Simulate existing tokens in localStorage
    const mockTokens = {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expiresAt: Date.now() + 3600000,
      tokenType: 'Bearer',
    }
    localStorage.setItem('auth_tokens', JSON.stringify(mockTokens))

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Should load user from stored tokens
    expect(result.current.getAccessToken()).toBe('mock-token')
  })
})
```

---

## API & Integration Testing

**🤔 WHY API Testing Is Essential**

API testing bridges the gap between unit tests and end-to-end tests, providing confidence in the critical integration points where your application communicates with external services. In modern React applications, API integration failures are often the source of the most critical bugs—authentication failures, data inconsistencies, and performance issues. Comprehensive API testing ensures that your application handles both success and failure scenarios gracefully.

**🎯 WHAT API Testing Should Cover**

Comprehensive API testing addresses:
- **Request Formation**: Proper headers, authentication, and payload structure
- **Response Handling**: Success scenarios, error parsing, and data transformation
- **Error Scenarios**: Network failures, timeout handling, and retry logic
- **Authentication**: Token management, refresh flows, and security headers
- **State Management**: Cache invalidation, optimistic updates, and rollback scenarios
- **Performance**: Request timing, retry behavior, and rate limiting
- **Integration**: Service-to-service communication and data flow

**⏰ WHEN to Use Different API Testing Strategies**

Testing approaches vary by integration complexity:

- **Mock APIs**: For isolated unit testing and deterministic scenarios
- **Test APIs**: For integration testing with controlled data
- **Staging APIs**: For realistic testing with production-like data
- **Contract Testing**: For ensuring API compatibility across teams
- **Performance Testing**: For load testing and bottleneck identification

**🚀 HOW to Structure Comprehensive API Tests**

API testing follows layered validation:

1. **Mock Layer**: Fast, isolated testing with predictable responses
2. **Integration Layer**: Real API calls with test data
3. **Error Simulation**: Network failures, timeouts, and edge cases
4. **Authentication Testing**: Token flows and security scenarios
5. **Performance Validation**: Response times and retry behavior

### Step 1: Testing API Services

Create `src/services/api/__tests__/auth.service.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { server } from '@/test/mocks/server'
import { rest } from 'msw'
import { authService } from '../auth.service'
import { API_CONFIG } from '@/config/api.config'

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('login', () => {
    it('logs in user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password',
      }

      const result = await authService.login(credentials)

      expect(result.user.email).toBe('test@example.com')
      expect(result.tokens.accessToken).toBe('mock-access-token')
      
      // Tokens should be stored
      const storedTokens = localStorage.getItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)
      expect(storedTokens).toBeTruthy()
    })

    it('throws error for invalid credentials', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }

      await expect(authService.login(credentials)).rejects.toThrow()
    })

    it('handles network errors', async () => {
      // Mock network error
      server.use(
        rest.post('*/auth/login', (req, res, ctx) => {
          return res.networkError('Network error')
        })
      )

      const credentials = {
        email: 'test@example.com',
        password: 'password',
      }

      await expect(authService.login(credentials)).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('logs out user and clears tokens', async () => {
      // First login
      await authService.login({
        email: 'test@example.com',
        password: 'password',
      })

      // Verify tokens are stored
      expect(localStorage.getItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)).toBeTruthy()

      // Logout
      await authService.logout()

      // Tokens should be cleared
      expect(localStorage.getItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)).toBeNull()
    })

    it('clears tokens even if logout request fails', async () => {
      // First login
      await authService.login({
        email: 'test@example.com',
        password: 'password',
      })

      // Mock logout failure
      server.use(
        rest.post('*/auth/logout', (req, res, ctx) => {
          return res(ctx.status(500))
        })
      )

      // Logout should still clear tokens
      await authService.logout()

      expect(localStorage.getItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY)).toBeNull()
    })
  })

  describe('token management', () => {
    it('refreshes tokens automatically', async () => {
      // Login first
      await authService.login({
        email: 'test@example.com',
        password: 'password',
      })

      const newToken = await authService.refreshToken()

      expect(newToken).toBe('new-mock-access-token')
      
      // New tokens should be stored
      const storedTokens = JSON.parse(
        localStorage.getItem(API_CONFIG.AUTH.TOKEN_STORAGE_KEY) || '{}'
      )
      expect(storedTokens.accessToken).toBe('new-mock-access-token')
    })

    it('detects authentication status correctly', () => {
      // Not authenticated initially
      expect(authService.isAuthenticated()).toBe(false)

      // Mock valid tokens
      const mockTokens = {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        expiresAt: Date.now() + 3600000, // 1 hour from now
        tokenType: 'Bearer',
      }
      localStorage.setItem(
        API_CONFIG.AUTH.TOKEN_STORAGE_KEY,
        JSON.stringify(mockTokens)
      )

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('detects expired tokens', () => {
      // Mock expired tokens
      const expiredTokens = {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 3600000, // 1 hour ago
        tokenType: 'Bearer',
      }
      localStorage.setItem(
        API_CONFIG.AUTH.TOKEN_STORAGE_KEY,
        JSON.stringify(expiredTokens)
      )

      expect(authService.isAuthenticated()).toBe(false)
    })
  })
})
```

### Step 2: Testing RTK Query

Create `src/services/api/__tests__/tasks.api.test.tsx`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { api } from '../rtkQuery'
import { useGetTasksQuery, useCreateTaskMutation } from '../tasks.api'

// Test store setup
const createTestStore = () => {
  return configureStore({
    reducer: {
      api: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  })
}

const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
}

describe('Tasks API', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  describe('useGetTasksQuery', () => {
    it('fetches tasks successfully', async () => {
      const { result } = renderHook(
        () => useGetTasksQuery({}),
        { wrapper: createWrapper(store) }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.tasks).toHaveLength(3)
      expect(result.current.data?.tasks[0].title).toBe('Task 1')
    })

    it('filters tasks by status', async () => {
      const { result } = renderHook(
        () => useGetTasksQuery({ status: ['todo'] }),
        { wrapper: createWrapper(store) }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.tasks).toHaveLength(1)
      expect(result.current.data?.tasks[0].status).toBe('todo')
    })

    it('handles pagination', async () => {
      const { result } = renderHook(
        () => useGetTasksQuery({ page: 1, limit: 2 }),
        { wrapper: createWrapper(store) }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.pagination.page).toBe(1)
      expect(result.current.data?.pagination.limit).toBe(2)
    })

    it('caches results correctly', async () => {
      // First request
      const { result: result1 } = renderHook(
        () => useGetTasksQuery({}),
        { wrapper: createWrapper(store) }
      )

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
      })

      // Second identical request should use cache
      const { result: result2 } = renderHook(
        () => useGetTasksQuery({}),
        { wrapper: createWrapper(store) }
      )

      // Should immediately have data from cache
      expect(result2.current.isSuccess).toBe(true)
      expect(result2.current.data).toEqual(result1.current.data)
    })
  })

  describe('useCreateTaskMutation', () => {
    it('creates task successfully', async () => {
      const { result } = renderHook(
        () => useCreateTaskMutation(),
        { wrapper: createWrapper(store) }
      )

      const newTask = {
        title: 'New Task',
        description: 'New task description',
        priority: 'high' as const,
      }

      const [createTask] = result.current

      await createTask(newTask)

      await waitFor(() => {
        expect(result.current[1].isSuccess).toBe(true)
      })

      expect(result.current[1].data?.title).toBe('New Task')
    })

    it('handles validation errors', async () => {
      // Mock validation error response
      server.use(
        rest.post('*/tasks', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Title is required',
              },
            })
          )
        })
      )

      const { result } = renderHook(
        () => useCreateTaskMutation(),
        { wrapper: createWrapper(store) }
      )

      const [createTask] = result.current

      try {
        await createTask({ title: '', priority: 'medium' })
      } catch (error) {
        // Expected to fail
      }

      await waitFor(() => {
        expect(result.current[1].isError).toBe(true)
      })
    })

    it('invalidates cache after creation', async () => {
      // First, fetch tasks to populate cache
      const { result: queryResult } = renderHook(
        () => useGetTasksQuery({}),
        { wrapper: createWrapper(store) }
      )

      await waitFor(() => {
        expect(queryResult.current.isSuccess).toBe(true)
      })

      const initialTaskCount = queryResult.current.data?.tasks.length

      // Create new task
      const { result: mutationResult } = renderHook(
        () => useCreateTaskMutation(),
        { wrapper: createWrapper(store) }
      )

      const [createTask] = mutationResult.current

      await createTask({
        title: 'Cache Test Task',
        priority: 'low',
      })

      // Cache should be invalidated and refetched
      await waitFor(() => {
        expect(queryResult.current.data?.tasks.length).toBeGreaterThan(initialTaskCount || 0)
      })
    })
  })
})
```

---

## Summary

🎉 **Congratulations!** You now have a comprehensive testing strategy with:

✅ **Modern Testing Stack**: Vitest + React Testing Library for optimal performance  
✅ **Component Testing**: Unit tests focused on user behavior and accessibility  
✅ **Hook Testing**: Custom hooks with proper context and state management  
✅ **API Testing**: Service layer and RTK Query integration testing  
✅ **Mocking Strategy**: MSW for realistic API mocking  
✅ **Test Utilities**: Reusable test helpers and builders  
✅ **Coverage Reports**: Comprehensive coverage tracking with thresholds  

### Key Benefits Achieved

1. **Fast Execution**: Vitest provides 2-10x faster test runs than Jest
2. **User-Focused**: Tests verify user experience rather than implementation details
3. **Realistic Testing**: MSW provides realistic API mocking without brittle mocks
4. **Type Safety**: Full TypeScript integration throughout test suite
5. **Accessibility**: Built-in accessibility testing with jest-axe
6. **Maintainability**: Clear test structure with reusable utilities and builders

### Next Steps

- **Chapter 8**: Production build configuration and deployment
- **Chapter 9**: Performance optimization and security best practices
- **Chapter 10**: Complete application example

---

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)

---

**Previous**: [← Chapter 6 - API Integration](./06-api-integration.md) | **Next**: [Chapter 8 - Build & Deployment →](./08-build-deployment.md)