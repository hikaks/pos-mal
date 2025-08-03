import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Products: React.FC = () => {
  const { 
    products, 
    isLoadingProducts,
    error,
    loadProducts,
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    barcode: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Load products from Firebase on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = ['Makanan', 'Minuman', 'Snack', 'Elektronik', 'Pakaian', 'Lainnya'];
  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setSubmitMessage('❌ Semua field wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('🔄 Menyimpan produk ke Firebase...');

      const newProduct = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        barcode: formData.barcode || undefined,
        image: formData.image || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addProduct(newProduct);
      setSubmitMessage('✅ Produk berhasil ditambahkan ke Firebase!');
      
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
        setSubmitMessage('');
      }, 1500);
    } catch (error) {
      console.error('Error adding product:', error);
      setSubmitMessage('❌ Gagal menambahkan produk. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setSubmitMessage('❌ Semua field wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('🔄 Mengupdate produk di Firebase...');

      await updateProduct(editingProduct.id, {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        barcode: formData.barcode || undefined,
        image: formData.image || undefined,
        updatedAt: new Date()
      });

      setSubmitMessage('✅ Produk berhasil diupdate di Firebase!');
      
      setTimeout(() => {
        setEditingProduct(null);
        resetForm();
        setSubmitMessage('');
      }, 1500);
    } catch (error) {
      console.error('Error updating product:', error);
      setSubmitMessage('❌ Gagal mengupdate produk. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari Firebase?')) {
      try {
        setSubmitMessage('🔄 Menghapus produk dari Firebase...');
        
        await deleteProduct(productId);
        setSubmitMessage('✅ Produk berhasil dihapus dari Firebase!');
        
        setTimeout(() => {
          setSubmitMessage('');
        }, 1500);
      } catch (error) {
        console.error('Error deleting product:', error);
        setSubmitMessage('❌ Gagal menghapus produk. Silakan coba lagi.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      barcode: '',
      image: ''
    });
    setSubmitMessage('');
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      barcode: product.barcode || '',
      image: product.image || ''
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">Semua Kategori</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          submitMessage.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : submitMessage.includes('❌')
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-blue-50 border border-blue-200 text-blue-700'
        }`}>
          <p className="font-medium">{submitMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingProducts && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat produk dari Firebase...</p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoadingProducts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-lg font-bold text-primary-600">
                  Rp {product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Stok: {product.stock} | {product.category}
                </p>
                {product.barcode && (
                  <p className="text-xs text-gray-500">Barcode: {product.barcode}</p>
                )}
                <p className="text-xs text-gray-400">
                  ID: {product.id}
                </p>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-1"
                  disabled={isSubmitting}
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="btn-danger flex items-center justify-center gap-1"
                  disabled={isSubmitting}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingProducts && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tidak ada produk yang sesuai dengan filter'
              : 'Belum ada produk yang ditambahkan ke Firebase'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Tambah Produk Pertama
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="Masukkan nama produk"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="input-field"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="input-field"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field"
                  disabled={isSubmitting}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                  className="input-field"
                  placeholder="Masukkan barcode"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Gambar (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingProduct ? handleEditProduct : handleAddProduct}
                className="btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingProduct ? 'Updating...' : 'Adding...'}
                  </div>
                ) : (
                  editingProduct ? 'Update' : 'Tambah'
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="btn-secondary flex-1"
                disabled={isSubmitting}
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

export default Products; 