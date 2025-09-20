# Chapter 10: Complete Application 🎯

## Overview

In this final chapter, we'll build a comprehensive task management application that demonstrates all the concepts learned throughout this guide. This real-world example integrates modern React development patterns, Material-UI components, Redux state management, performance optimizations, security best practices, and comprehensive testing strategies to create a production-ready application.

---

## 📋 Table of Contents

1. [Application Architecture](#application-architecture)
2. [Project Structure Setup](#project-structure-setup)
3. [Core Features Implementation](#core-features-implementation)
4. [Authentication System](#authentication-system)
5. [Task Management Features](#task-management-features)
6. [Dashboard & Analytics](#dashboard--analytics)
7. [Real-time Features](#real-time-features)
8. [Advanced UI Components](#advanced-ui-components)
9. [Testing Implementation](#testing-implementation)
10. [Production Deployment](#production-deployment)

---

## Application Architecture

**🤔 WHY Complete Application Architecture Matters**

Building a complete application demonstrates the integration of all modern React development patterns into a cohesive, production-ready system. This integration reveals how individual concepts work together to create scalable, maintainable, and performant applications. A well-architected complete application serves as a blueprint for real-world development, showing how to handle complexity, maintain code quality, and deliver excellent user experiences at scale.

**🎯 WHAT Complete Application Architecture Encompasses**

Comprehensive application architecture includes:
- **Feature-Based Organization**: Modular structure that scales with team size and complexity
- **State Management Integration**: Coordinated state across authentication, data, and UI layers
- **API Integration Patterns**: Consistent data fetching, caching, and synchronization strategies
- **Performance Optimization**: Code splitting, lazy loading, and efficient rendering patterns
- **Security Implementation**: Authentication, authorization, and data protection measures
- **Testing Strategies**: Comprehensive testing from unit to end-to-end levels
- **Production Readiness**: Monitoring, error handling, and deployment configurations

**⏰ WHEN to Apply Different Architectural Patterns**

Architecture decisions depend on application scope and team context:

- **Prototype Development**: Simple structure with rapid iteration capabilities
- **MVP Launch**: Scalable foundation with essential features and growth capability
- **Team Growth**: Feature-based organization for multiple developers
- **Enterprise Scale**: Advanced patterns for large teams and complex requirements
- **Global Deployment**: Multi-region architecture with performance optimization
- **Regulatory Compliance**: Enhanced security and audit trail requirements

**🚀 HOW to Structure Production-Ready Applications**

Implementation follows proven architectural principles:

1. **Domain-Driven Design**: Organize code around business features and capabilities
2. **Separation of Concerns**: Clear boundaries between UI, state, and business logic
3. **Scalability by Design**: Architecture that accommodates growth and change
4. **Performance First**: Optimization strategies built into the foundation
5. **Testing Integration**: Testability considered in every architectural decision

### Feature Overview

Our task management application will include:

- 🔐 **Authentication**: Login, registration, password reset, 2FA
- 📋 **Task Management**: CRUD operations, categories, priorities, due dates
- 👥 **Team Collaboration**: Shared projects, task assignments, comments
- 📊 **Dashboard**: Analytics, progress tracking, charts
- 🔔 **Notifications**: Real-time updates, email notifications
- ⚙️ **Settings**: User preferences, theme customization, profile management
- 📱 **Responsive Design**: Mobile-first approach with PWA capabilities
- 🔍 **Search & Filters**: Advanced search, sorting, filtering options

### Technical Architecture

```
├── Frontend (React + TypeScript + Vite)
│   ├── Material-UI Components & Theming
│   ├── Redux Toolkit + RTK Query State Management
│   ├── React Router v6 Navigation
│   ├── React Hook Form + Zod Validation
│   ├── Vitest + React Testing Library
│   └── Performance & Security Optimizations
│
├── Backend API (Mock/Real)
│   ├── RESTful API with JSON
│   ├── Authentication & Authorization
│   ├── WebSocket for Real-time Updates
│   └── File Upload & Management
│
└── Deployment
    ├── Vercel Frontend Hosting
    ├── Environment Configuration
    ├── CI/CD Pipeline
    └── Monitoring & Analytics
```

---

## Project Structure Setup

### Step 1: Enhanced Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components
│   ├── ui/              # Base UI components
│   └── common/          # Common utility components
│
├── features/            # Feature-based modules
│   ├── auth/           # Authentication feature
│   ├── tasks/          # Task management feature
│   ├── dashboard/      # Dashboard feature
│   ├── teams/          # Team collaboration feature
│   ├── notifications/  # Notifications feature
│   └── settings/       # Settings feature
│
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useWebSocket.ts
│   └── useLocalStorage.ts
│
├── services/           # API and external services
│   ├── api/           # API service layer
│   ├── websocket/     # WebSocket service
│   └── storage/       # Storage service
│
├── store/              # Redux store configuration
│   ├── slices/        # Redux slices
│   ├── api/           # RTK Query APIs
│   └── middleware/    # Custom middleware
│
├── types/              # TypeScript type definitions
│   ├── auth.types.ts
│   ├── task.types.ts
│   ├── user.types.ts
│   └── api.types.ts
│
├── utils/              # Utility functions
│   ├── validation/    # Validation schemas
│   ├── formatters/    # Data formatters
│   └── helpers/       # Helper functions
│
└── assets/             # Static assets
    ├── icons/
    ├── images/
    └── locales/
```

### Step 2: Core Type Definitions

Create `src/types/core.types.ts`:

```typescript
// Core application types

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'admin' | 'manager' | 'member'
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: NotificationSettings
  dashboard: DashboardSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  inApp: boolean
  taskReminders: boolean
  projectUpdates: boolean
  teamInvitations: boolean
}

export interface DashboardSettings {
  defaultView: 'list' | 'board' | 'calendar'
  itemsPerPage: number
  showCompletedTasks: boolean
  groupBy: 'project' | 'priority' | 'dueDate' | 'none'
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  category?: TaskCategory
  projectId?: string
  assigneeId?: string
  reporterId: string
  dueDate?: string
  completedAt?: string
  tags: string[]
  attachments: Attachment[]
  comments: Comment[]
  subtasks: Subtask[]
  timeTracking: TimeTracking
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskCategory {
  id: string
  name: string
  color: string
  icon?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  ownerId: string
  members: ProjectMember[]
  settings: ProjectSettings
  stats: ProjectStats
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  userId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface ProjectSettings {
  isPrivate: boolean
  allowGuestAccess: boolean
  defaultTaskStatus: TaskStatus
  defaultTaskPriority: TaskPriority
  enableTimeTracking: boolean
  enableComments: boolean
}

export interface ProjectStats {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  activeMembers: number
}

export interface Comment {
  id: string
  content: string
  authorId: string
  taskId: string
  parentId?: string
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedBy: string
  uploadedAt: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

export interface TimeTracking {
  estimated?: number // minutes
  logged: number // minutes
  sessions: TimeSession[]
}

export interface TimeSession {
  id: string
  startTime: string
  endTime?: string
  duration?: number // minutes
  description?: string
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
}

export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'task_overdue'
  | 'comment_added'
  | 'project_invitation'
  | 'mention'
  | 'deadline_reminder'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code: string
  field?: string
  details?: Record<string, any>
}

// Filter and search types
export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeId?: string[]
  projectId?: string[]
  categoryId?: string[]
  tags?: string[]
  dueDateFrom?: string
  dueDateTo?: string
  createdFrom?: string
  createdTo?: string
  search?: string
}

export interface TaskSortOptions {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt'
  direction: 'asc' | 'desc'
}

// UI State types
export interface ViewState {
  layout: 'list' | 'board' | 'calendar'
  filters: TaskFilters
  sort: TaskSortOptions
  selectedTasks: string[]
  sidebarOpen: boolean
  detailsPanelOpen: boolean
}

export interface AppState {
  user: ViewState
  tasks: ViewState
  projects: ViewState
  notifications: {
    unreadCount: number
    lastChecked: string
  }
}
```

Create `src/types/api.types.ts`:

```typescript
// API-specific types

import { Task, Project, User, Comment, Notification } from './core.types'

// Authentication API
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  inviteCode?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

// Tasks API
export interface CreateTaskRequest {
  title: string
  description?: string
  priority: TaskPriority
  categoryId?: string
  projectId?: string
  assigneeId?: string
  dueDate?: string
  tags?: string[]
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: TaskStatus
}

export interface TasksListRequest {
  page?: number
  limit?: number
  filters?: TaskFilters
  sort?: TaskSortOptions
}

export interface TasksListResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Projects API
export interface CreateProjectRequest {
  name: string
  description?: string
  color: string
  icon?: string
  isPrivate?: boolean
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface InviteProjectMemberRequest {
  email: string
  role: ProjectMember['role']
}

// Comments API
export interface CreateCommentRequest {
  content: string
  taskId: string
  parentId?: string
}

export interface UpdateCommentRequest {
  content: string
}

// File Upload API
export interface UploadFileRequest {
  file: File
  entityType: 'task' | 'comment' | 'user'
  entityId: string
}

export interface UploadFileResponse {
  attachment: Attachment
}

// WebSocket Events
export interface WebSocketMessage {
  type: WebSocketEventType
  data: any
  timestamp: string
}

export type WebSocketEventType =
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'comment_added'
  | 'user_online'
  | 'user_offline'
  | 'notification_new'

// Analytics API
export interface DashboardStatsResponse {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  todaysTasks: number
  completionRate: number
  averageTaskDuration: number
  tasksByStatus: Record<TaskStatus, number>
  tasksByPriority: Record<TaskPriority, number>
  recentActivity: ActivityItem[]
  upcomingDeadlines: Task[]
}

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'comment_added' | 'project_created'
  title: string
  description: string
  timestamp: string
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>
}

// Search API
export interface SearchRequest {
  query: string
  filters?: {
    types?: ('tasks' | 'projects' | 'users')[]
    projectId?: string
    limit?: number
  }
}

export interface SearchResponse {
  tasks: Task[]
  projects: Project[]
  users: User[]
  total: number
}
```

---

## Core Features Implementation

**🤔 WHY Core Features Integration Is Essential**

Core features integration demonstrates how individual components, patterns, and services work together to create cohesive user experiences. This integration reveals the complexity of real-world applications where authentication affects data access, state management coordinates multiple features, and user interactions cascade through multiple system layers. Understanding this integration is crucial for building maintainable applications that can evolve with changing requirements.

**🎯 WHAT Core Features Integration Includes**

Comprehensive feature integration encompasses:
- **Cross-Feature Communication**: How authentication affects data access and UI state
- **State Coordination**: Managing shared state across multiple feature modules
- **Error Handling Integration**: Consistent error handling across all application features
- **Performance Optimization**: Feature-level optimizations that improve overall application performance
- **User Experience Coordination**: Seamless transitions and interactions between features
- **Security Integration**: Authentication and authorization affecting all feature interactions
- **Data Flow Patterns**: How data moves between features and external services

**⏰ WHEN to Focus on Different Integration Aspects**

Integration complexity scales with application development:

- **Individual Features**: Focus on feature-specific logic and isolated testing
- **Feature Interactions**: Implement communication patterns between related features
- **System Integration**: Coordinate authentication, routing, and global state
- **Performance Integration**: Optimize cross-feature performance and loading patterns
- **Production Integration**: Handle real-world edge cases and error scenarios
- **Scale Integration**: Manage complexity as features and team size grow

**🚀 HOW to Implement Effective Feature Integration**

Implementation follows modular integration principles:

1. **Clear Boundaries**: Define clean interfaces between features and shared services
2. **Event-Driven Communication**: Use events and hooks for feature communication
3. **Shared State Strategy**: Coordinate global state while maintaining feature autonomy
4. **Error Boundary Integration**: Implement comprehensive error handling across features
5. **Performance Coordination**: Optimize loading and rendering across feature boundaries

### Step 1: Enhanced Authentication System

Create `src/features/auth/components/LoginForm.tsx`:

```typescript
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  GitHub,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginAsync, selectAuth } from '../store/authSlice'
import { LoginRequest } from '@/types/api.types'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(selectAuth)
  const [showPassword, setShowPassword] = React.useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(loginAsync(data as LoginRequest))
      
      if (loginAsync.rejected.match(result)) {
        setError('root', {
          message: result.payload as string || 'Login failed',
        })
      }
    } catch (error) {
      setError('root', {
        message: 'An unexpected error occurred',
      })
    }
  }
  
  const handleSocialLogin = (provider: 'google' | 'github') => {
    // Implement social login
    window.location.href = `/api/auth/${provider}`
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>
        
        {(error || errors.root) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || errors.root?.message}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            fullWidth
            label="Email Address"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            {...register('password')}
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControlLabel
            control={<Checkbox {...register('rememberMe')} />}
            label="Remember me"
            sx={{ mt: 1 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading || isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link href="/auth/forgot-password" variant="body2">
              Forgot your password?
            </Link>
          </Box>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('google')}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={() => handleSocialLogin('github')}
            >
              GitHub
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/auth/register">
                Sign up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}
```

### Step 2: Task Management Components

Create `src/features/tasks/components/TaskCard.tsx`:

```typescript
import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  LinearProgress,
} from '@mui/material'
import {
  MoreVert,
  Edit,
  Delete,
  Comment,
  Attachment,
  Schedule,
  Flag,
} from '@mui/icons-material'
import { Task, TaskPriority, TaskStatus } from '@/types/core.types'
import { formatDistanceToNow, format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  compact?: boolean
  showProject?: boolean
}

const priorityColors: Record<TaskPriority, 'default' | 'info' | 'warning' | 'error'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
}

const statusColors: Record<TaskStatus, string> = {
  todo: '#757575',
  'in-progress': '#2196f3',
  review: '#ff9800',
  done: '#4caf50',
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  compact = false,
  showProject = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  
  const handleEdit = () => {
    onEdit?.(task)
    handleMenuClose()
  }
  
  const handleDelete = () => {
    onDelete?.(task.id)
    handleMenuClose()
  }
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  const completionPercentage = task.subtasks.length > 0 
    ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
    : task.status === 'done' ? 100 : 0
  
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
        },
        border: `2px solid transparent`,
        borderLeftColor: statusColors[task.status],
        ...(isOverdue && {
          borderColor: 'error.main',
          bgcolor: 'error.light',
          opacity: 0.9,
        }),
      }}
    >
      <CardContent sx={{ pb: compact ? 1 : 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant={compact ? 'body2' : 'h6'} component="h3" sx={{ flexGrow: 1, mr: 1 }}>
            {task.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label={task.priority}
              size="small"
              color={priorityColors[task.priority]}
              icon={<Flag />}
            />
            
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
        
        {!compact && task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...`
              : task.description
            }
          </Typography>
        )}
        
        {/* Progress bar for subtasks */}
        {task.subtasks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Subtasks
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
        
        {/* Tags */}
        {task.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {task.tags.slice(0, compact ? 2 : 5).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {task.tags.length > (compact ? 2 : 5) && (
              <Chip
                label={`+${task.tags.length - (compact ? 2 : 5)}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Due date */}
          {task.dueDate && (
            <Tooltip title={format(new Date(task.dueDate), 'PPP')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule 
                  fontSize="small" 
                  color={isOverdue ? 'error' : 'action'} 
                />
                <Typography 
                  variant="caption" 
                  color={isOverdue ? 'error' : 'text.secondary'}
                >
                  {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                </Typography>
              </Box>
            </Tooltip>
          )}
          
          {/* Assignee */}
          {task.assigneeId && (
            <Tooltip title="Assigned to John Doe">
              <Avatar sx={{ width: 24, height: 24 }}>
                JD
              </Avatar>
            </Tooltip>
          )}
        </Box>
      </CardContent>
      
      {!compact && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            {task.comments.length > 0 && (
              <Badge badgeContent={task.comments.length} color="primary">
                <Comment fontSize="small" color="action" />
              </Badge>
            )}
            
            {task.attachments.length > 0 && (
              <Badge badgeContent={task.attachments.length} color="primary">
                <Attachment fontSize="small" color="action" />
              </Badge>
            )}
          </Box>
          
          <Chip
            label={task.status.replace('-', ' ')}
            size="small"
            sx={{
              bgcolor: statusColors[task.status],
              color: 'white',
              textTransform: 'capitalize',
            }}
          />
        </CardActions>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  )
}
```

Create `src/features/tasks/components/TaskForm.tsx`:

```typescript
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Autocomplete,
  DatePicker,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Task, TaskPriority, TaskStatus, Project, User } from '@/types/core.types'
import { CreateTaskRequest, UpdateTaskRequest } from '@/types/api.types'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.date().nullable().optional(),
  tags: z.array(z.string()).optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>
  task?: Task
  projects: Project[]
  users: User[]
  loading?: boolean
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#4caf50' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'urgent', label: 'Urgent', color: '#9c27b0' },
]

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  task,
  projects,
  users,
  loading = false,
}) => {
  const isEditing = !!task
  const [tagInput, setTagInput] = React.useState('')
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'todo',
      projectId: task?.projectId || '',
      assigneeId: task?.assigneeId || '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : null,
      tags: task?.tags || [],
    },
  })
  
  const watchedTags = watch('tags') || []
  
  React.useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        projectId: task.projectId || '',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        tags: task.tags,
      })
    } else if (open && !task) {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        projectId: '',
        assigneeId: '',
        dueDate: null,
        tags: [],
      })
    }
  }, [open, task, reset])
  
  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      const submitData = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      }
      
      await onSubmit(submitData as CreateTaskRequest | UpdateTaskRequest)
      onClose()
    } catch (error) {
      console.error('Error submitting task:', error)
    }
  }
  
  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()])
      setTagInput('')
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }
  
  const handleTagInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddTag()
    }
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' }
        }}
      >
        <DialogTitle>
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              {/* Title */}
              <TextField
                {...register('title')}
                label="Task Title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                autoFocus
              />
              
              {/* Description */}
              <TextField
                {...register('description')}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Priority */}
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Priority">
                        {priorityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: option.color,
                                }}
                              />
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                
                {/* Status (only for editing) */}
                {isEditing && (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Status">
                          {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Project */}
                <FormControl fullWidth>
                  <InputLabel>Project</InputLabel>
                  <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Project">
                        <MenuItem value="">
                          <em>No Project</em>
                        </MenuItem>
                        {projects.map((project) => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                
                {/* Assignee */}
                <FormControl fullWidth>
                  <InputLabel>Assignee</InputLabel>
                  <Controller
                    name="assigneeId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Assignee">
                        <MenuItem value="">
                          <em>Unassigned</em>
                        </MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              
              {/* Due Date */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Due Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
              
              {/* Tags */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {watchedTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Add a tag..."
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button onClick={handleAddTag} variant="outlined" size="small">
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Task' : 'Create Task')
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  )
}
```

---

## Task Management Features

### Step 3: Task List with Advanced Filtering

Create `src/features/tasks/components/TaskList.tsx`:

```typescript
import React from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  Menu,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Add,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  Search,
  Clear,
} from '@mui/icons-material'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { Task, TaskFilters, TaskSortOptions, TaskStatus, TaskPriority } from '@/types/core.types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  selectTasks, 
  selectTasksLoading, 
  createTaskAsync, 
  updateTaskAsync, 
  deleteTaskAsync,
  setFilters,
  setSort,
  setLayout,
} from '../store/tasksSlice'

interface TaskListProps {
  projectId?: string
  showHeader?: boolean
}

export const TaskList: React.FC<TaskListProps> = ({
  projectId,
  showHeader = true,
}) => {
  const dispatch = useAppDispatch()
  const { filteredTasks, filters, sort, layout, loading } = useAppSelector(selectTasks)
  const [taskFormOpen, setTaskFormOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | undefined>()
  const [filterMenuAnchor, setFilterMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [sortMenuAnchor, setSortMenuAnchor] = React.useState<null | HTMLElement>(null)
  
  // Filter the tasks by project if projectId is provided
  const displayTasks = React.useMemo(() => {
    if (!projectId) return filteredTasks
    return filteredTasks.filter(task => task.projectId === projectId)
  }, [filteredTasks, projectId])
  
  const handleCreateTask = async (data: any) => {
    await dispatch(createTaskAsync({
      ...data,
      projectId: projectId || data.projectId,
    }))
  }
  
  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await dispatch(updateTaskAsync({
        id: editingTask.id,
        ...data,
      }))
      setEditingTask(undefined)
    }
  }
  
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTaskAsync(taskId))
    }
  }
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }
  
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await dispatch(updateTaskAsync({
      id: taskId,
      status,
    }))
  }
  
  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    dispatch(setFilters({ ...filters, ...newFilters }))
  }
  
  const handleSortChange = (newSort: TaskSortOptions) => {
    dispatch(setSort(newSort))
  }
  
  const handleClearFilters = () => {
    dispatch(setFilters({}))
  }
  
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof TaskFilters]
    return Array.isArray(value) ? value.length > 0 : !!value
  })
  
  return (
    <Box>
      {showHeader && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Tasks
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Search */}
              <TextField
                placeholder="Search tasks..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                  endAdornment: filters.search && (
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange({ search: '' })}
                    >
                      <Clear />
                    </IconButton>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              
              {/* Filter Menu */}
              <Button
                startIcon={<FilterList />}
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                variant={hasActiveFilters ? 'contained' : 'outlined'}
                color={hasActiveFilters ? 'primary' : 'inherit'}
              >
                Filter
              </Button>
              
              {/* Sort Menu */}
              <Button
                startIcon={<Sort />}
                onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                variant="outlined"
              >
                Sort
              </Button>
              
              {/* Layout Toggle */}
              <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <IconButton
                  onClick={() => dispatch(setLayout('list'))}
                  color={layout === 'list' ? 'primary' : 'default'}
                  size="small"
                >
                  <ViewList />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(setLayout('grid'))}
                  color={layout === 'grid' ? 'primary' : 'default'}
                  size="small"
                >
                  <ViewModule />
                </IconButton>
              </Box>
            </Box>
          </Box>
          
          {/* Active Filters */}
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {filters.status?.map((status) => (
                <Chip
                  key={status}
                  label={`Status: ${status}`}
                  onDelete={() => handleFilterChange({
                    status: filters.status?.filter(s => s !== status)
                  })}
                  size="small"
                />
              ))}
              {filters.priority?.map((priority) => (
                <Chip
                  key={priority}
                  label={`Priority: ${priority}`}
                  onDelete={() => handleFilterChange({
                    priority: filters.priority?.filter(p => p !== priority)
                  })}
                  size="small"
                />
              ))}
              {filters.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={`Tag: ${tag}`}
                  onDelete={() => handleFilterChange({
                    tags: filters.tags?.filter(t => t !== tag)
                  })}
                  size="small"
                />
              ))}
              {hasActiveFilters && (
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  startIcon={<Clear />}
                >
                  Clear All
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
      
      {/* Task Grid/List */}
      {displayTasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {hasActiveFilters 
              ? 'Try adjusting your filters or create a new task.'
              : 'Get started by creating your first task!'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setTaskFormOpen(true)}
          >
            Create Task
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={layout === 'grid' ? 3 : 2}>
          {displayTasks.map((task) => (
            <Grid 
              item 
              xs={12} 
              sm={layout === 'grid' ? 6 : 12} 
              md={layout === 'grid' ? 4 : 12}
              lg={layout === 'grid' ? 3 : 12}
              key={task.id}
            >
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                compact={layout === 'list'}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={() => setTaskFormOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{ sx: { minWidth: 300, p: 2 } }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Filter Tasks
        </Typography>
        
        {/* Status Filter */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.status || []}
            onChange={(e) => handleFilterChange({ status: e.target.value as TaskStatus[] })}
            label="Status"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
        
        {/* Priority Filter */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            multiple
            value={filters.priority || []}
            onChange={(e) => handleFilterChange({ priority: e.target.value as TaskPriority[] })}
            label="Priority"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={handleClearFilters}>
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={() => setFilterMenuAnchor(null)}
          >
            Apply
          </Button>
        </Box>
      </Menu>
      
      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        <MenuItem onClick={() => { handleSortChange({ field: 'title', direction: 'asc' }); setSortMenuAnchor(null) }}>
          Title A-Z
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange({ field: 'title', direction: 'desc' }); setSortMenuAnchor(null) }}>
          Title Z-A
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange({ field: 'priority', direction: 'desc' }); setSortMenuAnchor(null) }}>
          Priority High-Low
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange({ field: 'dueDate', direction: 'asc' }); setSortMenuAnchor(null) }}>
          Due Date Soon-Late
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange({ field: 'createdAt', direction: 'desc' }); setSortMenuAnchor(null) }}>
          Recently Created
        </MenuItem>
      </Menu>
      
      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false)
          setEditingTask(undefined)
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projects={[]} // TODO: Get from projects slice
        users={[]} // TODO: Get from users slice
        loading={loading}
      />
    </Box>
  )
}
```

---

## Dashboard & Analytics

### Step 4: Dashboard Overview

Create `src/features/dashboard/components/DashboardStats.tsx`:

```typescript
import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material'
import {
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Person,
  Notifications,
  MoreVert,
} from '@mui/icons-material'
import { formatDistanceToNow, format } from 'date-fns'
import { DashboardStatsResponse, ActivityItem } from '@/types/api.types'
import { Task } from '@/types/core.types'

