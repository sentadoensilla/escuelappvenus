import { Fragment, useContext } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// import swal from 'sweetalert2';

// import * as myConst from '../../main/constants';
// import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { UserContext } from '../../services/context/UserContext';
// import { privateRoutes } from '../../services/routes';
import { Forbidden } from '../forbidden'
import { WidgetWhatsapp } from '../components/initWP';
import UserHead from '../components/head';
import { Foot } from '../components/foot'

export default function misWhatsapp(){

    const miUsuario =  tool.getUser()
	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}

    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    return (
        <div id='elgrapper' className="wrapper">
            <UserHead  waiting={waiting} setWaiting={setWaiting} />

            <div className="main-panel">
                <div className="content">
                    <div className="page-inner">
                        <div className="page-category">
                            <div className="page-inner mt--5">

                            </div>
                        </div>
                        
                        <div className="page-category">
                            <WidgetWhatsapp />
                        </div>

                    </div>

                </div>
            </div>
            <Foot />
        </div>
    );
}