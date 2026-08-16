import { Fragment, useContext, useState, useEffect } from 'react';
import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import Listado from '../components/tables';
import { Foot } from '../components/foot';

/**
 * Estadísticas SAE: resumen de matrícula, sexo, etnia y grado (solo lectura).
 */
export default function EstadisticasSae() {
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);
    const [resumen, setResumen] = useState({});
    const [porSexo, setPorSexo] = useState([]);
    const [porEtnia, setPorEtnia] = useState([]);
    const [porGrado, setPorGrado] = useState([]);
    const miUsuario = tool.getUser();

    const colsGrupo = [
        { name: 'GRUPO', selector: (row) => row.etiqueta, sortable: true },
        { name: 'TOTAL', selector: (row) => row.total, sortable: true, maxWidth: '120px' },
    ];

    useEffect(() => {
        const base = myConst.roots.engine + '/estadisticassae';
        messenger.poster({ method: 'POST', url: base + '/resumen', value: {} }).then((r) => setResumen(r.rows?.[0] || {}));
        messenger.poster({ method: 'POST', url: base + '/porsexo', value: {} }).then((r) => setPorSexo(r.rows || []));
        messenger.poster({ method: 'POST', url: base + '/poretnia', value: {} }).then((r) => setPorEtnia(r.rows || []));
        messenger.poster({ method: 'POST', url: base + '/porgrado', value: {} }).then((r) => setPorGrado(r.rows || []));
        // eslint-disable-next-line
    }, []);

    if (!miUsuario.isLogged) {
        return <Fragment><Forbidden /></Fragment>;
    }

    const tarjetas = [
        { titulo: 'Matriculados', valor: resumen.matriculados, color: 'primary' },
        { titulo: 'Mujeres', valor: resumen.mujeres, color: 'danger' },
        { titulo: 'Hombres', valor: resumen.hombres, color: 'info' },
        { titulo: 'Docentes', valor: resumen.docentes, color: 'success' },
        { titulo: 'Cursos', valor: resumen.cursos, color: 'warning' },
    ];

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
                                    {tarjetas.map((t, i) => (
                                        <div key={i} className="col-md-3 col-sm-6">
                                            <div className={`card card-stats card-${t.color}`}>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-stats">
                                                            <div className="stats-icon"><i className="fas fa-chart-bar"></i></div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="numbers">
                                                                <p className="card-category">{t.titulo}</p>
                                                                <h4 className="card-title">{t.valor ?? 0}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header"><h4 className="card-title">Matrículas por sexo</h4></div>
                                            <div className="card-body">
                                                <Listado props={{ title: 'Sexo', columns: colsGrupo, data: porSexo }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header"><h4 className="card-title">Matrículas por grado</h4></div>
                                            <div className="card-body">
                                                <Listado props={{ title: 'Grado', columns: colsGrupo, data: porGrado }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header"><h4 className="card-title">Matrículas por etnia</h4></div>
                                            <div className="card-body">
                                                <Listado props={{ title: 'Etnia', columns: colsGrupo, data: porEtnia }} />
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