interface DashboardStatsProps {
  stats: DashboardStatsResponse
  loading?: boolean
}

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  progress?: number
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  progress,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
          {icon}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      {progress !== undefined && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={color}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}
    </CardContent>
  </Card>
)

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2 }}>
                    <Assignment />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }
  
  return (
    <Grid container spacing={3}>
      {/* Total Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<Assignment />}
          color="primary"
        />
      </Grid>
      
      {/* Completed Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          subtitle={`${Math.round(stats.completionRate)}% completion rate`}
          icon={<CheckCircle />}
          color="success"
          progress={stats.completionRate}
        />
      </Grid>
      
      {/* Overdue Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          subtitle={stats.overdueTasks > 0 ? 'Needs attention' : 'All caught up!'}
          icon={<Schedule />}
          color="error"
        />
      </Grid>
      
      {/* Today's Tasks */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Due Today"
          value={stats.todaysTasks}
          subtitle="Focus for today"
          icon={<TrendingUp />}
          color="warning"
        />
      </Grid>
      
      {/* Recent Activity */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ maxHeight: 320, overflow: 'auto' }}>
              {stats.recentActivity.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemAvatar>
                    <Avatar src={activity.user.avatar}>
                      {activity.user.firstName[0]}{activity.user.lastName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Upcoming Deadlines */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List sx={{ maxHeight: 320, overflow: 'auto' }}>
              {stats.upcomingDeadlines.map((task) => (
                <ListItem key={task.id} divider>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          label={task.priority}
                          size="small"
                          color={
                            task.priority === 'urgent' ? 'error' :
                            task.priority === 'high' ? 'warning' :
                            task.priority === 'medium' ? 'primary' : 'default'
                          }
                        />
                        <Typography variant="caption">
                          Due {format(new Date(task.dueDate!), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {stats.upcomingDeadlines.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No upcoming deadlines"
                    secondary="You're all caught up!"
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
```

Create `src/features/dashboard/components/TaskAnalyticsChart.tsx`:

```typescript
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { TaskStatus, TaskPriority } from '@/types/core.types'

interface TaskAnalyticsChartProps {
  data: {
    tasksByStatus: Record<TaskStatus, number>
    tasksByPriority: Record<TaskPriority, number>
    completionTrend: Array<{
      date: string
      completed: number
      created: number
    }>
  }
}

const statusColors = {
  todo: '#757575',
  'in-progress': '#2196f3',
  review: '#ff9800',
  done: '#4caf50',
}

const priorityColors = {
  low: '#4caf50',
  medium: '#2196f3',
  high: '#ff9800',
  urgent: '#f44336',
}

export const TaskAnalyticsChart: React.FC<TaskAnalyticsChartProps> = ({ data }) => {
  const [chartType, setChartType] = React.useState<'status' | 'priority' | 'trend'>('status')
  
  const statusData = Object.entries(data.tasksByStatus).map(([status, count]) => ({
    name: status.replace('-', ' '),
    value: count,
    fill: statusColors[status as TaskStatus],
  }))
  
  const priorityData = Object.entries(data.tasksByPriority).map(([priority, count]) => ({
    name: priority,
    value: count,
    fill: priorityColors[priority as TaskPriority],
  }))
  
  const renderChart = () => {
    switch (chartType) {
      case 'status':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'priority':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'trend':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.completionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#4caf50" 
                strokeWidth={2}
                name="Completed Tasks"
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#2196f3" 
                strokeWidth={2}
                name="Created Tasks"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Task Analytics
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              label="Chart Type"
            >
              <MenuItem value="status">By Status</MenuItem>
              <MenuItem value="priority">By Priority</MenuItem>
              <MenuItem value="trend">Completion Trend</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {renderChart()}
      </CardContent>
    </Card>
  )
}
```

---

## Real-time Features

**🤔 WHY Real-time Features Matter**

Real-time features transform static applications into dynamic, collaborative experiences that keep users engaged and informed. Modern users expect instant updates, live collaboration, and immediate feedback without manual refreshes. Real-time capabilities enable team collaboration, instant notifications, live data updates, and competitive advantages through responsive user experiences. Without real-time features, applications feel outdated and require constant manual interaction.

**🎯 WHAT Real-time Features Enable**

Comprehensive real-time functionality includes:
- **Live Data Synchronization**: Instant updates across multiple user sessions
- **Collaborative Features**: Real-time editing, commenting, and team interactions
- **Push Notifications**: Immediate alerts for important events and updates
- **Live Status Updates**: Real-time presence indicators and activity feeds
- **Progressive Data Loading**: Streaming data updates for better performance
- **Conflict Resolution**: Handling simultaneous edits and data conflicts
- **Offline Support**: Queue and synchronize changes when connectivity returns

**⏰ WHEN to Implement Real-time Features**

Real-time implementation depends on application requirements:

- **Collaborative Applications**: Essential for team-based tools and shared workspaces
- **Social Platforms**: Critical for messaging, feeds, and user interactions
- **Dashboard Applications**: Important for live metrics and monitoring data
- **E-commerce**: Valuable for inventory updates and order status tracking
- **Financial Applications**: Essential for trading, pricing, and transaction updates
- **Gaming Applications**: Critical for multiplayer experiences and leaderboards

**🚀 HOW to Build Reliable Real-time Features**

Implementation follows resilient communication patterns:

1. **Connection Management**: Robust connection handling with automatic reconnection
2. **Message Queuing**: Buffer messages during connection interruptions
3. **Error Handling**: Graceful degradation when real-time features fail
4. **Performance Optimization**: Efficient message handling and memory management
5. **Security Integration**: Secure WebSocket connections with authentication

### Step 5: WebSocket Integration

Create `src/services/websocket/WebSocketService.ts`:

```typescript
import { store } from '@/store'
import { addNotification } from '@/features/notifications/store/notificationsSlice'
import { updateTask, addTask } from '@/features/tasks/store/tasksSlice'
import { WebSocketMessage, WebSocketEventType } from '@/types/api.types'

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 1000
  private isConnecting = false
  private listeners: Map<WebSocketEventType, Array<(data: any) => void>> = new Map()
  
  connect(token: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    
    this.isConnecting = true
    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        
        // Send heartbeat
        this.startHeartbeat()
      }
      
      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason)
        this.isConnecting = false
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect(token)
        }
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      this.isConnecting = false
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.stopHeartbeat()
  }
  
  private reconnect(token: string) {
    this.reconnectAttempts++
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      this.connect(token)
    }, delay)
  }
  
  private heartbeatInterval: NodeJS.Timeout | null = null
  
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // Send ping every 30 seconds
  }
  
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
  
  private handleMessage(message: WebSocketMessage) {
    // Dispatch to Redux store
    switch (message.type) {
      case 'task_created':
        store.dispatch(addTask(message.data))
        store.dispatch(addNotification({
          type: 'task_assigned',
          title: 'New Task Created',
          message: `Task "${message.data.title}" was created`,
          data: message.data,
        }))
        break
        
      case 'task_updated':
        store.dispatch(updateTask(message.data))
        if (message.data.status === 'done') {
          store.dispatch(addNotification({
            type: 'task_completed',
            title: 'Task Completed',
            message: `Task "${message.data.title}" was completed`,
            data: message.data,
          }))
        }
        break
        
      case 'comment_added':
        // Handle comment added
        store.dispatch(addNotification({
          type: 'comment_added',
          title: 'New Comment',
          message: `New comment on "${message.data.taskTitle}"`,
          data: message.data,
        }))
        break
        
      case 'notification_new':
        store.dispatch(addNotification(message.data))
        break
        
      default:
        console.log('Unhandled WebSocket message type:', message.type)
    }
    
    // Call registered listeners
    const listeners = this.listeners.get(message.type) || []
    listeners.forEach(listener => listener(message.data))
  }
  
  // Subscribe to specific event types
  on(eventType: WebSocketEventType, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(callback)
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType) || []
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
  
  // Send message to server
  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data, timestamp: new Date().toISOString() }))
    }
  }
  
  // Get connection status
  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService()
