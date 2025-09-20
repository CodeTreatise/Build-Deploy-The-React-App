# Chapter 4: Redux Toolkit State Management 🗄️

## Overview

In this chapter, we'll implement Redux Toolkit (RTK) for comprehensive state management, including RTK Query for server state management. We'll establish patterns that scale from simple local state to complex enterprise applications with normalized data, caching, and optimistic updates.

---

## 📋 Table of Contents

1. [Why Redux Toolkit in 2025?](#why-redux-toolkit-in-2025)
2. [Installation & Store Setup](#installation--store-setup)
3. [Creating Redux Slices](#creating-redux-slices)
4. [RTK Query Setup](#rtk-query-setup)
5. [Async State Management](#async-state-management)
6. [Entity Management](#entity-management)
7. [Middleware & DevTools](#middleware--devtools)
8. [Performance Optimization](#performance-optimization)
9. [Testing Redux Logic](#testing-redux-logic)
10. [Best Practices](#best-practices)

---

## Why Redux Toolkit in 2025?

### 💡 Understanding State Management Fundamentals

Before diving into Redux Toolkit, let's understand **why state management matters in React applications**:

**The State Management Problem:**
```javascript
// ❌ Component state chaos (prop drilling)
function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  
  return (
    <Layout user={user}>
      <Dashboard 
        user={user} 
        tasks={tasks} 
        notifications={notifications}
        onTaskUpdate={(task) => {
          setTasks(prev => prev.map(t => t.id === task.id ? task : t))
          setNotifications(prev => [...prev, `Task ${task.title} updated`])
        }}
      />
    </Layout>
  )
}

// ✅ Centralized state management
function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Dashboard />
      </Layout>
    </Provider>
  )
}
```

**Key State Management Concepts:**
1. **Local State**: Component-specific state (useState, useReducer)
2. **Shared State**: State needed by multiple components
3. **Server State**: Data from APIs (cached, synchronized)
4. **UI State**: Loading, modals, form state
5. **Global State**: Application-wide state (user, theme, settings)

**State Management Evolution:**
```javascript
// React 2013-2015: Manual state lifting
Parent → Child → Grandchild (prop drilling)

// React 2016-2018: Redux + Connect
Store → Connect HOC → Component

// React 2019-2021: Context + useReducer
Context → useContext → Component

// React 2022+: Modern Redux Toolkit
Store → useSelector → Component (with RTK Query)
```

**Why Centralized State Management?**
- **Predictability**: Single source of truth for application state
- **Debuggability**: Time-travel debugging, action history
- **Testability**: Pure functions, predictable state updates
- **Scalability**: Organized state structure for large applications
- **Performance**: Optimized re-rendering, memoized selectors

### 💡 Understanding Redux Mental Model

**Redux Core Concepts (Think of it like a Bank):**
```javascript
// 🏦 Store = Bank (holds all the money/state)
const store = configureStore({...})

// 💳 Action = Transaction Request (what happened)
const deposit = { type: 'account/deposit', payload: { amount: 100 } }

// 👨‍💼 Reducer = Bank Teller (processes transactions)
function accountReducer(state, action) {
  switch (action.type) {
    case 'account/deposit':
      return { ...state, balance: state.balance + action.payload.amount }
  }
}

// 📱 Selector = ATM (reads current balance)
const selectBalance = (state) => state.account.balance

// 🏪 Component = Customer (makes requests, gets updates)
function AccountDisplay() {
  const balance = useSelector(selectBalance)
  const dispatch = useDispatch()
  
  return (
    <div>
      Balance: ${balance}
      <button onClick={() => dispatch(deposit)}>Deposit $100</button>
    </div>
  )
}
```

**Redux Data Flow (Unidirectional):**
```
Component → Action → Reducer → Store → Component
    ↑                                      ↓
    ←─────── useSelector ←─────────────────┘
```

**Benefits of Redux Toolkit:**
- **Less Boilerplate**: createSlice combines actions and reducers
- **Immer Integration**: Write "mutative" logic safely
- **RTK Query**: Built-in data fetching with caching
- **DevTools**: Excellent debugging experience
- **TypeScript**: Excellent type safety out of the box

### Redux Toolkit vs Alternatives

| Feature | Redux Toolkit | Zustand | Context API | Jotai |
|---------|---------------|---------|-------------|-------|
| **Bundle Size** | 42KB | 8KB | 0KB (built-in) | 13KB |
| **Learning Curve** | Medium | Easy | Easy | Medium |
| **DevTools** | Excellent | Good | None | Good |
| **Server State** | RTK Query | External | Manual | External |
| **Time Travel** | Yes | No | No | No |
| **Middleware** | Rich ecosystem | Limited | None | Limited |
| **Enterprise Scale** | Excellent | Good | Poor | Good |
| **TypeScript** | Excellent | Excellent | Good | Excellent |

### Why Choose Redux Toolkit?

1. **Mature Ecosystem**: 10+ years of development, battle-tested
2. **Server State Management**: RTK Query handles caching, invalidation, and synchronization
3. **DevTools**: Unparalleled debugging experience with time-travel debugging
4. **Predictability**: Single source of truth with immutable updates
5. **Performance**: Optimized selectors and component re-rendering
6. **Enterprise Ready**: Used by Meta, Netflix, Airbnb, and thousands of companies
7. **Simplified API**: 70% less boilerplate compared to classic Redux

### When to Use Redux Toolkit

### 🎯 WHEN to Choose Different State Management Solutions

**State Management Decision Tree:**

```javascript
// 📝 Local Component State - WHEN:
const [count, setCount] = useState(0)
// ✅ Use WHEN:
- State only used in one component
- Simple UI state (toggles, form inputs)
- No need to persist or share
- Component lifecycle matches state lifecycle

// 🏠 Lifted State - WHEN:
function Parent() {
  const [sharedData, setSharedData] = useState()
  return <Child1 data={sharedData} /><Child2 data={sharedData} />
}
// ✅ Use WHEN:
- 2-3 components need same state
- Components are closely related (parent-child)
- State is temporary/session-based
- Simple data structure

// 🌐 Context API - WHEN:
const ThemeContext = createContext()
// ✅ Use WHEN:
- App-wide settings (theme, language, auth status)
- Rarely changing data
- Avoiding prop drilling for stable data
- Small to medium applications

// 🏪 Redux Toolkit - WHEN:
const store = configureStore({...})
// ✅ Use WHEN:
- Complex state shared across many components
- Need time-travel debugging
- Complex business logic
- Server state caching needed
- Team development (multiple developers)
- Large applications (50+ components)
```

**State Type Decision Guide:**
```javascript
// 🎨 UI State Examples:
- Modal open/closed → useState or Context
- Loading states → RTK Query or useState  
- Form validation → useState + libraries
- Theme/dark mode → Context API

// 📊 Application State Examples:
- User authentication → Redux Toolkit
- Shopping cart → Redux Toolkit  
- Notifications → Redux Toolkit
- App settings → Redux Toolkit or Context

// 🌐 Server State Examples:  
- API data → RTK Query (recommended)
- User profiles → RTK Query
- Real-time data → RTK Query + WebSocket
- Cached responses → RTK Query
```

**Performance Considerations:**
```javascript
// 🐌 AVOID Context for frequently changing data:
❌ const CountContext = createContext() // Re-renders all consumers

// ⚡ USE Redux for frequently changing data:
✅ const count = useSelector(state => state.counter.value) // Only re-renders if count changes
```

**Team Size Considerations:**
```javascript
// 👤 Solo Developer (1 person):
- Small project → useState + useEffect
- Medium project → Context API
- Large project → Redux Toolkit

// 👥 Small Team (2-5 people):  
- Any size → Redux Toolkit (consistency)

// 🏢 Large Team (5+ people):
- Always → Redux Toolkit (predictability)
```

✅ **Use Redux Toolkit when you have:**
- Complex state that's shared across many components
- Server state that needs caching and synchronization
- Need for time-travel debugging and state inspection
- Team development with multiple developers
- Enterprise application with complex business logic

❌ **Consider alternatives when you have:**
- Simple local component state
- Small applications with minimal state sharing
- Tight bundle size requirements
- Team unfamiliar with Redux concepts

---

## Installation & Store Setup

### Step 1: Install Redux Toolkit

```bash
# Install Redux Toolkit and React-Redux
npm install @reduxjs/toolkit react-redux

# Install additional utilities
npm install reselect

# Install development dependencies
npm install --save-dev @types/react-redux
```

### Step 2: Create Store Configuration

Create `src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Import reducers
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import tasksReducer from './slices/tasksSlice'

// Import API slices
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {
    // Feature slices
    auth: authReducer,
    ui: uiReducer,
    tasks: tasksReducer,
    
    // API slice
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(apiSlice.middleware),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
})

// Enable listener behavior for RTK Query
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
```

### Step 3: Create Typed Hooks

Create `src/store/hooks.ts`:

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Custom hooks for common patterns
export const useAppStore = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state)
  return { dispatch, state }
}
```

### Step 4: Connect Store to React

Update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

// Import fonts
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/material-icons'

import { store } from '@/store'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

---

## Creating Redux Slices

### 💡 Understanding Redux Slices

**What is a Slice?** Think of slices as **feature-based state modules**:

```javascript
// 🏦 Traditional Redux (lots of boilerplate)
// Actions
const LOGIN_START = 'auth/LOGIN_START'
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'  
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE'

const loginStart = () => ({ type: LOGIN_START })
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user })
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error })

// Reducer  
function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_START:
      return { ...state, loading: true }
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    // ... more cases
  }
}

// 🚀 Redux Toolkit Slice (concise & powerful)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => { state.loading = true },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload
    },
    loginFailure: (state, action) => {
      state.loading = false  
      state.error = action.payload
    }
  }
})
```

**Key Slice Concepts:**
1. **Feature Organization**: Each slice handles one domain (auth, tasks, ui)
2. **Immer Integration**: Write "mutative" code, Immer makes it immutable
3. **Auto-Generated Actions**: Actions created automatically from reducer names
4. **Type Safety**: Full TypeScript support out of the box

**Slice Architecture Patterns:**
```javascript
// 📁 Domain-Driven Slices (Recommended)
/store
  /slices
    authSlice.ts     // User authentication & session
    tasksSlice.ts    // Task management
    uiSlice.ts       // UI state (modals, notifications)
    settingsSlice.ts // App settings & preferences
  /api
    apiSlice.ts      // RTK Query API definitions

