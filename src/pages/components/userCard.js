import { Link, useNavigate } from 'react-router-dom';
import tool from '../../services/tools';
import { privateRoutes, publicRoutes } from '../../services/routes';

function UserCard() {
    const navegar = useNavigate()
    const miUsuario = tool.getUser()
    const colorProfile = (tool.decriptar(miUsuario.usuarioRollId)==="2")? 'warning' : 'danger'

/*     const userDefaul = {
        picProfile: process.env.REACT_APP_PUBLIC_FOLDER+'/assets/img/profile.jpg'
    } */

    // CENTINELA FOR NO AUTH USERS
    if(!miUsuario.isLogged){
        navegar(publicRoutes.LOGIN , { replace: true })
    }

    return (
        <div className="user">
            <div className="avatar-sm float-left mr-2">
                <div className="avatar avatar-online">
                    <span className={'avatar-title rounded-circle border border-'+colorProfile+' bg-'+colorProfile}>
                        {miUsuario.usuarioNick.substring(0,2)}
                    </span>
                </div> 
            </div>
            <div className="info">
                <a data-toggle="collapse" href="#collapseUserInfo" aria-expanded="true">
                    <span>
                        { miUsuario.usuarioNick.split("@")[0] }
                        <span className="user-level">{ miUsuario.usuarioRollNombre }</span>
                        <span className="caret"></span>
                    </span>
                </a>
                <div className="clearfix"></div>

                <div className="collapse in" id="collapseUserInfo">
                    <ul className="nav">
                        <li>
                            <Link to={privateRoutes.USUARIO_PROFILE}>
                                <span className="link-collapse">Mi cuenta</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={privateRoutes.USUARIO_PASSCHANGE}>
                                <span className="link-collapse">Cambiar clave</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default UserCard;