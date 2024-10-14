import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Search } from 'lucide-react';

const Sales: React.FC = () => {
  const { sales, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(sale =>
    sale.items.some(item => {
      const product = products.find(p => p.id === item.productId);
      return product && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sales History</h2>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sales..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sale.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul>
                    {sale.items.map((item, index) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <li key={index}>
                          {product ? `${product.name} x ${item.quantity}` : 'Unknown Product'}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${sale.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;