// 📊 State Shape Preview:
{
  auth: { user: {...}, isAuthenticated: true, loading: false },
  tasks: { items: [], filter: 'all', loading: false },
  ui: { sidebarOpen: true, notifications: [] },
  api: { queries: {...}, mutations: {...} }
}
```

**Slice Best Practices:**
- **Single Responsibility**: Each slice handles one feature domain
- **Normalized State**: Keep state flat, avoid nested objects
- **Consistent Naming**: Use present tense for state, past tense for actions
- **Error Handling**: Include loading/error states for async operations

### Step 1: Auth Slice

Create `src/store/slices/authSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin'
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastLoginTime: number | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginTime: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en',
        },
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      return { user: mockUser, token: mockToken }
    } catch (error) {
      return rejectWithValue('Invalid credentials')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: {
      firstName: string
      lastName: string
      email: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en',
        },
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      return { user: mockUser, token: mockToken }
    } catch (error) {
      return rejectWithValue('Registration failed')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    updates: Partial<User>,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState }
      if (!state.auth.user) {
        throw new Error('No user logged in')
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      return { ...state.auth.user, ...updates }
    } catch (error) {
      return rejectWithValue('Failed to update profile')
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      state.lastLoginTime = null
      
      // Clear localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    updatePreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload }
      }
    },
    
    // Hydrate auth state from localStorage
    hydrateAuth: (state) => {
      const token = localStorage.getItem('authToken')
      const userString = localStorage.getItem('user')
      
      if (token && userString) {
        try {
          const user = JSON.parse(userString)
          state.user = user
          state.token = token
          state.isAuthenticated = true
          state.lastLoginTime = Date.now()
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        state.lastLoginTime = Date.now()
        
        // Persist to localStorage
        localStorage.setItem('authToken', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
    
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        state.lastLoginTime = Date.now()
        
        // Persist to localStorage
        localStorage.setItem('authToken', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
    
    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, updatePreferences, hydrateAuth } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
```

### Step 2: UI Slice

Create `src/store/slices/uiSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  // Navigation
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Loading states
  globalLoading: boolean
  pageLoading: boolean
  
  // Notifications
  notifications: Notification[]
  
  // Modals
  modals: {
    [key: string]: {
      open: boolean
      data?: any
    }
  }
  
  // Theme (will integrate with ThemeContext)
  theme: 'light' | 'dark' | 'system'
  
  // Layout
  layout: {
    header: {
      height: number
      fixed: boolean
    }
    sidebar: {
      width: number
      collapsedWidth: number
    }
    footer: {
      height: number
      visible: boolean
    }
  }
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  timestamp: number
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  globalLoading: false,
  pageLoading: false,
  notifications: [],
  modals: {},
  theme: 'system',
  layout: {
    header: {
      height: 64,
      fixed: true,
    },
    sidebar: {
      width: 280,
      collapsedWidth: 72,
    },
    footer: {
      height: 48,
      visible: true,
    },
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    
    // Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload
    },
    
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        duration: action.payload.duration ?? 5000,
      }
      state.notifications.push(notification)
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Modals
    openModal: (state, action: PayloadAction<{ key: string; data?: any }>) => {
      state.modals[action.payload.key] = {
        open: true,
        data: action.payload.data,
      }
    },
    
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].open = false
        delete state.modals[action.payload].data
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key].open = false
        delete state.modals[key].data
      })
    },
    
    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    
    // Layout
    updateLayout: (state, action: PayloadAction<Partial<UIState['layout']>>) => {
      state.layout = { ...state.layout, ...action.payload }
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setSidebarCollapsed,
  setGlobalLoading,
  setPageLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setTheme,
  updateLayout,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading
export const selectPageLoading = (state: { ui: UIState }) => state.ui.pageLoading
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications
export const selectModals = (state: { ui: UIState }) => state.ui.modals
export const selectTheme = (state: { ui: UIState }) => state.ui.theme
export const selectLayout = (state: { ui: UIState }) => state.ui.layout
```

### Step 3: Tasks Slice with Entity Adapter

Create `src/store/slices/tasksSlice.ts`:

```typescript
import { 
  createSlice, 
  createAsyncThunk, 
  createEntityAdapter,
  PayloadAction 
} from '@reduxjs/toolkit'

// Types
export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  assigneeId?: string
  projectId?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface TaskFilters {
  status?: Task['status'][]
  priority?: Task['priority'][]
  assigneeId?: string
  projectId?: string
  search?: string
  tags?: string[]
  dueDateRange?: {
    start?: string
    end?: string
  }
}

// Entity adapter for normalized state
const tasksAdapter = createEntityAdapter<Task>({
  // Sort by priority and due date
  sortComparer: (a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    
    return a.title.localeCompare(b.title)
  },
})

interface TasksState {
  loading: boolean
  error: string | null
  filters: TaskFilters
  selectedTaskIds: string[]
  searchQuery: string
  sortBy: 'title' | 'dueDate' | 'priority' | 'status' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  viewMode: 'list' | 'grid' | 'kanban'
}

const initialState = tasksAdapter.getInitialState<TasksState>({
  loading: false,
  error: null,
  filters: {},
  selectedTaskIds: [],
  searchQuery: '',
  sortBy: 'priority',
  sortOrder: 'desc',
  viewMode: 'list',
})

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters?: TaskFilters, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock tasks data
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Complete React Router setup',
          description: 'Implement routing and navigation for the application',
          status: 'done',
          priority: 'high',
          dueDate: '2025-09-15',
          tags: ['frontend', 'routing'],
          createdAt: '2025-09-10T10:00:00Z',
          updatedAt: '2025-09-15T14:30:00Z',
          completedAt: '2025-09-15T14:30:00Z',
        },
        {
          id: '2',
          title: 'Implement Redux state management',
          description: 'Set up Redux Toolkit with proper slice patterns',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2025-09-20',
          tags: ['frontend', 'state-management'],
          createdAt: '2025-09-12T09:00:00Z',
          updatedAt: '2025-09-19T11:00:00Z',
        },
        {
          id: '3',
          title: 'Design user authentication flow',
          description: 'Create login, register, and password reset functionality',
          status: 'todo',
          priority: 'medium',
          dueDate: '2025-09-25',
          tags: ['auth', 'security'],
          createdAt: '2025-09-18T16:00:00Z',
          updatedAt: '2025-09-18T16:00:00Z',
        },
        {
          id: '4',
          title: 'Write comprehensive tests',
          description: 'Add unit and integration tests for all components',
          status: 'todo',
          priority: 'medium',
          tags: ['testing', 'quality'],
          createdAt: '2025-09-19T08:00:00Z',
          updatedAt: '2025-09-19T08:00:00Z',
        },
      ]
      
      return mockTasks
    } catch (error) {
      return rejectWithValue('Failed to fetch tasks')
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      return newTask
    } catch (error) {
      return rejectWithValue('Failed to create task')
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { id, updates }: { id: string; updates: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const updatedTask = {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
        ...(updates.status === 'done' && !updates.completedAt && {
          completedAt: new Date().toISOString(),
        }),
      }
      
      return updatedTask
    } catch (error) {
      return rejectWithValue('Failed to update task')
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return taskId
    } catch (error) {
      return rejectWithValue('Failed to delete task')
    }
  }
)

