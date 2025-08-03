// Sample data untuk testing aplikasi POS

export const sampleProducts = [
  {
    id: 'PROD-1',
    name: 'Nasi Goreng',
    price: 15000,
    stock: 50,
    category: 'Makanan',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    barcode: '1234567890',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-2',
    name: 'Es Teh Manis',
    price: 5000,
    stock: 100,
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    barcode: '1234567891',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-3',
    name: 'Keripik Kentang',
    price: 8000,
    stock: 30,
    category: 'Snack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d8b?w=400',
    barcode: '1234567892',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-4',
    name: 'Smartphone Samsung',
    price: 2500000,
    stock: 5,
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    barcode: '1234567893',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-5',
    name: 'Kaos Polos',
    price: 75000,
    stock: 25,
    category: 'Pakaian',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    barcode: '1234567894',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-6',
    name: 'Buku Novel',
    price: 45000,
    stock: 15,
    category: 'Lainnya',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    barcode: '1234567895',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-7',
    name: 'Ayam Goreng',
    price: 12000,
    stock: 40,
    category: 'Makanan',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
    barcode: '1234567896',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'PROD-8',
    name: 'Kopi Hitam',
    price: 8000,
    stock: 60,
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    barcode: '1234567897',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const sampleCustomers = [
  {
    id: 'CUST-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '081234567890',
    address: 'Jl. Contoh No. 123, Jakarta',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'CUST-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '081234567891',
    address: 'Jl. Sample No. 456, Bandung',
    createdAt: new Date('2024-01-02')
  },
  {
    id: 'CUST-3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '081234567892',
    address: 'Jl. Test No. 789, Surabaya',
    createdAt: new Date('2024-01-03')
  },
  {
    id: 'CUST-4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '081234567893',
    address: 'Jl. Demo No. 321, Medan',
    createdAt: new Date('2024-01-04')
  }
];

export const sampleTransactions = [
  {
    id: 'TXN-1',
    items: [
      {
        product: sampleProducts[0],
        quantity: 2,
        discount: 0
      },
      {
        product: sampleProducts[1],
        quantity: 1,
        discount: 1000
      }
    ],
    total: 35000,
    tax: 3850,
    discount: 1000,
    grandTotal: 37850,
    paymentMethod: 'cash' as const,
    cashierId: '1',
    cashierName: 'Administrator',
    createdAt: new Date('2024-01-15 10:30:00')
  },
  {
    id: 'TXN-2',
    items: [
      {
        product: sampleProducts[2],
        quantity: 3,
        discount: 2000
      },
      {
        product: sampleProducts[7],
        quantity: 2,
        discount: 0
      }
    ],
    total: 40000,
    tax: 4400,
    discount: 2000,
    grandTotal: 42400,
    paymentMethod: 'card' as const,
    cashierId: '2',
    cashierName: 'Kasir',
    createdAt: new Date('2024-01-15 14:20:00')
  },
  {
    id: 'TXN-3',
    items: [
      {
        product: sampleProducts[4],
        quantity: 1,
        discount: 5000
      }
    ],
    total: 75000,
    tax: 8250,
    discount: 5000,
    grandTotal: 78250,
    paymentMethod: 'ewallet' as const,
    cashierId: '1',
    cashierName: 'Administrator',
    createdAt: new Date('2024-01-15 16:45:00')
  },
  {
    id: 'TXN-4',
    items: [
      {
        product: sampleProducts[6],
        quantity: 1,
        discount: 0
      },
      {
        product: sampleProducts[1],
        quantity: 2,
        discount: 1000
      },
      {
        product: sampleProducts[5],
        quantity: 1,
        discount: 0
      }
    ],
    total: 65000,
    tax: 7150,
    discount: 1000,
    grandTotal: 71150,
    paymentMethod: 'cash' as const,
    cashierId: '2',
    cashierName: 'Kasir',
    createdAt: new Date('2024-01-16 09:15:00')
  }
];

export const sampleUsers = [
  {
    id: '1',
    email: 'admin@pos.com',
    name: 'Administrator',
    role: 'admin' as const,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'cashier@pos.com',
    name: 'Kasir',
    role: 'cashier' as const,
    createdAt: new Date('2024-01-01')
  }
];

// Helper functions untuk testing
export const generateRandomTransaction = () => {
  const randomProducts = sampleProducts
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
  
  const items = randomProducts.map(product => ({
    product,
    quantity: Math.floor(Math.random() * 5) + 1,
    discount: Math.floor(Math.random() * 2000)
  }));
  
  const total = items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity) - item.discount, 0
  );
  
  const tax = total * 0.11;
  const discount = items.reduce((sum, item) => sum + item.discount, 0);
  const grandTotal = total + tax - discount;
  
  const paymentMethods = ['cash', 'card', 'ewallet'];
  const cashiers = ['Administrator', 'Kasir'];
  
  return {
    id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    items,
    total,
    tax,
    discount,
    grandTotal,
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)] as any,
    cashierId: Math.floor(Math.random() * 2) + 1,
    cashierName: cashiers[Math.floor(Math.random() * cashiers.length)],
    createdAt: new Date()
  };
};

export const generateRandomTransactions = (count: number) => {
  const transactions = [];
  for (let i = 0; i < count; i++) {
    transactions.push(generateRandomTransaction());
  }
  return transactions;
}; 