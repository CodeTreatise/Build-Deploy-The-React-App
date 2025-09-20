# Chapter 5: Forms & Validation 📝

## Overview

In this chapter, we'll implement React Hook Form with Zod validation schemas for type-safe, performant form handling. We'll create reusable form components that integrate seamlessly with Material-UI and our Redux state management, establishing patterns that scale from simple contact forms to complex multi-step wizards.

---

## 📋 Table of Contents

1. [Why React Hook Form + Zod in 2025?](#why-react-hook-form--zod-in-2025)
2. [Installation & Basic Setup](#installation--basic-setup)
3. [Zod Schema Validation](#zod-schema-validation)
4. [Form Components Integration](#form-components-integration)
5. [Advanced Form Patterns](#advanced-form-patterns)
6. [Multi-Step Forms](#multi-step-forms)
7. [Dynamic Forms](#dynamic-forms)
8. [File Upload Handling](#file-upload-handling)
9. [Form State Management](#form-state-management)
10. [Testing Form Components](#testing-form-components)

---

## Why React Hook Form + Zod in 2025?

### 💡 Understanding Form Handling in React

**The Form State Challenge:**
```javascript
// ❌ Manual form state (becomes complex quickly)
function ContactForm() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')
    setNameError('')
    
    // Manual validation
    if (!email) setEmailError('Email is required')
    if (!email.includes('@')) setEmailError('Invalid email')
    if (!name) setNameError('Name is required')
    
    if (emailError || nameError) return
    
    setIsSubmitting(true)
    // Submit logic...
    setIsSubmitting(false)
  }
  
  // Every input change triggers re-render
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}  // Re-render!
      />
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}   // Re-render!
      />
    </form>
  )
}

// ✅ React Hook Form + Zod (declarative, performant)
const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
})

function ContactForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema)
  })
  
  // No re-renders on input changes, validation automatic
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />     {/* No re-render */}
      <input {...register('name')} />      {/* No re-render */}
    </form>
  )
}
```

**Core Form Concepts:**
1. **Controlled vs Uncontrolled**: Where form state lives
2. **Validation Strategies**: When and how to validate
3. **Form State Management**: Handling complex form interactions
4. **User Experience**: Real-time feedback and error handling
5. **Performance**: Minimizing re-renders and bundle size

**Form State Management Evolution:**
```javascript
// React 2013-2016: Manual controlled components
const [value, setValue] = useState('')

// React 2017-2019: Form libraries (Formik)
<Formik initialValues={{}} onSubmit={...}>

// React 2020+: React Hook Form (uncontrolled)
const { register } = useForm()

// React 2022+: React Hook Form + Schema validation
const { register } = useForm({ resolver: zodResolver(schema) })
```

**Why Modern Form Handling Matters:**
- **Performance**: Uncontrolled inputs don't cause re-renders
- **Type Safety**: Schema-first approach with runtime validation
- **User Experience**: Real-time validation with proper error messaging
- **Developer Experience**: Less boilerplate, better debugging
- **Accessibility**: Built-in support for ARIA attributes and screen readers

### 💡 Understanding Controlled vs Uncontrolled Components

**Controlled Components (React manages state):**
```javascript
// ✅ Good for: Simple forms, real-time validation, complex interactions
function ControlledForm() {
  const [email, setEmail] = useState('')
  
  return (
    <input 
      value={email}                          // React controls value
      onChange={(e) => setEmail(e.target.value)}  // Every keystroke = re-render
    />
  )
}
```

**Uncontrolled Components (DOM manages state):**
```javascript
// ✅ Good for: Performance, large forms, minimal validation
function UncontrolledForm() {
  const emailRef = useRef()
  
  const handleSubmit = () => {
    console.log(emailRef.current.value)     // Read value when needed
  }
  
  return (
    <input 
      ref={emailRef}                        // DOM controls value
      defaultValue=""                       // Initial value only
    />
  )
}
```

**React Hook Form Approach (Best of both worlds):**
```javascript
// ✅ Uncontrolled performance + Controlled developer experience
function ModernForm() {
  const { register, watch, formState } = useForm()
  
  // Watch specific fields when needed (controlled behavior)
  const email = watch('email')
  
  return (
    <input {...register('email')} />       // Uncontrolled until you need control
  )
}
```

### React Hook Form vs Alternatives

| Feature | React Hook Form | Formik | React Final Form |
|---------|-----------------|--------|------------------|
| **Bundle Size** | 25KB | 45KB | 18KB |
| **Performance** | Excellent (uncontrolled) | Good (controlled) | Good |
| **Re-renders** | Minimal | Many | Few |
| **TypeScript** | Excellent | Good | Limited |
| **Validation** | Flexible | Built-in | Flexible |
| **Dev Experience** | Excellent | Good | Good |
| **Community** | 37k+ GitHub stars | 34k+ stars | 7k+ stars |
| **Bundle Impact** | Tree-shakeable | Larger | Small |

### Zod vs Other Validation Libraries

| Feature | Zod | Yup | Joi | Superstruct |
|---------|-----|-----|-----|-------------|
| **TypeScript** | Native TS | TS support | TS support | TS support |
| **Bundle Size** | 12KB | 17KB | 146KB | 6KB |
| **Schema First** | Yes | Yes | Yes | Yes |
| **Type Inference** | Excellent | Good | Limited | Good |
| **Runtime Safety** | Excellent | Good | Good | Good |
| **API Design** | Modern | Traditional | Traditional | Modern |

### Why Choose React Hook Form + Zod?

1. **Performance**: Minimal re-renders with uncontrolled components
2. **Type Safety**: End-to-end type safety from schema to form
3. **Developer Experience**: Excellent DevTools and error messages
4. **Bundle Size**: Smaller bundle compared to alternatives
5. **Validation**: Runtime type checking with compile-time types
6. **Ecosystem**: Great integration with popular UI libraries
7. **Modern API**: Hooks-based, intuitive API design

### When to Use This Stack

### 🎯 WHEN to Choose Different Form Solutions

**Form Complexity Decision Tree:**
```javascript
// 📝 Simple Forms (1-3 fields, basic validation)
// Use: useState or uncontrolled refs
function SimpleContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  
  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
    </form>
  )
}

// 📋 Medium Forms (4-10 fields, schema validation)
// Use: React Hook Form + Zod
function UserRegistrationForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(userSchema)
  })
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}

// 🏢 Complex Forms (10+ fields, conditional logic, multi-step)
// Use: React Hook Form + Zod + Context/Redux
function EnterpriseApplicationForm() {
  const { control, watch, formState } = useForm({
    resolver: zodResolver(complexSchema),
    mode: 'onChange'
  })
  
  // Complex conditional rendering based on form state
  const watchedValues = watch(['userType', 'businessType'])
  
  return <form>...</form>
}
```

**Validation Strategy Decision Guide:**
```javascript
// 🚀 Client-Side Only - WHEN:
// - Simple validation rules
// - Immediate user feedback needed
// - Offline-first applications
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120)
})

// 🌐 Client + Server Validation - WHEN:
// - Complex business rules
// - Data integrity critical
// - User security important
const clientSchema = z.object({
  email: z.string().email(),          // Basic client validation
  username: z.string().min(3)         // Quick feedback
})

// Server validates: uniqueness, business rules, security

// 🔒 Server-Only Validation - WHEN:
// - Security-critical forms
// - Complex database lookups needed
// - Legacy system integration
```

**Form State Management Decisions:**
```javascript
// 🏠 Local Form State - WHEN:
// - Form data not needed elsewhere
// - Simple submit-and-forget forms
// - No draft saving required
const { register } = useForm()

// 🌐 Global Form State (Redux) - WHEN:
// - Multi-step forms across routes
// - Draft saving/auto-save needed
// - Form data used in multiple components
const dispatch = useAppDispatch()
const formData = useAppSelector(selectFormData)

// 💾 Persistent Form State - WHEN:
// - Long forms users might abandon
// - Network connectivity issues
// - Legal/compliance requirements
useEffect(() => {
  localStorage.setItem('formDraft', JSON.stringify(formData))
}, [formData])
```

**Performance Considerations:**
```javascript
// ⚡ Use React Hook Form WHEN:
// - Large forms (10+ fields)
// - Real-time validation needed
// - Mobile performance critical
// - Bundle size matters

// 🎯 Use Controlled Components WHEN:
// - Small forms (1-5 fields)
// - Complex real-time interactions
// - Debounced API calls needed
// - Custom validation logic
```

**Team Experience Factors:**
```javascript
// 👥 Team familiar with schemas → React Hook Form + Zod
// 👤 Solo developer, simple forms → useState
// 🏢 Enterprise team, complex forms → React Hook Form + Zod + Redux
// 🚀 Startup, rapid prototyping → Formik (faster initial setup)
```

✅ **Use React Hook Form + Zod when you have:**
- Forms with complex validation requirements
- Need for optimal performance with large forms
- TypeScript projects requiring type safety
- Dynamic form generation requirements
- Multi-step form workflows

❌ **Consider alternatives when you have:**
- Very simple forms with minimal validation
- Team unfamiliar with schema validation
- Legacy projects with existing form solutions

---

## Installation & Basic Setup

### Step 1: Install Dependencies

```bash
# Install React Hook Form
npm install react-hook-form

# Install Zod for validation
npm install zod

# Install integration library
npm install @hookform/resolvers

# Install additional utilities
npm install @hookform/devtools

# For file uploads (optional)
npm install react-dropzone

# For date handling
npm install date-fns
```

### Step 2: Create Form Types

Create `src/types/forms.ts`:

```typescript
import { z } from 'zod'

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format')
  .optional()

// User registration schema
export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  newsletter: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

// Profile update schema
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  avatar: z.instanceof(File).optional(),
})

// Task creation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  estimatedHours: z.number().min(0).max(1000).optional(),
})

// Contact form schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  category: z.enum(['general', 'support', 'sales', 'feedback']),
  urgent: z.boolean().optional(),
})

// Export inferred types
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type ContactFormData = z.infer<typeof contactSchema>

// Form state types
export interface FormFieldError {
  type: string
  message: string
}

export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  errors: Record<string, FormFieldError>
  touchedFields: Record<string, boolean>
}
```

### Step 3: Create Form Utilities

Create `src/utils/formUtils.ts`:

```typescript
import { FieldError, FieldErrors } from 'react-hook-form'

// Convert RHF errors to our error format
export const formatFieldError = (error?: FieldError): string => {
  if (!error) return ''
  return error.message || 'Invalid value'
}

// Get nested field errors
export const getNestedError = (
  errors: FieldErrors,
  path: string
): FieldError | undefined => {
  const keys = path.split('.')
  let current: any = errors
  
  for (const key of keys) {
    if (current?.[key]) {
      current = current[key]
    } else {
      return undefined
    }
  }
  
  return current
}

// Format form data for API submission
export const formatFormData = <T extends Record<string, any>>(
  data: T,
  options: {
    removeEmpty?: boolean
    trimStrings?: boolean
    dateFormat?: 'iso' | 'timestamp'
  } = {}
): T => {
  const { removeEmpty = true, trimStrings = true, dateFormat = 'iso' } = options
  
  const formatValue = (value: any): any => {
    if (value === null || value === undefined) {
      return removeEmpty ? undefined : value
    }
    
    if (typeof value === 'string') {
      const trimmed = trimStrings ? value.trim() : value
      return removeEmpty && trimmed === '' ? undefined : trimmed
    }
    
    if (value instanceof Date) {
      return dateFormat === 'iso' ? value.toISOString() : value.getTime()
    }
    
    if (Array.isArray(value)) {
      const formatted = value.map(formatValue).filter(v => v !== undefined)
      return removeEmpty && formatted.length === 0 ? undefined : formatted
    }
    
    if (typeof value === 'object') {
      const formatted = Object.fromEntries(
        Object.entries(value)
          .map(([k, v]) => [k, formatValue(v)])
          .filter(([, v]) => v !== undefined)
      )
      return removeEmpty && Object.keys(formatted).length === 0 ? undefined : formatted
    }
    
    return value
  }
  
  return formatValue(data) as T
}

// Debounce utility for form validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Form data validation utilities
export const validateFile = (
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    required?: boolean
  } = {}
): string | null => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [], required = false } = options
  
  if (!file) {
    return required ? 'File is required' : null
  }
  
  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`
  }
  
  return null
}

// Generate form field props
export const createFieldProps = (
  name: string,
  form: any,
  options: {
    required?: boolean
    disabled?: boolean
  } = {}
) => {
  const { required = false, disabled = false } = options
  
  return {
    name,
    required,
    disabled,
    error: !!form.formState.errors[name],
    helperText: formatFieldError(form.formState.errors[name]),
    ...form.register(name),
  }
}
```

### Step 4: Create Form Hook

Create `src/hooks/useForm.ts`:

```typescript
import { useForm as useReactHookForm, UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCallback } from 'react'
import { formatFormData } from '@/utils/formUtils'

interface UseFormOptions<T extends z.ZodType> extends Omit<UseFormProps, 'resolver'> {
  schema: T
  onSubmit?: (data: z.infer<T>) => Promise<void> | void
  formatData?: boolean
  debugMode?: boolean
}

interface UseFormReturn<T> extends Omit<UseFormReturn<T>, 'handleSubmit'> {
  handleSubmit: (onValid: (data: T) => Promise<void> | void, onInvalid?: (errors: any) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  submitError: string | null
  clearError: () => void
}

export function useForm<T extends z.ZodType>({
  schema,
  onSubmit,
  formatData = true,
  debugMode = false,
  ...options
}: UseFormOptions<T>): UseFormReturn<z.infer<T>> {
  const form = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...options,
  })

  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const clearError = useCallback(() => {
    setSubmitError(null)
  }, [])

  const handleSubmit = useCallback(
    (onValid: (data: z.infer<T>) => Promise<void> | void, onInvalid?: (errors: any) => void) =>
      form.handleSubmit(
        async (data) => {
          try {
            setIsSubmitting(true)
            setSubmitError(null)
            
            const formattedData = formatData ? formatFormData(data) : data
            
            if (debugMode) {
              console.log('Form submission data:', formattedData)
            }
            
            await onValid(formattedData)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred'
            setSubmitError(errorMessage)
            
            if (debugMode) {
              console.error('Form submission error:', error)
            }
          } finally {
            setIsSubmitting(false)
          }
        },
        (errors) => {
          if (debugMode) {
            console.log('Form validation errors:', errors)
          }
          onInvalid?.(errors)
        }
      ),
    [form, formatData, debugMode]
  )

  return {
    ...form,
    handleSubmit,
    isSubmitting,
    submitError,
    clearError,
  }
}

export default useForm
```

---

## Zod Schema Validation

### 💡 Understanding Schema-First Validation

**Traditional Validation vs Schema-First:**
```javascript
// ❌ Traditional validation (scattered, error-prone)
function validateUser(user) {
  const errors = {}
  
  if (!user.email) errors.email = 'Email required'
  if (user.email && !user.email.includes('@')) errors.email = 'Invalid email'
  if (!user.age) errors.age = 'Age required'
  if (user.age && (user.age < 18 || user.age > 120)) errors.age = 'Invalid age'
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

// ✅ Schema-first validation (centralized, type-safe)
const userSchema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+').max(120, 'Invalid age')
})

// Automatic validation + TypeScript types
type User = z.infer<typeof userSchema>  // { email: string; age: number }
const result = userSchema.safeParse(userData)  // { success: boolean, data?: User, error?: ZodError }
```

**Schema Validation Benefits:**
1. **Type Safety**: Runtime validation + compile-time types
2. **Single Source of Truth**: Schema defines both validation and types
3. **Composability**: Combine and reuse schemas
4. **Error Handling**: Consistent error message format
5. **Parsing**: Transform data while validating
6. **Documentation**: Schema serves as API documentation

**Zod Mental Model - Think of it as a Type Guard:**
```javascript
// 🛡️ Zod = Runtime Type Guard + Type Generator
const schema = z.string()

// Runtime validation
const result = schema.safeParse("hello")     // { success: true, data: "hello" }
const result2 = schema.safeParse(123)        // { success: false, error: ZodError }

// Compile-time types
type SchemaType = z.infer<typeof schema>     // string

// Form integration
const { register } = useForm({
  resolver: zodResolver(schema)              // Automatic validation + types
})
```

**Common Zod Patterns:**
```javascript
// 📝 Basic Types
z.string()                    // string
z.number()                    // number  
z.boolean()                   // boolean
z.date()                      // Date object
z.string().email()            // email string
z.string().url()              // URL string
z.string().uuid()             // UUID string

// 🏗️ Complex Types
z.object({ name: z.string() })           // { name: string }
z.array(z.string())                      // string[]
z.tuple([z.string(), z.number()])        // [string, number]
z.enum(['admin', 'user'])                // 'admin' | 'user'
z.union([z.string(), z.number()])        // string | number

// 🔧 Transformations
z.string().transform(s => s.toUpperCase())    // Transform during validation
z.coerce.number()                             // "123" → 123 (type coercion)
z.string().default("hello")                   // Provide default value

// 🎯 Conditional Logic
z.object({...}).refine(data => data.x > data.y, "x must be greater than y")
```

### Step 1: Advanced Validation Patterns

Create `src/validation/schemas.ts`:

```typescript
import { z } from 'zod'

// Custom validation functions
const createPasswordSchema = (minLength = 8) => {
  return z
    .string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
}

// Conditional validation
export const userSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.enum(['user', 'admin', 'moderator']),
    isActive: z.boolean().default(true),
    preferences: z.object({
      notifications: z.boolean().default(true),
      newsletter: z.boolean().default(false),
      theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    }),
    // Conditional field based on role
    permissions: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Admin users must have permissions
      if (data.role === 'admin' && (!data.permissions || data.permissions.length === 0)) {
        return false
      }
      return true
    },
    {
      message: 'Admin users must have at least one permission',
      path: ['permissions'],
    }
  )

// Dynamic validation based on form state
export const createTaskSchemaWithProject = (hasProject: boolean) => {
  const baseSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })

  if (hasProject) {
    return baseSchema.extend({
      projectId: z.string().min(1, 'Project is required when project context is enabled'),
      milestone: z.string().optional(),
    })
  }

  return baseSchema
}

// File validation
export const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
})

