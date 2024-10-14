import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntl } from 'react-intl';
import { ShoppingCart, BarChart, Search, CreditCard, Printer, Sun, Moon } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const POS: React.FC = () => {
  const { products, addSale } = useData();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const intl = useIntl();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity > 0) {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    } else {
      removeFromCart(productId);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert(intl.formatMessage({ id: 'pos.emptyCart' }));
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    addSale({
      date: new Date().toISOString(),
      items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
      total,
      paymentMethod
    });
    alert(intl.formatMessage({ id: 'pos.saleCompleted' }));
    setCart([]);
  };

  const printReceipt = () => {
    const receiptContent = `
      ${intl.formatMessage({ id: 'pos.receiptTitle' })}
      ---------------------
      ${cart.map(item => `${item.name} x${item.quantity}: ${intl.formatNumber(item.price * item.quantity, { style: 'currency', currency: 'USD' })}`).join('\n')}
      ---------------------
      ${intl.formatMessage({ id: 'pos.total' })}: ${intl.formatNumber(cart.reduce((sum, item) => sum + item.price * item.quantity, 0), { style: 'currency', currency: 'USD' })}
    `;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<pre>' + receiptContent + '</pre>');
    printWindow?.document.close();
    printWindow?.print();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{intl.formatMessage({ id: 'pos.title' })}</h1>
          <div className="flex items-center space-x-4">
            <span>{intl.formatMessage({ id: 'pos.welcome' }, { username: user?.username })}</span>
            <Link to="/dashboard" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
              <BarChart className="mr-2" />
              {intl.formatMessage({ id: 'pos.dashboard' })}
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6 mb-6`}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: 'pos.searchOrScan' })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
                  }`}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`${
                      theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-md'
                    } border rounded-lg p-4 text-center transition-shadow duration-200`}
                  >
                    <div className="font-bold">{product.name}</div>
                    <div>{intl.formatNumber(product.price, { style: 'currency', currency: 'USD' })}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6`}>
              <h2 className="text-xl font-bold mb-4">{intl.formatMessage({ id: 'pos.shoppingCart' })}</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">{intl.formatMessage({ id: 'pos.emptyCart' })}</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.productId} className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <div>
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-l">-</button>
                        <span className="px-2">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-r">+</button>
                        <span className="ml-2">{intl.formatNumber(item.price * item.quantity, { style: 'currency', currency: 'USD' })}</span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center font-bold">
                      <span>{intl.formatMessage({ id: 'pos.total' })}:</span>
                      <span>{intl.formatNumber(cart.reduce((sum, item) => sum + item.price * item.quantity, 0), { style: 'currency', currency: 'USD' })}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
                      {intl.formatMessage({ id: 'pos.paymentMethod' })}
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
                      }`}
                    >
                      <option value="cash">{intl.formatMessage({ id: 'pos.cash' })}</option>
                      <option value="orangeMoney">{intl.formatMessage({ id: 'pos.orangeMoney' })}</option>
                      <option value="momo">{intl.formatMessage({ id: 'pos.momo' })}</option>
                      <option value="merchantCode">{intl.formatMessage({ id: 'pos.merchantCode' })}</option>
                    </select>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button onClick={handleCheckout} className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                      <CreditCard className="inline-block mr-2" />
                      {intl.formatMessage({ id: 'pos.checkout' })}
                    </button>
                    <button onClick={printReceipt} className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                      <Printer className="inline-block mr-2" />
                      {intl.formatMessage({ id: 'pos.print' })}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default POS;