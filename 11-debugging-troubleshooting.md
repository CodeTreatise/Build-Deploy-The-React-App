# Chapter 11: Debugging & Troubleshooting 🐛

## Overview

Debugging is an essential skill for React developers, especially when working with modern tech stacks. This chapter provides practical debugging techniques and tools for common issues you'll encounter while building React applications with our technology stack (Vite, TypeScript, Material-UI, Redux Toolkit, React Hook Form, and more).

---

## 📋 Table of Contents

1. [Debugging Environment Setup](#debugging-environment-setup)
2. [React Component Issues](#react-component-issues)
3. [State Management Debugging](#state-management-debugging)
4. [API & Network Troubleshooting](#api--network-troubleshooting)
5. [Form & Validation Issues](#form--validation-issues)
6. [Performance Debugging](#performance-debugging)
7. [Build & Production Issues](#build--production-issues)
8. [Quick Reference Guide](#quick-reference-guide)

---

## Debugging Environment Setup

### Step 1: Essential VS Code Extensions

Install these debugging-focused extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "firefox-devtools.vscode-firefox-debug",
    "ms-vscode.js-debug",
    "wallabyjs.console-ninja"
  ]
}
```

### Step 2: VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "port": 5173,
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["--run"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Step 3: Browser Extension Setup

**Chrome Extensions:**
- React Developer Tools
- Redux DevTools Extension
- Lighthouse
- Web Vitals Extension

**Firefox Extensions:**
- React Developer Tools
- Redux DevTools Extension

### Step 4: Debugging Utilities

Create `src/utils/debug.ts`:

```typescript
// Development debugging utilities
export const debugUtils = {
  // Log component renders
  logRender: (componentName: string, props?: any) => {
    if (import.meta.env.DEV) {
      console.log(`🔍 ${componentName} rendered`, props)
    }
  },

  // Log state changes
  logStateChange: (stateName: string, oldState: any, newState: any) => {
    if (import.meta.env.DEV) {
      console.group(`📊 ${stateName} state change`)
      console.log('Old:', oldState)
      console.log('New:', newState)
      console.groupEnd()
    }
  },

  // Log API calls
  logApiCall: (method: string, url: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`🌐 ${method.toUpperCase()} ${url}`, data)
    }
  },

  // Performance timing
  timeFunction: <T extends (...args: any[]) => any>(
    fn: T,
    label: string
  ): T => {
    return ((...args: any[]) => {
      console.time(label)
      const result = fn(...args)
      console.timeEnd(label)
      return result
    }) as T
  },

  // Deep object comparison
  deepEqual: (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }
}
```

---

## React Component Issues

### Issue 1: "My Component Isn't Re-rendering"

**🚨 Common Symptoms:**
- Component doesn't update when props change
- State changes don't reflect in UI
- Stale data displayed

**🔍 Debugging Steps:**

1. **Check React Developer Tools**
   ```
   - Open browser DevTools → Components tab
   - Find your component in the tree
   - Check props and state values
   - Look for gray highlighting (indicates no re-render)
   ```

2. **Add Debug Logging**
   ```typescript
   import { useEffect } from 'react'
   import { debugUtils } from '@/utils/debug'

   const TaskCard = ({ task, onEdit }: TaskCardProps) => {
     // Debug renders
     debugUtils.logRender('TaskCard', { taskId: task.id, title: task.title })
     
     // Debug prop changes
     useEffect(() => {
       console.log('Task prop changed:', task)
     }, [task])

     return (
       // Component JSX
     )
   }
   ```

3. **Common Solutions:**
   ```typescript
   // ❌ Problem: Object reference equality
   const TaskList = () => {
     const [filters, setFilters] = useState({ status: 'active' })
     
     const filteredTasks = tasks.filter(task => 
       // This creates new object every render
       task.metadata === { processed: true }
     )
   }

   // ✅ Solution: Proper comparison
   const TaskList = () => {
     const filteredTasks = useMemo(() => 
       tasks.filter(task => task.metadata?.processed === true),
       [tasks]
     )
   }
   ```

### Issue 2: "Infinite Re-rendering Loop"

**🚨 Common Symptoms:**
- Browser becomes unresponsive
- Console shows repeated renders
- useEffect runs continuously

**🔍 Debugging Steps:**

1. **Check useEffect Dependencies**
   ```typescript
   // ❌ Problem: Missing dependencies
   useEffect(() => {
     fetchTasks(filters)
   }, []) // Missing 'filters' dependency

   // ✅ Solution: Correct dependencies
   useEffect(() => {
     fetchTasks(filters)
   }, [filters, fetchTasks])
   ```

2. **Debug with React DevTools Profiler**
   ```
   - Open React DevTools → Profiler tab
   - Click "Start profiling"
   - Reproduce the issue
   - Stop profiling and analyze the flame graph
   - Look for components with excessive render counts
   ```

3. **Add Render Counting**
   ```typescript
   const TaskCard = ({ task }: TaskCardProps) => {
     const renderCount = useRef(0)
     renderCount.current++
     
     console.log(`TaskCard render #${renderCount.current}`, task.id)
     
     return <Card>...</Card>
   }
   ```

### Issue 3: "Props Not Updating Child Components"

**🔍 Debugging with React DevTools:**

1. **Check Component Tree**
   ```
   - Components tab → find parent component
   - Verify props are changing at parent level
   - Follow the prop chain down to child components
   - Look for memo() components that might be blocking updates
   ```

2. **Debug Memo Components**
   ```typescript
   // Add custom comparison function for debugging
   const TaskCard = React.memo(({ task, onEdit }: TaskCardProps) => {
     return <Card>...</Card>
   }, (prevProps, nextProps) => {
     const isEqual = prevProps.task.id === nextProps.task.id &&
                     prevProps.task.updatedAt === nextProps.task.updatedAt
     
     console.log('TaskCard memo comparison:', {
       isEqual,
       prevTask: prevProps.task,
       nextTask: nextProps.task
     })
     
     return isEqual
   })
   ```

---

## State Management Debugging

### Redux DevTools Mastery

**🛠️ Essential DevTools Features:**

1. **Action Monitoring**
   ```
   - Open Redux DevTools
   - Switch to "Action" tab
   - See all dispatched actions in real-time
   - Click any action to see payload and state diff
   ```

2. **Time Travel Debugging**
   ```
   - Use slider to go back/forward through actions
   - Click "Jump" next to any action
   - Perfect for reproducing bugs step by step
   ```

3. **State Inspection**
   ```
   - "State" tab shows current store state
   - "Diff" tab shows what changed
   - "Tree" tab shows state structure
   ```

### RTK Query Debugging

**🔍 Debug API Cache Issues:**

```typescript
// Add to your store configuration
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production' && {
    trace: true,
    traceLimit: 25,
  },
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)
```

**🐛 Common RTK Query Issues:**

1. **Cache Not Updating**
   ```typescript
   // Debug cache tags
   export const tasksApi = createApi({
     reducerPath: 'tasksApi',
     baseQuery: fetchBaseQuery({
       baseUrl: '/api/',
       prepareHeaders: (headers) => {
         console.log('🔍 API Request headers:', headers)
         return headers
       },
     }),
     tagTypes: ['Task'],
     endpoints: (builder) => ({
       getTasks: builder.query<Task[], void>({
         query: () => 'tasks',
         providesTags: (result) => {
           console.log('🏷️ Providing tags for tasks:', result?.length)
           return result
             ? [...result.map(({ id }) => ({ type: 'Task' as const, id })), 'Task']
             : ['Task']
         },
       }),
     }),
   })
   ```

2. **Debugging Query States**
   ```typescript
   const TaskList = () => {
     const { 
       data: tasks, 
       error, 
       isLoading, 
       isFetching,
       isSuccess,
       isError 
     } = useGetTasksQuery()

     // Debug query state
     useEffect(() => {
       console.log('🔍 RTK Query State:', {
         isLoading,
         isFetching,
         isSuccess,
         isError,
         error,
         dataLength: tasks?.length
       })
     }, [isLoading, isFetching, isSuccess, isError, error, tasks])

     if (isLoading) return <div>Loading...</div>
     if (isError) {
       console.error('❌ RTK Query Error:', error)
       return <div>Error: {JSON.stringify(error)}</div>
     }

     return <div>{/* Render tasks */}</div>
   }
   ```

---

## API & Network Troubleshooting

### Browser Network Tab Analysis

**🔍 Step-by-Step Network Debugging:**

1. **Open Network Tab**
   ```
   - F12 → Network tab
   - Clear existing requests
   - Reproduce the issue
   - Look for failed requests (red status codes)
   ```

2. **Analyze Request Details**
   ```
   - Click on failed request
   - Check Headers tab for request/response headers
   - Check Response tab for error messages
   - Check Timing tab for performance issues
   ```

### Axios Debugging

**🛠️ Enhanced Axios Configuration for Debugging:**

```typescript
// src/services/api/client.ts
import axios from 'axios'

// Request interceptor for debugging
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.group(`🌐 ${config.method?.toUpperCase()} ${config.url}`)
    console.log('Headers:', config.headers)
    console.log('Data:', config.data)
    console.log('Params:', config.params)
    console.groupEnd()
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.group(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`)
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    console.log('Headers:', response.headers)
    console.groupEnd()
    return response
  },
  (error) => {
    console.group(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
    console.error('Error:', error.message)
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.groupEnd()
    
    // Common error debugging
    if (error.response?.status === 401) {
      console.warn('🔐 Authentication required - redirecting to login')
      // Handle auth redirect
    } else if (error.response?.status === 403) {
      console.warn('⛔ Forbidden - check user permissions')
    } else if (error.response?.status >= 500) {
      console.error('🔥 Server error - check backend logs')
    }
    
    return Promise.reject(error)
  }
)
```

### CORS Issues Debugging

**🚨 Common CORS Symptoms:**
- "Access-Control-Allow-Origin" errors
- Preflight request failures
- Authentication not working

**🔍 Debugging Steps:**

1. **Check Browser Console**
   ```
   Look for CORS-specific error messages:
   - "has been blocked by CORS policy"
   - "Preflight request didn't succeed"
   - "Access-Control-Allow-Origin missing"
   ```

2. **Vite Proxy Configuration**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:3000',
           changeOrigin: true,
           secure: false,
           configure: (proxy, _options) => {
             proxy.on('error', (err, _req, _res) => {
               console.log('🔥 Proxy error:', err)
             })
             proxy.on('proxyReq', (proxyReq, req, _res) => {
               console.log('🔍 Proxy request:', req.method, req.url)
             })
             proxy.on('proxyRes', (proxyRes, req, _res) => {
               console.log('✅ Proxy response:', proxyRes.statusCode, req.url)
             })
           },
         },
       },
     },
   })
   ```

---

## Form & Validation Issues

### React Hook Form Debugging

**🐛 Common Form Issues:**

1. **Form Not Submitting**
   ```typescript
   const TaskForm = () => {
     const { handleSubmit, formState: { errors, isSubmitting } } = useForm()

     const onSubmit = async (data: any) => {
       console.log('🔍 Form submission started:', data)
       console.log('🔍 Form errors:', errors)
       console.log('🔍 Is submitting:', isSubmitting)
       
       try {
         await submitTask(data)
         console.log('✅ Form submitted successfully')
       } catch (error) {
         console.error('❌ Form submission failed:', error)
       }
     }

     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         {/* Debug form state */}
         {import.meta.env.DEV && (
           <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '10px' }}>
             Errors: {JSON.stringify(errors, null, 2)}
             Is Submitting: {isSubmitting.toString()}
           </pre>
         )}
       </form>
     )
   }
   ```

2. **Validation Not Working**
   ```typescript
   // Debug Zod schema validation
   import { z } from 'zod'

   const taskSchema = z.object({
     title: z.string().min(1, 'Title is required'),
     priority: z.enum(['low', 'medium', 'high', 'urgent']),
   }).superRefine((data, ctx) => {
     // Custom validation with debugging
     console.log('🔍 Zod validation data:', data)
     
     if (data.title.length > 100) {
       ctx.addIssue({
         code: z.ZodIssueCode.too_big,
         maximum: 100,
         type: 'string',
         inclusive: true,
         message: 'Title too long',
         path: ['title'],
       })
     }
   })

   // Test schema separately
   const testValidation = (data: any) => {
     const result = taskSchema.safeParse(data)
     console.log('🔍 Validation result:', result)
     return result
   }
   ```

### Material-UI Form Integration Issues

**🔍 Debug MUI + React Hook Form:**

```typescript
// Debug Controller component
const DebugController = ({ name, control, render, rules }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={(props) => {
        console.log(`🔍 Controller ${name}:`, {
          value: props.field.value,
          error: props.fieldState.error,
          isDirty: props.fieldState.isDirty,
          isTouched: props.fieldState.isTouched,
        })
        return render(props)
      }}
    />
  )
}

