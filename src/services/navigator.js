import { Fragment, useState } from 'react';
import {Link} from 'react-router-dom';
import tool from '../services/tools';



function Navigator() {
	const [miMenu, setMiMenu] = useState(null)
    const multiplicador = 5, miUsuario = tool.getUser()
    let preItem = null
    let elMenu = []
    
    const buildMenu = () => {
        elMenu = tool.getNav()
        
        elMenu.forEach( (item,i) => {
            preItem = preItem + `
                <li className="nav-item">
                    <a data-toggle="collapse" href={"#menu"+multiplicador+item.aemenu_id}>
                        <i className={item.aemenu_icono}></i>
                        <p>{item.aemenu_nombre}</p>
                        <span className="caret"></span>
                    </a>
                    <div className="collapse" id={"#menu"+multiplicador+item.aemenu_id}>
                        <ul className="nav nav-collapse">
                    `

                item.opciones.forEach((opcion,o) => {
                    preItem = preItem + `
                                <li>
                                    <Link to={opcion.enlace} replace>
                                        <a>
                                            <span className="sub-item">{item.opciones[o].nombre}</span>
                                        </a>
                                    </Link>
                                </li>`
                })
        
           preItem = preItem +  `
                        </ul>
                    </div>
            </li>`
        })

        setMiMenu(preItem)        
    };
    return (
        <Fragment>
            <div className="sidebar sidebar-style-2">			
                <div className="sidebar-wrapper scrollbar scrollbar-inner">
                    <div className="sidebar-content">
                        <div className="user">
                            <div className="avatar-sm float-left mr-2">
                                <img src="../../public/assets/img/profile.jpg" alt="..." className="avatar-img rounded-circle" />
                            </div>
                            <div className="info">
                                <a data-toggle="collapse" href="#collapseExample" aria-expanded="true">
                                    <span>
                                        Hizrian
                                        <span className="user-level">Administrator</span>
                                        <span className="caret"></span>
                                    </span>
                                </a>
                                <div className="clearfix"></div>

                                <div className="collapse in" id="collapseExample">
                                    <ul className="nav">
                                        <li>
                                            <a href="#profile">
                                                <span className="link-collapse">My Profile</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#edit">
                                                <span className="link-collapse">Edit Profile</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#settings">
                                                <span className="link-collapse">Settings</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <ul className="nav nav-primary">
                            <li className="nav-item active">
                                <Link to={miUsuario.usuarioIndex}>
                                    <a data-toggle="collapse" className="collapsed" aria-expanded="false">
                                        <i className="fas fa-home"></i>
                                        <p>Inicio</p>
                                        <span className="caret"></span>
                                    </a>
                                </Link>
                            </li>
                            { buildMenu }
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default Navigator;