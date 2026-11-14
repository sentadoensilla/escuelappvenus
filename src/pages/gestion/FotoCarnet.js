import { useRef, useState } from 'react';
import swal from 'sweetalert2';
import AppIcon from '../components/AppIcon';
import * as myConst from '../../main/constants';

/**
 * FotoCarnet — selector de foto para el formulario.
 *
 * Permite cargar la imagen desde la GALERÍA o la CÁMARA del dispositivo
 * (`capture="environment"` en móvil) y la reduce a tamaño carnet (300x400)
 * devolviéndola como JPEG en base64 (data URL). Al guardar, el backend escribe
 * la imagen como archivo y almacena la RUTA en la base de datos.
 */

// Reduce una imagen a 300x400 (carnet) cubriendo el área y con fondo blanco.
function reducirImagen(archivo) {
    return new Promise((resolver, rechazar) => {
        if (!archivo) { resolver(''); return; }
        const lector = new FileReader();
        lector.onload = () => {
            const imagen = new Image();
            imagen.onload = () => {
                const ancho = 300;
                const alto = 400;
                const lienzo = document.createElement('canvas');
                lienzo.width = ancho;
                lienzo.height = alto;
                const ctx = lienzo.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, ancho, alto);
                const escala = Math.max(ancho / imagen.width, alto / imagen.height);
                const w = imagen.width * escala;
                const h = imagen.height * escala;
                ctx.drawImage(imagen, (ancho - w) / 2, (alto - h) / 2, w, h);
                resolver(lienzo.toDataURL('image/jpeg', 0.7));
            };
            imagen.onerror = () => rechazar(new Error('No se pudo leer la imagen'));
            imagen.src = lector.result;
        };
        lector.onerror = () => rechazar(new Error('No se pudo leer el archivo'));
        lector.readAsDataURL(archivo);
    });
}

export default function CampoFoto({ value, onChange }) {
    const inputGaleria = useRef(null);
    const inputCamara = useRef(null);
    const [procesando, setProcesando] = useState(false);

    // `value` puede ser una data URL (imagen recién elegida) o una ruta
    // guardada por el backend (p.ej. "archivos/docentes/xxx.jpg").
    const srcFoto = !value
        ? ''
        : (value.startsWith('data:') ? value : `${myConst.roots.engine}/p/${value}`);

    const seleccionar = async (evento) => {
        const archivo = evento.target.files && evento.target.files[0];
        evento.target.value = '';
        if (!archivo) return;
        if (!/^image\//.test(archivo.type)) {
            swal.fire({ title: 'Archivo no válido', text: 'Selecciona una imagen (JPG/PNG).', icon: 'warning', showConfirmButton: true, customClass: { confirmButton: 'btn btn-primary' } });
            return;
        }
        setProcesando(true);
        try {
            const base64 = await reducirImagen(archivo);
            onChange(base64);
        } catch (error) {
            swal.fire({ title: 'Error', text: error.message, icon: 'error', showConfirmButton: true, customClass: { confirmButton: 'btn btn-primary' } });
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="text-center">
            <div className="mb-2">
                {srcFoto
                    ? <img src={srcFoto} alt="Foto" className="img-thumbnail" style={{ width: '150px', height: '200px', objectFit: 'cover' }} />
                    : <div className="border rounded mx-auto d-flex align-items-center justify-content-center text-muted" style={{ width: '150px', height: '200px' }}>
                        <AppIcon icon="tabler:user" size="48" />
                    </div>}
            </div>
            {/* Galería: selector de archivos del dispositivo (permite elegir cámara o galería). */}
            <input ref={inputGaleria} type="file" accept="image/*" className="d-none" onChange={seleccionar} />
            {/* Cámara: en móvil abre directamente la cámara trasera. */}
            <input ref={inputCamara} type="file" accept="image/*" capture="environment" className="d-none" onChange={seleccionar} />
            <button type="button" className="btn btn-outline-primary btn-sm me-1" onClick={() => inputGaleria.current && inputGaleria.current.click()}>
                <AppIcon icon="tabler:photo" /> {procesando ? 'Procesando…' : (value ? 'Cambiar foto' : 'Subir foto')}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm me-1" onClick={() => inputCamara.current && inputCamara.current.click()}>
                <AppIcon icon="tabler:camera" /> Tomar foto
            </button>
            {value && (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onChange('')}>Quitar</button>
            )}
            <div><small className="text-muted">Desde la galería o la cámara (se reduce a 300x400)</small></div>
        </div>
    );
}
