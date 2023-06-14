import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSemLogin from '../header/HeaderSemLogin';
import Footer from '../footer/Footer';
import './login.css';
import api from '../../API/Api';


export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const realizarLogin = async (e) => {
    e.preventDefault();

    const response = await api.get('/usuarios');
      const usuarios = response.data;

     
      const usuarioExistente = usuarios.find(
        (usuario) => usuario.email === email && usuario.senha === senha
      );

      if (usuarioExistente) {
        
        alert('Login realizado com sucesso');
        navigate('/');
        
        setItem('usuario', { email, senha });

        navigate('/');
      } else  {
         alert('Usuário não cadastrado ou Credenciais Inválidas');
        navigate('/register');
      }
    } 

    return (
      <>
        <HeaderSemLogin />
        <div className='login'>
          <div className='container_geral'>
            <div className='container_login'>
              <h1 className="titulo">
                Log In
              </h1>
              <form className="form" onSubmit={realizarLogin}>

                <div className="campo">
                  <label className='labels' htmlFor="email">Endereço de e-mail</label>
                  <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="campo">
                  <label className='labels' htmlFor="password">Password</label>
                  <input type="password" name="password" id="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>
                <div className='botao'>
                  <button className='btn_login' type="submit">Log In</button>
                </div>
              </form>
              <div className='registro-div'>
                  <span className='mensagem'>Ainda não tem conta? <Link to="/register">Registre-se</Link></span>
              </div>
          </div>
          </div>
          </div>
  
        <Footer />
      </>
    );
  };
  
  export default Login;
  