export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be a JPEG, PNG, or WebP image'
    ),
  alt: z.string().min(1, 'Alt text is required').max(200),
  caption: z.string().max(500).optional(),
})

// Array validation with custom rules
export const teamSchema = z.object({
  name: z.string().min(2).max(100),
  members: z
    .array(
      z.object({
        userId: z.string(),
        role: z.enum(['owner', 'admin', 'member']),
        permissions: z.array(z.string()),
      })
    )
    .min(1, 'Team must have at least one member')
    .max(50, 'Team cannot have more than 50 members')
    .refine(
      (members) => {
        // Must have exactly one owner
        const owners = members.filter(m => m.role === 'owner')
        return owners.length === 1
      },
      {
        message: 'Team must have exactly one owner',
        path: ['members'],
      }
    ),
})

// Async validation (for unique values)
export const createUniqueEmailSchema = (checkEmail: (email: string) => Promise<boolean>) => {
  return z.string().email().refine(
    async (email) => {
      const isUnique = await checkEmail(email)
      return isUnique
    },
    {
      message: 'Email is already taken',
    }
  )
}

// Multi-step form schemas
export const multiStepFormSchemas = {
  step1: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
  }),
  step2: z.object({
    company: z.string().min(2),
    position: z.string().min(2),
    experience: z.enum(['junior', 'mid', 'senior']),
  }),
  step3: z.object({
    skills: z.array(z.string()).min(1, 'Select at least one skill'),
    portfolio: z.string().url().optional(),
    availability: z.enum(['immediate', 'two-weeks', 'month']),
  }),
}

