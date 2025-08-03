export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  customerName: string;
  date: string;
  total: number;
  items: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Espresso Machine",
    price: 299.99,
    stock: 15,
    category: "Appliances",
    image: "https://placehold.co/300x300.png",
    description: "A professional-grade espresso machine for home use."
  },
  {
    id: 2,
    name: "Organic Coffee Beans",
    price: 24.5,
    stock: 50,
    category: "Groceries",
    image: "https://placehold.co/300x300.png",
    description: "1kg bag of single-origin organic coffee beans from Colombia."
  },
  {
    id: 3,
    name: "Modern Bookshelf",
    price: 149.0,
    stock: 10,
    category: "Furniture",
    image: "https://placehold.co/300x300.png",
    description: "A sleek and modern bookshelf with 5 shelves, made from oak wood."
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 199.99,
    stock: 30,
    category: "Electronics",
    image: "https://placehold.co/300x300.png",
    description: "Noise-cancelling over-ear wireless headphones with 40-hour battery life."
  },
  {
    id: 5,
    name: "Yoga Mat",
    price: 39.95,
    stock: 100,
    category: "Sports & Outdoors",
    image: "https://placehold.co/300x300.png",
    description: "Eco-friendly, non-slip yoga mat for all types of yoga and pilates."
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 249.00,
    stock: 25,
    category: "Electronics",
    image: "https://placehold.co/300x300.png",
    description: "A smartwatch with fitness tracking, heart rate monitor, and GPS."
  },
  {
    id: 7,
    name: "Leather Wallet",
    price: 75.00,
    stock: 40,
    category: "Accessories",
    image: "https://placehold.co/300x300.png",
    description: "A minimalist bifold wallet made from genuine leather."
  },
  {
    id: 8,
    name: "Blender",
    price: 89.99,
    stock: 20,
    category: "Appliances",
    image: "https://placehold.co/300x300.png",
    description: "A high-speed blender perfect for smoothies, soups, and sauces."
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "555-0101",
    avatar: "https://placehold.co/40x40.png"
  },
  {
    id: 2,
    name: "Bob Williams",
    email: "bob.w@example.com",
    phone: "555-0102",
    avatar: "https://placehold.co/40x40.png"
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    phone: "555-0103",
    avatar: "https://placehold.co/40x40.png"
  },
  {
    id: 4,
    name: "Diana Miller",
    email: "diana.m@example.com",
    phone: "555-0104",
    avatar: "https://placehold.co/40x40.png"
  },
];

export const mockTransactions: Transaction[] = [
    { id: 'TXN001', customerName: 'Alice Johnson', date: '2023-10-01', total: 125.50, items: 3 },
    { id: 'TXN002', customerName: 'Bob Williams', date: '2023-10-01', total: 88.00, items: 2 },
    { id: 'TXN003', customerName: 'Charlie Brown', date: '2023-10-02', total: 210.75, items: 5 },
    { id: 'TXN004', customerName: 'Alice Johnson', date: '2023-10-03', total: 45.00, items: 1 },
];

export const mockCustomerPurchaseHistory = {
    customerName: 'Alice Johnson',
    purchaseHistory: [
      {
        productName: 'Wireless Headphones',
        category: 'Electronics',
        purchaseDate: '2023-09-15',
        quantity: 1,
        price: 199.99,
      },
      {
        productName: 'Organic Coffee Beans',
        category: 'Groceries',
        purchaseDate: '2023-09-20',
        quantity: 2,
        price: 24.50,
      },
      {
        productName: 'Yoga Mat',
        category: 'Sports & Outdoors',
        purchaseDate: '2023-10-05',
        quantity: 1,
        price: 39.95,
      },
    ],
};
