import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { CheckCircle2, Clock, FileOutput, Edit2 } from 'lucide-react';

function OrderList() {
  const { orders, approveOrder } = useOrders();

  const handleApprove = (orderId: string) => {
    approveOrder(orderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Nenhum pedido registrado</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{order.customerName}</h3>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={`/orders/edit/${order.id}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Link>
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' ? (
                    <>
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-yellow-500">Pendente</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-500">Aprovado</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Email:</p>
                <p>{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-500">Telefone:</p>
                <p>{order.customerPhone}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Itens:</p>
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.description}</span>
                    <span>{item.quantity}x - {item.size}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-600">Cor: {item.color}</p>
                    <p className="font-medium">{formatCurrency(item.price)} un.</p>
                  </div>
                  {item.details && <p className="text-gray-600 mt-1">{item.details}</p>}
                  <p className="text-right text-gray-800 mt-1">
                    Subtotal: {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Valor Total:</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor de Entrada:</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(order.downPayment)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor Restante:</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.remainingAmount)}</p>
                </div>
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleApprove(order.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FileOutput className="h-4 w-4 mr-2" />
                  Gerar Ordem de Serviço
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OrderList;