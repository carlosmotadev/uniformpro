import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shirt, Users, ClipboardList, Home } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shirt className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-semibold text-white">UniForm Pro</span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 ${isActive('/')}`}
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Link>
            
            <Link
              to="/customers"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 ${isActive('/customers')}`}
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </Link>
            
            <Link
              to="/orders"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 ${isActive('/orders')}`}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Pedidos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;