// Usage in form
<DebugController
  name="title"
  control={control}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      label="Task Title"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )}
/>
```

---

## Performance Debugging

### React DevTools Profiler

**🔍 Step-by-Step Performance Analysis:**

1. **Setup Profiling**
   ```
   - Open React DevTools → Profiler tab
   - Click "Start profiling"
   - Interact with your app (reproduce slow behavior)
   - Click "Stop profiling"
   ```

2. **Analyze Results**
   ```
   - Flame graph shows component render times
   - Yellow/red components are slow
   - Click components to see why they rendered
   - Look for "Did not render" vs "Rendered due to..."
   ```

3. **Common Performance Issues**
   ```typescript
   // ❌ Problem: Expensive calculations on every render
   const TaskList = ({ tasks }) => {
     const sortedTasks = tasks.sort((a, b) => a.priority.localeCompare(b.priority))
     return <div>{/* render tasks */}</div>
   }

   // ✅ Solution: Memoize expensive calculations
   const TaskList = ({ tasks }) => {
     const sortedTasks = useMemo(
       () => tasks.sort((a, b) => a.priority.localeCompare(b.priority)),
       [tasks]
     )
     return <div>{/* render tasks */}</div>
   }
   ```

### Bundle Analysis

**🔍 Analyze Bundle Size:**

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ],
})

# Build and analyze
npm run build
# Opens stats.html showing bundle composition
```