export const bulkUpdateTasks = createAsyncThunk(
  'tasks/bulkUpdateTasks',
  async (
    { taskIds, updates }: { taskIds: string[]; updates: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return taskIds.map(id => ({
        id,
        changes: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }))
    } catch (error) {
      return rejectWithValue('Failed to update tasks')
    }
  }
)

// Tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Filters
    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = action.payload
    },
    
    clearFilters: (state) => {
      state.filters = {}
    },
    
    updateFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    // Selection
    selectTask: (state, action: PayloadAction<string>) => {
      if (!state.selectedTaskIds.includes(action.payload)) {
        state.selectedTaskIds.push(action.payload)
      }
    },
    
    deselectTask: (state, action: PayloadAction<string>) => {
      state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== action.payload)
    },
    
    selectAllTasks: (state) => {
      state.selectedTaskIds = state.ids as string[]
    },
    
    deselectAllTasks: (state) => {
      state.selectedTaskIds = []
    },
    
    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const taskId = action.payload
      if (state.selectedTaskIds.includes(taskId)) {
        state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== taskId)
      } else {
        state.selectedTaskIds.push(taskId)
      }
    },
    
    // Search and sort
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    
    setSortBy: (state, action: PayloadAction<TasksState['sortBy']>) => {
      state.sortBy = action.payload
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
    
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
    },
    
    // View mode
    setViewMode: (state, action: PayloadAction<'list' | 'grid' | 'kanban'>) => {
      state.viewMode = action.payload
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        tasksAdapter.setAll(state, action.payload)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Create task
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        tasksAdapter.addOne(state, action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
    
    // Update task
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        tasksAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        })
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
    
    // Delete task
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        tasksAdapter.removeOne(state, action.payload)
        state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
    
    // Bulk update
    builder
      .addCase(bulkUpdateTasks.fulfilled, (state, action) => {
        tasksAdapter.updateMany(state, action.payload)
        state.selectedTaskIds = []
      })
      .addCase(bulkUpdateTasks.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const {
  setFilters,
  clearFilters,
  updateFilters,
  selectTask,
  deselectTask,
  selectAllTasks,
  deselectAllTasks,
  toggleTaskSelection,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
  setViewMode,
  clearError,
} = tasksSlice.actions

export default tasksSlice.reducer

// Export the customized selectors for this adapter
export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors((state: { tasks: typeof initialState }) => state.tasks)

// Custom selectors
export const selectTasksLoading = (state: { tasks: typeof initialState }) => state.tasks.loading
export const selectTasksError = (state: { tasks: typeof initialState }) => state.tasks.error
export const selectTaskFilters = (state: { tasks: typeof initialState }) => state.tasks.filters
export const selectSelectedTaskIds = (state: { tasks: typeof initialState }) => state.tasks.selectedTaskIds
export const selectSearchQuery = (state: { tasks: typeof initialState }) => state.tasks.searchQuery
export const selectSortBy = (state: { tasks: typeof initialState }) => state.tasks.sortBy
export const selectSortOrder = (state: { tasks: typeof initialState }) => state.tasks.sortOrder
export const selectViewMode = (state: { tasks: typeof initialState }) => state.tasks.viewMode

// Advanced selectors with memoization
export const selectFilteredTasks = (state: { tasks: typeof initialState }) => {
  const tasks = selectAllTasks(state)
  const filters = selectTaskFilters(state)
  const searchQuery = selectSearchQuery(state)
  
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !task.title.toLowerCase().includes(query) &&
        !task.description.toLowerCase().includes(query) &&
        !task.tags.some(tag => tag.toLowerCase().includes(query))
      ) {
        return false
      }
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some(tag => task.tags.includes(tag))) return false
    }
    
    // Due date range filter
    if (filters.dueDateRange && task.dueDate) {
      const taskDate = new Date(task.dueDate)
      if (filters.dueDateRange.start) {
        const startDate = new Date(filters.dueDateRange.start)
        if (taskDate < startDate) return false
      }
      if (filters.dueDateRange.end) {
        const endDate = new Date(filters.dueDateRange.end)
        if (taskDate > endDate) return false
      }
    }
    
    return true
  })
}