// Combined schema for final validation
export const completeMultiStepSchema = z.intersection(
  z.intersection(
    multiStepFormSchemas.step1,
    multiStepFormSchemas.step2
  ),
  multiStepFormSchemas.step3
)

// Transform schemas (for data formatting)
export const contactFormSchema = z.object({
  name: z.string().min(2).transform(val => val.trim()),
  email: z.string().email().transform(val => val.toLowerCase()),
  message: z.string().min(10).transform(val => val.trim()),
  phone: z.string().optional().transform(val => 
    val ? val.replace(/\D/g, '') : undefined
  ),
  contactTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  createdAt: z.date().default(() => new Date()),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type UserFormData = z.infer<typeof userSchema>
export type TeamFormData = z.infer<typeof teamSchema>
export type ImageUploadData = z.infer<typeof imageUploadSchema>
export type MultiStepFormData = z.infer<typeof completeMultiStepSchema>
```

### Step 2: Custom Validation Hooks

Create `src/hooks/useValidation.ts`:

```typescript
import { useMemo } from 'react'
import { z } from 'zod'

// Validation result type
interface ValidationResult {
  isValid: boolean
  errors: z.ZodError | null
  data: any
}

// Hook for manual validation
export const useValidation = <T extends z.ZodType>(schema: T) => {
  const validate = useMemo(() => {
    return (data: unknown): ValidationResult => {
      try {
        const validData = schema.parse(data)
        return {
          isValid: true,
          errors: null,
          data: validData,
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            errors: error,
            data: null,
          }
        }
        throw error
      }
    }
  }, [schema])

  const validateAsync = useMemo(() => {
    return async (data: unknown): Promise<ValidationResult> => {
      try {
        const validData = await schema.parseAsync(data)
        return {
          isValid: true,
          errors: null,
          data: validData,
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            errors: error,
            data: null,
          }
        }
        throw error
      }
    }
  }, [schema])

  const getFieldError = useMemo(() => {
    return (errors: z.ZodError | null, fieldPath: string): string | null => {
      if (!errors) return null
      
      const fieldError = errors.errors.find(error => 
        error.path.join('.') === fieldPath
      )
      
      return fieldError?.message || null
    }
  }, [])

  return {
    validate,
    validateAsync,
    getFieldError,
  }
}

