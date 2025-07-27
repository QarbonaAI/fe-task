# Frontend Task: Product Table with API Integration, Zod Validation & Navigation

## Objective

Enhance the existing Next.js boilerplate by integrating the [DummyJSON Products API](https://dummyjson.com/docs/products) into a data table. Implement full CRUD operations, pagination, sorting, form validation using Zod, routing with dynamic titles, and utilize **TanStack Query** for efficient data fetching and state management.

---

## Requirements

### 1. Data Table Integration

- Fetch product data from `https://dummyjson.com/products` using **TanStack Query**.
- Display the data in the existing table (data-table) component.

### 2. Pagination

- Implement pagination using the API's `limit` and `skip` query parameters.
- Allow users to navigate through different pages of products.

### 3. Sorting

- Enable sorting of products on the table based on fields like `title`, `price`, and `rating`.
- Implement both ascending and descending order sorting.

### 4. CRUD Functionality

- **Add Product**:

  - Create a form to add a new product.
  - Use **Zod** with `react-hook-form` for form validation.
  - Send a POST request to `https://dummyjson.com/products/add`.
  - Upon successful addition, update the TanStack Query's cache to include the new product.
- **Update Product**:

  - Allow editing of existing product details.
  - Use **Zod** for validating the updated data.
  - Send a PUT request to `https://dummyjson.com/products/{id}`.
  - Reflect the changes in the TanStack Query's cache upon successful update.
- **Delete Product**:

  - Implement a delete functionality for each product.
  - Send a DELETE request to `https://dummyjson.com/products/{id}`.
  - Remove the product from the TanStack Query's cache upon successful deletion.

### 5. Product Detail Page (View Page)

- Clicking on a table row should navigate to a product view page at `/products/[id]`.
- Fetch the product using `GET https://dummyjson.com/products/{id}`.
- Display key information: title, price, description, brand, thumbnail, etc.

### 6. Dynamic Page Titles

- Use the product name (or relevant context) as the document `<title>` for each page.
  - Example:
    - `/products`: “All Products – QuarbonaAI”
    - `/products/12`: “iPhone 9 – QuarbonaAI”

---

## Form Validation with Zod

Use `zod` and `@hookform/resolvers/zod` for schema validation. Example schema:

```typescript
import { z } from 'zod';

export const productSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});
```

Integrate this schema with `react-hook-form` to validate form inputs and display appropriate error messages.

---

## Evaluation Criteria

* **Functionality** : Correct implementation of data fetching, pagination, sorting, CRUD operations, and routing.
* **Code Quality** : Clean, readable, and maintainable code.
* **User Experience** : Intuitive and responsive UI/UX.
* **Validation** : Effective use of Zod for form validation with appropriate error messages.
* **State Management** : Efficient use of TanStack Query for data fetching and state management.
* **Error Handling** : Proper handling of API errors and edge cases.

---

## Submission Guidelines

1. **Fork the Repository.**
2. **Make Your Changes**
3. **Push Changes and Create a Pull Request** :

* Ensure the base repository is `QarbonaAI/fe-task` and the base branch is `main`.
* Set the title of the pull request to your  **full name** .
* Provide a brief description of the changes you've made.
