import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer } from './CustomerContext';

interface Item {
  description: string;
  quantity: number;
  size: string;
  color: string;
  details: string;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: Customer;
  items: Item[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
  total: number;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByCustomerId: (customerId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (id: string, updatedData: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, ...updatedData, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const getOrdersByCustomerId = (customerId: string) => {
    return orders.filter((order) => order.customerId === customerId);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrder, 
      getOrderById,
      getOrdersByCustomerId 
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}