// Hook for real-time validation
export const useRealTimeValidation = <T extends z.ZodType>(
  schema: T,
  data: unknown,
  options: {
    debounceMs?: number
    validateOnChange?: boolean
  } = {}
) => {
  const { debounceMs = 300, validateOnChange = true } = options
  const [validationResult, setValidationResult] = React.useState<ValidationResult>({
    isValid: true,
    errors: null,
    data: null,
  })

  const { validate } = useValidation(schema)

  const debouncedValidation = useMemo(
    () => debounce((dataToValidate: unknown) => {
      const result = validate(dataToValidate)
      setValidationResult(result)
    }, debounceMs),
    [validate, debounceMs]
  )

  React.useEffect(() => {
    if (validateOnChange) {
      debouncedValidation(data)
    }
  }, [data, debouncedValidation, validateOnChange])

  return validationResult
}

// Hook for schema composition
export const useSchemaComposition = () => {
  const combineSchemas = useMemo(() => {
    return <T extends z.ZodType, U extends z.ZodType>(
      schema1: T,
      schema2: U
    ): z.ZodIntersection<T, U> => {
      return z.intersection(schema1, schema2)
    }
  }, [])

  const mergeSchemas = useMemo(() => {
    return <T extends z.ZodRawShape, U extends z.ZodRawShape>(
      schema1: z.ZodObject<T>,
      schema2: z.ZodObject<U>
    ): z.ZodObject<T & U> => {
      return schema1.merge(schema2)
    }
  }, [])

  const extendSchema = useMemo(() => {
    return <T extends z.ZodRawShape, U extends z.ZodRawShape>(
      baseSchema: z.ZodObject<T>,
      extension: U
    ): z.ZodObject<T & U> => {
      return baseSchema.extend(extension)
    }
  }, [])

  return {
    combineSchemas,
    mergeSchemas,
    extendSchema,
  }
}
```

---

## Form Components Integration

### Step 1: Material-UI Form Components

Create `src/components/forms/FormTextField.tsx`:

```typescript
import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { formatFieldError } from '@/utils/formUtils'

interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string
  rules?: Record<string, any>
  transform?: {
    input?: (value: any) => any
    output?: (value: any) => any
  }
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  rules,
  transform,
  ...textFieldProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          value={transform?.input ? transform.input(value) : value || ''}
          onChange={(e) => {
            const newValue = e.target.value
            const transformedValue = transform?.output ? transform.output(newValue) : newValue
            onChange(transformedValue)
          }}
          error={!!errors[name]}
          helperText={formatFieldError(errors[name])}
        />
      )}
    />
  )
}

export default FormTextField
```

Create `src/components/forms/FormSelect.tsx`:

```typescript
import React from 'react'
import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
  InputLabel,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { formatFieldError } from '@/utils/formUtils'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
}

interface FormSelectProps extends Omit<SelectProps, 'name'> {
  name: string
  label?: string
  options: SelectOption[]
  rules?: Record<string, any>
  placeholder?: string
  groupBy?: boolean
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  rules,
  placeholder,
  groupBy = false,
  ...selectProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const renderOptions = () => {
    if (!groupBy) {
      return options.map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))
    }

    // Group options by group property
    const grouped = options.reduce((acc, option) => {
      const group = option.group || 'Other'
      if (!acc[group]) acc[group] = []
      acc[group].push(option)
      return acc
    }, {} as Record<string, SelectOption[]>)

    return Object.entries(grouped).map(([group, groupOptions]) => [
      <MenuItem key={`group-${group}`} disabled>
        <strong>{group}</strong>
      </MenuItem>,
      ...groupOptions.map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          &nbsp;&nbsp;{option.label}
        </MenuItem>
      )),
    ])
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors[name]} {...selectProps}>
          {label && <InputLabel>{label}</InputLabel>}
          <Select
            {...field}
            value={field.value || ''}
            displayEmpty={!!placeholder}
            {...selectProps}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}
            {renderOptions()}
          </Select>
          {errors[name] && (
            <FormHelperText>{formatFieldError(errors[name])}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormSelect
```

Create `src/components/forms/FormCheckbox.tsx`:

```typescript
import React from 'react'
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CheckboxProps,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { formatFieldError } from '@/utils/formUtils'

interface FormCheckboxProps extends Omit<CheckboxProps, 'name'> {
  name: string
  label: string
  rules?: Record<string, any>
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  rules,
  ...checkboxProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => (
        <FormControl error={!!errors[name]}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                {...checkboxProps}
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label={label}
          />
          {errors[name] && (
            <FormHelperText>{formatFieldError(errors[name])}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormCheckbox
```

Create `src/components/forms/FormDatePicker.tsx`:

```typescript
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TextField } from '@mui/material'
import { formatFieldError } from '@/utils/formUtils'

interface FormDatePickerProps {
  name: string
  label?: string
  rules?: Record<string, any>
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  required?: boolean
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  rules,
  minDate,
  maxDate,
  disabled = false,
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value, ...field } }) => (
          <DatePicker
            {...field}
            label={label}
            value={value ? new Date(value) : null}
            onChange={(date) => onChange(date?.toISOString().split('T')[0] || '')}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required={required}
                error={!!errors[name]}
                helperText={formatFieldError(errors[name])}
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default FormDatePicker
```

### Step 2: Form Provider Component

Create `src/components/forms/FormProvider.tsx`:

```typescript
import React from 'react'
import { FormProvider as RHFFormProvider, UseFormReturn } from 'react-hook-form'
import { Box, Paper, Typography } from '@mui/material'

interface FormProviderProps {
  children: React.ReactNode
  methods: UseFormReturn<any>
  onSubmit?: (data: any) => Promise<void> | void
  title?: string
  description?: string
  loading?: boolean
  elevation?: number
  sx?: any
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  methods,
  onSubmit,
  title,
  description,
  loading = false,
  elevation = 0,
  sx,
}) => {
  const handleSubmit = onSubmit
    ? methods.handleSubmit(onSubmit)
    : (e: React.FormEvent) => e.preventDefault()

  return (
    <Paper elevation={elevation} sx={{ p: 3, ...sx }}>
      {(title || description) && (
        <Box sx={{ mb: 3 }}>
          {title && (
            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      )}
      
      <RHFFormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            '& .MuiTextField-root': { mb: 2 },
            '& .MuiFormControl-root': { mb: 2 },
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? 'none' : 'auto',
          }}
        >
          {children}
        </Box>
      </RHFFormProvider>
    </Paper>
  )
}

export default FormProvider
```

### Step 3: Complete Form Examples

Create `src/components/forms/LoginForm.tsx`:

```typescript
import React from 'react'
import { Box, Button, Stack, Link, Divider, Alert } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'

import { useForm } from '@/hooks/useForm'
import { loginSchema, LoginFormData } from '@/types/forms'
import { FormProvider } from './FormProvider'
import { FormTextField } from './FormTextField'
import { FormCheckbox } from './FormCheckbox'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  loading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const methods = useForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const { handleSubmit, isSubmitting, submitError, clearError } = methods

  React.useEffect(() => {
    if (submitError) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitError, clearError])

  return (
    <FormProvider
      methods={methods}
      title="Sign In"
      description="Welcome back! Please sign in to your account."
    >
      <Stack spacing={3}>
        {submitError && (
          <Alert severity="error" onClose={clearError}>
            {submitError}
          </Alert>
        )}

        <FormTextField
          name="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          autoFocus
          fullWidth
          required
        />

        <FormTextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          required
        />

        <FormCheckbox
          name="rememberMe"
          label="Remember me"
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={isSubmitting || loading}
          onClick={handleSubmit(onSubmit)}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>

        <Divider sx={{ my: 2 }}>
          <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            OR
          </Box>
        </Divider>

        <Stack spacing={2} alignItems="center">
          <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
            Forgot your password?
          </Link>
          <Box>
            <span>Don't have an account? </span>
            <Link component={RouterLink} to="/auth/register" variant="body2">
              Sign up
            </Link>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default LoginForm
```

Create `src/components/forms/TaskForm.tsx`:

```typescript
import React from 'react'
import { Box, Button, Stack, Chip, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material'

import { useForm } from '@/hooks/useForm'
import { taskSchema, TaskFormData } from '@/types/forms'
import { FormProvider } from './FormProvider'
import { FormTextField } from './FormTextField'
import { FormSelect } from './FormSelect'
import { FormDatePicker } from './FormDatePicker'

interface TaskFormProps {
  initialData?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [newTag, setNewTag] = React.useState('')
  
  const methods = useForm({
    schema: taskSchema,
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      tags: [],
      ...initialData,
    },
  })

  const { handleSubmit, isSubmitting, watch, setValue, getValues } = methods
  const currentTags = watch('tags') || []

  const handleAddTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setValue('tags', [...currentTags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', group: 'Priority' },
    { value: 'medium', label: 'Medium', group: 'Priority' },
    { value: 'high', label: 'High', group: 'Priority' },
  ]

  return (
    <FormProvider
      methods={methods}
      title={initialData ? 'Edit Task' : 'Create New Task'}
      description="Fill in the details for your task"
    >
      <Stack spacing={3}>
        <FormTextField
          name="title"
          label="Task Title"
          fullWidth
          required
          autoFocus
        />

        <FormTextField
          name="description"
          label="Description"
          multiline
          rows={4}
          fullWidth
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormSelect
            name="status"
            label="Status"
            options={statusOptions}
            fullWidth
          />

          <FormSelect
            name="priority"
            label="Priority"
            options={priorityOptions}
            fullWidth
          />
        </Stack>

        <FormDatePicker
          name="dueDate"
          label="Due Date"
          minDate={new Date()}
        />

        {/* Tags Section */}
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <TextField
              size="small"
              label="Add Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
          </Stack>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {currentTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                deleteIcon={<CloseIcon />}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || loading}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </LoadingButton>
          
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              fullWidth
              disabled={isSubmitting || loading}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default TaskForm
```

---

## Advanced Form Patterns

### 💡 Understanding Complex Form Interactions

**Advanced Form Challenges:**
```javascript
// 🧩 Complex Form Patterns Include:
1. Dynamic field arrays (add/remove items)
2. Conditional field rendering based on other fields
3. Cross-field validation (password confirmation)
4. Real-time field dependencies (city based on country)
5. Nested object structures (address, contact info)
6. File uploads with validation
7. Multi-step wizards with persistence
8. Auto-save drafts and recovery
```

**Form Array Mental Model:**
```javascript
// 📋 Think of Form Arrays as Dynamic Lists
// User starts with: []
// User adds items: [item1, item2, item3]
// User removes item2: [item1, item3] (indices shift!)
// Form validates entire array as one unit

// ❌ Manual array handling (complex state management)
const [items, setItems] = useState([])
const [errors, setErrors] = useState({})

const addItem = () => setItems([...items, defaultItem])
const removeItem = (index) => {
  setItems(items.filter((_, i) => i !== index))
  // Also need to update errors object indices...
}

// ✅ React Hook Form Field Arrays (automatic handling)
const { fields, append, remove } = useFieldArray({ name: 'items' })
// Validation, error tracking, and re-indexing handled automatically
```

**Conditional Rendering Patterns:**
```javascript
// 👀 Watch Pattern - Re-render when specific fields change
function ConditionalForm() {
  const { watch, register } = useForm()
  const userType = watch('userType')  // Only re-render when userType changes
  
  return (
    <form>
      <select {...register('userType')}>
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>
      
      {userType === 'business' && (
        <input {...register('companyName')} placeholder="Company Name" />
      )}
    </form>
  )
}

// 🔄 Dynamic Schema Pattern - Schema changes based on form state
function DynamicSchemaForm() {
  const [formType, setFormType] = useState('basic')
  
  const schema = useMemo(() => {
    const base = z.object({ name: z.string() })
    return formType === 'advanced' 
      ? base.extend({ details: z.string().min(10) })
      : base
  }, [formType])
  
  const form = useForm({ resolver: zodResolver(schema) })
  
  // Schema validation changes automatically
}
```

**Cross-Field Validation Concepts:**
```javascript
// 🔗 Fields that depend on each other
const registrationSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]  // Error appears on confirmPassword field
})

// 📅 Date range validation
const eventSchema = z.object({
  startDate: z.date(),
  endDate: z.date()
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
})
```

### Step 1: Form Array Handling

Create `src/components/forms/FormArray.tsx`:

```typescript
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface FormArrayProps {
  name: string
  title?: string
  addButtonText?: string
  renderItem: (index: number, remove: (index: number) => void) => React.ReactNode
  defaultValue?: any
  maxItems?: number
  minItems?: number
}

export const FormArray: React.FC<FormArrayProps> = ({
  name,
  title,
  addButtonText = 'Add Item',
  renderItem,
  defaultValue,
  maxItems,
  minItems = 0,
}) => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAdd = () => {
    if (!maxItems || fields.length < maxItems) {
      append(defaultValue || {})
    }
  }

  const handleRemove = (index: number) => {
    if (fields.length > minItems) {
      remove(index)
    }
  }

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Card key={field.id} variant="outlined">
            <CardContent>
              <Box sx={{ position: 'relative' }}>
                {fields.length > minItems && (
                  <IconButton
                    sx={{ position: 'absolute', right: -8, top: -8 }}
                    size="small"
                    color="error"
                    onClick={() => handleRemove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {renderItem(index, handleRemove)}
              </Box>
            </CardContent>
          </Card>
        ))}

        {(!maxItems || fields.length < maxItems) && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ alignSelf: 'flex-start' }}
          >
            {addButtonText}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export default FormArray
```

### Step 2: Conditional Fields

Create `src/components/forms/ConditionalField.tsx`:

```typescript
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

interface ConditionalFieldProps {
  children: React.ReactNode
  condition: (values: any) => boolean
  fallback?: React.ReactNode
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  children,
  condition,
  fallback = null,
}) => {
  const { control } = useFormContext()
  const watchedValues = useWatch({ control })

  const shouldShow = condition(watchedValues)

  return <>{shouldShow ? children : fallback}</>
}

// Example usage component
export const ProjectTaskForm: React.FC = () => {
  const methods = useForm({
    schema: taskSchema,
    defaultValues: {
      title: '',
      hasProject: false,
      projectId: '',
      isUrgent: false,
      deadline: '',
    },
  })

  return (
    <FormProvider methods={methods}>
      <Stack spacing={3}>
        <FormTextField name="title" label="Task Title" />
        
        <FormCheckbox name="hasProject" label="Assign to Project" />
        
        <ConditionalField condition={(values) => values.hasProject}>
          <FormSelect
            name="projectId"
            label="Project"
            options={[
              { value: 'project1', label: 'Project Alpha' },
              { value: 'project2', label: 'Project Beta' },
            ]}
          />
        </ConditionalField>

        <FormCheckbox name="isUrgent" label="Urgent Task" />
        
        <ConditionalField condition={(values) => values.isUrgent}>
          <FormDatePicker
            name="deadline"
            label="Urgent Deadline"
            required
          />
        </ConditionalField>
      </Stack>
    </FormProvider>
  )
}
```

### Step 3: Dynamic Validation

Create `src/components/forms/DynamicForm.tsx`:

```typescript
import React from 'react'
import { z } from 'zod'
import { useForm } from '@/hooks/useForm'
import { FormProvider } from './FormProvider'

interface FormField {
  name: string
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date'
  label: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: z.ZodSchema
  dependsOn?: string
  showWhen?: (value: any) => boolean
}

interface DynamicFormProps {
  fields: FormField[]
  onSubmit: (data: any) => Promise<void>
  title?: string
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  title,
}) => {
  // Build dynamic schema
  const schema = React.useMemo(() => {
    const schemaShape: Record<string, z.ZodSchema> = {}
    
    fields.forEach(field => {
      let fieldSchema: z.ZodSchema = z.string()
      
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email()
          break
        case 'number':
          fieldSchema = z.number()
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'date':
          fieldSchema = z.string().datetime()
          break
        default:
          fieldSchema = z.string()
      }
      
      if (field.validation) {
        fieldSchema = field.validation
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional()
      }
      
      schemaShape[field.name] = fieldSchema
    })
    
    return z.object(schemaShape)
  }, [fields])

  const methods = useForm({ schema })
  const { watch } = methods
  const watchedValues = watch()

  const renderField = (field: FormField) => {
    // Check if field should be shown based on dependencies
    if (field.dependsOn && field.showWhen) {
      const dependentValue = watchedValues[field.dependsOn]
      if (!field.showWhen(dependentValue)) {
        return null
      }
    }

    switch (field.type) {
      case 'select':
        return (
          <FormSelect
            key={field.name}
            name={field.name}
            label={field.label}
            options={field.options || []}
            required={field.required}
          />
        )
      case 'checkbox':
        return (
          <FormCheckbox
            key={field.name}
            name={field.name}
            label={field.label}
          />
        )
      case 'date':
        return (
          <FormDatePicker
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
          />
        )
      default:
        return (
          <FormTextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            required={field.required}
            fullWidth
          />
        )
    }
  }

  return (
    <FormProvider methods={methods} title={title} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {fields.map(renderField)}
        
        <Button type="submit" variant="contained" fullWidth>
          Submit
      </Stack>
    </FormProvider>
  )
}
```

---

## Testing Form Components

### 💡 Understanding Form Testing Strategy

**What to Test in Forms:**
```javascript
// 🎯 Test Categories:
1. User Interactions (typing, clicking, submitting)
2. Validation Logic (error messages, validation timing)
3. Form State (field values, form validity, loading states)
4. Integration (API calls, navigation after submit)
5. Accessibility (ARIA labels, keyboard navigation)
6. Error Handling (network failures, validation errors)
```

**Form Testing Mental Model:**
```javascript
// 🧪 Think like a User, Test like a Developer
// User perspective: "Can I fill out and submit this form?"
// Developer perspective: "Does the form handle all edge cases?"

