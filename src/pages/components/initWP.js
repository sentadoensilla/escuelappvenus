import { Fragment, useState, useEffect, useContext } from 'react';
import swal from 'sweetalert2'

import { UserContext } from '../../services/context/UserContext';

// eslint-disable-next-line
import * as myConst from '../../main/constants';
// eslint-disable-next-line
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import QRCode from "react-qr-code";
import socketIOClient from "socket.io-client";
const miSocketServer = process.env.REACT_APP_BACKEND_URL
let miSocket = {}

export const WidgetWhatsapp = (props) => {
    const miUsuario = tool.getUser()

    const [elQR, setElQR] = useState({message:'',namba:null})
    // eslint-disable-next-line
    const [miSocketStatus, setMiSocketStatus] = useState(false)
    const [elNumero, setElNumero] = useState("")
    const [listaContactos, setListaContactos] = useState([])
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario, setElUsuario } = useContext(UserContext);

    const deleteContact = async(laData) => {
        swal.fire({
            title: '¿Está seguro?',
            text: "También debe cerrar la sesion en el smartphone",
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText : 'Si, eliminar!',
            showCancelButton: true,
            customClass: {
                confirmButton:'btn btn-danger',
                closeButton:'btn btn-primary'
            },
        }).then(async (answer) => {
            if (answer.isConfirmed) {

                setWaiting(waiting => true)
                await messenger.poster({
                    method: 'POST',
                    value: {
                        'campana': miUsuario.usuarioCampanaId,
                        'mynumber': laData.elNumero,
                        'socketId': miSocket.id
                    },
                    url: myConst.roots.engine + myConst.roots.wpdelete
                })
                .then((elMensaje) =>{
                    setWaiting(waiting => false)
                    if(parseInt(elMensaje.statusCode) === 200){
                        listWP()
                    }            
                })
                .catch((error) =>{
                    setWaiting(waiting => false)
                    // eslint-disable-next-line
                    console.log('Error eliminando numeros: ', error.toString())
                })

            }
        })
    }

    const listWP =  async() =>{        
        setWaiting(waiting => true)
        miSocket.emit("givemewplist", {
            'campana': miUsuario.usuarioCampanaId,
            'socketId': miSocket.id,
            'socketid': miSocket.id
        })
        setWaiting(waiting => false)
    }

    const getQR =  async (laData) =>{
        setWaiting(waiting => true)

        if(laData.elNumero.length >=10){
            miSocket.emit("connectnamba", {
                'campana': miUsuario.usuarioCampanaId,
                'sessionId': laData.elNumero,
                'socketId': miSocket.id,
                'socketid': miSocket.id
            })
            
        }else{
            swal.fire({
                title: 'Número incorrecto',
                text: "Debe ser un número de whatsapp de 10 dígitos",
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText : 'Si, lo corregiré!',
                showCancelButton: true,
                customClass: {
                    confirmButton:'btn btn-primary'
                },
            })
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        miSocket = socketIOClient.connect(miSocketServer, {
            secure: true,
            reconnect:true,
            rejectUnauthorized:false,
            allowUpgrades: false,
            upgrade: false,
            withCredentials: true,
            transports: ['polling'],
        })
        

        miSocket.on("connect", ()=>{
            // setMiSocketid(loid => miSocket.id)
            tool.setSocket(miSocket.id)
            // miUsuario.socketId = miSocket.id
            setMiSocketStatus(miSocket.connected)

            listWP()
        })

        // listWP()
        miSocket.on('disconnect', () => {
            setMiSocketStatus(miSocket.connected);
        });

        // eslint-disable-next-line
        miSocket.on("qr", data => {
            setElQR(data)
            setWaiting(waiting => false)
        });

/*         // CHANGE WHATSAPP STATE FROM LIST TO SHOW BUTTOM QR AGAIN
        miSocket.on("nambaconnected", (response) => {
            // eslint-disable-next-line
            console.log('Lo que llego del socket: ', response)        
            setListaContactos(listaContactos => response.list)
            // eslint-disable-next-line
            console.log('La lista ha cambiado: ', listaContactos)
        }); */

        miSocket.on("nambalistado", (response) => {
            setElQR({message:'',namba:null})
            setListaContactos(listaContactos => response.list)
            setWaiting(waiting => false)
        });

        // DELETE WHATSAPP FROM STATE
        miSocket.on("nambadeleted", (response) => {
            listaContactos.filter(item => (item.emisor !== response.sessionId))
            setWaiting(waiting => false)
        });

    }, [miSocketServer])

    
        return ( 
            <Fragment>
                <div className="page-inner mt--5">
                    <div className="row mt--2">
                        <div className="col-md-12">
                            <div className="card full-height">
                                <div className="card-body">
                                    <div className="card-title text-center">
                                        <h1 className="text-center">
                                            <img src={myConst.essentials.logohorizontal} alt="navbar brand" className="navbar-brand" />
                                            Emisores Whatsapp Bussiness de campaña 
                                        </h1>
                                    </div>
                                        <div className="row">
                                            <div className="col-md-8 px-2 pb-2 pb-md-0">
                                            <div className="row">
                                                <div className="card-body">
                                                    <ul className="nav nav-pills nav-info" id="pills-tab" role="tablist">
                                                        <li className="nav-item">
                                                            <a className="nav-link active" id="v-pills-home-nobd" data-toggle="pill" href="#v-pills-init" role="tab" aria-controls="pills-home" aria-selected="true">Inicialmente</a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#v-pills-howmany" role="tab" aria-controls="pills-profile" aria-selected="false">¿Cuántos mensajes puedo enviar?</a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#v-pills-guide" role="tab" aria-controls="pills-contact" aria-selected="false">Instrucciones</a>
                                                        </li>
                                                    </ul>
                                                    <div className="tab-content mt-2 mb-3" id="pills-tabContent">
                                                        <div className="tab-pane fade show active" id="v-pills-init" role="tabpanel" aria-labelledby="v-pills-home-tab-nobd">
                                                            <p>
                                                                Aquí puede conectar cuentas de whatsapp business: Serán utilizadas como emisores de mensajes de su campaña para enviar mensajes a los potenciales votantes cuando:
                                                            </p>
                                                            <div>
                                                                <ul>
                                                                    <li>Son registrados votantes potenciales en polimetrika.com</li>
                                                                    <li>Son enviados volantes de la campaña a los potenciales votantes</li>
                                                                    <li>Es enviada publicidad a los potenciales votantes</li>
                                                                </ul>
                                                            </div>
                                                            <p>
                                                                Deben ser cuentas de whatsapp Bussiness diferentes al whatsapp oficial
                                                                de la campaña o el whatsapp del candidato, completamente configuradas con la información de la campaña
                                                                para que quienes reciban los mensajes, sepan el origen y no se sorprendan de manera negativa
                                                            </p>
                                                        </div>
                                                        <div className="tab-pane fade" id="v-pills-howmany" role="tabpanel" aria-labelledby="v-pills-profile-tab-nobd">
                                                            <p>
                                                                Puede comenzar con una, pero whatsapp maneja unos límites diarios
                                                            </p>
                                                            <p>
                                                                Las cuentas de whatsapp completamente configuradas comienzan con un límite de 1000
                                                                clientes diarios, entonces haga las cuentas según la cantidad de posibles votantes en su campaña 
                                                                (clientes de whatsapp son los destinatarios de los mensajes, en este caso los votantes potenciales de su campaña)
                                                            </p>
                                                            <p>
                                                                Tenga en cuenta que el limite de clientes contactados al dia puede variar segun el manejo que se le de
                                                                e incluso su número de whatsapp business puede ser bloqueado, de ahí la recomendación de no utilizar aquí el múmero oficial de campaña 

                                                                <a rel="noreferrer" href='https://developers.facebook.com/docs/whatsapp/messaging-limits?locale=es_ES#c-mo-comprobar-el-l-mite' target='_blank'> Lea lo concerniente a los limites de whatsapp aqui</a>
                                                            </p>
                                                            <p>
                                                                <a rel="noreferrer" href='https://www.whatsapp.com/legal/business-terms/' target='_blank'> Lea cuidadosamente las politicas de whatsapp</a>
                                                            </p>                                                                
                                                        </div>
                                                        <div className="tab-pane fade" id="v-pills-guide" role="tabpanel" aria-labelledby="v-pills-messages-tab-nobd">
                                                            <div>
                                                                <ol>
                                                                    <li>Consiga los whatsapp que necesite y configurelos en los smartphone de su preferencia</li>
                                                                    <li>Cárguelos en polimetrika.com, uno despues del otro</li>
                                                                    <li>Tenga en cuenta que estas cuentas de whatsapp business deben estar activas en los smartphone y conectadas a internet mientas utilicen polimetrika.com</li>
                                                                </ol>
                                                            </div>
                                                            <p>
                                                                (El proceso debe realizarse a diario, antes de hacer uso del sistema por parte de los líderes o para enviar volantes o publicidad)
                                                            </p>
                                                            <p>
                                                                Entre las personas que reciban los mensajes deben estar los miembros del equipo
                                                                de campaña, familiares y amigos que respondan positivamente a los mensajes de
                                                                publicidad ya que definitivamente habrá reportes y respuestas negativas de gente
                                                                ajena a la campaña buscando limitar el alcance de la misma o simplemente gente
                                                                molesta.
                                                            </p>
                                                            <p>
                                                                polimetrika.com no recolecta ni guarda información recibida en las cuentas de whatsapp cargadas al
                                                                sistema, sólo se conecta a las cuentas para enviar mensajes en cada campaña.  
                                                                Lo que se diga en los volantes y publicidad en general es responsabilidad de la campaña y/o quienes administran polimetrika.com para la misma.                                                                        
                                                            </p> 
                                                        </div>                                                                
                                                    </div>
                                                </div>
                                            </div>
                                            </div>

                                            <div className="col-md-4 px-2 pb-2 pb-md-0">
                                                <div className="px-2 pb-2 text-center">
                                                    {
                                                        (elQR.message === "")?  
                                                        <img src={myConst.essentials.qrprime} style={{width:'260px'}}/>
                                                        :
                                                        <div className="flex-1 ml-3 pt-1">
                                                            <QRCode value={elQR.message} />
                                                            <h5 className="text-danger">{elQR.namba}</h5>
                                                        </div>
                                                    }
                                                </div>

                                                <div id="circles-1" className='text-center'>
                                                    <div className='card-body'>
                                                        <span className='fw-bold mb-1'>Número de whatsapp: </span>
                                                        <input type="text" placeholder='3219999999'
                                                        value={elNumero} onChange={(e) => {setElNumero(e.target.value)}} 
                                                        style={{width:'128px',textAlign:'center'}}
                                                        />
                                                    </div>
                                                    <button
                                                        type='button'
                                                        className={props.waiting? 'btn is-loading btn-success ml-1' : 'btn btn-success ml-1'}
                                                        onClick={() => {getQR({elNumero})}}
                                                    ><i className="fab fa-whatsapp"></i> Cargar QR</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                    {
                        (listaContactos.length > 0)?
                        
                            listaContactos.map(item => {
                                if(parseInt(item.estado) === 6){
                                    return (
                                        <div key={item.emisor} className="col-12 col-sm-6 col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="text-success">{item.emisor}</h5>
                                                            <p className="text-muted">
                                                                Cargado correctamente
                                                            </p>
                                                        </div>
                                                        <h3 className="text-success fw-bold">
                                                            <span>
                                                                <i className="flaticon-whatsapp"></i>
                                                            </span>
                                                        </h3>
                                                    </div>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-success w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-2">
                                                        <p className="text-muted mb-0">
                                                            {item.mensajesenviados} Clientes hoy
                                                        </p>
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <button
                                                                    type='button'
                                                                    className={props.waiting? 'btn is-loading btn-dark btn-sm' : 'btn btn-dark btn-sm'}
                                                                    onClick={() => {deleteContact({elNumero:item.emisor})}}
                                                                ><i className="fas fa-window-close"></i> Eliminar</button>                                                                                    
                                                            </small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else{
                                    return (
                                        <div key={item.emisor} className="col-12 col-sm-6 col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="text-danger">{item.emisor}</h5>
                                                            <p className="text-muted">
                                                                Debe cargar QR
                                                            </p>
                                                        </div>
                                                        <h3 className="text-danger fw-bold">
                                                            <span>
                                                                <i className="flaticon-whatsapp"></i>
                                                            </span>
                                                        </h3>
                                                    </div>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-danger w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-2">
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <button
                                                                    type='button'
                                                                    className={props.waiting? 'btn is-loading btn-dark btn-sm' : 'btn btn-dark btn-sm'}
                                                                    onClick={() => {deleteContact({elNumero:item.emisor})}}
                                                                ><i className="fas fa-window-close"></i> Eliminar</button>                                                                                    
                                                            </small>
                                                        </p>
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <button
                                                                type='button'
                                                                className={props.waiting? 'btn is-loading btn-danger btn-sm' : 'btn btn-danger btn-sm'}
                                                                onClick={() => {getQR({elNumero:item.emisor})}}
                                                            ><i className="fab fa-whatsapp"></i> Cargar QR</button>
                                                            </small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                            })
                        :
                        <div key="nonambanever" className="d-flex">
                            <div className="avatar avatar-offline">
                                <span className="avatar-title rounded-circle border border-white bg-danger"><i className="fab fa-whatsapp"> </i> </span>
                            </div>
                            <div className="flex-1 ml-3 pt-1">
                                <h6 className="text-uppercase fw-bold mb-1">No hay números activados <span className="text-success pl-3"></span></h6>
                                <span className="text-muted">Estos whatsapp son indispensables, sigue las instrucciones</span>
                            </div>
                            <div className="float-right pt-1">
                                <small className="text-muted"></small>
                            </div>
                        </div>

                    }
                    </div>                    
                </div>
            </Fragment>
        );
   
};
