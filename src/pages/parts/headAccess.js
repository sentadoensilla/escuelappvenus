import { Fragment } from 'react';
import { UserContext } from '../../App';

export default function HeadPublic() {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);  
    return (
        <Fragment>
            <div className='main-header'>
                <div className='logo-header' data-background-color='blue2'>
                    <a href='index.html' className='logo'>
                        <img
                            src={process.env.REACT_APP_BASE_URL+'/assets/img/logoblanco.png'}
                            alt='navbar brand HERE'
                            className='navbar-brand'
                        />
                    </a>
                </div>

                <nav
                    className='navbar navbar-header navbar-expand-lg'
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
