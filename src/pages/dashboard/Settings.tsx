import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('My Grocery Store');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save these settings to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
            <input
              type="number"
              id="taxRate"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
};

export default Settings;