### Memory Leak Detection

**🔍 Debug Memory Issues:**

```typescript
// Memory leak detector hook
const useMemoryLeak = (componentName: string) => {
  useEffect(() => {
    console.log(`📈 ${componentName} mounted`)
    
    return () => {
      console.log(`📉 ${componentName} unmounted`)
      
      // Check for potential leaks
      if (import.meta.env.DEV) {
        setTimeout(() => {
          console.log('🔍 Memory check after unmount:', {
            heap: (performance as any).memory?.usedJSHeapSize,
            listeners: window.addEventListener.toString(),
          })
        }, 1000)
      }
    }
  }, [componentName])
}

// Usage
const TaskCard = () => {
  useMemoryLeak('TaskCard')
  
  useEffect(() => {
    const handleClick = () => console.log('clicked')
    
    // ❌ Potential leak: missing cleanup
    document.addEventListener('click', handleClick)
    
    // ✅ Proper cleanup
    return () => document.removeEventListener('click', handleClick)
  }, [])
  
  return <div>...</div>
}
```

---

## Build & Production Issues

### Vite Build Debugging

**🚨 Common Build Issues:**

1. **Import Resolution Errors**
   ```typescript
   // ❌ Problem: Absolute imports not working
   import { TaskCard } from 'src/components/TaskCard'

   // ✅ Solution: Use configured path mapping
   import { TaskCard } from '@/components/TaskCard'

   // Check vite.config.ts
   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, 'src'),
       },
     },
   })
   ```

