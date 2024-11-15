import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useCustomers } from '../context/CustomerContext';
import { PlusCircle, Trash2, Search } from 'lucide-react';

interface ItemForm {
  description: string;
  quantity: number;
  size: string;
  color: string;
  details: string;
  price: number;
}

const initialItemForm: ItemForm = {
  description: '',
  quantity: 1,
  size: 'M',
  color: '',
  details: '',
  price: 0,
};

interface OrderFormProps {
  initialOrder?: any;
}

function OrderForm({ initialOrder }: OrderFormProps) {
  const navigate = useNavigate();
  const { addOrder, updateOrder } = useOrders();
  const { customers } = useCustomers();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<ItemForm[]>([{ ...initialItemForm }]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [downPayment, setDownPayment] = useState<number>(0);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialOrder) {
      setCustomerName(initialOrder.customerName);
      setCustomerEmail(initialOrder.customerEmail);
      setCustomerPhone(initialOrder.customerPhone);
      setItems(initialOrder.items);
      setDownPayment(initialOrder.downPayment);
    }
  }, [initialOrder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomerSearch = (value: string) => {
    setCustomerName(value);
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setShowSuggestions(true);
  };

  const selectCustomer = (customer: { name: string; email: string; phone: string }) => {
    setCustomerName(customer.name);
    setCustomerEmail(customer.email);
    setCustomerPhone(customer.phone);
    setShowSuggestions(false);
  };

  const handleAddItem = () => {
    setItems([...items, { ...initialItemForm }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ItemForm, value: string | number) => {
    const newItems = [...items];
    if (field === 'quantity') {
      const quantity = parseInt(value.toString(), 10);
      newItems[index] = { 
        ...newItems[index], 
        quantity: isNaN(quantity) ? 1 : Math.max(1, quantity) 
      };
    } else if (field === 'price') {
      const price = parseFloat(value.toString());
      newItems[index] = { 
        ...newItems[index], 
        price: isNaN(price) ? 0 : Math.max(0, price) 
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const calculateTotal = (items: ItemForm[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDownPayment(isNaN(value) ? 0 : Math.max(0, value));
  };

  const totalAmount = calculateTotal(items);
  const remainingAmount = Math.max(0, totalAmount - downPayment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      items,
      status: initialOrder?.status || 'pending' as const,
      total: totalAmount,
      downPayment,
      remainingAmount,
      createdAt: initialOrder?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (initialOrder) {
      updateOrder(initialOrder.id, orderData);
    } else {
      addOrder({
        id: Date.now().toString(),
        ...orderData,
      });
    }
    
    navigate('/orders');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
          <div className="relative">
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => handleCustomerSearch(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              placeholder="Digite para buscar cliente..."
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          {showSuggestions && filteredCustomers.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
            >
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectCustomer(customer)}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Itens do Pedido</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Adicionar Item
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  required
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity.toString()}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tamanho</label>
                  <select
                    value={item.size}
                    onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {['PP', 'P', 'M', 'G', 'GG', 'XG'].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cor</label>
                <input
                  type="text"
                  required
                  value={item.color}
                  onChange={(e) => handleItemChange(index, 'color', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor Unitário</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">R$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={item.price.toString()}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detalhes Adicionais</label>
              <textarea
                value={item.details}
                onChange={(e) => handleItemChange(index, 'details', e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                Subtotal: {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Total</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor de Entrada</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={downPayment}
                  onChange={handleDownPaymentChange}
                  className="block w-full rounded-md border-gray-300 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Restante</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {formatCurrency(remainingAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialOrder ? 'Salvar Alterações' : 'Criar Pedido'}
        </button>
      </div>
    </form>
  );
}

export default OrderForm;