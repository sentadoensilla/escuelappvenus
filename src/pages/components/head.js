import { Fragment, useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import tool from '../../services/tools';
import { publicRoutes } from '../../services/routes';

import UserCard from './userCard';
import AppIcon from './AppIcon';

// Dashboard de inicio por rol (logic.tabroll): 0 admin, 1 estudiante, 2 docente,
// 3 institución, 4 acudiente, 5 demo, 6 coordinador, 7 secretaría.
const DASHBOARD_BY_ROL = {
    0: '/academic', 3: '/academic', 6: '/academic', 7: '/academic',
    1: '/dashstudent', 4: '/dashstudent',
    2: '/dashteacher',
    5: '/dashboardadmon',
};
// Icono (Tabler) representativo del rol, para el navbar superior.
const ICONO_BY_ROL = {
    0: 'tabler:user-shield', 1: 'tabler:backpack', 2: 'tabler:chalkboard', 3: 'tabler:building',
    4: 'tabler:user-heart', 5: 'tabler:user-star', 6: 'tabler:user-check', 7: 'tabler:clipboard-text',
};

function rolDeUsuario(miUsuario) {
    try {
        const n = parseInt(tool.decriptar(miUsuario.usuarioRollId));
        return isNaN(n) ? null : n;
    } catch (e) {
        return null;
    }
}

// Ruta del dashboard según el rol; si no se reconoce, usa usuarioIndex si es una
// ruta interna válida; en último caso, el dashboard académico.
function dashboardDeUsuario(miUsuario) {
    const rol = rolDeUsuario(miUsuario);
    if (DASHBOARD_BY_ROL[rol]) return DASHBOARD_BY_ROL[rol];
    const idx = miUsuario.usuarioIndex;
    if (typeof idx === 'string' && /^\/(academic|dashteacher|dashstudent|dashboardadmon)$/.test(idx)) return idx;
    return '/academic';
}

function iconoDeRol(miUsuario) {
    const rol = rolDeUsuario(miUsuario);
    return ICONO_BY_ROL[rol] || 'tabler:user';
}

function UserHead(props) {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);    
    const navegar = useNavigate()
    const miUsuario = tool.getUser()
    const miInicio = dashboardDeUsuario(miUsuario)
    const rolIcono = iconoDeRol(miUsuario)
    // Ruta actual sin '/' inicial. La coincidencia del menú/opción debe ser exacta
    // o por segmento (nunca `includes`, que marcaría todo cuando la ruta es vacía).
    const rutaActual = window.location.pathname.replace(/^\//, '')
    const coincide = (enlace) => {
        const e = String(enlace || '').replace(/^\//, '')
        if (!e || !rutaActual) return false
        return rutaActual === e || rutaActual.startsWith(e + '/')
    }
    const menuActivo = (item) => (item.opciones || []).some((op) => coincide(op.enlace))
    const enInicio = window.location.pathname === miInicio
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
        navegar(publicRoutes.LOGIN)
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
    // CENTINELA FOR NO AUTH USERS → login
    if(!miUsuario.isLogged){
        navegar(publicRoutes.LOGIN , { replace: true })
    }

    return (
        <Fragment>
            <div className="main-header">
                <div className="logo-header" data-background-color="blue">
                    <NavLink to={miInicio} className="logo">
                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                    </NavLink>
                    <button className="navbar-toggler sidenav-toggler ms-auto"
                        onClick={toggleMenu}
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="collapse" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">
                            <AppIcon icon="tabler:menu-2" />
                        </span>
                    </button>
                    <button className="topbar-toggler more"><AppIcon icon="tabler:dots-vertical" /></button>
                    <div className="nav-toggle"> {
                        (waiting)?
                            <button className="btn btn-toggle toggle-sidebar custom-toggle">
                                <AppIcon icon="tabler:settings" />
                            </button>
                        : 
                            <button 
                                onClick={toggleMenu}
                                className="btn btn-toggle toggle-sidebar">
                                <AppIcon icon="tabler:menu-2" />
                            </button>
                    }
                    </div>
                </div>

                <nav className="navbar navbar-header navbar-expand-lg"
                style={{"padding":"0"}} 
                data-background-color="blue2">
                    
                    <div className="container-fluid">
                        <div className="collapse show" id="search-nav">
                            <div className="input-group">
                                <span className='text-white d-inline-flex align-items-center'>
                                    <AppIcon icon={rolIcono} className="me-1" />
                                    { miUsuario.usuarioInstitucionNombre }
                                </span>
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
                        <ul id="menuPrincipalAccordion" className="nav nav-primary">
                            <li className={enInicio ? "nav-item active" : "nav-item"}>
                                <NavLink to={miInicio} className="collapsed">
                                    <AppIcon icon="tabler:home" />
                                    <p>Inicio</p>
                                    <span className="caret"></span>
                                </NavLink>
                            </li>
                            { 
                                miMenu.map( (item,i) => {
                                    return (
                                    <li key={i} className={menuActivo(item) ? "nav-item active" : "nav-item"}>
                                        <NavLink data-bs-toggle="collapse"  data-bs-target={"#menu"+multiplicador+item.aemenu_id}>
                                            <AppIcon icon={tool.icono(item.aemenu_icono || 'tabler:folder-open')} />
                                            <p>{item.aemenu_nombre}</p>
                                            <span className="caret"></span>
                                        </NavLink>
                                        <div className={menuActivo(item) ? "collapse show" : "collapse"}
                                            id={"menu"+multiplicador+item.aemenu_id}
                                            data-bs-parent="#menuPrincipalAccordion">
                                            <ul className={menuActivo(item) ? "nav nav-show" : "nav nav-collapse"}>
                                            {
                                                item.opciones.map((opcion,o) => {
                                                    return (
                                                        <li key={o} className={coincide(opcion.enlace) ? "active" : ""}>
                                                            <NavLink to={opcion.enlace}>
                                                                <AppIcon icon={tool.icono(item.opciones[o].icono || 'tabler:circle')} />
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
                                    <AppIcon icon="tabler:power" className="text-white" />
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