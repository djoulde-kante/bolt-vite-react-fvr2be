import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Finances: React.FC = () => {
  const { sales } = useData();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const getFinancialData = () => {
    const now = new Date();
    const periodStart = new Date(now);

    switch (period) {
      case 'weekly':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        periodStart.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredSales = sales.filter(sale => new Date(sale.date) >= periodStart);

    const groupedData: { [key: string]: number } = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.date);
      let key: string;
      switch (period) {
        case 'weekly':
          key = date.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
      }
      groupedData[key] = (groupedData[key] || 0) + sale.total;
    });

    return Object.entries(groupedData).map(([date, total]) => ({ date, total }));
  };

  const financialData = getFinancialData();

  const totalRevenue = financialData.reduce((sum, item) => sum + item.total, 0);
  const averageRevenue = totalRevenue / financialData.length || 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
      <div className="mb-4">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">${averageRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#4CAF50" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Details</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {financialData.map((item) => (
              <tr key={item.date}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finances;