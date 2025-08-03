import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PrinterIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const Transaction: React.FC = () => {
  const {
    products,
    cart,
    cartTotal,
    cartTax,
    cartDiscount,
    cartGrandTotal,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    updateCartItemDiscount,
    clearCart,
    calculateCartTotals,
    addTransaction,
    user
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'ewallet'>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    calculateCartTotals();
  }, [cart, calculateCartTotals]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  const handleDiscountChange = (productId: string, discount: number) => {
    updateCartItemDiscount(productId, discount);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const transaction = {
      id: `TXN-${Date.now()}`,
      items: cart,
      total: cartTotal,
      tax: cartTax,
      discount: cartDiscount,
      grandTotal: cartGrandTotal,
      paymentMethod: selectedPaymentMethod,
      cashierId: user?.id || '',
      cashierName: user?.name || '',
      createdAt: new Date()
    };

    addTransaction(transaction);
    clearCart();
    setShowReceipt(true);
    
    // Auto-hide receipt after 5 seconds
    setTimeout(() => setShowReceipt(false), 5000);
  };

  const change = cashReceived - cartGrandTotal;

  return (
    <div className="h-screen flex">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Transaksi Baru</h1>
            <button
              onClick={clearCart}
              className="btn-secondary"
              disabled={cart.length === 0}
            >
              Kosongkan Keranjang
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`card cursor-pointer transition-all ${
                  product.stock === 0 ? 'opacity-50' : 'hover:shadow-lg'
                }`}
                onClick={() => handleAddToCart(product)}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                <p className="text-lg font-bold text-primary-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className={`text-sm ${product.stock > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  Stok: {product.stock}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Keranjang Belanja</h2>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Keranjang kosong</p>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">
                        Rp {item.product.price.toLocaleString('id-ID')} x {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-danger-600 hover:text-danger-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-gray-500">Diskon:</label>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleDiscountChange(item.product.id, Number(e.target.value))}
                      className="w-20 text-xs border border-gray-300 rounded px-2 py-1"
                      min="0"
                      max={item.product.price * item.quantity}
                    />
                  </div>
                  
                  <div className="text-right mt-2">
                    <p className="text-sm font-medium text-gray-900">
                      Rp {((item.product.price * item.quantity) - item.discount).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="flex-1 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Metode Pembayaran</h3>
            <div className="space-y-2">
              {[
                { id: 'cash', label: 'Tunai', icon: BanknotesIcon },
                { id: 'card', label: 'Kartu', icon: CreditCardIcon },
                { id: 'ewallet', label: 'E-Wallet', icon: DevicePhoneMobileIcon }
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id as any)}
                    className={`w-full flex items-center p-3 border rounded-lg transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPaymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uang Diterima
              </label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(Number(e.target.value))}
                className="input-field"
                placeholder="0"
              />
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pajak (11%):</span>
              <span className="font-medium">Rp {cartTax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Diskon:</span>
              <span className="font-medium text-success-600">
                -Rp {cartDiscount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>Rp {cartGrandTotal.toLocaleString('id-ID')}</span>
            </div>
            
            {selectedPaymentMethod === 'cash' && cashReceived > 0 && (
              <div className="flex justify-between text-lg font-bold text-success-600">
                <span>Kembalian:</span>
                <span>Rp {change.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || (selectedPaymentMethod === 'cash' && cashReceived < cartGrandTotal)}
            className="btn-primary w-full py-3"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Cetak Struk & Selesai
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Struk Pembayaran</h3>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>Rp {((item.product.price * item.quantity) - item.discount).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pajak:</span>
                <span>Rp {cartTax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold">Rp {cartGrandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Terima kasih telah berbelanja!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction; 