# Chapter 3: React Router & Navigation 🧭

## Overview

In this chapter, we'll implement React Router v6 for client-side routing, create a comprehensive navigation system, and establish routing patterns that scale with your application. We'll cover everything from basic routing to advanced patterns like protected routes and layout-based navigation.

---

## 📋 Table of Contents

1. [Why React Router v6?](#why-react-router-v6)
2. [Installation & Basic Setup](#installation--basic-setup)
3. [Route Configuration](#route-configuration)
4. [Navigation Components](#navigation-components)
5. [Layout-Based Routing](#layout-based-routing)
6. [Protected Routes](#protected-routes)
7. [Dynamic Routing](#dynamic-routing)
8. [Navigation State Management](#navigation-state-management)
9. [Breadcrumbs & Page Titles](#breadcrumbs--page-titles)
10. [Performance Optimization](#performance-optimization)

---

## Why React Router v6?

### Key Improvements in v6

React Router v6 introduced significant improvements over previous versions:

| Feature | v5 | v6 | Benefits |
|---------|----|----|----------|
| **Bundle Size** | 43KB | 11KB | 70% smaller bundle |
| **Route Definition** | Component-based | Config-based | Better tree-shaking |
| **Nested Routes** | Complex | Intuitive | Easier layout patterns |
| **TypeScript** | Limited | Excellent | Full type safety |
| **Performance** | Good | Excellent | Better re-render optimization |
| **API Design** | Imperative | Declarative | More React-like patterns |

### Why Choose React Router v6?

1. **Modern API**: Hooks-based, declarative routing
2. **Better Performance**: Smaller bundle, optimized rendering
3. **Nested Routing**: Intuitive layout and outlet patterns
4. **TypeScript Support**: Excellent type inference and safety
5. **Future-Proof**: Actively maintained, latest React patterns
6. **Industry Standard**: Used by 80%+ of React applications

---

## Installation & Basic Setup

### Step 1: Install React Router

```bash
# Install React Router v6
npm install react-router-dom

# Install type definitions (if using TypeScript)
npm install --save-dev @types/react-router-dom
```

### Step 2: Basic Router Setup

Update `src/main.tsx` to add router provider:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Import fonts
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/material-icons'

import { ThemeProvider } from '@/contexts/ThemeContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

### Step 3: Create Basic Pages

Create page components structure:

```bash
mkdir -p src/pages/{Dashboard,Profile,Settings,Tasks,Auth}
touch src/pages/Dashboard/index.tsx
touch src/pages/Profile/index.tsx
touch src/pages/Settings/index.tsx
touch src/pages/Tasks/{index.tsx,TaskList.tsx,TaskDetail.tsx}
touch src/pages/Auth/{Login.tsx,Register.tsx,ForgotPassword.tsx}
touch src/pages/{NotFound.tsx,Home.tsx}
```

Create `src/pages/Home.tsx`:

```typescript
import React from 'react'
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Dashboard, Assignment, Person, Settings } from '@mui/icons-material'

export const Home: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Dashboard',
      description: 'View your overview and analytics',
      icon: <Dashboard color="primary" sx={{ fontSize: 40 }} />,
      path: '/dashboard',
    },
    {
      title: 'Tasks',
      description: 'Manage your tasks and projects',
      icon: <Assignment color="primary" sx={{ fontSize: 40 }} />,
      path: '/tasks',
    },
    {
      title: 'Profile',
      description: 'Update your profile information',
      icon: <Person color="primary" sx={{ fontSize: 40 }} />,
      path: '/profile',
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: <Settings color="primary" sx={{ fontSize: 40 }} />,
      path: '/settings',
    },
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Task Manager
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A modern React application with Material-UI and React Router
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                {feature.icon}
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home
```

Create other basic pages:

```typescript
// src/pages/Dashboard/index.tsx
import React from 'react'
import { Typography, Container, Paper, Box } from '@mui/material'

export const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Welcome to your dashboard! This is where you'll see an overview of your tasks and analytics.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Dashboard
```

```typescript
// src/pages/Profile/index.tsx
import React from 'react'
import { Typography, Container, Paper, Box } from '@mui/material'

export const Profile: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Manage your profile information and preferences here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Profile
```

```typescript
// src/pages/Tasks/index.tsx
import React from 'react'
import { Typography, Container, Paper, Box } from '@mui/material'

export const Tasks: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tasks
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Your task management interface will be implemented here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Tasks
```

```typescript
// src/pages/Settings/index.tsx
import React from 'react'
import { Typography, Container, Paper, Box } from '@mui/material'

export const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Configure your application settings and preferences.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Settings
```

```typescript
// src/pages/NotFound.tsx
import React from 'react'
import { Container, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon } from '@mui/icons-material'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  )
}

export default NotFound
```

---

## Route Configuration

### Step 1: Create Route Configuration

Create `src/routes/index.tsx`:

```typescript
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'

// Import layouts
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// Import pages
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Tasks from '@/pages/Tasks'
import NotFound from '@/pages/NotFound'

// Lazy load auth pages for better performance
const Login = React.lazy(() => import('@/pages/Auth/Login'))
const Register = React.lazy(() => import('@/pages/Auth/Register'))
const ForgotPassword = React.lazy(() => import('@/pages/Auth/ForgotPassword'))

// Loading component
const Loading: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
    }}
  >
    <CircularProgress />
  </Box>
)

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes with main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>

        {/* Auth routes with auth layout */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
```

### Step 2: Create Route Types

Create `src/types/routes.ts`:

```typescript
export interface RouteConfig {
  path: string
  element: React.ComponentType
  children?: RouteConfig[]
  protected?: boolean
  title?: string
  description?: string
  icon?: React.ReactNode
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: React.ReactNode
  children?: NavigationItem[]
  disabled?: boolean
  badge?: string | number
}
```

### Step 3: Create Navigation Configuration

Create `src/config/navigation.tsx`:

```typescript
import React from 'react'
import {
  Dashboard,
  Assignment,
  Person,
  Settings,
  Home as HomeIcon,
} from '@mui/icons-material'
import { NavigationItem } from '@/types/routes'

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: <HomeIcon />,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <Dashboard />,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: <Assignment />,
    children: [
      {
        id: 'task-list',
        label: 'All Tasks',
        path: '/tasks',
      },
      {
        id: 'task-create',
        label: 'Create Task',
        path: '/tasks/create',
      },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: <Person />,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <Settings />,
  },
]

export const getNavigationItemByPath = (path: string): NavigationItem | undefined => {
  const findItem = (items: NavigationItem[]): NavigationItem | undefined => {
    for (const item of items) {
      if (item.path === path) return item
      if (item.children) {
        const found = findItem(item.children)
        if (found) return found
      }
    }
    return undefined
  }
  return findItem(navigationItems)
}
```

---

## Navigation Components

### Step 1: Create Navigation Hook

Create `src/hooks/useNavigation.ts`:

```typescript
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigationItems, getNavigationItemByPath } from '@/config/navigation'
import { NavigationItem, BreadcrumbItem } from '@/types/routes'

export const useNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname
  const currentItem = useMemo(() => getNavigationItemByPath(currentPath), [currentPath])

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const pathSegments = currentPath.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

    let currentPath = ''
    for (const segment of pathSegments) {
      currentPath += `/${segment}`
      const item = getNavigationItemByPath(currentPath)
      if (item) {
        items.push({
          label: item.label,
          href: currentPath,
        })
      }
    }

    // Mark last item as current
    if (items.length > 0) {
      items[items.length - 1].current = true
      delete items[items.length - 1].href
    }

    return items
  }, [currentPath])

  const isActiveRoute = (path: string): boolean => {
    if (path === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(path)
  }

  const navigateTo = (path: string) => {
    navigate(path)
  }

  const goBack = () => {
    navigate(-1)
  }

  const goForward = () => {
    navigate(1)
  }

  return {
    currentPath,
    currentItem,
    navigationItems,
    breadcrumbs,
    isActiveRoute,
    navigateTo,
    goBack,
    goForward,
  }
}
```

### Step 2: Create Sidebar Navigation

Create `src/components/layout/Sidebar.tsx`:

```typescript
import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useNavigation } from '@/hooks/useNavigation'
import { NavigationItem } from '@/types/routes'

interface SidebarProps {
  open: boolean
  onClose: () => void
  width?: number
  variant?: 'permanent' | 'persistent' | 'temporary'
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  width = 280,
  variant = 'temporary',
}) => {
  const { navigationItems, isActiveRoute, navigateTo } = useNavigation()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      handleToggleExpand(item.id)
    } else {
      navigateTo(item.path)
      if (variant === 'temporary') {
        onClose()
      }
    }
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const isActive = isActiveRoute(item.path)

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={isActive && !hasChildren}
            sx={{
              pl: 2 + level * 2,
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: level > 0 ? '0.875rem' : '1rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(childItem =>
                renderNavigationItem(childItem, level + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Task Manager
        </Typography>
      </Box>
      
      <Divider />

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 1 }}>
          {navigationItems.map(item => renderNavigationItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 Task Manager
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar
```

### Step 3: Create App Header

Create `src/components/layout/Header.tsx`:

```typescript
import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person,
  Settings,
  ExitToApp,
  Notifications,
} from '@mui/icons-material'

import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useNavigation } from '@/hooks/useNavigation'

interface HeaderProps {
  onMenuClick: () => void
  showMenuButton?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = true,
}) => {
  const { currentItem } = useNavigation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    handleProfileMenuClose()
    // Navigate to profile
  }

  const handleSettingsClick = () => {
    handleProfileMenuClose()
    // Navigate to settings
  }

  const handleLogoutClick = () => {
    handleProfileMenuClose()
    // Handle logout
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {currentItem?.label || 'Task Manager'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            color="inherit"
            aria-label="account of current user"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <Person />
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
```

---

## Layout-Based Routing

### Step 1: Create Main Layout

Create `src/components/layout/MainLayout.tsx`:

```typescript
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'

export const MainLayout: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header onMenuClick={handleSidebarToggle} />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        variant={isMobile ? 'temporary' : 'persistent'}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px', // Account for AppBar height
          pl: isMobile || !sidebarOpen ? 0 : '280px', // Account for Sidebar width
          transition: theme.transitions.create(['margin', 'padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Breadcrumbs */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Breadcrumbs />
        </Box>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
```

### Step 2: Create Auth Layout

Create `src/components/layout/AuthLayout.tsx`:

```typescript
import React from 'react'
import { Outlet } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'

import { ThemeToggle } from '@/components/common/ThemeToggle'

export const AuthLayout: React.FC = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Task Manager
        </Typography>
        <ThemeToggle />
      </Box>

      {/* Main Content */}
      <Container component="main" maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            p: 4,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Outlet />
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 Task Manager. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthLayout
```

### Step 3: Create Breadcrumbs Component

Create `src/components/layout/Breadcrumbs.tsx`:

```typescript
import React from 'react'
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material'
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import { useNavigation } from '@/hooks/useNavigation'

export const Breadcrumbs: React.FC = () => {
  const { breadcrumbs } = useNavigation()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <Box>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          if (isLast || !item.href) {
            return (
              <Typography key={index} color="text.primary" fontWeight={500}>
                {item.label}
              </Typography>
            )
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.href}
              color="inherit"
              underline="hover"
            >
              {item.label}
            </Link>
          )
        })}
      </MuiBreadcrumbs>
    </Box>
  )
}

export default Breadcrumbs
```

### Step 4: Create Auth Pages

Create `src/pages/Auth/Login.tsx`:

```typescript
import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Stack,
} from '@mui/material'

export const Login: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle login logic here
    navigate('/dashboard')
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Welcome Back
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
        Sign in to your account to continue
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            required
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Stack spacing={2} alignItems="center">
        <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
          Forgot your password?
        </Link>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/auth/register">
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default Login
```

Create `src/pages/Auth/Register.tsx`:

```typescript
import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Stack,
} from '@mui/material'

export const Register: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle registration logic here
    navigate('/dashboard')
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Create Account
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
        Join us today and start managing your tasks
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            required
          />
          <TextField
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            required
          />
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            required
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Account
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Stack spacing={2} alignItems="center">
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to="/auth/login">
            Sign in
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default Register
```

Create `src/pages/Auth/ForgotPassword.tsx`:

```typescript
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Alert,
} from '@mui/material'

export const ForgotPassword: React.FC = () => {
  const [emailSent, setEmailSent] = React.useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle forgot password logic here
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <Box textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Check Your Email
        </Typography>
        <Alert severity="success" sx={{ mt: 2, mb: 3 }}>
          We've sent password reset instructions to your email address.
        </Alert>
        <Link component={RouterLink} to="/auth/login">
          Back to Sign In
        </Link>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Reset Password
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
        Enter your email address and we'll send you instructions to reset your password
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Instructions
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Link component={RouterLink} to="/auth/login">
          Back to Sign In
        </Link>
      </Stack>
    </Box>
  )
}

export default ForgotPassword
```

### Step 5: Update App.tsx

Update `src/App.tsx` to use the route configuration:

```typescript
import React from 'react'
import { AppRoutes } from '@/routes'

function App() {
  return <AppRoutes />
}

export default App
```

**🎉 Success Indicator**: You should see a complete navigation system with a sidebar, header, breadcrumbs, and working routes between pages.

---

## Protected Routes

### Step 1: Create Auth Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate checking for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate API call to check existing session
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: undefined,
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // Simulate API registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: undefined,
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Step 2: Create Protected Route Component

Create `src/components/route/ProtectedRoute.tsx`:

```typescript
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    const from = (location.state as any)?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
```

### Step 3: Update Route Configuration

Update `src/routes/index.tsx` to include protected routes:

```typescript
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'

// Import layouts
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { ProtectedRoute } from '@/components/route/ProtectedRoute'

// Import pages
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Tasks from '@/pages/Tasks'
import NotFound from '@/pages/NotFound'

// Lazy load auth pages
const Login = React.lazy(() => import('@/pages/Auth/Login'))
const Register = React.lazy(() => import('@/pages/Auth/Register'))
const ForgotPassword = React.lazy(() => import('@/pages/Auth/ForgotPassword'))

// Loading component
const Loading: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
    }}
  >
    <CircularProgress />
  </Box>
)

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Protected routes with main layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>

        {/* Auth routes (only accessible when not authenticated) */}
        <Route
          path="/auth"
          element={
            <ProtectedRoute requireAuth={false}>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
```

### Step 4: Update Main Provider

Update `src/main.tsx` to include auth provider:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Import fonts
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/material-icons'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

---

## Dynamic Routing

### Step 1: Create Dynamic Task Routes

Add dynamic routes to your configuration. Update `src/routes/index.tsx`:

```typescript
// Add these imports
const TaskDetail = React.lazy(() => import('@/pages/Tasks/TaskDetail'))
const TaskEdit = React.lazy(() => import('@/pages/Tasks/TaskEdit'))

// Update the routes section for tasks
<Route path="tasks">
  <Route index element={<Tasks />} />
  <Route path="create" element={<TaskEdit />} />
  <Route path=":taskId" element={<TaskDetail />} />
  <Route path=":taskId/edit" element={<TaskEdit />} />
</Route>
```

### Step 2: Create Task Detail Page

Create `src/pages/Tasks/TaskDetail.tsx`:

```typescript
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Chip,
  Stack,
} from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'

export const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()

  // Mock task data - in real app, fetch based on taskId
  const task = {
    id: taskId,
    title: 'Sample Task',
    description: 'This is a detailed description of the task.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2025-09-30',
    assignee: 'John Doe',
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/tasks')}
          >
            Back to Tasks
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/tasks/${taskId}/edit`)}
          >
            Edit Task
          </Button>
        </Stack>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {task.title}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip label={`Status: ${task.status}`} color="primary" />
            <Chip label={`Priority: ${task.priority}`} color="warning" />
          </Stack>

          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {task.description}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Due Date:</strong> {task.dueDate}
          </Typography>
          
          <Typography variant="body1">
            <strong>Assignee:</strong> {task.assignee}
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default TaskDetail
```

### Step 3: Create Task Edit Page

Create `src/pages/Tasks/TaskEdit.tsx`:

```typescript
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Stack,
} from '@mui/material'
import { Save, Cancel } from '@mui/icons-material'

export const TaskEdit: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const isCreating = !taskId

  const handleSave = () => {
    // Handle save logic
    navigate(isCreating ? '/tasks' : `/tasks/${taskId}`)
  }

  const handleCancel = () => {
    navigate(isCreating ? '/tasks' : `/tasks/${taskId}`)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isCreating ? 'Create New Task' : `Edit Task ${taskId}`}
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Task Title"
              defaultValue={!isCreating ? 'Sample Task' : ''}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              defaultValue={!isCreating ? 'This is a detailed description of the task.' : ''}
            />
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              defaultValue={!isCreating ? '2025-09-30' : ''}
            />
            
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Task
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default TaskEdit
```

---

## Performance Optimization

### Step 1: Route-Based Code Splitting

Your routes are already set up with lazy loading. You can extend this pattern:

```typescript
// Group related routes for better chunking
const TaskPages = {
  List: React.lazy(() => import('@/pages/Tasks')),
  Detail: React.lazy(() => import('@/pages/Tasks/TaskDetail')),
  Edit: React.lazy(() => import('@/pages/Tasks/TaskEdit')),
}

const AdminPages = {
  Dashboard: React.lazy(() => import('@/pages/Admin/Dashboard')),
  Users: React.lazy(() => import('@/pages/Admin/Users')),
  Settings: React.lazy(() => import('@/pages/Admin/Settings')),
}
```

### Step 2: Preload Critical Routes

Create `src/utils/routePreloader.ts`:

```typescript
export const preloadRoute = (routeComponent: () => Promise<any>) => {
  const componentImport = routeComponent()
  return componentImport
}

// Preload critical routes on app load
export const preloadCriticalRoutes = () => {
  // Preload dashboard and tasks since they're commonly accessed
  preloadRoute(() => import('@/pages/Dashboard'))
  preloadRoute(() => import('@/pages/Tasks'))
}
```

Call this in your main app:

```typescript
// In App.tsx or main.tsx
import { preloadCriticalRoutes } from '@/utils/routePreloader'

// Preload after initial render
React.useEffect(() => {
  preloadCriticalRoutes()
}, [])
```

---

## Summary

🎉 **Congratulations!** You now have a comprehensive React Router setup with:

✅ **Modern Routing**: React Router v6 with declarative configuration  
✅ **Layout System**: Reusable layout components with outlet patterns  
✅ **Navigation**: Sidebar navigation with active states and breadcrumbs  
✅ **Protected Routes**: Authentication-based route protection  
✅ **Dynamic Routing**: Parameter-based routes for detailed pages  
✅ **Performance**: Lazy loading and code splitting  
✅ **Mobile Ready**: Responsive navigation patterns  

### Key Benefits Achieved

1. **Scalable Architecture**: Layout-based routing for consistent UI
2. **Type Safety**: Full TypeScript integration with route parameters
3. **Performance**: Code splitting and lazy loading out of the box
4. **User Experience**: Smooth navigation with loading states
5. **Security**: Protected routes with authentication checks
6. **Maintainability**: Centralized route configuration and navigation logic

### Next Steps

- **Chapter 4**: Redux Toolkit for state management
- **Chapter 5**: React Hook Form for form handling
- **Chapter 6**: API integration patterns

---

## 📚 Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [React Router v6 Migration Guide](https://reactrouter.com/upgrading/v5)
- [Code Splitting with React Router](https://reactrouter.com/route/lazy)

---

**Previous**: [← Chapter 2 - Material-UI Setup](./02-material-ui-setup.md) | **Next**: [Chapter 4 - State Management →](./04-state-management.md)