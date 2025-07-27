# MyShop - Product Management System

**Developer**: Anshum Dwivedi

A comprehensive product management system built with Next.js, TanStack Query, and modern web technologies. This application provides full CRUD operations for products with real-time search, sorting, pagination, and a beautiful responsive UI.

## 🚀 Features

### Core Functionality
- **Full CRUD Operations**: Create, Read, Update, Delete products
- **Real-time Search**: Debounced search functionality for products
- **Advanced Filtering**: Sort by multiple fields (title, brand, price, rating)
- **Pagination**: Server-side pagination with configurable page sizes
- **Form Validation**: Comprehensive validation using Zod schemas
- **Dynamic Routing**: Product detail pages with dynamic titles
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### User Experience
- **Modern UI**: Clean, professional interface with shadcn/ui components
- **Dark Mode Support**: Complete dark/light theme switching
- **Loading States**: Skeleton loaders and loading indicators
- **Toast Notifications**: User feedback for all operations
- **Error Handling**: Graceful error states and fallbacks
- **Accessibility**: WCAG compliant with proper contrast ratios

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.4.4**: React framework with App Router for optimal performance
- **TypeScript**: Type-safe development with strict type checking
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### State Management & Data Fetching
- **TanStack Query (React Query)**: Efficient data fetching, caching, and state management
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: Schema validation for runtime type safety

### UI Components & Styling
- **shadcn/ui**: High-quality, accessible React components
- **Lucide React**: Beautiful, customizable icons
- **class-variance-authority**: Type-safe component variants
- **clsx & tailwind-merge**: Utility functions for conditional styling

### HTTP Client & Utilities
- **Axios**: Promise-based HTTP client for API requests
- **React Toastify**: Toast notification system
- **date-fns**: Modern date utility library

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page with marketing content
│   └── products/                # Product-related pages
│       ├── page.tsx             # Products listing page
│       └── [id]/                # Dynamic product detail pages
│           └── page.tsx         # Individual product detail page
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── badge.tsx           # Badge component for status indicators
│   │   ├── button.tsx          # Button component variants
│   │   ├── input.tsx           # Input field component
│   │   ├── select.tsx          # Select dropdown component
│   │   └── ...                 # Other UI components
│   ├── table/                   # Data table components
│   │   ├── data-table.tsx      # Main data table component
│   │   └── data-table-toolbar.tsx # Table toolbar with filters
│   ├── products/                # Product-specific components
│   │   ├── product-columns.tsx # Table column definitions
│   │   └── product-form.tsx    # Add/Edit product form
│   ├── navbar.tsx              # Navigation bar component
│   ├── theme-provider.tsx      # Theme context provider
│   └── mode-toggle.tsx         # Dark/light mode toggle
├── api/                         # API layer
│   ├── index.ts                # Axios instance configuration
│   └── products.ts             # Product API functions
├── hooks/                       # Custom React hooks
│   ├── use-products.ts         # TanStack Query hooks for products
│   └── use-debounce.ts         # Debounce hook for search
├── lib/                         # Utility libraries
│   ├── query-provider.tsx      # TanStack Query provider setup
│   ├── schemas.ts              # Zod validation schemas
│   └── utils.ts                # Utility functions
├── types/                       # TypeScript type definitions
│   └── product.ts              # Product-related interfaces
└── styles/                      # Global styles
    └── globals.css             # Tailwind CSS and custom styles
