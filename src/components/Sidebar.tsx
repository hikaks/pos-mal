import React from 'react';
import { useStore } from '../store/useStore';
import { 
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useStore();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      href: '/',
      roles: ['admin', 'cashier']
    },
    {
      name: 'Transaksi',
      icon: ShoppingCartIcon,
      href: '/transactions',
      roles: ['admin', 'cashier']
    },
    {
      name: 'Produk',
      icon: CubeIcon,
      href: '/products',
      roles: ['admin']
    },
    {
      name: 'Pelanggan',
      icon: UsersIcon,
      href: '/customers',
      roles: ['admin']
    },
    {
      name: 'Laporan',
      icon: ChartBarIcon,
      href: '/reports',
      roles: ['admin']
    },
    {
      name: 'Pengaturan',
      icon: CogIcon,
      href: '/settings',
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'cashier')
  );

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">POS System</h2>
            <p className="text-sm text-gray-500">Point of Sale</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Menu Utama
          </div>
          
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-5 w-5 mr-3 text-gray-400" />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || 'user'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 