import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

const Reports: React.FC = () => {
  const { transactions, products } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Calculate reports based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      
      switch (selectedPeriod) {
        case 'today':
          return transactionDate >= today;
        case 'yesterday':
          return transactionDate >= yesterday && transactionDate < today;
        case 'week':
          return transactionDate >= thisWeek;
        case 'month':
          return transactionDate >= thisMonth;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate statistics
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.grandTotal, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  
  // Top selling products
  const productSales = new Map();
  filteredTransactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const productId = item.product.id;
      const currentSales = productSales.get(productId) || 0;
      productSales.set(productId, currentSales + item.quantity);
    });
  });

  const topProducts = Array.from(productSales.entries())
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        product,
        quantity,
        revenue: quantity * (product?.price || 0)
      };
    })
    .filter(item => item.product)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Payment method breakdown
  const paymentMethods = filteredTransactions.reduce((acc, transaction) => {
    const method = transaction.paymentMethod;
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const periods = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'all', label: 'Semua Waktu' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik</h1>
          <p className="text-gray-600">Analisis data penjualan dan performa</p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
              <p className="text-2xl font-semibold text-gray-900">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCartIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Transaksi</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Transaksi</p>
              <p className="text-2xl font-semibold text-gray-900">
                Rp {averageTransaction.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Terlaris</h3>
        {topProducts.length > 0 ? (
          <div className="space-y-3">
            {topProducts.map((item, index) => (
              <div key={item.product?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">{item.product?.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{item.quantity} terjual</p>
                  <p className="text-sm text-gray-500">
                    Rp {item.revenue.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Tidak ada data penjualan</p>
        )}
      </div>

      {/* Payment Methods */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h3>
        {Object.keys(paymentMethods).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(paymentMethods).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  <span className="font-medium text-gray-900 capitalize">{method}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{count} transaksi</p>
                  <p className="text-sm text-gray-500">
                    {((count / totalTransactions) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Tidak ada data pembayaran</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaksi Terbaru</h3>
        {filteredTransactions.length > 0 ? (
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
                {filteredTransactions.slice(0, 10).map((transaction) => (
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
          <p className="text-gray-500 text-center py-8">Tidak ada transaksi</p>
        )}
      </div>
    </div>
  );
};

export default Reports; 