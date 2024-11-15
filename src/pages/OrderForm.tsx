import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderFormComponent from '../components/OrderForm';
import { useOrders } from '../context/OrderContext';
import { ArrowLeft } from 'lucide-react';

function OrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) {
      const existingOrder = getOrderById(id);
      if (existingOrder) {
        setOrder(existingOrder);
      }
    }
  }, [id, getOrderById]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Pedidos
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        {id ? 'Editar Pedido' : 'Novo Pedido'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <OrderFormComponent initialOrder={order} />
      </div>
    </div>
  );
}

export default OrderForm;