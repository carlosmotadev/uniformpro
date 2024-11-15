import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import { useOrders } from '../context/OrderContext';
import { UserPlus, Phone, Mail, MapPin, ClipboardList } from 'lucide-react';

function CustomerPage() {
  const { customers } = useCustomers();
  const { getOrdersByCustomerId } = useOrders();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Link
          to="/customers/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">
            Nenhum cliente cadastrado
          </p>
        ) : (
          customers.map((customer) => {
            const customerOrders = getOrdersByCustomerId(customer.id);
            return (
              <div
                key={customer.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {customer.name}
                    </h2>
                    <Link
                      to={`/customers/edit/${customer.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Editar
                    </Link>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{customer.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      <span>{customerOrders.length} pedidos</span>
                    </div>
                  </div>

                  {customer.notes && (
                    <p className="mt-4 text-sm text-gray-500">{customer.notes}</p>
                  )}

                  <div className="mt-6">
                    <Link
                      to="/orders/new"
                      state={{ customerId: customer.id }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Novo Pedido
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CustomerPage;