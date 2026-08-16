import { Fragment } from 'react';
// import { useNavigate } from "react-router-dom";
import * as myConst from '../main/constants';
// import { publicRoutes } from '../services/routes';
import { Foot } from './components/foot'
import HeadRibbon from './parts/ribbon'
// import messenger from "../services/messenger";
// import tool from '../services/tools';
import Desc from '../pages/description'

export default function Login() {
	
	return (
		<Fragment>
			<div id='elgrapper' className='wrapper overlay-sidebar'>
				<div className='main-header'>
					<div className='logo-header' data-background-color='blue2'>
						<a href={myConst.roots.app} className='logo tales'>
							<img
								src={myConst.essentials.logo}
								alt='navbar brand'
								className='navbar-brand'
							/>
						</a>
					</div>
					<nav className="navbar navbar-header d-none d-md-block" data-background-color="blue2">

					</nav>
				</div>

				<div className='main-panel'>
					<div className='content'>
						<HeadRibbon />
						<div className='page-inner'>
							<Desc />
						</div>
					</div>

					<Foot />
				</div>
			</div>
		</Fragment>
	);
}
