import { Fragment, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import swal from 'sweetalert2';
// eslint-disable-next-line
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import {
    align,
    font,
    fontColor,
    fontSize,
    formatBlock,
    hiliteColor,
    horizontalRule,
    lineHeight,
    list,
    paragraphStyle,
    table,
    template,
    textStyle,
    image,
    video,
    link
} from 'suneditor/src/plugins';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import { privateRoutes } from '../../services/routes';

import UserHead from '../components/head';
import { Forbidden } from '../forbidden';
import { Foot } from '../components/foot';

/**
 * Alta/edición de un aviso institucional (SAE - public.tabavisroll).
 * Patrón de referencia: pages/comunicados/comunicadosAdd.js
 *  - El autor es transparente: se toma de miUsuario.usuarioId (no se pide al usuario).
 *  - El contenido usa SunEditor (wysiwyg) con react-hook-form (Controller).
 */
export default function AddAviso() {
    const limitFile = 3145728; // 3Mb
    const miUsuario = tool.getUser();
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);

    const params = useLocation();
    const navegar = useNavigate();

    let uRl = myConst.roots.engine + myConst.roots.avisoNew;
    let titulo = myConst.labels.avisosAdd[0][0];

    const id = (params.state) ? params.state.reference : null;

    if (id !== 'undefined' && id !== null) {
        uRl = myConst.roots.engine + myConst.roots.avisoUpdate;
        titulo = myConst.labels.avisosAdd[1][0];
    } else {
        tool.removeStorage('record');
    }

    const record = (id !== 'undefined' && id !== null) ? (tool.getRecord() || {}) : {};

    const editorRef = useRef(null);

    // The sunEditor parameter will be set to the core suneditor instance when this function is called
    const getSunEditorInstance = (sunEditor) => {
        editorRef.current = sunEditor;
    };

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            idregistro: record.idregistro || id || '',
            titulo: record.titulo || '',
            contenido: record.contenido || '',
            imagen: record.imagen || '',
        }
    });

    const elFade = { form: 'elFormulario', response: 'laRespuesta' };

    const [selectedFile, setSelectedFile] = useState('');
    const [preview, setPreview] = useState();

    const handleUpload = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            e.target.value = '';
            return;
        }

        if (e.target.files[0].size > limitFile) {
            setSelectedFile(undefined);
            e.target.value = '';
            swal.fire({
                title: 'El archivo es muy grande',
                text: `El archivo no debe tener más de ${limitFile / (1024 * 1024)} Mb`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Ok',
                customClass: { confirmButton: 'btn btn-warning' },
            });
            return;
        }

        setSelectedFile(e.target.files[0]);
    };

    // Create a preview as a side effect, whenever selected file is changed.
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const onRegister = async (data) => {
        if (data !== '') {
            setWaiting(true);

            // El autor es un dato transparente tomado del usuario logueado.
            data.idautor = miUsuario.usuarioId;
            data.id_institucion = miUsuario.usuarioEmpresaId;

            const formData = new FormData();
            formData.append('idautor', data.idautor);
            formData.append('id_institucion', data.id_institucion);
            formData.append('titulo', data.titulo);
            formData.append('contenido', data.contenido);
            formData.append('idregistro', data.idregistro || '');
            if (data.imagen) formData.append('imagen', data.imagen);

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            await messenger.posterFile({
                method: 'POST',
                value: formData,
                url: uRl,
            }).then((resultado) => {
                swal.fire({
                    title: myConst.protocolMessages.status[resultado.statusCode],
                    text: resultado.message,
                    icon: resultado.status,
                    showConfirmButton: true,
                    customClass: { confirmButton: 'btn btn-primary' },
                }).then((answer) => {
                    if (answer.isConfirmed) {
                        navegar(privateRoutes.AVISOS_LIST, { replace: true });
                    }
                });
            });

            setWaiting(false);
        }
    };

    if (!miUsuario.isLogged) {
        return <Fragment><Forbidden /></Fragment>;
    }

    return (
        <Fragment>
            <div id='elgrapper' className="wrapper">
                <UserHead waiting={waiting} setWaiting={setWaiting} />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-inner mt--5">
                                <h1 className="text-center">
                                    <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                    {titulo}
                                </h1>
                            </div>
                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">{titulo}</h4>
                                                    <Link to={privateRoutes.AVISOS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.avisosList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    {(id !== 'undefined' && id !== null) && <input type="hidden" {...register('idregistro')} />}

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor="titulo">Título:</label>
                                                        <input type="text" className="form-control" placeholder="Comunicado de convivencia"
                                                            {...register('titulo', { required: true, minLength: 4 })} />
                                                        {errors.titulo?.type === 'required' && <small className="form-text text-danger">¿Cuál es el título del aviso?</small>}
                                                        {errors.titulo?.type === 'minLength' && <small className="form-text text-danger">El título está corto</small>}
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor="contenido" className="placeholder">Contenido del aviso</label>
                                                        <Controller
                                                            name="contenido"
                                                            control={control}
                                                            defaultValue={record.contenido || ''}
                                                            render={({ field }) => (
                                                                <SunEditor
                                                                    lang="es"
                                                                    height="320px"
                                                                    {...field}
                                                                    placeholder="Detalle del aviso"
                                                                    autoFocus={false}
                                                                    setOptions={{
                                                                        buttonList: [
                                                                            ["undo", "redo"],
                                                                            ["font", "fontSize", "formatBlock"],
                                                                            ["paragraphStyle"],
                                                                            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                                                                            ["fontColor", "hiliteColor"],
                                                                            ["removeFormat"],
                                                                            ["outdent", "indent"],
                                                                            ["align", "horizontalRule", "list", "lineHeight"],
                                                                            ["table", "link", "image", "video"]
                                                                        ],
                                                                        formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
                                                                        font: [
                                                                            "Arial", "Calibri", "Comic Sans", "Courier", "Garamond",
                                                                            "Georgia", "Impact", "Lucida Console", "Palatino Linotype",
                                                                            "Segoe UI", "Tahoma", "Times New Roman", "Trebuchet MS"
                                                                        ],
                                                                        plugins: [align, font, fontColor, fontSize, formatBlock,
                                                                            hiliteColor, horizontalRule, lineHeight, list,
                                                                            paragraphStyle, table, template, textStyle,
                                                                            image, video, link]
                                                                    }}
                                                                    getSunEditorInstance={getSunEditorInstance}
                                                                    onChange={(text) => field.onChange(text)}
                                                                />
                                                            )}
                                                            rules={{ required: true }}
                                                        />
                                                        {errors.contenido?.type === 'required' && <small className="form-text text-danger">¿Cuál es el contenido del aviso?</small>}
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor="file" className="placeholder">Imagen / archivo adjunto: </label>
                                                        <input type="file"
                                                            className="form-control-file"
                                                            placeholder="Cargar imagen o PDF"
                                                            accept="image/png, image/jpg, image/jpeg, image/gif, application/pdf"
                                                            {...register('imagen', {
                                                                onChange: (e) => handleUpload(e),
                                                            })} />
                                                        {selectedFile?.type?.includes('image/') &&
                                                            <div className="col-md-4 px-0 text-center">
                                                                <img className="img-thumbnail rounded center-block" width="400" src={preview} alt="Img preview" />
                                                            </div>
                                                        }
                                                        {selectedFile?.type?.includes('/pdf') &&
                                                            <div className="card card-stats card-round">
                                                                <div className="card-body">
                                                                    <div className="row align-items-center">
                                                                        <div className="col-icon">
                                                                            <div className="icon-big text-center icon-danger bubble-shadow-small">
                                                                                <i className="fas fa-file-pdf"></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col col-stats ml-3 ml-sm-0">
                                                                            <div className="numbers">
                                                                                <h4 className="card-title">{selectedFile.name}</h4>
                                                                                <p className="card-category">{(selectedFile.size / (1024 * 1024)).toFixed(1)} Mb</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>

                                                    <div className="card-action text-center">
                                                        <button type="submit"
                                                            className={waiting ? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                            disabled={waiting}>
                                                            {titulo}
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