```

Create `src/hooks/useWebSocket.ts`:

```typescript
import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAuthToken } from '@/features/auth/store/authSlice'
import { webSocketService } from '@/services/websocket/WebSocketService'
import { WebSocketEventType } from '@/types/api.types'

export const useWebSocket = () => {
  const token = useAppSelector(selectAuthToken)
  const connectionAttempted = useRef(false)
  
  useEffect(() => {
    if (token && !connectionAttempted.current) {
      connectionAttempted.current = true
      webSocketService.connect(token)
      
      return () => {
        webSocketService.disconnect()
        connectionAttempted.current = false
      }
    }
  }, [token])
  
  return {
    isConnected: webSocketService.isConnected,
    send: webSocketService.send.bind(webSocketService),
    on: webSocketService.on.bind(webSocketService),
  }
}

// Hook for subscribing to specific WebSocket events
export const useWebSocketEvent = (
  eventType: WebSocketEventType,
  callback: (data: any) => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const unsubscribe = webSocketService.on(eventType, callback)
    return unsubscribe
  }, deps)
}
```

---

## Advanced UI Components

### Step 6: Kanban Board

Create `src/features/tasks/components/KanbanBoard.tsx`:

```typescript
import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Badge,
  Chip,
} from '@mui/material'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { Task, TaskStatus } from '@/types/core.types'
import { TaskCard } from './TaskCard'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void
  onTaskEdit: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#757575' },
  { id: 'in-progress', title: 'In Progress', color: '#2196f3' },
  { id: 'review', title: 'Review', color: '#ff9800' },
  { id: 'done', title: 'Done', color: '#4caf50' },
]

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
}) => {
  const tasksByStatus = React.useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    }, {} as Record<TaskStatus, Task[]>)
  }, [tasks])
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    
    if (!destination) {
      return
    }
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    
    const newStatus = destination.droppableId as TaskStatus
    onTaskMove(draggableId, newStatus)
  }
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 3, overflow: 'auto', minHeight: '70vh', p: 2 }}>
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.id] || []
          
          return (
            <Paper
              key={column.id}
              sx={{
                minWidth: 300,
                maxWidth: 300,
                p: 2,
                backgroundColor: 'grey.50',
                border: `2px solid ${column.color}`,
                borderRadius: 2,
              }}
            >
              {/* Column Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {column.title}
                </Typography>
                <Badge badgeContent={columnTasks.length} color="primary">
                  <Chip
                    size="small"
                    sx={{
                      backgroundColor: column.color,
                      color: 'white',
                      minWidth: 20,
                    }}
                    label=" "
                  />
                </Badge>
              </Box>
              
              {/* Droppable Column */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: 200,
                      backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                      borderRadius: 1,
                      p: 1,
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 2,
                              transform: snapshot.isDragging ? 'rotate(5deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              '&:last-child': { mb: 0 },
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onTaskEdit}
                              onDelete={onTaskDelete}
                              compact
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Empty State */}
                    {columnTasks.length === 0 && (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 4,
                          color: 'text.secondary',
                          fontStyle: 'italic',
                        }}
                      >
                        Drop tasks here
                      </Box>
                    )}
                  </Box>
                )}
              </Droppable>
            </Paper>
          )
        })}
      </Box>
    </DragDropContext>
  )
}
```

### Step 7: Advanced Search Component

Create `src/features/tasks/components/AdvancedSearch.tsx`:

```typescript
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Divider,
  Grid,
  Autocomplete,
  DatePicker,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Search, Clear } from '@mui/icons-material'
