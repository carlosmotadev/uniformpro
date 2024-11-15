import React from 'react';
import { Link } from 'react-router-dom';
import OrderList from '../components/OrderList';
import { PlusCircle } from 'lucide-react';

function OrderPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <Link
          to="/orders/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Pedido
        </Link>
      </div>

      <OrderList />
    </div>
  );
}

export default OrderPage;