import React, { createContext, useState, useContext, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string;
}

interface Sale {
  id: string;
  date: string;
  items: { productId: string; quantity: number }[];
  total: number;
}

interface DataContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedSales = localStorage.getItem('sales');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedSales) setSales(JSON.parse(storedSales));
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
    localStorage.setItem('products', JSON.stringify([...products, newProduct]));
  };

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { ...sale, id: Date.now().toString() };
    setSales([...sales, newSale]);
    localStorage.setItem('sales', JSON.stringify([...sales, newSale]));

    // Update product stock
    const updatedProducts = products.map(product => {
      const saleItem = sale.items.find(item => item.productId === product.id);
      if (saleItem) {
        return { ...product, stock: product.stock - saleItem.quantity };
      }
      return product;
    });
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <DataContext.Provider value={{ products, sales, addProduct, updateProduct, deleteProduct, addSale }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};