import { TaskFilters, TaskStatus, TaskPriority, Project, User } from '@/types/core.types'

interface AdvancedSearchProps {
  open: boolean
  onClose: () => void
  onSearch: (filters: TaskFilters) => void
  initialFilters?: TaskFilters
  projects: Project[]
  users: User[]
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  open,
  onClose,
  onSearch,
  initialFilters = {},
  projects,
  users,
}) => {
  const [filters, setFilters] = React.useState<TaskFilters>(initialFilters)
  const [tagInput, setTagInput] = React.useState('')
  
  React.useEffect(() => {
    if (open) {
      setFilters(initialFilters)
    }
  }, [open, initialFilters])
  
  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags?.includes(tagInput.trim())) {
      handleFilterChange('tags', [...(filters.tags || []), tagInput.trim()])
      setTagInput('')
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    handleFilterChange('tags', filters.tags?.filter(tag => tag !== tagToRemove))
  }
  
  const handleClear = () => {
    setFilters({})
    setTagInput('')
  }
  
  const handleSearch = () => {
    onSearch(filters)
    onClose()
  }
  
  const hasFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof TaskFilters]
    return Array.isArray(value) ? value.length > 0 : !!value
  })
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search />
          Advanced Search
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Text Search */}
            <TextField
              label="Search in title and description"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              fullWidth
              placeholder="Enter keywords..."
            />
            
            <Divider />
            
            {/* Status and Priority */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={filters.status || []}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="review">Review</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    multiple
                    value={filters.priority || []}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    label="Priority"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Project and Assignee */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  options={projects}
                  getOptionLabel={(option) => option.name}
                  value={projects.filter(p => filters.projectId?.includes(p.id)) || []}
                  onChange={(_, value) => 
                    handleFilterChange('projectId', value.map(v => v.id))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Projects" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  options={users}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={users.filter(u => filters.assigneeId?.includes(u.id)) || []}
                  onChange={(_, value) => 
                    handleFilterChange('assigneeId', value.map(v => v.id))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Assignees" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={`${option.firstName} ${option.lastName}`}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                />
              </Grid>
            </Grid>
            
            {/* Date Range */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date From"
                  value={filters.dueDateFrom ? new Date(filters.dueDateFrom) : null}
                  onChange={(value) => 
                    handleFilterChange('dueDateFrom', value?.toISOString())
                  }
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date To"
                  value={filters.dueDateTo ? new Date(filters.dueDateTo) : null}
                  onChange={(value) => 
                    handleFilterChange('dueDateTo', value?.toISOString())
                  }
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {filters.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag..."
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button onClick={handleAddTag} variant="outlined" size="small">
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClear} startIcon={<Clear />} disabled={!hasFilters}>
            Clear All
          </Button>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSearch} variant="contained" startIcon={<Search />}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
```

---

## Testing Implementation

**🤔 WHY Comprehensive Testing Is Essential**

Comprehensive testing in a complete application ensures that all integrated features work correctly both individually and together. As application complexity increases with multiple features, state management, API interactions, and user workflows, the potential for bugs and regressions grows exponentially. Systematic testing provides confidence in deployments, enables safe refactoring, and ensures that new features don't break existing functionality.

**🎯 WHAT Comprehensive Testing Covers**

Complete application testing encompasses multiple layers:
- **Unit Testing**: Individual components, hooks, and utility functions
- **Integration Testing**: Feature interactions and data flow between components
- **API Testing**: Service layer interactions and error handling
- **User Flow Testing**: Complete user journeys and business workflows
- **Performance Testing**: Loading times, memory usage, and rendering efficiency
- **Accessibility Testing**: Screen reader compatibility and keyboard navigation
- **Security Testing**: Authentication flows and input validation

**⏰ WHEN to Apply Different Testing Strategies**

Testing strategies depend on development phase and risk levels:

- **Development**: Unit tests for individual components and functions
- **Feature Integration**: Integration tests for component and service interactions
- **User Workflow**: End-to-end tests for critical business processes
- **Performance Validation**: Performance tests for optimization verification
- **Security Validation**: Security tests for authentication and data protection
- **Regression Testing**: Comprehensive test suites before major releases

**🚀 HOW to Structure Effective Testing**

Implementation follows testing pyramid principles:

1. **Foundation Layer**: Comprehensive unit tests for reliable building blocks
2. **Integration Layer**: Service and component integration testing
3. **User Experience Layer**: Critical user workflow and accessibility testing
4. **Performance Layer**: Performance budgets and optimization validation
5. **Security Layer**: Authentication and security vulnerability testing

### Step 8: Comprehensive Testing Strategy

Create `src/features/tasks/components/__tests__/TaskCard.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { TaskCard } from '../TaskCard'
import { Task } from '@/types/core.types'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task description',
  status: 'todo',
  priority: 'medium',
  projectId: 'project-1',
  assigneeId: 'user-1',
  reporterId: 'user-2',
  dueDate: '2025-12-31T23:59:59Z',
  tags: ['frontend', 'react'],
  attachments: [],
  comments: [
    {
      id: 'comment-1',
      content: 'Test comment',
      authorId: 'user-1',
      taskId: '1',
      attachments: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    }
  ],
  subtasks: [
    {
      id: 'subtask-1',
      title: 'Complete design',
      completed: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'subtask-2',
      title: 'Implement feature',
      completed: false,
      createdAt: '2025-01-01T00:00:00Z',
    }
  ],
  timeTracking: {
    logged: 120,
    sessions: []
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}

const renderTaskCard = (props = {}) => {
  const defaultProps = {
    task: mockTask,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
  }
  
  return render(
    <ThemeProvider theme={theme}>
      <TaskCard {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

describe('TaskCard', () => {
  it('renders task title and description', () => {
    renderTaskCard()
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText(/This is a test task description/)).toBeInTheDocument()
  })
  
  it('displays priority chip with correct color', () => {
    renderTaskCard()
    
    const priorityChip = screen.getByText('medium')
    expect(priorityChip).toBeInTheDocument()
  })
  
  it('shows progress bar for subtasks', () => {
    renderTaskCard()
    
    expect(screen.getByText('Subtasks')).toBeInTheDocument()
    expect(screen.getByText('1/2')).toBeInTheDocument()
    
    // Check progress bar value (50% completion)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })
  
  it('displays tags', () => {
    renderTaskCard()
    
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
  })
  
  it('shows due date information', () => {
    renderTaskCard()
    
    expect(screen.getByText(/in \d+ months?/)).toBeInTheDocument()
  })
  
  it('displays comment and attachment counts', () => {
    renderTaskCard()
    
    // Should show comment badge
    expect(screen.getByText('1')).toBeInTheDocument()
  })
  
  it('opens menu when more button is clicked', async () => {
    const user = userEvent.setup()
    renderTaskCard()
    
    const moreButton = screen.getByLabelText(/more/i)
    await user.click(moreButton)
    
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
  
  it('calls onEdit when edit menu item is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    renderTaskCard({ onEdit })
    
    const moreButton = screen.getByLabelText(/more/i)
    await user.click(moreButton)
    
    const editButton = screen.getByText('Edit')
    await user.click(editButton)
    
    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })
  
  it('calls onDelete when delete menu item is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderTaskCard({ onDelete })
    
    const moreButton = screen.getByLabelText(/more/i)
    await user.click(moreButton)
    
    const deleteButton = screen.getByText('Delete')
    await user.click(deleteButton)
    
    expect(onDelete).toHaveBeenCalledWith('1')
  })
  
  it('applies overdue styling when task is overdue', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2024-01-01T00:00:00Z', // Past date
    }
    
    renderTaskCard({ task: overdueTask })
    
    // Check if overdue styling is applied (this would need to be checked via classes or styles)
    const card = screen.getByText('Test Task').closest('[class*="MuiCard"]')
    expect(card).toBeInTheDocument()
  })
  
  it('renders in compact mode', () => {
    renderTaskCard({ compact: true })
    
    // In compact mode, description should not be shown
    expect(screen.queryByText(/This is a test task description/)).not.toBeInTheDocument()
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
  
  it('handles missing optional data gracefully', () => {
    const minimalTask = {
      ...mockTask,
      description: undefined,
      dueDate: undefined,
      assigneeId: undefined,
      tags: [],
      subtasks: [],
      comments: [],
      attachments: [],
    }
    
    renderTaskCard({ task: minimalTask })
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.queryByText('Subtasks')).not.toBeInTheDocument()
  })
})
```

Create `src/features/tasks/components/__tests__/TaskForm.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { TaskForm } from '../TaskForm'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

const mockProjects = [
  { id: '1', name: 'Project Alpha', description: '', color: '#ff0000', ownerId: 'user-1', members: [], settings: {} as any, stats: {} as any, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Project Beta', description: '', color: '#00ff00', ownerId: 'user-1', members: [], settings: {} as any, stats: {} as any, createdAt: '', updatedAt: '' },
]

const mockUsers = [
  { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: 'member' as const, preferences: {} as any, createdAt: '', updatedAt: '' },
  { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', role: 'member' as const, preferences: {} as any, createdAt: '', updatedAt: '' },
]

const renderTaskForm = (props = {}) => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    projects: mockProjects,
    users: mockUsers,
    loading: false,
  }
  
  return render(
    <ThemeProvider theme={theme}>
      <TaskForm {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

describe('TaskForm', () => {
  it('renders create form when no task is provided', () => {
    renderTaskForm()
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
  })
  
  it('renders edit form when task is provided', () => {
    const task = {
      id: '1',
      title: 'Existing Task',
      description: 'Existing description',
      priority: 'high' as const,
      status: 'in-progress' as const,
      projectId: '1',
      assigneeId: '1',
      reporterId: 'user-1',
      dueDate: '2025-12-31T23:59:59Z',
      tags: ['existing-tag'],
      attachments: [],
      comments: [],
      subtasks: [],
      timeTracking: { logged: 0, sessions: [] },
      createdAt: '',
      updatedAt: '',
    }
    
    renderTaskForm({ task })
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument()
  })
  
  it('validates required fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderTaskForm({ onSubmit })
    
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)
    
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
  
  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()
    renderTaskForm({ onSubmit, onClose })
    
    // Fill required fields
    await user.type(screen.getByLabelText(/task title/i), 'New Task')
    await user.type(screen.getByLabelText(/description/i), 'Task description')
    
    // Select priority
    await user.click(screen.getByLabelText(/priority/i))
    await user.click(screen.getByText('High'))
    
    // Submit form
    await user.click(screen.getByText('Create Task'))
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'Task description',
          priority: 'high',
        })
      )
    })
    
    expect(onClose).toHaveBeenCalled()
  })
  
  it('handles tag management', async () => {
    const user = userEvent.setup()
    renderTaskForm()
    
    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    const addButton = screen.getByText('Add')
    
    // Add a tag
    await user.type(tagInput, 'frontend')
    await user.click(addButton)
    
    expect(screen.getByText('frontend')).toBeInTheDocument()
    
    // Add another tag by pressing Enter
    await user.type(tagInput, 'react')
    await user.keyboard('{Enter}')
    
    expect(screen.getByText('react')).toBeInTheDocument()
    
    // Remove a tag
    const frontendChip = screen.getByText('frontend').closest('.MuiChip-root')
    const deleteButton = frontendChip?.querySelector('[data-testid="CancelIcon"]')
    if (deleteButton) {
      await user.click(deleteButton)
    }
    
    expect(screen.queryByText('frontend')).not.toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
  })
  
  it('prevents duplicate tags', async () => {
    const user = userEvent.setup()
    renderTaskForm()
    
    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    const addButton = screen.getByText('Add')
    
    // Add same tag twice
    await user.type(tagInput, 'frontend')
    await user.click(addButton)
    
    await user.type(tagInput, 'frontend')
    await user.click(addButton)
    
    // Should only have one instance
    expect(screen.getAllByText('frontend')).toHaveLength(1)
  })
  
  it('displays loading state', () => {
    renderTaskForm({ loading: true })
    
    const submitButton = screen.getByText(/creating.../i)
    expect(submitButton).toBeDisabled()
  })
  
  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderTaskForm({ onClose })
    
    await user.click(screen.getByText('Cancel'))
    
    expect(onClose).toHaveBeenCalled()
  })
  
  it('resets form when dialog opens/closes', async () => {
    const { rerender } = renderTaskForm({ open: false })
    
    // Reopen with task data
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test description',
      priority: 'high' as const,
      status: 'todo' as const,
      projectId: '1',
      assigneeId: '1',
      reporterId: 'user-1',
      tags: ['test'],
      attachments: [],
      comments: [],
      subtasks: [],
      timeTracking: { logged: 0, sessions: [] },
      createdAt: '',
      updatedAt: '',
    }
    
    rerender(
      <ThemeProvider theme={theme}>
        <TaskForm
          open={true}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          task={task}
          projects={mockProjects}
          users={mockUsers}
        />
      </ThemeProvider>
    )
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
```

### Step 9: Integration Testing

Create `src/features/tasks/__tests__/TaskManagement.integration.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { createStore } from '@/store'
import { TaskList } from '../components/TaskList'
import { createTheme } from '@mui/material/styles'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const theme = createTheme()

// Mock API server
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          tasks: [
            {
              id: '1',
              title: 'Test Task 1',
              description: 'Description 1',
              status: 'todo',
              priority: 'medium',
              tags: ['frontend'],
              comments: [],
              subtasks: [],
              attachments: [],
              timeTracking: { logged: 0, sessions: [] },
              reporterId: 'user-1',
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
            {
              id: '2',
              title: 'Test Task 2',
              description: 'Description 2',
              status: 'in-progress',
              priority: 'high',
              tags: ['backend'],
              comments: [],
              subtasks: [],
              attachments: [],
              timeTracking: { logged: 0, sessions: [] },
              reporterId: 'user-1',
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
          },
        },
      })
    )
  }),
  
  rest.post('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '3',
          title: 'New Task',
          description: 'New Description',
          status: 'todo',
          priority: 'medium',
          tags: [],
          comments: [],
          subtasks: [],
          attachments: [],
          timeTracking: { logged: 0, sessions: [] },
          reporterId: 'user-1',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      })
    )
  }),
  
  rest.put('/api/tasks/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: req.params.id,
          title: 'Updated Task',
          description: 'Updated Description',
          status: 'done',
          priority: 'high',
          tags: [],
          comments: [],
          subtasks: [],
          attachments: [],
          timeTracking: { logged: 0, sessions: [] },
          reporterId: 'user-1',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      })
    )
  }),
  
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    return res(ctx.status(204))
  })
)