```

## 📄 File Documentation

### 🆕 New Files Added

#### **API Layer**
- **`src/api/products.ts`**
  - **Purpose**: Centralized API functions for all product operations
  - **Why**: Separates API logic from components, provides type safety, and enables easy testing
  - **Functions**: `getProducts`, `getProduct`, `searchProducts`, `addProduct`, `updateProduct`, `deleteProduct`
  - **Features**: Proper TypeScript typing, error handling, and consistent API structure

#### **Type Definitions**
- **`src/types/product.ts`**
  - **Purpose**: TypeScript interfaces for product data structures
  - **Why**: Ensures type safety across the application and provides IntelliSense support
  - **Interfaces**: `Product`, `ProductsResponse`, `ProductFormData`, `Review`, `Category`
  - **Benefits**: Prevents runtime errors and improves development experience

#### **Custom Hooks**
- **`src/hooks/use-products.ts`**
  - **Purpose**: TanStack Query hooks for product data management
  - **Why**: Provides caching, background updates, and optimistic updates
  - **Hooks**: `useProducts`, `useProduct`, `useAddProduct`, `useUpdateProduct`, `useDeleteProduct`
  - **Features**: Automatic cache invalidation, error handling, and loading states

- **`src/hooks/use-debounce.ts`**
  - **Purpose**: Debounce hook for search input optimization
  - **Why**: Reduces API calls during typing and improves performance
  - **Usage**: Applied to search functionality to prevent excessive requests

#### **Validation Schemas**
- **`src/lib/schemas.ts`**
  - **Purpose**: Zod validation schemas for form validation
  - **Why**: Runtime type validation, better error messages, and type inference
  - **Schemas**: `productSchema`, `productUpdateSchema`
  - **Features**: Comprehensive validation rules for all product fields

#### **UI Components**
- **`src/components/ui/badge.tsx`**
  - **Purpose**: Reusable badge component for status indicators
  - **Why**: Consistent styling for stock levels, categories, and status badges
  - **Variants**: default, secondary, destructive, outline

- **`src/components/products/product-columns.tsx`**
  - **Purpose**: Table column definitions for the product data table
  - **Why**: Separates column logic from table component, enables easy customization
  - **Features**: Sortable columns, custom cell renderers, action dropdowns

- **`src/components/products/product-form.tsx`**
  - **Purpose**: Comprehensive form for adding and editing products
  - **Why**: Reusable form component with validation, dynamic fields, and proper UX
  - **Features**: Dynamic tag/image management, form validation, loading states

#### **Pages**
- **`src/app/page.tsx`**
  - **Purpose**: Marketing-style home page with feature showcase
  - **Why**: Provides context about the application and guides users to products
  - **Features**: Hero section, feature cards, technology stack, call-to-action

- **`src/app/products/page.tsx`**
  - **Purpose**: Main products listing page with full CRUD functionality
  - **Why**: Central hub for product management with search, filtering, and actions
  - **Features**: Data table, search, modals for add/edit, pagination info

- **`src/app/products/[id]/page.tsx`**
  - **Purpose**: Individual product detail page with comprehensive information
  - **Why**: Provides detailed view of products with all specifications and reviews
  - **Features**: Product images, specifications, policies, customer reviews

### 🔄 Modified Files

#### **Layout & Configuration**
- **`src/app/layout.tsx`**
  - **Changes**: Added metadata configuration, ToastContainer setup, improved color scheme
  - **Why**: Better SEO, user feedback, and consistent theming
  - **Improvements**: Dynamic page titles, toast notifications, enhanced color palette

- **`src/components/navbar.tsx`**
  - **Changes**: Enhanced navigation with better styling and color scheme
  - **Why**: Improved user experience and visual consistency
  - **Improvements**: Better contrast, professional appearance, responsive design

#### **Data Table Integration**
- **`src/components/table/data-table.tsx`** (existing)
  - **Usage**: Used as-is for displaying product data
  - **Why**: Leverages existing TanStack Table implementation without modifications
  - **Integration**: Passed data and column configurations as props

#### **Query Provider**
- **`src/lib/query-provider.tsx`** (existing)
  - **Usage**: Configured for product data management
  - **Why**: Provides TanStack Query context for efficient data fetching
  - **Configuration**: Optimized for product operations with proper caching

## 🎯 Key Implementation Decisions

### **Why TanStack Query?**
- **Efficient Caching**: Automatic background updates and cache invalidation
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Error Handling**: Built-in error states and retry mechanisms
- **Performance**: Reduces unnecessary API calls and improves responsiveness

### **Why Zod Validation?**
- **Runtime Safety**: Validates data at runtime, not just compile time
- **Type Inference**: Automatically generates TypeScript types from schemas
- **Better UX**: Provides detailed error messages for form validation
- **Consistency**: Ensures data integrity across the application

### **Why shadcn/ui Components?**
- **Accessibility**: Built with accessibility best practices
- **Customizable**: Easy to customize with Tailwind CSS
- **Type Safety**: Full TypeScript support with proper types
- **Performance**: Lightweight and optimized components

### **Why Axios?**
- **Interceptors**: Request/response interceptors for global error handling
- **Type Safety**: Better TypeScript support than fetch
- **Features**: Automatic JSON parsing, request cancellation, progress tracking
- **Consistency**: Unified API for all HTTP requests

### **Why React Hook Form?**
- **Performance**: Minimal re-renders and optimized form handling
- **Validation**: Easy integration with Zod and other validation libraries
- **Accessibility**: Built-in accessibility features
- **Developer Experience**: Excellent TypeScript support and debugging tools

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fe-task

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🌐 API Integration

The application integrates with the [DummyJSON Products API](https://dummyjson.com/docs/products) for:

- **GET /products**: Fetch products with pagination and sorting
- **GET /products/{id}**: Fetch individual product details
- **GET /products/search**: Search products by query
- **POST /products/add**: Add new product
- **PUT /products/{id}**: Update existing product
- **DELETE /products/{id}**: Delete product

## 🎨 Design System

### Color Palette
- **Primary**: Blue (`blue-600`, `blue-700`)
- **Secondary**: Slate (`slate-50` to `slate-900`)
- **Success**: Green (`green-600`, `green-400`)
- **Warning**: Orange (`orange-600`, `orange-400`)
- **Error**: Red (`red-500`, `red-600`)
- **Info**: Purple (`purple-600`, `purple-400`)

### Typography
- **Font**: Geist Sans (modern, clean font)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight with good readability

### Spacing
- **Consistent**: 4px base unit system
- **Responsive**: Tailwind's responsive spacing utilities
- **Accessible**: Proper spacing for touch targets and readability

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com

# Application Settings
NEXT_PUBLIC_APP_NAME=MyShop
NEXT_PUBLIC_APP_DESCRIPTION=Product Management System
```