export const selectTaskStatistics = (state: { tasks: typeof initialState }) => {
  const tasks = selectAllTasks(state)
  
  return {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    done: tasks.filter(task => task.status === 'done').length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    overdue: tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'done'
    ).length,
  }
}
```

---

## RTK Query Setup

### 💡 Understanding Server State vs Client State

**The Two Types of State in Modern Apps:**

```javascript
// 🖥️ Client State (App-controlled)
{
  ui: { sidebarOpen: true, currentPage: 'dashboard' },
  form: { email: 'user@example.com', errors: {} },
  user: { preferences: { theme: 'dark' } }
}

// 🌐 Server State (Server-controlled, cached locally)  
{
  api: {
    queries: {
      'getUsers': { data: [...], status: 'fulfilled' },
      'getTasks': { data: [...], status: 'pending' }
    }
  }
}
```

**Why Server State is Different:**
1. **Remote Origin**: Data lives on server, not in your app
2. **Asynchronous**: All operations are async (network calls)
3. **Shared Ownership**: Multiple users can modify the same data
4. **Cache Management**: Need strategies for stale data, invalidation
5. **Error Handling**: Network failures, timeouts, server errors

**Traditional Server State Problems:**
```javascript
// ❌ Manual server state management (error-prone)
function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  
  // What about caching? Refetching? Error retry? Race conditions?
}