// ✅ Good form tests cover:
- Happy path: Fill form correctly → Submit successfully
- Validation: Leave required field empty → See error message  
- Error recovery: Fix validation error → Error disappears
- Edge cases: Network failure → Show appropriate message
- Accessibility: Screen reader users can navigate form
```

### Step 1: Schema Testing

```typescript
// src/validation/__tests__/schemas.test.ts
import { userSchema, taskSchema } from '../schemas'

describe('Form Schemas', () => {
  describe('userSchema', () => {
    test('validates correct user data', () => {
      const validUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user' as const,
        isActive: true,
        preferences: {
          notifications: true,
          newsletter: false,
          theme: 'light' as const,
        },
      }
      
      const result = userSchema.safeParse(validUser)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validUser)
      }
    })

    test('rejects invalid email', () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        role: 'user' as const,
      }
      
      const result = userSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
        expect(result.error.issues[0].message).toContain('email')
      }
    })

    test('enforces admin permissions requirement', () => {
      const adminWithoutPermissions = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin' as const,
        // Missing permissions array
      }
      
      const result = userSchema.safeParse(adminWithoutPermissions)
      expect(result.success).toBe(false)
    })
  })
})
```

### Step 2: Component Testing

```typescript
// src/components/forms/__tests__/TaskForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../TaskForm'

