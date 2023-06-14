
import { Link } from 'react-router-dom';
import logo from '../../img/logo.png';
import './HeaderSemLogin.css';



function HeaderSemLogin() {
    return (
        <header className='header-sem-login'>
            <div className='container-logo'>
                <Link to="/"><img className="logo" src={logo} /></Link>

            </div>
        </header>
    )
}

export default HeaderSemLogin