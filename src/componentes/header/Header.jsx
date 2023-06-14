import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { getItem, setItem } from '../../Services/LocalStorage';
import logo from '../../img/logo.png';
import styles from './Header.module.css';

function Header({ handleBusca }) {
  const usuario = getItem('usuario');
  const [conta, setConta] = useState(getItem('usuario') || []);

  const handleSair = () => {
    if (conta && conta.email) {
      setConta('');
      setItem("usuario"," ");
    }
  };
    return (
        <header className={styles.header}>
            <Link to="/"><img className={styles.imgHeader} src={logo}/></Link>
            <div className={styles.teste}>
                <input className={styles.inputbusca} type="text" placeholder='Buscar...' onChange={handleBusca} />
                <button className={styles.btnHeader}><SearchIcon className={styles.icon}/></button>
            </div>
            <nav >
                <button className={styles.btnHeader}><Link to="/login"><PersonIcon sx={{ fontSize: 35 }} className={styles.icon} /></Link></button>
                <button className={styles.btnHeader}><Link to="/carrinho"><ShoppingCartIcon sx={{ fontSize: 35 }} className={styles.icon} /></Link></button>
                <button className={styles.btnHeaderUsuario}>Olá, {usuario?.email || "Visitante"}</button>
                <button className={styles.btnHeader} onClick={handleSair}><Link to="/" className={styles.icon}>Sair</Link></button>                
              
        </nav>
        </header>
    )    
}

export default Header