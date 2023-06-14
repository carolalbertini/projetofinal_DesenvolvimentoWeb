import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSemLogin from '../header/HeaderSemLogin';
import Footer from '../footer/Footer';
import './Register.css';
import api from '../../API/Api';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {

    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao buscar os usuários');
      }
    };

    fetchUsuarios();
  }, []);

  const salvarUsuario = async (e) => {
    e.preventDefault();


    const usuarioExistente = usuarios.find((u) => u.email === email);
    if (usuarioExistente) {
      alert('Usuário já cadastrado');
      return;
    }


    if (senha !== confirmarSenha) {
      alert('A senha e a confirmação de senha não correspondem');
      return;
    }

    try {

      const novoUsuario = {
        email: email,
        senha: senha,
        id: usuarios.length + 1,
      };

      await api.post('/usuarios', novoUsuario);

      alert('Usuário cadastrado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao cadastrar o usuário');
    }
  };

  return (
    <>
      <HeaderSemLogin />
      <div className="register">
        <div className="container_registro">
          <h1 className="titulo-register">Register</h1>
          <form className="form" onSubmit={salvarUsuario}>
            <div className="campo-register">
              <label className="label-register" htmlFor="email">
                Endereço de e-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="campo-register">
              <label className="label-register" htmlFor="password">
                Senha
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="campo-register">
              <label className="label-register" htmlFor="confirmPassword">
                Confirmar senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
            <div className="botao-register">
              <button className="btn_register" type="submit">
                Registrar
              </button>
            </div>
            <div className='login-div'>
              <span className='mensagem'>Já tem conta? <Link to="/login">Faça login!</Link></span>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