// ✅ RTK Query handles everything automatically
function TaskList() {
  const { data: tasks, isLoading, error } = useGetTasksQuery()
  
  // Caching ✅ Refetching ✅ Error retry ✅ Race conditions ✅
}
```

**RTK Query Mental Model - Think of it as a Smart Cache:**
```javascript
// 🧠 RTK Query = Intelligent Data Layer
Component Request → RTK Query → Check Cache → API Call (if needed) → Update Cache → Re-render Component

// 📊 Cache Lifecycle:
1. Component mounts → Subscribe to query
2. Cache miss → Fetch from server  
3. Cache hit → Return cached data instantly
4. Data becomes stale → Background refetch
5. Component unmounts → Unsubscribe (cache persists)
6. Cache becomes unused → Garbage collect after timeout
```

**Key RTK Query Benefits:**
- **Automatic Caching**: Intelligent cache with configurable TTL
- **Background Refetching**: Keeps data fresh automatically
- **Optimistic Updates**: UI updates immediately, syncs later
- **Error Handling**: Built-in retry logic and error states
- **Loading States**: Automatic loading indicators
- **TypeScript**: Full type safety for API responses
- **DevTools**: Excellent debugging with cache inspection

### Step 1: Create API Slice

Create `src/store/api/apiSlice.ts`:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

// Types
export interface ApiError {
  status: number
  data: {
    message: string
    errors?: Record<string, string[]>
  }
}

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const token = (getState() as RootState).auth.token
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    
    headers.set('content-type', 'application/json')
    return headers
  },
})

// Base query with re-auth
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token or logout
    api.dispatch({ type: 'auth/logout' })
  }
  
  return result
}

// API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Task', 'User', 'Project'],
  endpoints: (builder) => ({
    // Tasks endpoints will be injected from task API slice
  }),
})

export default apiSlice
```

### Step 2: Create Task API Slice

Create `src/store/api/tasksApi.ts`:

```typescript
import { apiSlice } from './apiSlice'
import type { Task, TaskFilters } from '../slices/tasksSlice'

// Extended API slice for tasks
export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks with optional filters
    getTasks: builder.query<Task[], TaskFilters | void>({
      query: (filters = {}) => ({
        url: '/tasks',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
      // Transform response if needed
      transformResponse: (response: any) => {
        // Handle API response transformation
        return response.data || response
      },
    }),
    
    // Get single task
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    
    // Create task
    createTask: builder.mutation<Task, Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: createdTask } = await queryFulfilled
          
          // Update the cache immediately
          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
              draft.push(createdTask)
            })
          )
        } catch {
          // Rollback handled automatically by RTK Query
        }
      },
    }),
    
    // Update task
    updateTask: builder.mutation<Task, { id: string; updates: Partial<Task> }>({
      query: ({ id, updates }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
      // Optimistic update
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            const task = draft.find(task => task.id === id)
            if (task) {
              Object.assign(task, updates, { updatedAt: new Date().toISOString() })
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          // Rollback the optimistic update
          patchResult.undo()
        }
      },
    }),
    
    // Delete task
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            return draft.filter(task => task.id !== id)
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    
    // Bulk operations
    bulkUpdateTasks: builder.mutation<Task[], { ids: string[]; updates: Partial<Task> }>({
      query: ({ ids, updates }) => ({
        url: '/tasks/bulk',
        method: 'PATCH',
        body: { ids, updates },
      }),
      invalidatesTags: (result, error, { ids }) => [
        ...ids.map(id => ({ type: 'Task' as const, id })),
        { type: 'Task', id: 'LIST' },
      ],
    }),
    
    bulkDeleteTasks: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/tasks/bulk',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error, ids) => [
        ...ids.map(id => ({ type: 'Task' as const, id })),
        { type: 'Task', id: 'LIST' },
      ],
    }),
  }),
})

// Export hooks for components
export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useBulkUpdateTasksMutation,
  useBulkDeleteTasksMutation,
} = tasksApi

// Export utility functions
export const {
  selectAll: selectAllCachedTasks,
  selectById: selectCachedTaskById,
} = tasksApi.endpoints.getTasks.select(undefined)
```

### Step 3: User API Slice

Create `src/store/api/usersApi.ts`:

```typescript
import { apiSlice } from './apiSlice'
import type { User } from '../slices/authSlice'

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    
    updateCurrentUser: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: '/users/me',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: '/users/me/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useUploadAvatarMutation,
} = usersApi
```

---

## Async State Management

### Step 1: Enhanced Async Thunk Patterns

Create `src/store/middleware/errorMiddleware.ts`:

```typescript
import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { addNotification } from '../slices/uiSlice'

// Middleware to handle rejected async thunks
export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as string
    
    // Add error notification
    store.dispatch(addNotification({
      type: 'error',
      title: 'Error',
      message: error || 'An unexpected error occurred',
      duration: 5000,
    }))
  }
  
  return next(action)
}
```

### Step 2: Loading States Management

