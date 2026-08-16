import { Fragment, useContext, useState, useEffect } from 'react';
import swal from 'sweetalert2';
import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import { Foot } from '../components/foot';

/**
 * Promoción masiva de estudiantes: mueve las matrículas activas de un curso
 * origen a un curso destino (genera nuevas matrículas conservando el estudiante).
 */
export default function Promocion() {
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);
    const [cursos, setCursos] = useState([]);
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const miUsuario = tool.getUser();

    useEffect(() => {
        messenger.poster({ method: 'POST', url: myConst.roots.engine + '/sae/cursos/listar', value: {} })
            .then((r) => setCursos(r.rows || []));
        // eslint-disable-next-line
    }, []);

    const promover = async (event) => {
        event.preventDefault();
        if (!origen || !destino) {
            swal.fire({ icon: 'error', title: 'Error', text: 'Seleccione curso origen y destino' });
            return;
        }
        setWaiting(true);
        await messenger.poster({
            method: 'POST',
            url: myConst.roots.engine + '/sae/promover',
            value: { idorigen: origen, iddestino: destino },
        }).then((resultado) => {
            swal.fire({
                title: (parseInt(resultado.statusCode) === 200) ? 'Promoción realizada' : 'Error',
                text: resultado.message,
                icon: resultado.status,
                showConfirmButton: true,
                customClass: { confirmButton: 'btn btn-primary' },
            });
        });
        setWaiting(false);
    };

    if (!miUsuario.isLogged) {
        return <Fragment><Forbidden /></Fragment>;
    }

    return (
        <Fragment>
            <div id="elgrapper" className="wrapper">
                <UserHead waiting={waiting} setWaiting={setWaiting} />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-inner mt--5">
                                <h1 className="text-center">
                                    <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                    {miUsuario.usuarioInstitucionNombre}
                                </h1>
                            </div>
                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header"><h4 className="card-title">Promoción masiva de estudiantes</h4></div>
                                            <div className="card-body">
                                                <form onSubmit={promover} method="POST">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group text-left">
                                                                <label>Curso origen:</label>
                                                                <select className="form-control" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                                                                    <option value="">Seleccione curso origen</option>
                                                                    {cursos.map((c, i) => <option key={i} value={c.idregistro}>{c.nombre} ({c.grado})</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group text-left">
                                                                <label>Curso destino:</label>
                                                                <select className="form-control" value={destino} onChange={(e) => setDestino(e.target.value)}>
                                                                    <option value="">Seleccione curso destino</option>
                                                                    {cursos.map((c, i) => <option key={i} value={c.idregistro}>{c.nombre} ({c.grado})</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-action text-center my-4">
                                                        <button type="submit" className={waiting ? 'btn is-loading btn-warning' : 'btn btn-primary'} disabled={waiting}>
                                                            Promover estudiantes
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Foot />
                </div>
            </div>
        </Fragment>
    );
}
