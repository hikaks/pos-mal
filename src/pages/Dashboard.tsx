import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import AIInsights from '../components/AIInsights';
import { 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { 
    products, 
    transactions, 
    customers,
    calculateCartTotals 
  } = useStore();

  useEffect(() => {
    calculateCartTotals();
  }, [calculateCartTotals]);

  // Calculate statistics
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  
  const today = new Date();
  const todayTransactions = transactions.filter(t => 
    new Date(t.createdAt).toDateString() === today.toDateString()
  );
  
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.grandTotal, 0);
  
  const lowStockProducts = products.filter(p => p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const stats = [
    {
      name: 'Total Pendapatan Hari Ini',
      value: `Rp ${todayRevenue.toLocaleString('id-ID')}`,
      change: '+12%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Transaksi Hari Ini',
      value: todayTransactions.length.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Total Produk',
      value: totalProducts.toString(),
      change: lowStockProducts.length > 0 ? `${lowStockProducts.length} stok rendah` : 'Semua aman',
      changeType: lowStockProducts.length > 0 ? 'negative' : 'positive',
      icon: CubeIcon,
    },
    {
      name: 'Total Pelanggan',
      value: totalCustomers.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: UsersIcon,
    },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas toko hari ini</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                                 <div className={`flex items-center text-sm ${
                   stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                 }`}>
                   {stat.change}
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Peringatan Stok</h3>
          <div className="space-y-3">
            {outOfStockProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CubeIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Produk Habis Stok
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {outOfStockProducts.map(product => (
                          <li key={product.id}>{product.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CubeIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Stok Menipis
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {lowStockProducts.map(product => (
                          <li key={product.id}>
                            {product.name} (Stok: {product.stock})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

             {/* AI Insights */}
       <AIInsights />

       {/* Recent Transactions */}
       <div className="card">
         <h3 className="text-lg font-medium text-gray-900 mb-4">Transaksi Terbaru</h3>
         {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kasir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.cashierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {transaction.grandTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {transaction.paymentMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Belum ada transaksi</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 