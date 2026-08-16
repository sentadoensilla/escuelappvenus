import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { UserContext } from '../../services/context/UserContext';
import { privateRoutes } from '../../services/routes';
import { Forbidden } from '../forbidden'
import Waiting from '../parts/waiting';
import UserHead from '../components/head';
import { Foot } from '../components/foot'

export default function Addlider(){

    const miUsuario =  tool.getUser()
	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.liderUpdate
    let titulo = myConst.labels.liderAdd[0][0] // CREAR VOTANTE
    
    const idusuario = (params.state)? params.state.idusuario : null;
    
    if(idusuario !== "undefined" && idusuario !== null){
        uRl = myConst.roots.engine + myConst.roots.liderUpdate
        titulo = myConst.labels.liderAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
    // eslint-disable-next-line
	let [listado, setListado] = useState([]);
    const [meter, setMeter] = useState('password');

    // DEFAULT VALUES FORM
    let  [defaultValues, setDefaultValues] = useState({
        idusuario: idusuario||0,
        idcampana: listado[0]?.idcampana||miUsuario.usuarioCampanaId,
        documento: listado[0]?.identificacion||'',
        nombres: listado[0]?.nombres||'',
        elroll: listado[0]?.elroll||'',
        celular: listado[0]?.celular||'',
        correo: listado[0]?.usuario||'',
        clave: listado[0]?.clave||'',
        reclave: listado[0]?.clave||'',
        eldepto: listado[0]?.iddepartamento||miUsuario.usuarioDepto,
        mupio: listado[0]?.idmunicipio||miUsuario.usuarioMupio,
        lafoto: listado[0]?.lafoto||0,
        estado: listado[0]?.idestado||0,
        meta: listado[0]?.meta||null
    });
  
    // eslint-disable-next-line
	const [elroll, setelroll] = useState()

	const [elDeptos, setElDeptos] = useState(listado[0]?.eldepto||miUsuario.usuarioDepto)
	const [listaDeptos, setListaDeptos] = useState([])
	const [elMupios, setElMupios] = useState(defaultValues.mupio||miUsuario.usuarioMupio)
	const [listaMupios, setListaMupios] = useState([])
	let [listaMetas, setListaMetas] = useState([])


	const { control, register, reset, formState: { errors } , handleSubmit } = useForm({});


	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const [errorMessage, setErrorMessage] = useState({class:"text-success",message:""})

    const recoverRecord = () => {
        const partialListado = [tool.getRecord()]
        listado = partialListado       

        setDefaults()
    };

    const setDefaults = () => {
        defaultValues = {
            idusuario: idusuario||0,
            idcampana: listado[0]?.idcampana||miUsuario.usuarioCampanaId,
            documento: listado[0]?.identificacion||'',
            nombres: listado[0]?.nombres||'',
            elroll: listado[0]?.elroll||'',
            celular: listado[0]?.celular||'',
            correo: listado[0]?.usuario||'',
            clave: listado[0]?.clave||'',
            reclave: listado[0]?.clave||'',
            eldepto: listado[0]?.iddepartamento||miUsuario.usuarioDepto,
            mupio: listado[0]?.idmunicipio||miUsuario.usuarioMupio,
            lafoto: listado[0]?.lafoto||0,
            estado: listado[0]?.idestado||0,
            meta: listado[0]?.meta||null
        }

        setDefaultValues(defaultValues)

        setElDeptos(value => {return defaultValues.eldepto})
        setElMupios(value => {return defaultValues.mupio})

        setelroll(defaultValues.elroll)

    }

	const onRegister = async(data) => {
        const clave1 = document.getElementById('clave')
        const clave2 = document.getElementById('reclave')

        verificarClave(clave1,clave2)

        if(clave1.value === clave2.value){

            if(data!==""){
                setWaiting(waiting => true)
                misMetas()

                data.lider=miUsuario.usuarioId
                data.campana=miUsuario.usuarioCampanaId[0]
                data.listametas = listaMetas
                
                await messenger.poster({
                    method: 'POST',
                    value: data,
                    url: uRl
                }).then((resultado) =>{
                    swal.fire({
                        title: resultado.status,
                        text: resultado.message,
                        icon: resultado.status,
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText:'Ver listado',
                        cancelButtonText:'Agregar otro',
                        customClass: {
                            confirmButton:'btn btn-danger',
                            cancelButton:'btn btn-primary'
                        }
                    }).then(answer =>{
                        if(answer.isConfirmed){
                            navegar(privateRoutes.USUARIO_LISTADO)
                        }else{
                            setDefaults()
                            reset({...defaultValues})
                        }
                    })
                });

                setWaiting(waiting => false)
            }
        }
	}

    const misMetas = () => {
        const lasMetas = Array.from(document.getElementsByClassName('mimeta'))

        if(lasMetas.length > 0){
            setListaMetas(otrasMetas => [])
            listaMetas = lasMetas.map((laMeta) => {
                return [laMeta.getAttribute("data-key"),laMeta.value||null]
            })         
        }
    }

    const getListaDeptos = async() => {
        setWaiting(waiting => true)

        await messenger.poster({
            method: 'POST',
            value: { criterio: 0 },
            url: myConst.roots.engine + myConst.roots.listaDeptos
        }).then((elMensaje) =>{
            setListaDeptos(
				elMensaje.message.map((elDepto) =>{
                    return {value: elDepto.iddepto, text: elDepto.nombre}
				})				
			)
            setElDeptos(defaultValues.eldepto)
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    const getListaMupios = async(event) => {
        defaultValues.eldepto = event.target.value||elDeptos

        // defaultValues.mupio = (listado[0]?.mupio !== "" && listado[0]?.mupio !== undefined && listado[0]?.mupio !== null)? listado[0]?.mupio : miUsuario.usuarioMupio

        // eslint-disable-next-line
        // console.log('Los default mupios: ', defaultValues.mupio)
        setWaiting(waiting => true)

        await messenger.poster({
            method: 'POST',
            value: { criterio: defaultValues.eldepto },
            url: myConst.roots.engine + myConst.roots.listaMupios
        }).then((elMensaje) =>{
            setListaMupios(
                elMensaje.message.map((elMupio) =>{
                    return {value: elMupio.idmupio, text: elMupio.nombre}
                })
            )
            setElDeptos(defaultValues.eldepto)
            setElMupios(defaultValues.mupio)
            setWaiting(waiting => false)
        });
        setWaiting(waiting => false)
    };

    // FOR CHANGE CENTROS AND PUNTOS USING MUPIOS ONE EVENT
    const changeMupios = async(event) => {
        if(event.target.value!==null && event.target.value!==undefined ){
            setElMupios(event.target.value)
        }
    }

    const verClave = () =>{
        (meter === 'text')? setMeter('password') : setMeter('text');
    }

    const verificarClave = (uno,dos) =>{
        if(uno.value !== "" && dos.value !== ""){
            if(uno.value === dos.value){
                setErrorMessage({class:"text-success",message:""})
                uno.classList.remove("is-invalid")
                dos.classList.remove("is-invalid")
            }else{
                setErrorMessage({class:"text-danger",message:"La clave y la repetición no coinciden!"})
                uno.classList.add("is-invalid")
                dos.classList.add("is-invalid")
            }
        }
    }
    
    useEffect(() => {
        // eslint-disable-next-line
        setWaiting(waiting => true)

        recoverRecord()
        setIsFetching(isFetching => true)

        setDefaults();

        getListaDeptos();

        getListaMupios({target:{value:defaultValues.eldepto}});

        reset({...defaultValues});

		setIsFetching(isFetching => false)
        setWaiting(waiting => false)
  
    }, []);


	if(isFetching){
		return (
			<Fragment>
				<Waiting />
			</Fragment>
		);
	}else{
        return (
            <Fragment>
                <div id='elgrapper' className="wrapper">
				<UserHead />

				<div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-header">

                            </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">
                                                        <img src={myConst.essentials.logohorizontal} alt="navbar brand" className="navbar-brand" />
                                                        {titulo}
                                                    </h4>
                                                    <Link to={privateRoutes.USUARIO_LISTADO} className="btn btn-primary btn-round ml-auto">
                                                    <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                    Mis lideres 
                                                </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (idusuario !== "undefined" && idusuario !== null) ? <input type="hidden" value={idusuario} {...register("personal")} /> : "" }
                                                   
                                                    <div className="form-group  text-left has-feedback">
                                                        <label htmlFor='nombres'>Nombre completo:</label>
                                                        <input type="text" className="form-control" placeholder='Ana'
                                                        {...register("nombres", {
                                                            required:true,
                                                            minLength: 7
                                                        })} />
                                                        { errors.nombres?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama el usuario?</small> }
                                                        { errors.nombres?.type === 'minLength' && <small className="form-text text-danger">El nombre está corto</small> }													
                                                    </div>

                                                    <div className="form-group  text-left has-feedback">                                                        
                                                        <label htmlFor='clave'>Clave:</label>
                                                        <input type={meter} className="form-control" 
                                                        id="clave" name="clave" placeholder='Miclave-23'
                                                        {...register("clave", {
                                                            required: (typeof idusuario === "undefined" || idusuario === null), // depends on editing user to not password required
                                                            minLength: 6,
                                                            maxLength: 64,
                                                            onChange: () => verificarClave(document.getElementById('clave'), document.getElementById('reclave')),
                                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/ //eslint-disable-line
                                                        })} />
                                                        { errors.clave?.type === 'required' && <small className="form-text text-danger">La clave es obligatoria</small> }
                                                        { errors.clave?.type === 'minLength' && <small className="form-text text-danger">La clave es muy corta</small> }
                                                        { errors.clave?.type === 'maxLength' && <small className="form-text text-danger">La clave es muy larga</small> }
                                                        { errors.clave?.type === 'pattern' && <small className="form-text text-danger">Al menos 1 mayuscula, 1 minuscula, 1 digito, 1 simbolo (:.-_@!) </small> }
                                                    </div>
                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='reclave'>Repetir clave:</label>
                                                        <input type={meter} className="form-control" 
                                                        id="reclave" name="reclave" placeholder='Miclave-23'
                                                        {...register("reclave", {
                                                            required:(typeof idusuario === "undefined" || idusuario === null), // depends on editing user to not password required
                                                            minLength: 6,
                                                            maxLength: 64,
                                                            onChange: () => verificarClave(document.getElementById('clave'), document.getElementById('reclave')),
                                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/ //eslint-disable-line
                                                        })} />
                                                        <label htmlFor='visible'><input type="checkbox" name='visible' id="visible" onClick={verClave} /> Ver la clave</label><br/>
                                                        <small className={"form-text "+errorMessage.class}>{ errorMessage.message }</small>
                                                    </div>

                                                    <div className="form-group  text-left has-feedback">
                                                        <label htmlFor='celular'>Whatsapp:</label>
                                                        <input type="text" className="form-control" 
                                                        placeholder='3117696973'
                                                        {...register("celular", {
                                                            required:true,
                                                            minLength: 10,
                                                            maxLength: 10,
                                                            pattern: /^\d+$/ //eslint-disable-line
                                                        })} />
                                                        { errors.celular?.type === 'required' && <small className="form-text text-danger">Escriba un celular con acceso a Whatsapp por favor</small> }
                                                        { errors.celular?.type === 'pattern' && <small className="form-text text-danger">Sólo números, ejemplo: 3117696973</small> }
                                                    </div>

                                                    <div className="form-group  text-left has-feedback">
                                                        <label htmlFor='correo'>Correo:</label>
                                                        <input type="text" className="form-control" placeholder='mivotante@hotmail.com'
                                                        {...register("correo", {
                                                            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //eslint-disable-line
                                                        })} />
                                                        { errors.correo?.type === 'pattern' && <small className="form-text text-danger">El correo está mal escrito</small> }
                                                    </div>

                                                    <div className="form-group  form-floating-label text-left  has-feedback">
                                                        <Controller
                                                            name="eldepto"
                                                            control={control}
                                                            defaultValue={elDeptos}
                                                            render={({ onChange, value, ref }) => (
                                                                <select value={elDeptos} className="form-control input-border-bottom"  
                                                                {...register("eldepto", {
                                                                    onChange: (e) => {getListaMupios(e)},
                                                                    required:true,
                                                                })}>
                                                                    <option key="" value="">Seleccione un departamento</option>
                                                                    { listaDeptos.map(opcion => (
                                                                        <option key={opcion.value} value={opcion.value} >{opcion.text}</option>
                                                                    )) }
                                                                </select>
                                                            )}
                                                            rules={{ required: true }}
                                                        />
                                                        <label htmlFor="eldepto" className="placeholder">Departamento de votación...</label>
                                                        { errors.eldepto?.type === 'required' && <small className="form-text text-danger">¿Cuál es el departamento de votación?</small> }
                                                    </div>

                                                    <div className="form-group  form-floating-label text-left  has-feedback">
                                                    <Controller
                                                        name="mupio"
                                                        control={control}
                                                        defaultValue={elMupios}
                                                        render={({ onChange, value, ref }) => (
                                                                <select value={elMupios} className="form-control input-border-bottom" 
                                                                {...register("mupio", {
                                                                    onChange: (e) => {changeMupios(e)},
                                                                    required:true
                                                                })}>
                                                                    <option key="" value="">Seleccione un municipio o localidad</option>
                                                                    { listaMupios.map(opcion => (
                                                                        <option key={opcion.value} value={opcion.value} >{opcion.text}</option>
                                                                    )) }
                                                                </select>
                                                            )}
                                                            rules={{ required: true }}
                                                        />
                                                        <label htmlFor="mupio" className="placeholder">Municipio de votación...</label>
                                                        { errors.mupio?.type === 'required' && <small className="form-text text-danger">¿Cuál es el municipio o localidad?</small> }
                                                    </div>

                                                    <div className="form-group text-left has-feedback ">                                                        
                                                        {
                                                            miUsuario.usuarioCampanaNombre.map((campanita,c) => {
                                                                // SETTING META 
                                                                let elValueMeta = [{idcampana:'',meta:''}]

                                                                if(defaultValues.meta!==null){
                                                                    // SET METAS FOR USER
                                                                    elValueMeta = defaultValues.meta.filter(thisMeta => {
                                                                        return thisMeta.idcampana.toString().includes(miUsuario.usuarioCampanaId[c].toString())
                                                                    })
                                                                }

                                                                return <div key={'division'+miUsuario.usuarioCampanaId[c]} >
                                                                    <label key={miUsuario.usuarioCampanaId[c]} className="form-label d-block">Meta de votos para campaña {campanita}</label>
                                                                        <input type="text"
                                                                            key={'text'+miUsuario.usuarioCampanaId[c]} 
                                                                            className="form-control mimeta"
                                                                            data-key={miUsuario.usuarioCampanaId[c]}
                                                                            defaultValue={elValueMeta[0]?.meta||''}
                                                                            placeholder='5000'
                                                                            {...register("meta"+miUsuario.usuarioCampanaId[c], {
                                                                                    required:false,
                                                                                    pattern: /^\d+$/ //eslint-disable-line
                                                                                }) 
                                                                            }
                                                                        />
                                                                    { errors.meta?.type === 'pattern' && <small className="form-text text-danger">La meta debe ser un número entero</small> }
                                                                    </div>
                                                            })
                                                        }                                                     

                                                    </div>

                                                    <div className='card-action text-center'>
                                                        <button
                                                            type='submit'
                                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                            disabled={errorMessage.message||waiting}
                                                        >
                                                            Registrar lider
                                                        </button>
                                                    </div>
                                                </form>
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
}