beforeEach(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const renderTaskList = () => {
  const store = createStore()
  
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <TaskList />
      </ThemeProvider>
    </Provider>
  )
}

describe('Task Management Integration', () => {
  it('loads and displays tasks', async () => {
    renderTaskList()
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })
  
  it('creates a new task', async () => {
    const user = userEvent.setup()
    renderTaskList()
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })
    
    // Open create form
    const createButton = screen.getByLabelText(/add task/i)
    await user.click(createButton)
    
    // Fill form
    const titleInput = screen.getByLabelText(/task title/i)
    await user.type(titleInput, 'New Task')
    
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'New Description')
    
    // Submit form
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)
    
    // Verify task was created
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument()
    })
  })
  
  it('filters tasks by status', async () => {
    const user = userEvent.setup()
    renderTaskList()
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
    
    // Open filter menu
    const filterButton = screen.getByText('Filter')
    await user.click(filterButton)
    
    // Select status filter
    const statusSelect = screen.getByLabelText(/status/i)
    await user.click(statusSelect)
    await user.click(screen.getByText('In Progress'))
    
    // Apply filter
    const applyButton = screen.getByText('Apply')
    await user.click(applyButton)
    
    // Verify only in-progress tasks are shown
    await waitFor(() => {
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
    })
  })
  
  it('searches tasks by title', async () => {
    const user = userEvent.setup()
    renderTaskList()
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
    
    // Search for specific task
    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    await user.type(searchInput, 'Task 1')
    
    // Verify search results
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument()
    })
  })
  
  it('switches between list and grid layout', async () => {
    const user = userEvent.setup()
    renderTaskList()
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })
    
    // Switch to grid layout
    const gridButton = screen.getByLabelText(/grid view/i)
    await user.click(gridButton)
    
    // Verify layout changed (this would need to check CSS classes or data attributes)
    // The exact implementation depends on how layout differences are rendered
  })
  
  it('handles error states gracefully', async () => {
    // Override server to return error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    renderTaskList()
    
    // Verify error handling
    await waitFor(() => {
      // This would depend on how errors are displayed in your app
      expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument()
    })
  })
})
```

---

## Production Deployment

### Step 10: Final Production Configuration

Create `deployment/docker/Dockerfile`:

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY deployment/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deployment/nginx/default.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

Create `deployment/nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com wss://ws.example.com;" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass https://your-api-server.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket proxy (if needed)
    location /ws/ {
        proxy_pass https://your-ws-server.com/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

Create `deployment/vercel/vercel.json`:

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_WS_URL": "@vite_ws_url",
    "VITE_APP_VERSION": "@vite_app_version",
    "VITE_SENTRY_DSN": "@vite_sentry_dsn"
  },
  "build": {
    "env": {
      "VITE_API_URL": "@vite_api_url_production",
      "VITE_WS_URL": "@vite_ws_url_production",
      "VITE_APP_VERSION": "@vite_app_version",
      "VITE_SENTRY_DSN": "@vite_sentry_dsn_production"
    }
  },
  "functions": {
    "app/**": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/dashboard",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/app/(.*)",
      "destination": "/$1"
    }
  ]
}
```

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    name: Test
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
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    
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
        
      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_WS_URL: ${{ secrets.VITE_WS_URL }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 1
          
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run security audit
        run: npm audit --audit-level high
        
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [test, build, security]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
          
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
          alias-domains: |
            staging-taskapp.vercel.app
            
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, build, security]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
          
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
          
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          body: |
            Automated release from main branch
            
            Changes:
            ${{ github.event.head_commit.message }}
          draft: false
          prerelease: false
```

