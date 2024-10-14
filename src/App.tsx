import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import POS from './pages/POS';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SupplierManagement from './pages/SupplierManagement';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <LanguageProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/pos" element={<PrivateRoute><POS /></PrivateRoute>} />
                <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
                <Route path="/suppliers" element={<PrivateRoute><SupplierManagement /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><POS /></PrivateRoute>} />
              </Routes>
            </Router>
          </LanguageProvider>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;