Create `src/store/middleware/loadingMiddleware.ts`:

```typescript
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { setGlobalLoading } from '../slices/uiSlice'
import { loginUser, registerUser, updateUserProfile } from '../slices/authSlice'
import { fetchTasks, createTask, updateTask, deleteTask } from '../slices/tasksSlice'

export const loadingMiddleware = createListenerMiddleware()

// Track loading states for specific async thunks
const asyncThunks = [
  loginUser,
  registerUser,
  updateUserProfile,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
]

// Listen for pending actions
loadingMiddleware.startListening({
  matcher: isAnyOf(...asyncThunks.map(thunk => thunk.pending)),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as any
    const activeRequests = Object.values(state).reduce((count: number, slice: any) => {
      return count + (slice.loading ? 1 : 0)
    }, 0)
    
    if (activeRequests > 0) {
      listenerApi.dispatch(setGlobalLoading(true))
    }
  },
})

// Listen for fulfilled/rejected actions
loadingMiddleware.startListening({
  matcher: isAnyOf(
    ...asyncThunks.map(thunk => thunk.fulfilled),
    ...asyncThunks.map(thunk => thunk.rejected)
  ),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as any
    const activeRequests = Object.values(state).reduce((count: number, slice: any) => {
      return count + (slice.loading ? 1 : 0)
    }, 0)
    
    if (activeRequests === 0) {
      listenerApi.dispatch(setGlobalLoading(false))
    }
  },
})
```

### Step 3: Update Store Configuration

Update `src/store/index.ts` to include middleware:

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Import reducers
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import tasksReducer from './slices/tasksSlice'

// Import API slices
import { apiSlice } from './api/apiSlice'

// Import middleware
import { errorMiddleware } from './middleware/errorMiddleware'
import { loadingMiddleware } from './middleware/loadingMiddleware'

export const store = configureStore({
  reducer: {
    // Feature slices
    auth: authReducer,
    ui: uiReducer,
    tasks: tasksReducer,
    
    // API slice
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    })
    .concat(apiSlice.middleware)
    .concat(errorMiddleware)
    .concat(loadingMiddleware.middleware),
  
  devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
```

---

## Entity Management

### Step 1: Create Reusable Entity Adapter Utilities

Create `src/store/utils/entityUtils.ts`:

```typescript
import { createEntityAdapter, EntityAdapter, EntityState } from '@reduxjs/toolkit'

// Generic entity adapter factory
export function createGenericEntityAdapter<T extends { id: string }>(
  sortComparer?: (a: T, b: T) => number
): EntityAdapter<T> {
  return createEntityAdapter<T>({
    sortComparer,
  })
}

// Utility to create selectors for entity adapters
export function createEntitySelectors<T extends { id: string }>(
  adapter: EntityAdapter<T>,
  selectSlice: (state: any) => EntityState<T>
) {
  const selectors = adapter.getSelectors(selectSlice)
  
  return {
    ...selectors,
    selectById: (state: any, id: string) => selectors.selectById(state, id),
    selectMany: (state: any, ids: string[]) => selectors.selectAll(state).filter(entity => ids.includes(entity.id)),
    selectFiltered: (state: any, predicate: (entity: T) => boolean) => 
      selectors.selectAll(state).filter(predicate),
  }
}

// Utility for normalized updates
export function createEntityUpdater<T extends { id: string }>(
  adapter: EntityAdapter<T>
) {
  return {
    upsertOne: adapter.upsertOne,
    upsertMany: adapter.upsertMany,
    updateOne: adapter.updateOne,
    updateMany: adapter.updateMany,
    removeOne: adapter.removeOne,
    removeMany: adapter.removeMany,
    setAll: adapter.setAll,
    addOne: adapter.addOne,
    addMany: adapter.addMany,
  }
}
```

### Step 2: Projects Slice Example

Create `src/store/slices/projectsSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'archived'
  startDate: string
  endDate?: string
  teamMembers: string[]
  taskIds: string[]
  createdAt: string
  updatedAt: string
}

// Entity adapter
const projectsAdapter = createEntityAdapter<Project>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

interface ProjectsState {
  loading: boolean
  error: string | null
  selectedProjectId: string | null
}

const initialState = projectsAdapter.getInitialState<ProjectsState>({
  loading: false,
  error: null,
  selectedProjectId: null,
})

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data
      const projects: Project[] = [
        {
          id: 'project-1',
          name: 'Task Manager App',
          description: 'Modern React application with Redux Toolkit',
          status: 'active',
          startDate: '2025-09-01',
          teamMembers: ['user-1', 'user-2'],
          taskIds: ['1', '2', '3'],
          createdAt: '2025-09-01T00:00:00Z',
          updatedAt: '2025-09-19T00:00:00Z',
        },
      ]
      
      return projects
    } catch (error) {
      return rejectWithValue('Failed to fetch projects')
    }
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    selectProject: (state, action) => {
      state.selectedProjectId = action.payload
    },
    clearSelectedProject: (state) => {
      state.selectedProjectId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        projectsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { selectProject, clearSelectedProject } = projectsSlice.actions
export default projectsSlice.reducer

// Selectors
export const {
  selectAll: selectAllProjects,
  selectById: selectProjectById,
  selectIds: selectProjectIds,
} = projectsAdapter.getSelectors((state: { projects: typeof initialState }) => state.projects)

export const selectSelectedProject = (state: { projects: typeof initialState }) => {
  const selectedId = state.projects.selectedProjectId
  return selectedId ? selectProjectById(state, selectedId) : null
}
```

---

## Performance Optimization

### 💡 Understanding Redux Performance

**Redux Performance Challenges:**
```javascript
// ❌ Performance anti-patterns
function TaskList() {
  // Re-selects all tasks on every render (expensive)
  const tasks = useSelector(state => state.tasks.items)
  const filteredTasks = tasks.filter(task => task.status === 'active')
  
  // Object creation causes unnecessary re-renders
  const taskStats = useSelector(state => ({
    total: state.tasks.items.length,
    completed: state.tasks.items.filter(t => t.status === 'done').length
  }))
  
  return <div>{/* Renders */}</div>
}

// ✅ Optimized selectors
const selectActiveTasks = createSelector(
  [state => state.tasks.items],
  (tasks) => tasks.filter(task => task.status === 'active')
)

const selectTaskStats = createSelector(
  [state => state.tasks.items],
  (tasks) => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length
  })
)

