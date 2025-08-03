# API Documentation - POS System

## 🔧 Setup Firebase

### 1. Firebase Configuration

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOyPQ9CuhlFUQseO2lqYXqxFGB2u1kah0",
  authDomain: "pos-4-90fb5.firebaseapp.com",
  projectId: "pos-4-90fb5",
  storageBucket: "pos-4-90fb5.firebasestorage.app",
  messagingSenderId: "599895364431",
  appId: "1:599895364431:web:8f5dd5cb8a21234e3a2b3a",
  measurementId: "G-5W4HK9F0RF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 2. Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
    
    // Customers collection
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔐 Authentication API

### Login
```typescript
// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'cashier';
    createdAt: Date;
  };
  token: string;
}
```

### Logout
```typescript
// POST /auth/logout
interface LogoutResponse {
  success: boolean;
  message: string;
}
```

## 📦 Products API

### Get All Products
```typescript
// GET /products
interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
```

### Create Product
```typescript
// POST /products
interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  image?: string;
}

interface CreateProductResponse {
  product: Product;
  message: string;
}
```

### Update Product
```typescript
// PUT /products/{id}
interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  barcode?: string;
  image?: string;
}

interface UpdateProductResponse {
  product: Product;
  message: string;
}
```

### Delete Product
```typescript
// DELETE /products/{id}
interface DeleteProductResponse {
  success: boolean;
  message: string;
}
```

## 🛒 Transactions API

### Create Transaction
```typescript
// POST /transactions
interface CreateTransactionRequest {
  items: CartItem[];
  paymentMethod: 'cash' | 'card' | 'ewallet';
  customerId?: string;
  cashReceived?: number;
}

interface CreateTransactionResponse {
  transaction: Transaction;
  receipt: Receipt;
}
```

### Get Transactions
```typescript
// GET /transactions
interface GetTransactionsRequest {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  cashierId?: string;
}

interface GetTransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}
```

### Get Transaction by ID
```typescript
// GET /transactions/{id}
interface GetTransactionResponse {
  transaction: Transaction;
}
```

## 👥 Customers API

### Get All Customers
```typescript
// GET /customers
interface GetCustomersResponse {
  customers: Customer[];
  total: number;
}
```

### Create Customer
```typescript
// POST /customers
interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CreateCustomerResponse {
  customer: Customer;
  message: string;
}
```

### Update Customer
```typescript
// PUT /customers/{id}
interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface UpdateCustomerResponse {
  customer: Customer;
  message: string;
}
```

### Delete Customer
```typescript
// DELETE /customers/{id}
interface DeleteCustomerResponse {
  success: boolean;
  message: string;
}
```

## 📊 Reports API

### Get Sales Report
```typescript
// GET /reports/sales
interface GetSalesReportRequest {
  period: 'today' | 'yesterday' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

interface GetSalesReportResponse {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  paymentMethods: Record<string, number>;
  dailyData: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
}
```

### Get Inventory Report
```typescript
// GET /reports/inventory
interface GetInventoryReportResponse {
  totalProducts: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  categoryBreakdown: Record<string, number>;
  valueByCategory: Record<string, number>;
}
```

### Get Customer Report
```typescript
// GET /reports/customers
interface GetCustomerReportResponse {
  totalCustomers: number;
  newCustomers: number;
  topCustomers: Array<{
    customer: Customer;
    totalSpent: number;
    transactionCount: number;
  }>;
  customerSegments: Array<{
    segment: string;
    count: number;
    averageSpent: number;
  }>;
}
```

## 🤖 AI Integration API

### Analyze Sales Data
```typescript
// POST /ai/analyze-sales
interface AnalyzeSalesRequest {
  transactions: Transaction[];
  products: Product[];
}

interface AnalyzeSalesResponse {
  insights: string[];
  recommendations: string[];
  trends: string[];
  topProducts: Array<{
    name: string;
    reason: string;
  }>;
}
```

### Predict Sales
```typescript
// POST /ai/predict-sales
interface PredictSalesRequest {
  historicalData: Transaction[];
  period: 'week' | 'month' | 'quarter';
}

interface PredictSalesResponse {
  predictedRevenue: string;
  topSellingProducts: Array<{
    name: string;
    predictedQuantity: number;
  }>;
  seasonalTrends: string[];
  recommendations: string[];
}
```

### Optimize Inventory
```typescript
// POST /ai/optimize-inventory
interface OptimizeInventoryRequest {
  products: Product[];
  transactions: Transaction[];
}

interface OptimizeInventoryResponse {
  lowStockAlerts: Array<{
    productName: string;
    currentStock: number;
    recommendedStock: number;
    urgency: 'high' | 'medium' | 'low';
  }>;
  overstockedProducts: Array<{
    productName: string;
    currentStock: number;
    recommendedAction: string;
  }>;
  reorderRecommendations: Array<{
    productName: string;
    quantity: number;
    reason: string;
  }>;
}
```

## 🔧 Error Handling

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}
```

### Common Error Codes
- `AUTH_REQUIRED`: User not authenticated
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required role
- `PRODUCT_NOT_FOUND`: Product doesn't exist
- `INSUFFICIENT_STOCK`: Not enough stock for transaction
- `INVALID_PAYMENT_METHOD`: Invalid payment method
- `CUSTOMER_NOT_FOUND`: Customer doesn't exist
- `TRANSACTION_FAILED`: Transaction processing failed

## 📱 WebSocket Events (Real-time)

### Product Updates
```typescript
// Event: 'product:updated'
interface ProductUpdateEvent {
  product: Product;
  action: 'created' | 'updated' | 'deleted';
}
```

### Stock Alerts
```typescript
// Event: 'stock:alert'
interface StockAlertEvent {
  product: Product;
  type: 'low' | 'out';
  currentStock: number;
}
```

### Transaction Completed
```typescript
// Event: 'transaction:completed'
interface TransactionCompletedEvent {
  transaction: Transaction;
  receipt: Receipt;
}
```

## 🚀 Usage Examples

### Creating a Transaction
```typescript
const createTransaction = async (transactionData: CreateTransactionRequest) => {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    });
    
    if (!response.ok) {
      throw new Error('Transaction failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
```

### Getting Sales Report
```typescript
const getSalesReport = async (period: string) => {
  try {
    const response = await fetch(`/api/reports/sales?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sales report:', error);
    throw error;
  }
};
```

## 📋 Testing

### API Testing with Postman

1. **Authentication**
   - Import the collection
   - Set up environment variables
   - Run the login request to get token

2. **Products**
   - Test CRUD operations
   - Verify permissions (admin only for write)

3. **Transactions**
   - Test transaction creation
   - Verify receipt generation
   - Test different payment methods

4. **Reports**
   - Test different time periods
   - Verify data accuracy
   - Test filtering options

### Unit Testing

```typescript
// Example test for transaction creation
describe('Transaction API', () => {
  it('should create a transaction successfully', async () => {
    const transactionData = {
      items: [
        {
          product: mockProduct,
          quantity: 2,
          discount: 0
        }
      ],
      paymentMethod: 'cash',
      cashReceived: 50000
    };
    
    const response = await createTransaction(transactionData);
    
    expect(response.transaction).toBeDefined();
    expect(response.transaction.id).toBeDefined();
    expect(response.receipt).toBeDefined();
  });
});
```

---

**Note**: This documentation is for the current implementation. For production use, additional security measures, rate limiting, and comprehensive error handling should be implemented. 