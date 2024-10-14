import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit, Trash, ShoppingCart } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
}

const SupplierManagement: React.FC = () => {
  const intl = useIntl();
  const { theme } = useTheme();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'Supplier A', contact: '+1234567890', email: 'supplierA@example.com' },
    { id: '2', name: 'Supplier B', contact: '+0987654321', email: 'supplierB@example.com' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({ name: '', contact: '', email: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...formData } : s));
    } else {
      setSuppliers([...suppliers, { id: Date.now().toString(), ...formData }]);
    }
    setIsModalOpen(false);
    setEditingSupplier(null);
    setFormData({ name: '', contact: '', email: '' });
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({ name: supplier.name, contact: supplier.contact, email: supplier.email });
    setIsModalOpen(true);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{intl.formatMessage({ id: 'supplierManagement.title' })}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
          >
            <Plus className="mr-2" /> {intl.formatMessage({ id: 'supplierManagement.addSupplier' })}
          </button>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${theme === 'dark' ?'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'supplierManagement.name' })}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'supplierManagement.contact' })}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'supplierManagement.email' })}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'supplierManagement.actions' })}</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(supplier)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteSupplier(supplier.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-2"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {/* TODO: Implement order placement */}}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`inline-block align-bottom ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">{intl.formatMessage({ id: 'supplierManagement.name' })}</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contact" className="block text-sm font-medium mb-2">{intl.formatMessage({ id: 'supplierManagement.contact' })}</label>
                    <input
                      type="text"
                      name="contact"
                      id="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">{intl.formatMessage({ id: 'supplierManagement.email' })}</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
                      required
                    />
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingSupplier ? intl.formatMessage({ id: 'supplierManagement.update' }) : intl.formatMessage({ id: 'supplierManagement.add' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSupplier(null);
                      setFormData({ name: '', contact: '', email: '' });
                    }}
                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                  >
                    {intl.formatMessage({ id: 'supplierManagement.cancel' })}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;