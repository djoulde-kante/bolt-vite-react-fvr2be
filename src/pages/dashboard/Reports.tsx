import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const { sales, products } = useData();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getReportData = () => {
    const now = new Date();
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      switch (reportType) {
        case 'daily':
          return saleDate.toDateString() === now.toDateString();
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return saleDate >= weekAgo;
        case 'monthly':
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
    });

    const productSales: { [key: string]: number } = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          productSales[product.name] = (productSales[product.name] || 0) + item.quantity;
        }
      });
    });

    return Object.entries(productSales).map(([name, quantity]) => ({ name, quantity }));
  };

  const reportData = getReportData();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sales Reports</h2>
      <div className="mb-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Sales by Product
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((item) => (
              <tr key={item.name}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;