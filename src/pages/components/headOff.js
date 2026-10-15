import { Fragment } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import $ from 'jquery';

import * as myConst from '../../main/constants';
import tool from '../../services/tools';
import { publicRoutes } from '../../services/routes';
import AppIcon from './AppIcon';


function UserHeadOff() {

    const miUsuario = tool.getUser()
    const userDefaul = {
        picProfile: process.env.REACT_APP_PUBLIC_FOLDER+'/assets/img/profile.jpg',
        usuarioNombre: ' Usuario ',
        usuarioRollNombre: ' Tipo de usuario '
    }

    return (
        <Fragment>
            <div className="main-header">
                <div className="logo-header" data-background-color="blue2">
                    <a href={publicRoutes.LOGIN} className="logo">
                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                    </a>
                    <button className="navbar-toggler sidenav-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">
                            <AppIcon icon="tabler:menu-2" />
                        </span>
                    </button>
                    <button className="topbar-toggler more"><AppIcon icon="tabler:dots-vertical" /></button>
                    <div className="nav-toggle">
                        <button className="btn btn-toggle toggle-sidebar">
                            <AppIcon icon="tabler:menu-2" />
                        </button>
                    </div>
                </div>

                <nav className="navbar navbar-header navbar-expand-lg" data-background-color="blue2">
                    
                    <div className="container-fluid">
                        <div className="collapse" id="search-nav">
                            <form className="navbar-left navbar-form nav-search mr-md-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <button type="submit" className="btn btn-search pe-1">
                                            <AppIcon icon="la flaticon-search" className="search-icon" />
                                        </button>
                                    </div>
                                    <input type="text" placeholder="Buscar..." className="form-control" />
                                </div>
                            </form>
                        </div>
                        <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
                            <li className="nav-item toggle-nav-search hidden-caret">
                                <a className="nav-link" data-bs-toggle="collapse" href="#search-nav" role="button" aria-expanded="false" aria-controls="search-nav">
                                    <AppIcon icon="la flaticon-search" />
                                </a>
                            </li>
                            <li className="nav-item dropdown hidden-caret">

                            </li>
                        </ul>
                    </div>
                </nav>

            </div>

            <div className="sidebar sidebar-style-2">
                <div className="sidebar-wrapper scrollbar scrollbar-inner">
                    <div className="sidebar-content">
                    <div className="user">
                <div className="avatar-sm float-start me-2">
                    <img src={miUsuario.picProfile||userDefaul.picProfile} alt="..." className="avatar-img rounded-circle" />
                </div>
                <div className="info">
                    <a data-bs-toggle="collapse" href="#collapseUserInfo" aria-expanded="true">
                        <span>
                            { miUsuario.usuarioNombre||userDefaul.usuarioNombre }
                            <span className="user-level">{ miUsuario.usuarioRollNombre||userDefaul.usuarioRollNombre }</span>
                            <span className="caret"></span>
                        </span>
                    </a>
                    <div className="clearfix"></div>

                </div>
            </div>



                        <ul className="nav nav-primary">
                            <li className="nav-item active">
                                <Link to={publicRoutes.LOGIN} data-bs-toggle="collapse" className="collapsed" aria-expanded="false">
                                    <AppIcon icon="tabler:home" />
                                    <p>Inicio</p>
                                    <span className="caret"></span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default UserHeadOff;