### Step 11: Production Monitoring

Create `src/utils/monitoring/analytics.ts`:

```typescript
import { webVitals } from './webVitals'

// Google Analytics 4
export const initGA4 = (measurementId: string) => {
  if (typeof window === 'undefined') return

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window.gtag.q = window.gtag.q || []).push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
  })

  // Track Web Vitals
  webVitals((metric) => {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  })
}

// Custom event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'User Interaction',
      ...parameters,
    })
  }
}

// User journey tracking
export const trackUserJourney = (step: string, metadata?: Record<string, any>) => {
  trackEvent('user_journey', {
    step,
    timestamp: Date.now(),
    ...metadata,
  })
}

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit = 'ms') => {
  trackEvent('performance_metric', {
    metric,
    value,
    unit,
  })
}

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    ...context,
  })
}
```

---

## Chapter Summary

🎉 **Congratulations!** You've successfully built a comprehensive task management application that demonstrates all the modern React development concepts covered in this guide.

### What We've Accomplished

✅ **Complete Application Architecture**
- Feature-based folder structure
- Comprehensive TypeScript types
- Production-ready patterns

✅ **Authentication & Security**
- JWT-based authentication
- Social login integration
- Input validation and sanitization
- CSP implementation

✅ **Advanced Task Management**
- CRUD operations with optimistic updates
- Advanced filtering and search
- Kanban board with drag-and-drop
- Real-time collaboration

