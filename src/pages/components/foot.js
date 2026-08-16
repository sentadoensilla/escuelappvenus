import { Link } from 'react-router-dom'
import { publicRoutes } from '../../services/routes';

export const Foot = () => {
	return (
        <footer className='footer'>
            <div className='container-fluid'>
                <nav className='pull-left'>
                    <ul className='nav'>
                        <li className='nav-item'>
                            <Link className='nav-link' to={publicRoutes.AGREE}>
                                Política de uso de datos
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to={publicRoutes.AGREE}>
                                Terminos de uso
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to={publicRoutes.AGREE}>
                                Ayudas
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className='copyright ml-auto'>
                    2022, Array S.A.S. 
                    <i className='fa fa-heart heart text-danger'></i> Original by 
                    <a href='https://www.themekita.com' target="_blank" rel="noreferrer">ThemeKita</a>
                </div>
            </div>
        </footer>
    );
};
