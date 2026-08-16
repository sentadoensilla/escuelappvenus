import { Fragment, useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import tool from '../../services/tools';
import { publicRoutes } from '../../services/routes';

import UserCard from './userCard';

function UserHead(props) {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);    
    const navegar = useNavigate()
    const miUsuario = tool.getUser()
    const preUri = window.location.pathname.split('/')
    const miUri = preUri[1]
    const menuInicio = 'dashboard'
    const elHtml = document.getElementsByTagName('html')
    const elGraper = document.getElementById('elgrapper')
    /*     
        const userDefaul = {
            picProfile: process.env.REACT_APP_PUBLIC_FOLDER+'/assets/img/profile.jpg'
        } 
    */
    // const colorProfile = (tool.decriptar(miUsuario.usuarioRollId)==="2")? 'warning' : 'danger'
    const elMenu = tool.getNav()
    // eslint-disable-next-line
	const [miMenu, setMiMenu] = useState(elMenu)
    const multiplicador = 5 

    const toggleMenu = (e) =>{
        // WHEN USE SMARTPHONES
        if(elHtml[0].classList.contains('nav_open')){
            elHtml[0].classList.remove('nav_open')
            elGraper.classList.remove('sidebar_minimize')
        }else{
            elHtml[0].classList.add('nav_open')
            elGraper.classList.add('sidebar_minimize')
        }
    }

    // REMOVE LOCALSTORAGE AND REDIRECT TO LOGIN
    const LogOut = () =>{
        tool.outUser()
        closeMenu()
        navegar(publicRoutes.INDEX)
    }

    const closeMenu = () =>{
        elHtml[0].classList.remove('nav_open')
        elGraper.classList.remove('sidebar_minimize')
    }

     
/*     useEffect(() => {
        if (document.readyState === 'complete') {
            closeMenu()
        }
    }, []); 
 */
    // CENTINELA FOR NO AUTH USERS
    if(!miUsuario.isLogged){
        navegar(publicRoutes.INDEX , { replace: true })
    }

    return (
        <Fragment>
            <div className="main-header">
                <div className="logo-header" data-background-color="blue">
                    <NavLink to={miUsuario.usuarioIndex} className="logo">
                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                    </NavLink>
                    <button className="navbar-toggler sidenav-toggler ml-auto"
                        onClick={toggleMenu}
                        type="button" 
                        data-toggle="collapse" 
                        data-target="collapse" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">
                            <i className="icon-menu"></i>
                        </span>
                    </button>
                    <button className="topbar-toggler more"><i className="icon-options-vertical"></i></button>
                    <div className="nav-toggle"> {
                        (waiting)?
                            <button className="btn btn-toggle toggle-sidebar custom-toggle">
                                <i className="flaticon-settings"></i>
                            </button>
                        : 
                            <button 
                                onClick={toggleMenu}
                                className="btn btn-toggle toggle-sidebar">
                                <i className="icon-menu"></i>
                            </button>
                    }
                    </div>
                </div>

                <nav className="navbar navbar-header navbar-expand-lg"
                style={{"padding":"0"}} 
                data-background-color="blue2">
                    
                    <div className="container-fluid">
                        <div className="collapse" id="search-nav">
                            <div className="input-group">
                                <span className='text-white'>{ miUsuario.usuarioInstitucionNombre }</span>
                            </div>
                        </div>
                    </div>
                    
                </nav>
                {
                    (waiting)?
                        <div className="progress">
                            <div className="progress-bar progress-bar-animated progress-bar-striped bg-warning" role="progressbar" style={{width: "90%"}} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    : 
                        <div ></div> 
                }
            </div>

            <div className="sidebar sidebar-style-2">
                <div className="sidebar-wrapper scrollbar scrollbar-inner">
                    <div className="sidebar-content">
                        <UserCard />
                        <ul className="nav nav-primary">
                            <li className={(miUri.includes(menuInicio))? "nav-item active" : "nav-item"}>
                                <NavLink to={miUsuario.usuarioIndex} data-toggle="collapse" className="collapsed" aria-expanded="false">
                                    <i className="fas fa-home"></i>
                                    <p>Inicio</p>
                                    <span className="caret"></span>
                                </NavLink>
                            </li>
                            { 
                                miMenu.map( (item,i) => {
                                    return (
                                    <li key={i} className={(item.opciones.some(e => e.enlace.includes(miUri)))? "nav-item active" : "nav-item"}>
                                        <NavLink data-toggle="collapse"  data-target={"#menu"+multiplicador+item.aemenu_id}>
                                            <i className={item.aemenu_icono}></i>
                                            <p>{item.aemenu_nombre}</p>
                                            <span className="caret"></span>
                                        </NavLink>
                                        <div className={(item.opciones.some(e => e.enlace.includes(miUri)))? "collapse show" : "collapse"} id={"menu"+multiplicador+item.aemenu_id}>
                                            <ul className={(item.opciones.some(e => e.enlace.includes(miUri)))? "nav nav-show" : "nav nav-collapse"}>
                                            {
                                                item.opciones.map((opcion,o) => {
                                                    return (
                                                        <li key={o} className={(opcion.enlace.includes(miUri))? "active text-danger" : ""}>
                                                            <NavLink to={opcion.enlace}>
                                                                <i className={(opcion.enlace.includes(miUri))? item.opciones[o].icono+" active text-danger" : item.opciones[o].icono+""}></i>
                                                                <span className="sub-item">{item.opciones[o].opcion}</span>
                                                            </NavLink>
                                                        </li>
                                                    );
                                                })
                                            }
                                            </ul>
                                        </div>
                                    </li>);
                                })
                            }
                            <li onClick={LogOut} className="nav-item danger" role="button">
                                <a>
                                    <i className="text-white fas fa-power-off"></i>
                                    <p className="text-center text-white">{ myConst.labels.logOut[0] }</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default UserHead;