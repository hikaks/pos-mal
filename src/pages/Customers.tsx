import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    const newCustomer = {
      id: `CUST-${Date.now()}`,
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      createdAt: new Date()
    };

    addCustomer(newCustomer);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditCustomer = () => {
    if (!editingCustomer) return;

    updateCustomer(editingCustomer.id, {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined
    });

    setEditingCustomer(null);
    resetForm();
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      deleteCustomer(customerId);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const openEditModal = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pelanggan</h1>
          <p className="text-gray-600">Kelola data pelanggan</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Pelanggan
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">
                  Bergabung {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {customer.email && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-16">Email:</span>
                  <span className="text-gray-900">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-16">Phone:</span>
                  <span className="text-gray-900">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-16">Alamat:</span>
                  <span className="text-gray-900">{customer.address}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openEditModal(customer)}
                className="btn-secondary flex-1"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className="btn-danger"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada pelanggan ditemukan</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingCustomer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Masukkan nama pelanggan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  placeholder="pelanggan@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  placeholder="081234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={editingCustomer ? handleEditCustomer : handleAddCustomer}
                className="btn-primary flex-1"
                disabled={!formData.name}
              >
                {editingCustomer ? 'Update Pelanggan' : 'Tambah Pelanggan'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCustomer(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers; 