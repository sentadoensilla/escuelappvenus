import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { UserContext } from '../../services/context/UserContext';
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

    const navegar = useNavigate();
    const argumentos = useParams()
    const reference = argumentos.reference
    const uRl = myConst.roots.engine + myConst.roots.userInfoUpdate
   
    if(reference === "undefined" && reference === null){
        navegar(miUsuario.usuarioIndex)
    }

 
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
    // eslint-disable-next-line
	let [listado, setListado] = useState([]);
    // eslint-disable-next-line
    const [selectedFile, setSelectedFile] = useState("")
    const [preview, setPreview] = useState()

    // DEFAULT VALUES FORM
    // eslint-disable-next-line 
    let  [defaultValues, setDefaultValues] = useState({
        idusuario: reference||miUsuario.usuarioId,
        idcampana: miUsuario.usuarioCampanaId,
        nombres: listado[0]?.nombres||'',
        indicativo: (listado[0]?.celular.length >10)? listado[0]?.celular.substr(0, (listado[0]?.celular.length - 10)) : '' ||'',
        celular: (listado[0]?.celular.length >10)? listado[0]?.celular.substr((listado[0]?.celular.length - 10), listado[0]?.celular.length) : listado[0]?.celular ||'',
        correo: listado[0]?.usuario||'',
        eldepto: listado[0]?.iddepartamento||miUsuario.usuarioDepto,
        mupio: listado[0]?.idmunicipio||miUsuario.usuarioMupio,
        ruta: listado[0]?.encabezado||'',
    });
  
	const [elDeptos, setElDeptos] = useState(listado[0]?.eldepto||miUsuario.usuarioDepto)
	const [listaDeptos, setListaDeptos] = useState([])
	const [elMupios, setElMupios] = useState(defaultValues.mupio||miUsuario.usuarioMupio)
	const [listaMupios, setListaMupios] = useState([])
	const [elIndicativo, setElIndicativo] = useState({country:'Colombia',aka:'co',code:'+57'})

    const paises = [
        {country:'Afghanistan',aka:'af',code:'+93'},
        {country:'Aland Islands',aka:'ax',code:'+358-18'},
        {country:'Albania',aka:'al',code:'+355'},
        {country:'Algeria',aka:'dz',code:'+213'},
        {country:'American Samoa',aka:'as',code:'+1-684'},
        {country:'Andorra',aka:'ad',code:'+376'},
        {country:'Angola',aka:'ao',code:'+244'},
        {country:'Anguilla',aka:'ai',code:'+1-264'},
        {country:'Antarctica',aka:'aq',code:'+'},
        {country:'Antigua and Barbuda',aka:'ag',code:'+1-268'},
        {country:'Argentina',aka:'ar',code:'+54'},
        {country:'Armenia',aka:'am',code:'+374'},
        {country:'Aruba',aka:'aw',code:'+297'},
        {country:'Australia',aka:'au',code:'+61'},
        {country:'Austria',aka:'at',code:'+43'},
        {country:'Azerbaijan',aka:'az',code:'+994'},
        {country:'Bahamas',aka:'bs',code:'+1-242'},
        {country:'Bahrain',aka:'bh',code:'+973'},
        {country:'Bangladesh',aka:'bd',code:'+880'},
        {country:'Barbados',aka:'bb',code:'+1-246'},
        {country:'Belarus',aka:'by',code:'+375'},
        {country:'Belgium',aka:'be',code:'+32'},
        {country:'Belize',aka:'bz',code:'+501'},
        {country:'Benin',aka:'bj',code:'+229'},
        {country:'Bermuda',aka:'bm',code:'+1-441'},
        {country:'Bhutan',aka:'bt',code:'+975'},
        {country:'Bolivia',aka:'bo',code:'+591'},
        {country:'Bonaire Saint Eustatius and Saba ',aka:'bq',code:'+599'},
        {country:'Bosnia and Herzegovina',aka:'ba',code:'+387'},
        {country:'Botswana',aka:'bw',code:'+267'},
        {country:'Bouvet Island',aka:'bv',code:'+'},
        {country:'Brazil',aka:'br',code:'+55'},
        {country:'British Indian Ocean Territory',aka:'io',code:'+246'},
        {country:'British Virgin Islands',aka:'vg',code:'+1-284'},
        {country:'Brunei',aka:'bn',code:'+673'},
        {country:'Bulgaria',aka:'bg',code:'+359'},
        {country:'Burkina Faso',aka:'bf',code:'+226'},
        {country:'Burundi',aka:'bi',code:'+257'},
        {country:'Cambodia',aka:'kh',code:'+855'},
        {country:'Cameroon',aka:'cm',code:'+237'},
        {country:'Canada',aka:'ca',code:'+1'},
        {country:'Cape Verde',aka:'cv',code:'+238'},
        {country:'Cayman Islands',aka:'ky',code:'+1-345'},
        {country:'Central African Republic',aka:'cf',code:'+236'},
        {country:'Chad',aka:'td',code:'+235'},
        {country:'Chile',aka:'cl',code:'+56'},
        {country:'China',aka:'cn',code:'+86'},
        {country:'Christmas Island',aka:'cx',code:'+61'},
        {country:'Cocos Islands',aka:'cc',code:'+61'},
        {country:'Colombia',aka:'co',code:'+57'},
        {country:'Comoros',aka:'km',code:'+269'},
        {country:'Cook Islands',aka:'ck',code:'+682'},
        {country:'Costa Rica',aka:'cr',code:'+506'},
        {country:'Croatia',aka:'hr',code:'+385'},
        {country:'Cuba',aka:'cu',code:'+53'},
        {country:'Curacao',aka:'cw',code:'+599'},
        {country:'Cyprus',aka:'cy',code:'+357'},
        {country:'Czech Republic',aka:'cz',code:'+420'},
        {country:'Democratic Republic of the Congo',aka:'cd',code:'+243'},
        {country:'Denmark',aka:'dk',code:'+45'},
        {country:'Djibouti',aka:'dj',code:'+253'},
        {country:'Dominica',aka:'dm',code:'+1-767'},
        {country:'Dominican Republic',aka:'do',code:'+1-809 and 1-829'},
        {country:'East Timor',aka:'tl',code:'+670'},
        {country:'Ecuador',aka:'ec',code:'+593'},
        {country:'Egypt',aka:'eg',code:'+20'},
        {country:'El Salvador',aka:'sv',code:'+503'},
        {country:'Equatorial Guinea',aka:'gq',code:'+240'},
        {country:'Eritrea',aka:'er',code:'+291'},
        {country:'Estonia',aka:'ee',code:'+372'},
        {country:'Ethiopia',aka:'et',code:'+251'},
        {country:'Falkland Islands',aka:'fk',code:'+500'},
        {country:'Faroe Islands',aka:'fo',code:'+298'},
        {country:'Fiji',aka:'fj',code:'+679'},
        {country:'Finland',aka:'fi',code:'+358'},
        {country:'France',aka:'fr',code:'+33'},
        {country:'French Guiana',aka:'gf',code:'+594'},
        {country:'French Polynesia',aka:'pf',code:'+689'},
        {country:'French Southern Territories',aka:'tf',code:'+'},
        {country:'Gabon',aka:'ga',code:'+241'},
        {country:'Gambia',aka:'gm',code:'+220'},
        {country:'Georgia',aka:'ge',code:'+995'},
        {country:'Germany',aka:'de',code:'+49'},
        {country:'Ghana',aka:'gh',code:'+233'},
        {country:'Gibraltar',aka:'gi',code:'+350'},
        {country:'Greece',aka:'gr',code:'+30'},
        {country:'Greenland',aka:'gl',code:'+299'},
        {country:'Grenada',aka:'gd',code:'+1-473'},
        {country:'Guadeloupe',aka:'gp',code:'+590'},
        {country:'Guam',aka:'gu',code:'+1-671'},
        {country:'Guatemala',aka:'gt',code:'+502'},
        {country:'Guernsey',aka:'gg',code:'+44-1481'},
        {country:'Guinea',aka:'gn',code:'+224'},
        {country:'Guinea-Bissau',aka:'gw',code:'+245'},
        {country:'Guyana',aka:'gy',code:'+592'},
        {country:'Haiti',aka:'ht',code:'+509'},
        {country:'Heard Island and McDonald Islands',aka:'hm',code:'+ '},
        {country:'Honduras',aka:'hn',code:'+504'},
        {country:'Hong Kong',aka:'hk',code:'+852'},
        {country:'Hungary',aka:'hu',code:'+36'},
        {country:'Iceland',aka:'is',code:'+354'},
        {country:'India',aka:'in',code:'+91'},
        {country:'Indonesia',aka:'id',code:'+62'},
        {country:'Iran',aka:'ir',code:'+98'},
        {country:'Iraq',aka:'iq',code:'+964'},
        {country:'Ireland',aka:'ie',code:'+353'},
        {country:'Isle of Man',aka:'im',code:'+44-1624'},
        {country:'Israel',aka:'il',code:'+972'},
        {country:'Italy',aka:'it',code:'+39'},
        {country:'Ivory Coast',aka:'ci',code:'+225'},
        {country:'Jamaica',aka:'jm',code:'+1-876'},
        {country:'Japan',aka:'jp',code:'+81'},
        {country:'Jersey',aka:'je',code:'+44-1534'},
        {country:'Jordan',aka:'jo',code:'+962'},
        {country:'Kazakhstan',aka:'kz',code:'+7'},
        {country:'Kenya',aka:'ke',code:'+254'},
        {country:'Kiribati',aka:'ki',code:'+686'},
        {country:'Kosovo',aka:'xk',code:'+'},
        {country:'Kuwait',aka:'kw',code:'+965'},
        {country:'Kyrgyzstan',aka:'kg',code:'+996'},
        {country:'Laos',aka:'la',code:'+856'},
        {country:'Latvia',aka:'lv',code:'+371'},
        {country:'Lebanon',aka:'lb',code:'+961'},
        {country:'Lesotho',aka:'ls',code:'+266'},
        {country:'Liberia',aka:'lr',code:'+231'},
        {country:'Libya',aka:'ly',code:'+218'},
        {country:'Liechtenstein',aka:'li',code:'+423'},
        {country:'Lithuania',aka:'lt',code:'+370'},
        {country:'Luxembourg',aka:'lu',code:'+352'},
        {country:'Macao',aka:'mo',code:'+853'},
        {country:'Macedonia',aka:'mk',code:'+389'},
        {country:'Madagascar',aka:'mg',code:'+261'},
        {country:'Malawi',aka:'mw',code:'+265'},
        {country:'Malaysia',aka:'my',code:'+60'},
        {country:'Maldives',aka:'mv',code:'+960'},
        {country:'Mali',aka:'ml',code:'+223'},
        {country:'Malta',aka:'mt',code:'+356'},
        {country:'Marshall Islands',aka:'mh',code:'+692'},
        {country:'Martinique',aka:'mq',code:'+596'},
        {country:'Mauritania',aka:'mr',code:'+222'},
        {country:'Mauritius',aka:'mu',code:'+230'},
        {country:'Mayotte',aka:'yt',code:'+262'},
        {country:'Mexico',aka:'mx',code:'+52'},
        {country:'Micronesia',aka:'fm',code:'+691'},
        {country:'Moldova',aka:'md',code:'+373'},
        {country:'Monaco',aka:'mc',code:'+377'},
        {country:'Mongolia',aka:'mn',code:'+976'},
        {country:'Montenegro',aka:'me',code:'+382'},
        {country:'Montserrat',aka:'ms',code:'+1-664'},
        {country:'Morocco',aka:'ma',code:'+212'},
        {country:'Mozambique',aka:'mz',code:'+258'},
        {country:'Myanmar',aka:'mm',code:'+95'},
        {country:'Namibia',aka:'na',code:'+264'},
        {country:'Nauru',aka:'nr',code:'+674'},
        {country:'Nepal',aka:'np',code:'+977'},
        {country:'Netherlands',aka:'nl',code:'+31'},
        {country:'New Caledonia',aka:'nc',code:'+687'},
        {country:'New Zealand',aka:'nz',code:'+64'},
        {country:'Nicaragua',aka:'ni',code:'+505'},
        {country:'Niger',aka:'ne',code:'+227'},
        {country:'Nigeria',aka:'ng',code:'+234'},
        {country:'Niue',aka:'nu',code:'+683'},
        {country:'Norfolk Island',aka:'nf',code:'+672'},
        {country:'North Korea',aka:'kp',code:'+850'},
        {country:'Northern Mariana Islands',aka:'mp',code:'+1-670'},
        {country:'Norway',aka:'no',code:'+47'},
        {country:'Oman',aka:'om',code:'+968'},
        {country:'Pakistan',aka:'pk',code:'+92'},
        {country:'Palau',aka:'pw',code:'+680'},
        {country:'Palestinian Territory',aka:'ps',code:'+970'},
        {country:'Panama',aka:'pa',code:'+507'},
        {country:'Papua New Guinea',aka:'pg',code:'+675'},
        {country:'Paraguay',aka:'py',code:'+595'},
        {country:'Peru',aka:'pe',code:'+51'},
        {country:'Philippines',aka:'ph',code:'+63'},
        {country:'Pitcairn',aka:'pn',code:'+870'},
        {country:'Poland',aka:'pl',code:'+48'},
        {country:'Portugal',aka:'pt',code:'+351'},
        {country:'Puerto Rico',aka:'pr',code:'+1-787 and 1-939'},
        {country:'Qatar',aka:'qa',code:'+974'},
        {country:'Republic of the Congo',aka:'cg',code:'+242'},
        {country:'Reunion',aka:'re',code:'+262'},
        {country:'Romania',aka:'ro',code:'+40'},
        {country:'Russia',aka:'ru',code:'+7'},
        {country:'Rwanda',aka:'rw',code:'+250'},
        {country:'Saint Barthelemy',aka:'bl',code:'+590'},
        {country:'Saint Helena',aka:'sh',code:'+290'},
        {country:'Saint Kitts and Nevis',aka:'kn',code:'+1-869'},
        {country:'Saint Lucia',aka:'lc',code:'+1-758'},
        {country:'Saint Martin',aka:'mf',code:'+590'},
        {country:'Saint Pierre and Miquelon',aka:'pm',code:'+508'},
        {country:'Saint Vincent and the Grenadines',aka:'vc',code:'+1-784'},
        {country:'Samoa',aka:'ws',code:'+685'},
        {country:'San Marino',aka:'sm',code:'+378'},
        {country:'Sao Tome and Principe',aka:'st',code:'+239'},
        {country:'Saudi Arabia',aka:'sa',code:'+966'},
        {country:'Senegal',aka:'sn',code:'+221'},
        {country:'Serbia',aka:'rs',code:'+381'},
        {country:'Seychelles',aka:'sc',code:'+248'},
        {country:'Sierra Leone',aka:'sl',code:'+232'},
        {country:'Singapore',aka:'sg',code:'+65'},
        {country:'Sint Maarten',aka:'sx',code:'+599'},
        {country:'Slovakia',aka:'sk',code:'+421'},
        {country:'Slovenia',aka:'si',code:'+386'},
        {country:'Solomon Islands',aka:'sb',code:'+677'},
        {country:'Somalia',aka:'so',code:'+252'},
        {country:'South Africa',aka:'za',code:'+27'},
        {country:'South Georgia and the South Sandwich Islands',aka:'gs',code:'+'},
        {country:'South Korea',aka:'kr',code:'+82'},
        {country:'South Sudan',aka:'ss',code:'+211'},
        {country:'Spain',aka:'es',code:'+34'},
        {country:'Sri Lanka',aka:'lk',code:'+94'},
        {country:'Sudan',aka:'sd',code:'+249'},
        {country:'Suriname',aka:'sr',code:'+597'},
        {country:'Svalbard and Jan Mayen',aka:'sj',code:'+47'},
        {country:'Swaziland',aka:'sz',code:'+268'},
        {country:'Sweden',aka:'se',code:'+46'},
        {country:'Switzerland',aka:'ch',code:'+41'},
        {country:'Syria',aka:'sy',code:'+963'},
        {country:'Taiwan',aka:'tw',code:'+886'},
        {country:'Tajikistan',aka:'tj',code:'+992'},
        {country:'Tanzania',aka:'tz',code:'+255'},
        {country:'Thailand',aka:'th',code:'+66'},
        {country:'Togo',aka:'tg',code:'+228'},
        {country:'Tokelau',aka:'tk',code:'+690'},
        {country:'Tonga',aka:'to',code:'+676'},
        {country:'Trinidad and Tobago',aka:'tt',code:'+1-868'},
        {country:'Tunisia',aka:'tn',code:'+216'},
        {country:'Turkey',aka:'tr',code:'+90'},
        {country:'Turkmenistan',aka:'tm',code:'+993'},
        {country:'Turks and Caicos Islands',aka:'tc',code:'+1-649'},
        {country:'Tuvalu',aka:'tv',code:'+688'},
        {country:'U.S. Virgin Islands',aka:'vi',code:'+1-340'},
        {country:'Uganda',aka:'ug',code:'+256'},
        {country:'Ukraine',aka:'ua',code:'+380'},
        {country:'United Arab Emirates',aka:'ae',code:'+971'},
        {country:'United Kingdom',aka:'gb',code:'+44'},
        {country:'United States Minor Outlying Islands',aka:'um',code:'+1'},
        {country:'United States',aka:'us',code:'+1'},
        {country:'Uruguay',aka:'uy',code:'+598'},
        {country:'Uzbekistan',aka:'uz',code:'+998'},
        {country:'Vanuatu',aka:'vu',code:'+678'},
        {country:'Vatican',aka:'va',code:'+379'},
        {country:'Venezuela',aka:'ve',code:'+58'},
        {country:'Vietnam',aka:'vn',code:'+84'},
        {country:'Wallis and Futuna',aka:'wf',code:'+681'},
        {country:'Western Sahara',aka:'eh',code:'+212'},
        {country:'Yemen',aka:'ye',code:'+967'},
        {country:'Zambia',aka:'zm',code:'+260'},
        {country:'Zimbabwe',aka:'zw',code:'+263'}
    ];

    const setCountry = (indicativo) => {
        let elElegido = {country:'Colombia',aka:'co',code:'+57'}
        paises.forEach((pai) => {
            if(pai.code.toString() === indicativo.target.value.toString()){
                elElegido = pai
            }            
        })
        setElIndicativo(elIndicativo => elElegido)
    }

	const { control, register, reset, formState: { errors } , handleSubmit } = useForm({});

	const elFade = {form:'elFormulario',response:'laRespuesta'}

    // eslint-disable-next-line
	const [errorMessage, setErrorMessage] = useState({class:"text-success",message:""})

    const setDefaults = () => {
        defaultValues = {
            idusuario: reference||miUsuario.usuarioId,
            idcampana: miUsuario.usuarioCampanaId,
            nombres: listado[0]?.nombres||'',
            indicativo: (listado[0]?.celular?.length >10)? listado[0]?.celular.substr(0, (listado[0]?.celular.length - 10)) : '+57' ||'+57',
            celular: (listado[0]?.celular?.length >10)? listado[0]?.celular.substr((listado[0]?.celular.length - 10), listado[0]?.celular.length) : listado[0]?.celular ||'',
            correo: listado[0]?.usuario||'',
            eldepto: listado[0]?.iddepartamento||miUsuario.usuarioDepto,
            mupio: listado[0]?.idmunicipio||miUsuario.usuarioMupio,
            ruta: listado[0]?.encabezado||'',
        }

        setElDeptos(value => {return defaultValues.eldepto})
        setElMupios(value => {return defaultValues.mupio})

        reset({...defaultValues})
    }

    const handleUpload = (e) => {

        // eslint-disable-next-line
        console.log('El target: ', e)

        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            e.target.value = '';
            return
        }

        if (e.target.files[0].size > 780000) {
            setSelectedFile(undefined)
            e.target.value = '';
            swal.fire({
                title: 'El volante es muy grande',
                text: 'El volante no debe tener mas de 750 Kb',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText:'Ok',
                customClass: {
                    confirmButton:'btn btn-warning'
                }
            })
            return
        }
        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    };

	const onRegister = async(data) => {
        if(data!==""){
            setWaiting(waiting => true)

            const formData = new FormData();

            formData.append("personal", data.personal);
            formData.append("nombres", data.nombres);
            formData.append("indicativo", data.indicativo);
            formData.append("celular", data.celular);
            formData.append("correo", data.correo);
            formData.append("eldepto", data.eldepto);
            formData.append("mupio", data.mupio);

            formData.append("picture", data.ruta[0].name );
            formData.append("idusuario", miUsuario.usuarioId);
            formData.append("campana", miUsuario.usuarioCampanaId[0]);
            formData.append("volante", data.ruta[0]);

           
            await fetch(uRl, {
                method: 'POST',
/*                 headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization' : `Bearer ${miUsuario.token}`
                }, */
                body: formData,
            })
            .then((response) => response.json())
            .then((resultado) =>{

                swal.fire({
                    title: resultado.status,
                    text: resultado.message,
                    icon: resultado.status,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText:'Ir al inicio',
                    cancelButtonText:'Intentar de nuevo',
                    customClass: {
                        confirmButton:'btn btn-success',
                        cancelButton:'btn btn-warning'
                    }
                }).then(answer =>{
                    if(answer.isConfirmed){
                        navegar(miUsuario.usuarioIndex)
                    }else{
                        window.location.reload(false)
                    }
                })
            });

            setWaiting(waiting => false)
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

    // GET USER INFO TO SHOW UP
    const getMyInfo = async() => {
        setWaiting(waiting => true)

        await messenger.poster({
            method: 'POST',
            value: { 
                reference: miUsuario.usuarioId,
                campana: miUsuario.usuarioCampanaId 
            },
            url: myConst.roots.engine + myConst.roots.getMyInfo
        }).then((elMensaje) =>{
            listado = elMensaje.message
            setPreview(antes => myConst.roots.engine+elMensaje.message[0].encabezado )
            setDefaults()
            setWaiting(waiting => false)
		})
        .catch(error =>{
            setWaiting(waiting => false)
            // eslint-disable-next-line
            console.log('Error: ', error.toString())
            swal.fire({
                title: "!!!",
                text: "No tenemos su informacion",
                icon: "warning",
                showConfirmButton: true,
                confirmButtonText:'Ir al inicio',
                cancelButtonText:'Reintentar',
                customClass: {
                    confirmButton:'btn btn-success',
                    cancelButton:'btn btn-warning'
                }
            })
            .then(answer =>{
                if(answer.isConfirmed){
                    navegar(miUsuario.usuarioIndex)
                }else{
                    setDefaults()
                    
                }
            })
        })
        
    }

    const getListaMupios = async(event) => {
        defaultValues.eldepto = event.target.value||elDeptos

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

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])    

    useEffect(() => {
        getMyInfo()
        // eslint-disable-next-line
        setWaiting(waiting => true)

        setIsFetching(isFetching => true)

        setDefaults();

        getListaDeptos();

        getListaMupios({target:{value:defaultValues.eldepto}});

		setIsFetching(isFetching => false)
        setWaiting(waiting => false)
  
    }, [listado]);


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
                                                        Mis datos
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (reference !== "undefined" && reference !== null) ? <input type="hidden" value={reference} {...register("personal")} /> : "" }
                                                   
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

                                                    <div className="form-group text-left has-feedback">
                                                        <div className="row">
                                                            <div className="col text-left has-feedback">
                                                                <label htmlFor='indicativo'>Indicativo:</label>
                                                                <img id={'img'+elIndicativo.country} src={"assets/img/flags/"+elIndicativo.aka+".png"} className='mg-2' />
                                                                <Controller
                                                                    name="indicativo"
                                                                    control={control}
                                                                    defaultValue={elIndicativo.code}
                                                                    render={({ onChange, value, ref }) => (
                                                                        <select 
                                                                            {...register("indicativo", {
                                                                                onChange: (e) => {setCountry(e)},
                                                                                required:true,
                                                                            })}
                                                                            value={elIndicativo.code}
                                                                            className="form-control input-group">
                                                                            {
                                                                                paises.map((country,c) =>{
                                                                                    // style={{backgroundImage:"url(assets/img/flags/"+country.aka+".png)"}}
                                                                                    return (
                                                                                        <option key={'indicativo'+c} 
                                                                                            value={country.code}
                                                                                            >
                                                                                            {country.country+' ('+country.code+')'}
                                                                                        </option>
                                                                                    );
                                                                                })
                                                                            }                                                                        
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="col text-left has-feedback">
                                                                <label htmlFor='celular'>Whatsapp:</label>
                                                                <input type="text" className="form-control" placeholder='3117696973'
                                                                {...register("celular", {
                                                                    required:true,
                                                                    minLength: 10,
                                                                    maxLength: 10,
                                                                    pattern: /^\d+$/ //eslint-disable-line
                                                                })} />
                                                                { errors.celular?.type === 'required' && <small className="form-text text-danger">Escriba un celular con acceso a Whatsapp por favor</small> }
                                                                { errors.celular?.type === 'pattern' && <small className="form-text text-danger">Sólo números, ejemplo: 3117696973</small> }
                                                            </div>
                                                        </div>
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

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor="ruta" className="placeholder">Volante del tarjetón (Cargar la imagen)</label>
                                                        <Controller
                                                            name="ruta"
                                                            control={control}
                                                            render={({ field: { value, onChange, ...field } }) => (
                                                                <input type="file" 
                                                                className="form-control" 
                                                                placeholder='Cargar volante'
                                                                accept="image/png, image/jpeg, image/jpg"
                                                                
                                                                {...register("ruta", {
                                                                    required:true,
                                                                    onChange: (e) => {handleUpload(e)},
                                                                    lessThan10MB: (files) => files[0]?.size < 780000 || "Tamaño maximo del volante: 750Kb"
                                                                })} />
                                                            )}
                                                            rules={{ required: true }}
                                                        />
                                                        { errors.ruta?.type === 'required' && <small className="form-text text-danger">Cargue el volante</small> }
                                                    </div>

                                                    <div className='card-action text-center'>
                                                        <button
                                                            type='submit'
                                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                            disabled={errorMessage.message||waiting}
                                                        >
                                                            Guardar
                                                        </button>
                                                    </div>
                                                    <div className='text-center'>
                                                        {preview && <img className="img-fluid" src={preview} alt="Img preview" /> }
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