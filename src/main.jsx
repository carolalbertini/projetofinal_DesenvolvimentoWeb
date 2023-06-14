import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './componentes/login/login';
import Register from './componentes/register/Register';
import './index.css';
import { Carrinho } from './paginas/Carrinho';
import { Loja } from './paginas/loja';
import { DetalhesProduto } from './paginas/DetalhesProduto';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Loja />,
  },
  {
    path: '/carrinho',
    element: <Carrinho />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/produtos/:id',
    element: <DetalhesProduto />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