// Mock form wrapper for testing
function FormTestWrapper({ children, onSubmit = jest.fn() }) {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  )
}

describe('TaskForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders all form fields', () => {
    render(<TaskForm {...defaultProps} />)
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
    
    // Should not call onSubmit
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)
    
    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Task')
    await user.type(screen.getByLabelText(/description/i), 'Test Description')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Should call onSubmit with form data
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        status: 'todo',
        tags: [],
      })
    })
  })

  test('validates field dependencies', async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)
    
    // Select a priority that requires additional fields
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    
    // High priority tasks might require due date
    const dueDateField = screen.getByLabelText(/due date/i)
    expect(dueDateField).toBeRequired()
  })

  test('handles loading state', () => {
    render(<TaskForm {...defaultProps} loading />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/saving/i)).toBeInTheDocument()
  })

  test('pre-fills form when editing existing task', () => {
    const existingTask = {
      id: '1',
      title: 'Existing Task',
      description: 'Existing Description',
      priority: 'medium' as const,
      status: 'in-progress' as const,
      tags: ['work', 'urgent'],
    }
    
    render(<TaskForm {...defaultProps} initialData={existingTask} />)
    
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument()
  })
})
```

### Step 3: Integration Testing

```typescript
// src/components/forms/__tests__/TaskForm.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { TaskForm } from '../TaskForm'
import { server } from '@/test-utils/server'
import { rest } from 'msw'