2. **Environment Variables Not Working**
   ```typescript
   // Debug environment variables
   console.log('🔍 Environment Variables:', {
     NODE_ENV: import.meta.env.NODE_ENV,
     VITE_API_URL: import.meta.env.VITE_API_URL,
     all: import.meta.env,
   })

   // ❌ Problem: Missing VITE_ prefix
   REACT_APP_API_URL=http://localhost:3000

   // ✅ Solution: Use VITE_ prefix
   VITE_API_URL=http://localhost:3000
   ```

3. **TypeScript Build Errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit

   # Common fixes in tsconfig.json
   {
     "compilerOptions": {
       "skipLibCheck": true,  // Skip type checking of declaration files
       "allowSyntheticDefaultImports": true,
       "esModuleInterop": true
     }
   }
   ```

### Production Runtime Issues

**🔍 Debug Production Builds:**

```typescript
// Add error boundary for production
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }: any) {
  console.error('🔥 Production Error:', error)
  
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('🔥 Error Boundary Caught:', error, errorInfo)
        // Send to error reporting service
      }}
    >
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}
```

---

## Quick Reference Guide

### 🛠️ Essential Debugging Tools

| Tool | Purpose | Access |
|------|---------|---------|
| React DevTools | Component inspection, profiling | Browser extension |
| Redux DevTools | State management debugging | Browser extension |
| VS Code Debugger | Step-through debugging | F5 or Debug panel |
| Network Tab | API request debugging | F12 → Network |
| Console | Logging and errors | F12 → Console |
| Lighthouse | Performance analysis | F12 → Lighthouse |

### 🚨 Common Issues Checklist

**Component Not Updating:**
- [ ] Check React DevTools for prop/state changes
- [ ] Verify useEffect dependencies
- [ ] Check for memo() blocking updates
- [ ] Look for object reference equality issues

**State Management Issues:**
- [ ] Check Redux DevTools for action dispatch
- [ ] Verify reducer logic
- [ ] Check RTK Query cache invalidation
- [ ] Look for state mutation

**API Issues:**
- [ ] Check Network tab for failed requests
- [ ] Verify request headers and payload
- [ ] Check CORS configuration
- [ ] Test API endpoints directly

**Performance Issues:**
- [ ] Use React Profiler to identify slow components
- [ ] Check for unnecessary re-renders
- [ ] Analyze bundle size with visualizer
- [ ] Look for memory leaks

**Build Issues:**
- [ ] Check TypeScript errors with `tsc --noEmit`
- [ ] Verify environment variables have VITE_ prefix
- [ ] Check import paths and aliases
- [ ] Review Vite configuration

### 🔍 Debug Commands

```bash
# Type checking
npm run type-check

# Lint checking
npm run lint

# Test specific file
npm run test TaskCard.test.tsx

# Build analysis
npm run build && npx serve dist

# Performance testing
npm run build && npx lighthouse http://localhost:4173
```

### 📞 When to Ask for Help

1. **After trying these debugging steps**
2. **When you have specific error messages**
3. **With reproducible steps to recreate the issue**
4. **Including relevant code snippets**
5. **After checking documentation and Stack Overflow**

---

## Chapter Summary

🎯 **Debugging Skills Mastered:**

✅ **Development Environment** - VS Code debugging, browser tools, extensions
✅ **React Components** - Re-rendering issues, prop flow, performance problems
✅ **State Management** - Redux DevTools, RTK Query debugging, state flow
✅ **API Integration** - Network analysis, CORS issues, request/response debugging
✅ **Form Validation** - React Hook Form debugging, Zod schema validation
✅ **Performance** - Profiling, bundle analysis, memory leak detection
✅ **Production Issues** - Build debugging, error boundaries, runtime errors

**🚀 Next Level:**
With these debugging skills, you can confidently troubleshoot any React application issues and maintain high-quality codebases in professional environments.

---

*End of Chapter 11 - Debugging & Troubleshooting*