✅ **State Management Excellence**
- Redux Toolkit with RTK Query
- Normalized state structure
- Optimistic updates
- Error handling

✅ **Modern UI/UX**
- Material-UI components
- Responsive design
- Dark mode support
- Accessibility features

✅ **Real-time Features**
- WebSocket integration
- Live notifications
- Collaborative editing
- Presence indicators

✅ **Performance Optimization**
- Code splitting and lazy loading
- Bundle optimization
- Core Web Vitals monitoring
- Memory leak prevention

✅ **Comprehensive Testing**
- Unit tests with Vitest
- Integration tests
- Component testing
- E2E testing strategy

✅ **Production Deployment**
- Docker containerization
- CI/CD pipeline
- Vercel deployment
- Monitoring and analytics

### Key Technologies Mastered

🔧 **Build & Development**
- Vite with TypeScript
- ESLint + Prettier
- Hot module replacement

🎨 **UI & Styling**
- Material-UI (MUI)
- CSS-in-JS with emotion
- Responsive design patterns

🔄 **State Management**
- Redux Toolkit
- RTK Query for API state
- Normalized data structures

📝 **Forms & Validation**
- React Hook Form
- Zod schema validation
- Type-safe form handling

🌐 **API Integration**
- Axios with interceptors
- Error handling strategies
- Loading states management

🧪 **Testing Strategy**
- Vitest for unit tests
- React Testing Library
- MSW for API mocking

🚀 **Deployment & Monitoring**
- Vercel hosting
- GitHub Actions CI/CD
- Performance monitoring

### Production-Ready Features

🔐 **Security**
- Authentication & authorization
- Input sanitization
- HTTPS enforcement
- CSP headers

📊 **Analytics & Monitoring**
- User behavior tracking
- Performance metrics
- Error monitoring
- Real-time dashboards

🎯 **Performance**
- Core Web Vitals optimization
- Bundle size optimization
- Database query optimization
- CDN integration

♿ **Accessibility**
- WCAG 2.1 compliance
- Screen reader support
- Keyboard navigation
- High contrast mode

### Next Steps

This comprehensive application serves as a foundation for building enterprise-grade React applications. You can extend it with:

- **Advanced Features**: File uploads, advanced permissions, workflow automation
- **Integrations**: Third-party services, email notifications, calendar sync
- **Mobile App**: React Native version using shared business logic
- **Microservices**: Backend API with proper architecture patterns

You now have the knowledge and practical experience to build modern, scalable, and maintainable React applications using industry best practices! 🚀

---

*End of Chapter 10 - Complete Application*