function TaskList() {
  const activeTasks = useSelector(selectActiveTasks)
  const taskStats = useSelector(selectTaskStats)
  
  return <div>{/* Only re-renders when data actually changes */}</div>
}
```

### Step 1: Memoized Selectors

Create optimized selectors in `src/store/selectors/`:

```typescript
// src/store/selectors/taskSelectors.ts
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'

// Base selectors
const selectTasksSlice = (state: RootState) => state.tasks
const selectTaskItems = (state: RootState) => state.tasks.items
const selectTaskFilter = (state: RootState) => state.tasks.filter

// Memoized computed selectors
export const selectFilteredTasks = createSelector(
  [selectTaskItems, selectTaskFilter],
  (tasks, filter) => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => task.status !== 'done')
      case 'completed':
        return tasks.filter(task => task.status === 'done')
      case 'overdue':
        return tasks.filter(task => 
          task.dueDate && 
          new Date(task.dueDate) < new Date() && 
          task.status !== 'done'
        )
      default:
        return tasks
    }
  }
)

export const selectTaskStats = createSelector(
  [selectTaskItems],
  (tasks) => ({
    total: tasks.length,
    active: tasks.filter(task => task.status !== 'done').length,
    completed: tasks.filter(task => task.status === 'done').length,
    overdue: tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'done'
    ).length,
  })
)

// Parametric selector for single task
export const selectTaskById = (taskId: string) =>
  createSelector(
    [selectTaskItems],
    (tasks) => tasks.find(task => task.id === taskId)
  )
```

### Step 2: Component Optimization

```typescript
// src/components/TaskList/TaskItem.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { selectTaskById } from '@/store/selectors/taskSelectors'

interface TaskItemProps {
  taskId: string
}

// Component only re-renders when this specific task changes
export const TaskItem: React.FC<TaskItemProps> = React.memo(({ taskId }) => {
  const task = useSelector(selectTaskById(taskId))
  
  if (!task) return null
  
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  )
})

// src/components/TaskList/index.tsx
export const TaskList: React.FC = () => {
  const taskIds = useSelector(state => state.tasks.items.map(task => task.id))
  
  return (
    <div>
      {taskIds.map(taskId => (
        <TaskItem key={taskId} taskId={taskId} />
      ))}
    </div>
  )
}
```

### Step 3: RTK Query Performance

```typescript
// Optimized queries with selective subscriptions
export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      // Keep data fresh for 60 seconds
      keepUnusedDataFor: 60,
      // Provide specific cache tags for fine-grained invalidation
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    
    updateTask: builder.mutation<Task, Partial<Task> & Pick<Task, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApiSlice.util.updateQueryData('getTasks', undefined, (draft) => {
            const task = draft.find(task => task.id === id)
            if (task) {
              Object.assign(task, patch)
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      // Invalidate specific task
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
  }),
})
```

---

## Testing Redux Logic

### 💡 Understanding Redux Testing

**What to Test in Redux:**
1. **Reducers**: Pure functions with predictable outputs
2. **Action Creators**: Generate correct action objects
3. **Selectors**: Return correct derived state
4. **Async Thunks**: Handle API calls and state updates
5. **RTK Query**: API endpoints and cache behavior

### Step 1: Testing Reducers

```typescript
// src/store/slices/__tests__/tasksSlice.test.ts
import { tasksSlice, addTask, updateTask, deleteTask } from '../tasksSlice'
import type { Task } from '@/types'

describe('tasksSlice', () => {
  const initialState = {
    items: [],
    filter: 'all' as const,
    loading: false,
    error: null,
  }
  
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  test('should handle addTask', () => {
    const action = addTask(mockTask)
    const state = tasksSlice.reducer(initialState, action)
    
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toEqual(mockTask)
  })

  test('should handle updateTask', () => {
    const stateWithTask = {
      ...initialState,
      items: [mockTask],
    }
    
    const updates = { title: 'Updated Task', status: 'done' as const }
    const action = updateTask({ id: '1', updates })
    const state = tasksSlice.reducer(stateWithTask, action)
    
    expect(state.items[0].title).toBe('Updated Task')
    expect(state.items[0].status).toBe('done')
  })

  test('should handle deleteTask', () => {
    const stateWithTask = {
      ...initialState,
      items: [mockTask],
    }
    
    const action = deleteTask('1')
    const state = tasksSlice.reducer(stateWithTask, action)
    
    expect(state.items).toHaveLength(0)
  })
})
```

### Step 2: Testing Selectors

```typescript
// src/store/selectors/__tests__/taskSelectors.test.ts
import { selectFilteredTasks, selectTaskStats } from '../taskSelectors'
import type { RootState } from '../../index'

