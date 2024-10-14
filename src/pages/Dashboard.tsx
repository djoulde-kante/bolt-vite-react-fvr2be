import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntl } from 'react-intl';
import { ShoppingCart, Package, DollarSign, BarChart2, PieChart, Settings, LogOut, Users, Truck, Sun, Moon } from 'lucide-react';
import Overview from './dashboard/Overview';
import Products from './dashboard/Products';
import Sales from './dashboard/Sales';
import Reports from './dashboard/Reports';
import Finances from './dashboard/Finances';
import DashboardSettings from './dashboard/Settings';
import UserManagement from './UserManagement';
import SupplierManagement from './SupplierManagement';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const intl = useIntl();

  const navItems = [
    { name: intl.formatMessage({ id: 'dashboard.overview' }), path: '/dashboard', icon: BarChart2 },
    { name: intl.formatMessage({ id: 'dashboard.products' }), path: '/dashboard/products', icon: Package },
    { name: intl.formatMessage({ id: 'dashboard.sales' }), path: '/dashboard/sales', icon: DollarSign },
    { name: intl.formatMessage({ id: 'dashboard.reports' }), path: '/dashboard/reports', icon: PieChart },
    { name: intl.formatMessage({ id: 'dashboard.finances' }), path: '/dashboard/finances', icon: BarChart2 },
    { name: intl.formatMessage({ id: 'dashboard.settings' }), path: '/dashboard/settings', icon: Settings },
    { name: intl.formatMessage({ id: 'dashboard.users' }), path: '/users', icon: Users },
    { name: intl.formatMessage({ id: 'dashboard.suppliers' }), path: '/suppliers', icon: Truck },
  ];

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <aside className={`w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 text-green-600">
            <ShoppingCart className="h-8 w-8" />
            <span className="text-2xl font-bold">GroceryStore</span>
          </Link>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link
                to="/pos"
                className={`flex items-center space-x-2 py-2 px-4 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-green-100'}`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{intl.formatMessage({ id: 'dashboard.pos' })}</span>
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 py-2 px-4 ${
                    location.pathname === item.path
                      ? 'bg-green-500 text-white'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-green-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={logout}
            className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}
          >
            <LogOut className="h-5 w-5" />
            <span>{intl.formatMessage({ id: 'dashboard.logout' })}</span>
          </button>
        </div>
      </aside>
      <main className={`flex-1 overflow-x-hidden overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-3xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              {intl.formatMessage({ id: 'dashboard.title' })}
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-opacity-80`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/settings" element={<DashboardSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;