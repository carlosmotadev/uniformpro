import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ClipboardList, TrendingUp, Clock } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCustomers } from '../context/CustomerContext';

function HomePage() {
  const { orders } = useOrders();
  const { customers } = useCustomers();

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const inProgressOrders = orders.filter(order => order.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Gestão de Uniformes</h1>
        <p className="mt-4 text-xl text-gray-600">Gerencie seus pedidos e clientes em um só lugar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-3xl font-semibold text-gray-900">{customers.length}</p>
            </div>
            <Users className="h-12 w-12 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
              <p className="text-3xl font-semibold text-gray-900">{orders.length}</p>
            </div>
            <ClipboardList className="h-12 w-12 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
              <p className="text-3xl font-semibold text-gray-900">{pendingOrders}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Produção</p>
              <p className="text-3xl font-semibold text-gray-900">{inProgressOrders}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/customers/new"
          className="block p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all"
        >
          <h2 className="text-xl font-semibold text-white">Novo Cliente</h2>
          <p className="mt-2 text-indigo-100">Cadastre um novo cliente no sistema</p>
        </Link>

        <Link
          to="/orders/new"
          className="block p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all"
        >
          <h2 className="text-xl font-semibold text-white">Novo Pedido</h2>
          <p className="mt-2 text-green-100">Registre um novo pedido para um cliente</p>
        </Link>
      </div>

      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Pedidos</h2>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                to={`/orders/edit/${order.id}`}
                className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      Pedido #{order.id.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'completed' ? 'Concluído' :
                     order.status === 'in_progress' ? 'Em Produção' :
                     order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;