# Frontend Task: Product Table with API Integration, Zod Validation & Navigation

**Submitted by: [Arshad Rais]**

# Product Management System - Implementation

This implementation provides a complete product management system with CRUD operations, pagination, sorting, search functionality, and form validation using the DummyJSON Products API.

## Features Implemented

### Core Requirements

#### 1. Data Table Integration
- Fetches product data from `https://dummyjson.com/products` using TanStack Query
- Displays data in the existing DataTable component
- Responsive table with proper product information display

#### 2. Pagination
- Server-side pagination using API's `limit` and `skip` parameters
- Configurable page size (default: 10 products per page)
- Navigation controls with Previous/Next buttons
- Page information display showing current position

#### 3. Sorting
- Client-side sorting on table columns (title, price, rating, etc.)
- Ascending and descending order sorting
- Visual sort indicators in column headers

#### 4. CRUD Functionality

**Add Product:**
- Modal form for creating new products
- Zod schema validation with react-hook-form
- POST request to `https://dummyjson.com/products/add`
- Optimistic updates with TanStack Query cache management

**Update Product:**
- Inline edit functionality from table actions
- Pre-populated form with existing product data
- PUT request to `https://dummyjson.com/products/{id}`
- Optimistic updates with rollback on error

**Delete Product:**
- Delete confirmation dialog
- DELETE request to `https://dummyjson.com/products/{id}`
- Optimistic removal with cache updates

#### 5. Product Detail Page
- Dynamic route `/products/[id]` for individual product view
- Fetches single product using `GET https://dummyjson.com/products/{id}`
- Comprehensive product information display
- Product images, reviews, specifications, and metadata
- Responsive design with mobile-friendly layout

#### 6. Dynamic Page Titles
-  SEO-friendly page titles using Next.js metadata API
-  `/products`: "All Products – MyShop"
-  `/products/[id]`: "{Product Name} – MyShop"
-  Open Graph meta tags for social sharing

### Bonus Features

#### 1. Search Functionality
- Debounced search with 300ms delay
- Client-side search by product title and brand
- Real-time search results with loading indicators
- Clear search functionality

#### 2. Optimistic Updates
- Create operations show immediate UI feedback
- Update operations reflect changes instantly
- Delete operations remove items immediately
- Automatic rollback on API errors

#### 3. Skeleton Loading States
- Product table skeleton during data loading
- Product detail page skeleton
- Consistent loading experience across the app

#### 4. Enhanced UX
- Toast notifications for success/error states
- Loading states for all mutations
- Confirmation dialogs for destructive actions
- Responsive design with mobile optimization

## Technical Implementation

### Architecture & Libraries
- **Framework:** Next.js 15 with App Router
- **State Management:** TanStack Query for server state, Zustand for client state
- **Styling:** Tailwind CSS with shadcn/ui components
- **Forms:** React Hook Form with Zod validation
- **API Client:** Axios with interceptors
- **TypeScript:** Full type safety throughout the application

### Key Technical Features
1. **Type-Safe API Layer:** Complete TypeScript interfaces for all API responses
2. **Form Validation:** Comprehensive Zod schemas with error handling
3. **Cache Management:** Intelligent cache updates and invalidation
4. **Error Handling:** Graceful error states with user feedback
5. **Performance:** Optimized with React Query caching and optimistic updates

### File Structure
```
src/
├── api/
│   ├── index.ts           # Axios configuration
│   └── products.ts        # Product API functions
├── app/
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (redirects to products)
│   └── products/
│       ├── layout.tsx     # Products layout with metadata
│       ├── page.tsx       # Products listing page
│       └── [id]/
│           ├── layout.tsx # Product detail metadata
│           └── page.tsx   # Product detail page
├── components/
│   ├── products/
│   │   ├── product-columns.tsx    # Table column definitions
│   │   ├── product-form.tsx       # Product create/edit form
│   │   ├── product-search.tsx     # Search functionality
│   │   └── product-skeletons.tsx  # Loading skeletons
│   ├── table/             # Reusable table components
│   └── ui/                # shadcn/ui components
├── hooks/
│   ├── useDebounce.ts     # Debounce hook for search
│   └── useProducts.ts     # TanStack Query hooks
├── schemas/
│   └── product.ts         # Zod validation schemas
└── types/
    └── product.ts         # TypeScript interfaces
```

## Evaluation Criteria Met

- **Functionality:** All CRUD operations, pagination, sorting, and routing implemented
- **Code Quality:** Clean, readable, and maintainable TypeScript code
- **User Experience:** Intuitive interface with loading states and feedback
- **Validation:** Comprehensive Zod validation with clear error messages
- **State Management:** Efficient TanStack Query usage with optimistic updates
- **Error Handling:** Proper error boundaries and user-friendly error messages

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Access the application:**
   - Open http://localhost:3000 in your browser
   - You'll be redirected to the products page
   - Explore CRUD operations, search, and pagination

## Usage Guide

1. **View Products:** Navigate to `/products` to see the product table
2. **Add Product:** Click "Add Product" button to open the creation form
3. **Edit Product:** Click the edit icon in the actions column
4. **Delete Product:** Click the delete icon and confirm the action
5. **Search Products:** Use the search bar to find products by title or brand
6. **View Details:** Click on any product title to view detailed information
7. **Navigate:** Use pagination controls to browse through products

The implementation follows modern React patterns and provides a production-ready foundation for a product management system.