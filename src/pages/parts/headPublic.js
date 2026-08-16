import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as myConst from '../../main/constants';
import { publicRoutes } from '../../services/routes';
import { UserContext } from '../../services/context/UserContext';

export default function HeadPublic() {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);  	
    const laWidth = {"width":"100% !important"}

    return (
        <Fragment>
            <div className='main-header'>
                <div className='logo-header' data-background-color='blue2' style={laWidth}>
                    <Link to={publicRoutes.INDEX} className='logo'>
                        <img
                            src={myConst.essentials.logo}
                            alt='navbar brand'
                            className='navbar-brand'
                        />
                    </Link>
                </div>
                <nav
                    className='navbar navbar-header d-none d-md-block'
                    data-background-color='blue2'
                ></nav>                
                {
                    (waiting)?
                        <div className="progress">
                            <div className="progress-bar progress-bar-animated progress-bar-striped bg-warning" role="progressbar" style={{width: "40%"}} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                            <div className="progress-bar progress-bar-animated progress-bar-striped bg-primary" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            <div className="progress-bar progress-bar-animated progress-bar-striped bg-danger" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    : 
                        <div ></div> 
                }
            </div>
        </Fragment>
    );
};
