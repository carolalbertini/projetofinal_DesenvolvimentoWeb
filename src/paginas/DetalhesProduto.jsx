import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../API/Api";
import { getItem, setItem } from '../Services/LocalStorage';
import HeaderSemLogin from '../componentes/header/HeaderSemLogin';
import './detalhesProduto.css'
import Footer from '../componentes/footer/Footer';

export const DetalhesProduto = () => {
  const { id } = useParams();

  const [detalhesProduto, setDetalhesProduto] = useState(null);
  const [carrinho, setCarrinho] = useState(getItem('carrinhoCompra') || []);
  const [feedbacksPositivos, setFeedbacksPositivos] = useState(0);
  const [feedbacksNegativos, setFeedbacksNegativos] = useState(0);
  const [avaliado, setAvaliado] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {

      const response = await api.get(`/produtos/${id}`);
      console.log(response.data);
      setFeedbacksPositivos(response.data.feedbacksPositivos);
      setFeedbacksNegativos(response.data.feedbacksNegativos);
      setDetalhesProduto(response.data);
      setAvaliado(response.data.avaliado || false);
    };

    fetchProduto();
  }, [id]);

  if (!detalhesProduto) {
    return <div>Carregando...</div>;
  }

  const handleClickCarrinho = (produto) => {
    const item = carrinho.find((carrinhoItem) => carrinhoItem.id === produto.id);
    if (item) {
      const arrFilter = carrinho.filter((carrinhoItem) => carrinhoItem.id !== produto.id);
      setCarrinho(arrFilter);
      setItem("carrinhoCompra", arrFilter);
    } else {
      setCarrinho([...carrinho, produto]);
      setItem("carrinhoCompra", [...carrinho, produto]);
    }
  };

  const atualizarFeedbacksPositivos = async () => {

    const novoFeedbacksPositivos = avaliado
      ? detalhesProduto.feedbacksPositivos - 0
      : detalhesProduto.feedbacksPositivos + 1;
    const novoAvaliado = avaliado ? false : true;

    const produtoAtualizado = {
      ...detalhesProduto,
      feedbacksPositivos: novoFeedbacksPositivos,
      avaliado: novoAvaliado
    };

    const response = await api.put(`/produtos/${id}`, produtoAtualizado);
    setFeedbacksPositivos(novoFeedbacksPositivos);
    setAvaliado(novoAvaliado);

  };

  const atualizarFeedbacksNegativos = async () => {
    const novoFeedbacksNegativos = avaliado
      ? detalhesProduto.feedbacksNegativos - 0
      : detalhesProduto.feedbacksNegativos + 1;
    const novoAvaliado = avaliado ? false : true;

    const produtoAtualizado = {
      ...detalhesProduto,
      feedbacksNegativos: novoFeedbacksNegativos,
      avaliado: novoAvaliado
    };

    const response = await api.put(`/produtos/${id}`, produtoAtualizado);
    setFeedbacksNegativos(novoFeedbacksNegativos);
    setAvaliado(novoAvaliado);

  };

  return (
    <div>
      <HeaderSemLogin />
      <h1 className='nomeProduto'>{detalhesProduto.nome}</h1>
      <div className='imgPrincipal'>
        <img className="imgProduto_principal" src={detalhesProduto.imagem} alt={detalhesProduto.nome} />
        <div className='tresImg'>
          <img className="imgProduto_lateral" src={detalhesProduto.imagem} alt={detalhesProduto.nome} />
          <img className="imgProduto_lateral" src={detalhesProduto.imagem} alt={detalhesProduto.nome} />
          <img className="imgProduto_lateral" src={detalhesProduto.imagem} alt={detalhesProduto.nome} />
        </div>
      </div>

      <div className='descricao'>
        <p>Preço: R${detalhesProduto.preco}</p>
        <p>Quantidade: {detalhesProduto.quantidade}</p>
        <p>Descrição: {detalhesProduto.descrição}</p>
        <p>Marca: {detalhesProduto.marca}</p>
        <div className='divFeedback'>
          <div className='divPositivo'>
            <button className='feedbackPositivo' onClick={atualizarFeedbacksPositivos}>{avaliado ? <ThumbUpIcon sx={{ fontSize: 32 }}  /> : <ThumbUpIcon sx={{ fontSize: 32 }} />} </button>
            <span>{feedbacksPositivos}</span>
          </div>
          <div className='divNegativo'>
            <button className='feedbackNegativo' onClick={atualizarFeedbacksNegativos} >{avaliado ? <ThumbDownIcon sx={{ fontSize: 32 }} /> : <ThumbDownIcon sx={{ fontSize: 32 }} />} </button>
            <span>{feedbacksNegativos}</span>
          </div>
        </div>
        <p className="btn-comprar" onClick={() => handleClickCarrinho(detalhesProduto)}>
          {carrinho.some((item) => item.id === detalhesProduto.id) ? (
            <ShoppingCartIcon sx={{ fontSize:40 }}/>
          ) : (
            <AddShoppingCartIcon sx={{ fontSize:40 }}/>
          )}
        </p>
      </div>
      <Footer />
    </div>
  );
};

