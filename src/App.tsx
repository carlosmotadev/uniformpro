import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { CustomerProvider } from './context/CustomerContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import OrderPage from './pages/OrderPage';
import CustomerForm from './pages/CustomerForm';
import OrderForm from './pages/OrderForm';

function App() {
  return (
    <CustomerProvider>
      <OrderProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/customers/new" element={<CustomerForm />} />
                <Route path="/customers/edit/:id" element={<CustomerForm />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/orders/new" element={<OrderForm />} />
                <Route path="/orders/edit/:id" element={<OrderForm />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </OrderProvider>
    </CustomerProvider>
  );
}

export default App;