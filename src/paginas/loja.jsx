import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from "react";
import api from '../API/Api';
import { getItem, setItem } from '../Services/LocalStorage';
import Footer from '../componentes/footer/Footer';
import Header from '../componentes/header/Header';
import './loja.css';
import { Link } from 'react-router-dom';

export const Loja = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState(getItem('carrinhoCompra') || []);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProdutos();
  }, []);

  const handleClickCarrinho = (e) => {
    const item = carrinho.find((carrinho) => carrinho.id === e.id);
    if (item) {
      const arrFilter = carrinho.filter((carrinho) => carrinho.id !== e.id);
      setCarrinho(arrFilter);
      setItem('carrinhoCompra', arrFilter)
    } else {
      setCarrinho([...carrinho, e]);
      setItem('carrinhoCompra', [...carrinho, e])
    }
  };

  const handleBusca = (event) => {
    setBusca(event.target.value);
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome && produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <Header handleBusca={handleBusca} />
      <Grid container>
        {produtosFiltrados.map((produto) => (
          <Grid item key={produto.id}>
            <div>
              {produto.quantidade > 0
                &&
                <div className='container'>
                  <img className='imgProduto' src={produto.imagem} alt={produto.nome} />
                  <div className='card'>
                    <p className='nome'>{produto.nome}</p>
                  </div>
                  <p>Preço: R$ {produto.preco}</p>
                  <p>Marca: {produto.marca}</p>
                  <p>Quantidade em Estoque: {produto.quantidade}</p>
                  <p>Feedbacks positivos: {produto.feedbacksPositivos}</p>
                  <p>Feedbacks negativos: {produto.feedbacksNegativos}</p>
                  <span className='verDetalhe'>
                    <Link to={`/produtos/${produto.id}`}>Ver detalhes</Link>
                  </span>
                  <p className='btn-comprar' onClick={() => handleClickCarrinho(produto)}>
                    {carrinho.some((item) => item.id === produto.id) ? (
                      <ShoppingCartIcon />
                    ) : (
                      <AddShoppingCartIcon />
                    )}
                    COMPRAR
                  </p>
                </div>
              }
            </div>
          </Grid>
        ))}
      </Grid>
      <Footer />
    </div>
  );
}