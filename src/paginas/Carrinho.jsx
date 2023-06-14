import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from "../API/Api";
import { getItem, setItem } from "../Services/LocalStorage";
import HeaderSemLogin from "../componentes/header/HeaderSemLogin";
import Footer from "../componentes/footer/Footer";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import './carrinho.css';

export const Carrinho = () => {
  const [data, setData] = useState(getItem("carrinhoCompra") || []);
  const [total, setTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const usuario = getItem("usuario");
    setIsLoggedIn(!!usuario);
  }, []);

  useEffect(() => {
    const newData = data.map((item) => ({
      ...item,
      quantidadeCarrinho: 1,
    }));
    setData(newData);
  }, []);

  useEffect(() => {
    calcularTotal();
  }, [data]);

  const calcularTotal = () => {
    let soma = 0;
    data.forEach((item) => {
      soma += item.preco * item.quantidadeCarrinho;
    });
    setTotal(Number(soma.toFixed(2)));
  };

  const removeItem = (item) => {
    const arrFilter = data.filter((e) => e.id !== item.id);
    setData(arrFilter);
    setItem("carrinhoCompra", arrFilter);
  };

  const limpaCarrinho = () => {
    setItem("carrinhoCompra", []);
    setData([]);
  };

  const handleChangeQuantidade = (itemId, novaQuantidade) => {
    const newData = data.map((item) => {
      if (item.id === itemId) {
        let quantidade = novaQuantidade;
        if (novaQuantidade < 1) {
          quantidade = 1;
        } else if (novaQuantidade > item.quantidade) {
          quantidade = item.quantidade;
          alert(`A quantidade inserida foi ajustada para o máximo disponível em estoque: ${item.quantidade}.`);
        }
        return { ...item, quantidadeCarrinho: quantidade };
      }
      return item;
    });

    setData(newData);
    calcularTotal();
  };

  const handleCompra = async () => {
    const usuario = getItem("usuario");
    if (!isLoggedIn || usuario === " ") {
      alert("Faça o login ou cadastro para realizar a compra.");
      window.location.href = "/login";
      return;
    }

    const pedido = {
      itens: data.map((item) => ({
        usuario: usuario.email,
        idProduto: item.id,
        quantidade: item.quantidadeCarrinho,
      })),
      valorTotal: total,
    };

    try {
      const response = await api.post("/pedido", pedido);
      const pedidoId = response.data.id;
      alert(`Parabéns ${usuario.email} pelo seu pedido! O número do seu pedido é #${pedidoId}`);

      await Promise.all(
        data.map(async (item) => {
          const response = await api.get(`/produtos/${item.id}`);
          const produto = response.data;
          const estoqueAtualizado = produto.quantidade - item.quantidadeCarrinho;
          await api.put(`/produtos/${item.id}`, {
            ...produto,
            quantidade: estoqueAtualizado,
          });
        })
      );

      setData([]);
      setItem("carrinhoCompra", []);
      setTotal(0);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao realizar a compra.");
    }
  }

  return (
      <div>
        <HeaderSemLogin />
        <h1 className="title-carrinho">Meu Carrinho</h1>
        <br />
        <div className="container-carrinho">
          {data.map((item, index) => (
            <div key={item.id}>
              {index === 0 && ( // Verifica se é o primeiro item no carrinho
                <table className="item-table">
                  <tbody>
                    <tr>
                      <th>Produto</th>
                      <th>Nome</th>
                      <th>Marca</th>
                      <th>Preço </th>
                      <th>Qtd </th>
                      <th>Remover item</th>
                    </tr>
                  </tbody>
                </table>
              )}
              <table className="item-table1">
                <tbody>
                  <tr>
                    <td>
                      <img
                        className="img-carrinho"
                        width={200}
                        src={item.imagem}
                        alt={item.nome}
                      />
                    </td>
                    <td>{item.nome}</td>
                    <td>{item.marca}</td>
                    <td>R${item.preco}</td>
                    <td>
                      <input
                        className="input-qtd-carrinho"
                        type="number"
                        id={`qtd_${item.id}`}
                        label="Quantidade"
                        variant="outlined"
                        min="1"
                        max={item.quantidade}
                        defaultValue="1"
                        onKeyDown={(event) => {
                          const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
                          if (!arrowKeys.includes(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={(event) => {
                          let novaQuantidade = parseInt(event.target.value, 10);
                          if (novaQuantidade < 1 || isNaN(novaQuantidade)) {
                            novaQuantidade = 1;
                          } else if (novaQuantidade > item.quantidade) {
                            novaQuantidade = item.quantidade;
                            alert(`A quantidade inserida foi ajustada para o máximo disponível em estoque: ${item.quantidade}.`);
                          }
                          handleChangeQuantidade(item.id, novaQuantidade);
                        }}
                      />

                    </td>
                    <td>
                      <button onClick={() => removeItem(item)}>
                        <RemoveShoppingCartIcon />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </div>
          ))}
          {data.length > 0 && (
            <div>
              <h2 className="total">Total: R${total || 0}</h2>
              <div className="btns-carrinho">
                <button className="btn-comprar-carrinho" onClick={handleCompra}>
                  Comprar
                </button>
                <button
                  className="btn-limpar-carrinho"
                  onClick={() => limpaCarrinho()}
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          )}
          {data.length === 0 && ( // Verifica se o carrinho está vazio
            <div>
              <p>Seu carrinho está vazio D: </p>
              <br />
              <p>Navegue pela nossa <Link to="/"> loja </Link> e adicione produtos</p>
              {!isLoggedIn && <p>Faça o login para realizar a compra.</p>}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );

  }