describe('taskSelectors', () => {
  const mockState: Partial<RootState> = {
    tasks: {
      items: [
        {
          id: '1',
          title: 'Todo Task',
          status: 'todo',
          dueDate: '2025-12-31',
          createdAt: '2025-09-01T00:00:00Z',
          updatedAt: '2025-09-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Done Task',
          status: 'done',
          createdAt: '2025-09-01T00:00:00Z',
          updatedAt: '2025-09-01T00:00:00Z',
        },
      ],
      filter: 'all',
      loading: false,
      error: null,
    },
  }

  test('selectFilteredTasks should filter active tasks', () => {
    const stateWithFilter = {
      ...mockState,
      tasks: { ...mockState.tasks!, filter: 'active' as const },
    }
    
    const result = selectFilteredTasks(stateWithFilter as RootState)
    
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('todo')
  })

  test('selectTaskStats should calculate correct stats', () => {
    const result = selectTaskStats(mockState as RootState)
    
    expect(result).toEqual({
      total: 2,
      active: 1,
      completed: 1,
      overdue: 0,
    })
  })
})
```

### Step 3: Testing RTK Query

```typescript
// src/store/api/__tests__/tasksApi.test.ts
import { setupApiStore } from '@/test-utils/api-store'
import { tasksApiSlice } from '../tasksApiSlice'

describe('tasksApiSlice', () => {
  const storeRef = setupApiStore(tasksApiSlice)

  test('getTasks should fetch and cache tasks', async () => {
    const { store } = storeRef
    
    // Start the query
    const promise = store.dispatch(tasksApiSlice.endpoints.getTasks.initiate())
    
    // Wait for the query to finish
    const result = await promise
    
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
    
    // Check that the data is cached
    const state = store.getState()
    const cachedData = tasksApiSlice.endpoints.getTasks.select()(state)
    expect(cachedData.data).toEqual(result.data)
  })
})
```

### Step 4: Testing Components with Redux

```typescript
// src/components/__tests__/TaskList.test.tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { TaskList } from '../TaskList'
import tasksReducer from '@/store/slices/tasksSlice'

function renderWithRedux(
  component: React.ReactElement,
  preloadedState = {}
) {
  const store = configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState,
  })
  
  return render(<Provider store={store}>{component}</Provider>)
}

describe('TaskList', () => {
  test('renders tasks from Redux store', () => {
    const preloadedState = {
      tasks: {
        items: [
          { id: '1', title: 'Test Task', status: 'todo' },
        ],
        filter: 'all',
        loading: false,
        error: null,
      },
    }
    
    renderWithRedux(<TaskList />, preloadedState)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
})
```

---

## Best Practices

### 💡 Redux Architecture Best Practices

**State Structure Guidelines:**
```javascript
// ✅ Good state structure (normalized, flat)
{
  entities: {
    users: { byId: { '1': {...}, '2': {...} }, allIds: ['1', '2'] },
    tasks: { byId: { '1': {...}, '2': {...} }, allIds: ['1', '2'] },
  },
  ui: {
    selectedTaskId: '1',
    sidebarOpen: true,
    loading: { tasks: false, users: false },
  }
}

// ❌ Avoid nested, denormalized state
{
  users: [
    { 
      id: '1', 
      tasks: [
        { id: '1', assignedUser: { id: '1', name: '...' } }  // Duplication!
      ] 
    }
  ]
}
```

**Key Best Practices:**

1. **Feature-Based Organization**: Group by domain, not by technical concern
2. **Normalized State**: Use createEntityAdapter for relational data
3. **Memoized Selectors**: Use createSelector for computed values
4. **Type Safety**: Leverage TypeScript for better developer experience
5. **Server State Separation**: Use RTK Query for API data, Redux for client state
6. **Single Responsibility**: Each slice handles one domain
7. **Immutable Updates**: Use RTK's Immer integration
8. **Error Boundaries**: Handle async errors gracefully

**Common Anti-Patterns to Avoid:**
```javascript
// ❌ Don't store derived data
const slice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    completedTasks: [],  // ❌ This can be computed
    taskCount: 0,        // ❌ This can be computed
  }
})

// ✅ Compute derived data in selectors
const selectCompletedTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => task.status === 'done')
)

// ❌ Don't put non-serializable data in state
const slice = createSlice({
  initialState: {
    dateObject: new Date(),    // ❌ Not serializable
    functionRef: () => {},     // ❌ Not serializable
  }
})

// ✅ Store serializable data only
const slice = createSlice({
  initialState: {
    dateString: '2025-09-20T00:00:00Z',  // ✅ Serializable
  }
})
```

---

## Summary

🎉 **Congratulations!** You now have a comprehensive Redux Toolkit setup with:

✅ **Modern Redux Architecture**: RTK with proper TypeScript integration  
✅ **Entity Management**: Normalized state with createEntityAdapter  
✅ **Server State**: RTK Query with caching and optimistic updates  
✅ **Async State Management**: Proper loading, error, and success states  
✅ **Middleware**: Error handling and loading state management  
✅ **Performance**: Memoized selectors and optimized re-renders  
✅ **Developer Experience**: Redux DevTools and excellent debugging  

### Key Benefits Achieved

1. **Predictable State**: Single source of truth with immutable updates
2. **Performance**: Normalized entities and memoized selectors
3. **Developer Experience**: Time-travel debugging and excellent DevTools
4. **Type Safety**: Full TypeScript integration throughout
5. **Server State**: Automated caching, invalidation, and synchronization
6. **Scalability**: Patterns that work for small to enterprise applications

### Next Steps

- **Chapter 5**: React Hook Form for comprehensive form handling
- **Chapter 6**: API integration patterns and error handling
- **Chapter 7**: Testing strategies for Redux logic

---

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

---

**Previous**: [← Chapter 3 - Routing & Navigation](./03-routing-navigation.md) | **Next**: [Chapter 5 - Forms & Validation →](./05-forms-validation.md)