// Mock API responses
const mockApiHandlers = [
  rest.post('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '123',
        ...req.body,
        createdAt: new Date().toISOString(),
      })
    )
  }),
]

describe('TaskForm Integration', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('creates new task and updates Redux store', async () => {
    const user = userEvent.setup()
    
    render(
      <Provider store={store}>
        <TaskForm onSubmit={jest.fn()} />
      </Provider>
    )
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/title/i), 'Integration Test Task')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Wait for API call and Redux update
    await waitFor(() => {
      const state = store.getState()
      expect(state.tasks.items).toHaveLength(1)
      expect(state.tasks.items[0].title).toBe('Integration Test Task')
    })
  })

  test('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock API error
    server.use(
      rest.post('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }))
      })
    )
    
    render(
      <Provider store={store}>
        <TaskForm onSubmit={jest.fn()} />
      </Provider>
    )
    
    await user.type(screen.getByLabelText(/title/i), 'Test Task')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })
})
```

### Step 4: Accessibility Testing

```typescript
// src/components/forms/__tests__/TaskForm.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { TaskForm } from '../TaskForm'

expect.extend(toHaveNoViolations)

describe('TaskForm Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<TaskForm onSubmit={jest.fn()} />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('supports keyboard navigation', async () => {
    render(<TaskForm onSubmit={jest.fn()} />)
    
    // Test tab order
    const titleField = screen.getByLabelText(/title/i)
    titleField.focus()
    expect(titleField).toHaveFocus()
    
    // Tab to next field
    await userEvent.tab()
    expect(screen.getByLabelText(/description/i)).toHaveFocus()
  })

  test('has proper ARIA labels and descriptions', () => {
    render(<TaskForm onSubmit={jest.fn()} />)
    
    const titleField = screen.getByLabelText(/title/i)
    expect(titleField).toHaveAttribute('aria-required', 'true')
    
    // Error messages should be associated with fields
    const priorityField = screen.getByLabelText(/priority/i)
    expect(priorityField).toHaveAttribute('aria-describedby')
  })
})
```

---

## Best Practices

### 💡 Form Development Best Practices

**Performance Optimization:**
```javascript
// ✅ Optimize form performance
1. Use uncontrolled components (React Hook Form default)
2. Memoize validation schemas
3. Debounce real-time validation
4. Lazy load form components
5. Use field arrays efficiently

// 🚀 Schema caching
const schema = useMemo(() => createUserSchema(userType), [userType])

// ⚡ Debounced validation
const { register } = useForm({
  mode: 'onChange',
  reValidateMode: 'onChange',
  criteriaMode: 'all',
})
```

**User Experience Guidelines:**
```javascript
// 🎯 UX Best Practices
1. Validate on blur, not on change (less annoying)
2. Show success states, not just errors
3. Preserve form data during navigation
4. Provide clear error messages
5. Support keyboard navigation
6. Auto-save drafts for long forms

// 📱 Mobile considerations
- Larger touch targets (44px minimum)
- Appropriate input types (email, tel, number)
- Avoid horizontal scrolling
- Consider virtual keyboard behavior
```

**Accessibility Requirements:**
```javascript
// ♿ Accessibility checklist
✅ Proper label associations
✅ Required field indicators
✅ Error message announcements
✅ Keyboard navigation support
✅ Focus management
✅ Color contrast compliance
✅ Screen reader compatibility
```

---

## Summary
}

// Example usage
export const UserRegistrationForm: React.FC = () => {
  const fields: FormField[] = [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'userType',
      type: 'select',
      label: 'User Type',
      required: true,
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' },
      ],
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
      required: true,
      dependsOn: 'userType',
      showWhen: (value) => value === 'business',
    },
  ]

  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      title="User Registration"
    />
  )
}
```

---

## Summary

🎉 **Congratulations!** You now have a comprehensive form handling system with:

✅ **Modern Form Library**: React Hook Form with optimal performance  
✅ **Type-Safe Validation**: Zod schemas with runtime and compile-time safety  
✅ **Material-UI Integration**: Custom form components with consistent styling  
✅ **Advanced Patterns**: Dynamic forms, conditional fields, and form arrays  
✅ **Error Handling**: Comprehensive validation and user feedback  
✅ **Performance**: Minimal re-renders and optimized bundle size  
✅ **Developer Experience**: Excellent TypeScript support and debugging  

### Key Benefits Achieved

1. **Type Safety**: End-to-end type safety from schema to form submission
2. **Performance**: Uncontrolled components with minimal re-renders
3. **Validation**: Runtime type checking with excellent error messages
4. **Reusability**: Modular form components that scale across your app
5. **User Experience**: Immediate feedback and intuitive error handling
6. **Maintainability**: Schema-driven validation with clear separation of concerns

### Next Steps

- **Chapter 6**: API integration patterns with Axios
- **Chapter 7**: Comprehensive testing strategies
- **Chapter 8**: Production build and deployment

---

## 📚 Additional Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Material-UI Form Components](https://mui.com/components/text-fields/)

---

**Previous**: [← Chapter 4 - State Management](./04-state-management.md) | **Next**: [Chapter 6 - API Integration →](./06-api-integration.md)