### TanStack Query Configuration
- **Stale Time**: 5 minutes for products, 10 minutes for categories
- **Cache Time**: Automatic garbage collection
- **Retry Logic**: 3 retries with exponential backoff
- **Background Updates**: Enabled for better UX

## 🧪 Testing Strategy

### Unit Testing
- **Components**: React Testing Library for component testing
- **Hooks**: Custom hook testing with proper setup/teardown
- **Utils**: Jest for utility function testing

### Integration Testing
- **API Integration**: Mock API responses for testing
- **Form Validation**: Test form submission and validation
- **User Flows**: End-to-end testing of CRUD operations

### Performance Testing
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse**: Performance, accessibility, and SEO audits
- **Load Testing**: API endpoint performance under load

## 📈 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component for optimized images
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Caching**: TanStack Query caching and browser caching

### API Optimizations
- **Debounced Search**: Reduces API calls during typing
- **Pagination**: Server-side pagination to limit data transfer
- **Caching**: TanStack Query caching reduces redundant requests
- **Error Handling**: Graceful degradation and retry logic

## 🔒 Security Considerations

### Frontend Security
- **Input Validation**: Zod schemas prevent malicious input
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Proper form handling and validation
- **Content Security Policy**: CSP headers for additional protection

### API Security
- **Request Validation**: All API requests are validated
- **Error Handling**: Secure error messages without sensitive data
- **Rate Limiting**: Implemented on API endpoints
- **HTTPS**: All API calls use secure connections

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **AWS Amplify**: Enterprise-grade deployment
- **Docker**: Containerized deployment option

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes with proper TypeScript types
4. **Test** your changes thoroughly
5. **Submit** a pull request with detailed description

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Consistent code style
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DummyJSON**: For providing the free API for testing
- **shadcn/ui**: For the excellent component library
- **TanStack**: For the powerful React Query library
- **Vercel**: For the amazing Next.js framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Built with ❤️ using Next.js, TanStack Query, and modern web technologies**
