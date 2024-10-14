import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash } from 'lucide-react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'cashier';
}

const UserManagement: React.FC = () => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', role: 'admin' },
    { id: '2', username: 'manager1', role: 'manager' },
    { id: '3', username: 'cashier1', role: 'cashier' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: '', role: 'cashier' as User['role'] });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      setUsers([...users, { id: Date.now().toString(), ...formData }]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '', role: 'cashier' });
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ username: user.username, role: user.role });
    setIsModalOpen(true);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  if (user?.role !== 'admin') {
    return <div>{intl.formatMessage({ id: 'userManagement.accessDenied' })}</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{intl.formatMessage({ id: 'userManagement.title' })}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
          >
            <Plus className="mr-2" /> {intl.formatMessage({ id: 'userManagement.addUser' })}
          </button>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'userManagement.username' })}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'userManagement.role' })}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{intl.formatMessage({ id: 'userManagement.actions' })}</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{intl.formatMessage({ id: `userManagement.role.${user.role}` })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash className="h-5 w-5" />
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
                    <label htmlFor="username" className="block text-sm font-medium mb-2">{intl.formatMessage({ id: 'userManagement.username' })}</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium mb-2">{intl.formatMessage({ id: 'userManagement.role' })}</label>
                    <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
                    >
                      <option value="admin">{intl.formatMessage({ id: 'userManagement.role.admin' })}</option>
                      <option value="manager">{intl.formatMessage({ id: 'userManagement.role.manager' })}</option>
                      <option value="cashier">{intl.formatMessage({ id: 'userManagement.role.cashier' })}</option>
                    </select>
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingUser ? intl.formatMessage({ id: 'userManagement.update' }) : intl.formatMessage({ id: 'userManagement.add' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingUser(null);
                      setFormData({ username: '', role: 'cashier' });
                    }}
                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                  >
                    {intl.formatMessage({ id: 'userManagement.cancel' })}
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

export default UserManagement;