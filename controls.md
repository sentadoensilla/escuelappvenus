# Catálogo de controles ReactJS con `react-hook-form` — Venus / Escuelapp

> Guía de referencia para **revisar y corregir formularios**. Para cada situación hay un
> control recomendado, el ejemplo mínimo con `react-hook-form` y una nota de compatibilidad
> con **smartphone**. Cuando en una revisión se pida "cambia este control por otro más
> adecuado", el reemplazo sale de aquí.

**Base visual:** plantilla **Atlantis** (`/Users/sentadoensilla/side projects/Venus/atlantis`)
sobre **Bootstrap 4.6.2**. En el front se cargan ambos CSS (`public/index.html`):
- `assets/css/bootstrap.min.css` → clases Bootstrap (`.form-control`, `.form-check`, `.custom-*`, `.input-group`, `.btn`, grid).
- `assets/css/atlantis.min.css` → clases Atlantis (`.form-group`, `.form-floating-label`, `.input-solid`, `.selectgroup`, `.form-radio-*`, `.btn-round`, …).

**Librerías disponibles** (`venus/package.json`): `react-hook-form` 7.40, `react-select` 5.8,
`react-datepicker` 4.8, `react-dropzone` 14.2, `suneditor-react` 3.5, `bootstrap` 4.6.2.

---

## 0. Cómo usar este catálogo en una revisión

1. Abre el formulario (`pages/<modulo>/<modulo>Add.js`).
2. Ubica el control en la **§3 Tabla resumen** y salta a su sección en **§4**.
3. Compara con el ejemplo. El cambio típico se busca en **§7 "Si ves X, cámbialo por Y"**.
4. Aplica también la regla móvil de **§6** (nada de controles que se desborden en celular).

---

## 1. Reglas de oro

1. **Siempre `react-hook-form`** (`import { Controller, useForm } from 'react-hook-form'`).
   No manejar cada input con `useState` si `register`/`Controller` lo resuelve.
2. **`register`** para controles nativos simples (`text`, `email`, `number`, `date`, `file`,
   `textarea`, `select` básico).
3. **`Controller`** cuando el valor no es un string nativo o se necesita defaultValue/eventos:
   `DatePicker`, `react-select`, `SunEditor`, radios/checks controlados, selects con estado.
4. **Mobile-first**: el formulario debe funcionar en pantalla de ~360 px.
5. **Etiqueta visible** (`<label htmlFor>`) y **error en línea** junto al campo.
6. **PK/FK ocultas**: `idregistro` y las FKs viajan en `input type="hidden"` + `register`.
7. **Nunca** `document.getElementById`, jQuery ni `onclick="..."` en código nuevo.
8. Enviar con `handleSubmit(onRegister)`; `onRegister` es `async (data) => {…}`.

---

## 2. Esqueleto base de un formulario

```jsx
import { Fragment, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';

import UserHead from '../components/head';
import { Foot } from '../components/foot';

export default function EjemploAdd() {
  const miUsuario = tool.getUser();
  // eslint-disable-next-line
  const { waiting, setWaiting } = useContext(UserContext);

  const defaultValues = {
    idregistro: null,
    descripcion: '',
    idestado: '',
  };

  const {
    register, control, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const onRegister = async (data) => {
    setWaiting(true);
    const payload = {
      ...data,
      idautor: miUsuario.usuarioId,          // autor transparente (no se pide en el form)
      id_institucion: miUsuario.usuarioEmpresaId,
      ano_lectivo: miUsuario.usuarioAnoId,
    };
    await messenger.poster({ method: 'POST', value: payload, url: myConst.roots.engine + myConst.roots.xNew });
    setWaiting(false);
  };

  return (
    <Fragment>
      <div id="elgrapper" className="wrapper">
        <UserHead waiting={waiting} setWaiting={setWaiting} />
        <div className="main-panel"><div className="content"><div className="page-inner">
          <form onSubmit={handleSubmit(onRegister)} method="POST" noValidate>
            <div className="row">
              {/* col-12 en celular, 2 columnas en tablet, 3 en escritorio */}
              <div className="col-12 col-sm-6 col-lg-4">
                <div className={errors.descripcion ? 'form-group has-error has-feedback' : 'form-group'}>
                  <label htmlFor="descripcion">Descripción:</label>
                  <input
                    id="descripcion"
                    type="text"
                    className="form-control"
                    placeholder="Matemáticas"
                    {...register('descripcion', { required: true, minLength: 3 })}
                  />
                  {errors.descripcion?.type === 'required' && (
                    <small className="form-text text-danger">La descripción es obligatoria</small>
                  )}
                  {errors.descripcion?.type === 'minLength' && (
                    <small className="form-text text-danger">Mínimo 3 caracteres</small>
                  )}
                </div>
              </div>
            </div>

            <div className="card-action text-center">
              <button type="submit" className={waiting ? 'btn is-loading btn-warning' : 'btn btn-primary'}
                disabled={waiting}>
                Guardar
              </button>
              <button type="button" className="btn btn-border btn-light ml-1" onClick={() => reset(defaultValues)}>
                Cancelar
              </button>
            </div>
          </form>
        </div></div></div>
        <Foot />
      </div>
    </Fragment>
  );
}
```

> Referencias reales: [`pages/areas/areasAdd.js`](venus/src/pages/areas/areasAdd.js) (mínimo),
> [`pages/comunicados/comunicadosAdd.js`](venus/src/pages/comunicados/comunicadosAdd.js) (completo).

---

## 3. Tabla resumen

| Necesidad | Control recomendado | Móvil |
|---|---|---|
| Texto corto | `input type="text"` (`register`) | Teclado estándar |
| Correo | `input type="email"` | Teclado con `@` |
| Teléfono / celular | `input type="tel"` + `inputMode="tel"` | Teclado numérico-marcación |
| Número / valor | `input type="number"` + `inputMode` | Teclado numérico |
| Clave | `input type="password"` + checkbox "ver clave" | Teclado estándar |
| Dato oculto (PK/FK) | `input type="hidden"` | — |
| Texto largo sin formato | `textarea` | Crece vertical, sin scroll lateral |
| Texto largo con formato | `SunEditor` | Reducir `buttonList`; toolbar wrap |
| Lista corta de opciones | `select` nativo con `Controller` | Select nativo del SO (ideal móvil) |
| Lista larga / con búsqueda | `react-select` | Táctil, `menuPortalTarget` |
| Selección múltiple | `react-select isMulti` o `selectgroup-pills` | Pills hacen wrap |
| Única respuesta (2–4) | radio en `.selectgroup` | Botones grandes |
| Múltiples respuestas | checkbox / `.selectgroup-pills` | Botones grandes |
| Sí/No booleano | switch (`custom-control custom-switch`) o selectgroup | Área táctil amplia |
| Fecha | `input type="date"` (móvil) / `DatePicker` (escritorio) | Nativo es lo más confiable |
| Hora | `input type="time"` | Selector nativo |
| Fecha + hora | `input type="datetime-local"` | Selector nativo |
| Imagen / archivo | `input type="file"` | `accept` + `capture` |
| Varios archivos | `react-dropzone` | Botón grande |
| Color | `input type="color"` | Selector nativo |
| Rango | `input type="range"` | Pulgar táctil |
| Prefijo/ícono/botón | `.input-group` | Cuidar desbordes |

---

## 4. Catálogo detallado

### 4.1 `input type="text"` — texto corto

**Cuándo:** nombre, título, código, descripción corta.

```jsx
<div className="form-group">
  <label htmlFor="nombres">Nombre completo:</label>
  <input
    id="nombres"
    type="text"
    className="form-control"
    placeholder="Ana"
    autoComplete="name"
    {...register('nombres', { required: true, minLength: 7, maxLength: 80 })}
  />
  {errors.nombres?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama?</small>}
  {errors.nombres?.type === 'minLength' && <small className="form-text text-danger">El nombre está corto</small>}
</div>
```

**Móvil:** `autoComplete` correcto y `inputMode` acorde evitan correcciones molestas.
**Real:** `comunicadosAdd.js:451`, `usuariosAdd.js:309`.

---

### 4.2 `input type="email"` — correo

```jsx
<input
  id="correo"
  type="email"
  className="form-control"
  placeholder="mivotante@hotmail.com"
  autoComplete="email"
  inputMode="email"
  {...register('correo', {
    required: true,
    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
  })}
/>
{errors.correo?.type === 'pattern' && <small className="form-text text-danger">Correo mal escrito</small>}
```

**Móvil:** `type="email"` cambia el teclado (incluye `@` y `.`).
**Nota:** en el proyecto hay campos con `type="text"` que son correo (`usuariosAdd.js:365`) → **candidatos a cambio**.

---

### 4.3 `input type="tel"` — teléfono / celular

```jsx
<input
  id="celular"
  type="tel"
  className="form-control"
  placeholder="3117696973"
  autoComplete="tel"
  inputMode="tel"
  {...register('celular', { required: true, minLength: 10, maxLength: 10, pattern: /^\d+$/ })}
/>
{errors.celular?.type === 'pattern' && <small className="form-text text-danger">Sólo números, 10 dígitos</small>}
```

**Móvil:** teclado de marcación; mejor que `type="text"` con patrón.
**Real:** `usuariosAdd.js:351` (hoy es `type="text"`).

---

### 4.4 `input type="number"` — numérico

```jsx
<input
  id="valorinscripcion"
  type="number"
  className="form-control"
  inputMode="decimal"
  step="0.01"
  min="0"
  {...register('valorinscripcion', { required: true, min: 0, valueAsNumber: true })}
/>
```

**Móvil:** `inputMode` decide el teclado (`numeric`, `decimal`, `tel`). Para identificaciones
largas preferir `type="text" inputMode="numeric"` (evita la rueda numérica que corta ceros).
**Real:** `matriculasAdd.js:221`.

---

### 4.5 `input type="password"` + ver clave

```jsx
const [verClave, setVerClave] = useState(false);

<input
  id="clave"
  type={verClave ? 'text' : 'password'}
  className="form-control"
  autoComplete="new-password"
  {...register('clave', {
    required: !id,
    minLength: 6,
    maxLength: 64,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@[-`{-~]).{6,64}$/, // eslint-disable-line
  })}
/>
<label htmlFor="visible" className="form-check-label">
  <input type="checkbox" id="visible" className="form-check-input" checked={verClave}
    onChange={() => setVerClave(v => !v)} />
  <span className="form-check-sign"> Ver la clave</span>
</label>
```

**Móvil:** el checkbox "ver clave" es clave en celular (teclados agresivos).
**Real:** `usuariosAdd.js:320`, `pages/usuarios/passwordChange.js`.

---

### 4.6 `input type="hidden"` — PK/FK y contexto

```jsx
{id !== undefined && id !== null && (
  <input type="hidden" value={id} {...register('idregistro')} />
)}
<input type="hidden" {...register('id_institucion')} defaultValue={miUsuario.usuarioEmpresaId} />
```

**Uso:** `idregistro` en edición y FKs que no debe ver el usuario (se llenan con `defaultValue` o
`setValue`). **No** usar hidden para datos que se toman del usuario en sesión dentro de
`onRegister` (eso se inyecta en el payload, no en el formulario).
**Real:** `comunicadosAdd.js:448`, `matriculasAdd.js:143`.

---

### 4.7 `textarea` — texto largo sin formato

```jsx
<textarea className="form-control" rows="3" maxLength={500}
  {...register('comentario', { maxLength: 500 })} />
{errors.comentario?.type === 'maxLength' && <small className="form-text text-danger">Máximo 500 caracteres</small>}
```

**Móvil:** `rows` razonable (3–5) y sin ancho fijo. Si el texto lleva formato → §4.8.
**Real:** `areasAdd.js:120`.

---

### 4.8 `SunEditor` — texto enriquecido (HTML)

```jsx
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

<Controller
  name="comunicate"
  control={control}
  defaultValue=""
  rules={{ required: true }}
  render={({ field }) => (
    <SunEditor
      lang="es"
      height="280px"
      {...field}
      setOptions={{
        buttonList: [
          ['undo', 'redo'],
          ['bold', 'underline', 'italic', 'strike'],
          ['fontColor', 'hiliteColor'],
          ['align', 'list', 'lineHeight'],
          ['table', 'link', 'image'],
        ],
        formats: ['p', 'div', 'h1', 'h2', 'h3'],
      }}
      onChange={(text) => field.onChange(text)}
    />
  )}
/>
```

**Móvil:** reducir `buttonList`; el toolbar hace wrap. Para textos cortos, preferir `textarea`.
En listados mostrar sin etiquetas con `tool.removeTags(valor)`.
**Real:** `comunicadosAdd.js:666`, `avisosAdd.js`.

---

### 4.9 `select` nativo simple (con `Controller`)

```jsx
<Controller
  name="idcurso"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <select className="form-control" {...field}>
      <option value="">Seleccione</option>
      {cursos.map((c, i) => <option key={i} value={c.value}>{c.label}</option>)}
    </select>
  )}
/>
{errors.idcurso?.type === 'required' && <small className="form-text text-danger">Seleccione un curso</small>}
```

**Móvil:** el `<select>` nativo abre la rueda del sistema: es **lo más usable** en celular.
**Real:** `matriculasAdd.js:149-179`.

---

### 4.10 `select` nativo múltiple

```jsx
<Controller
  name="idsgrupos"
  control={control}
  render={({ field }) => (
    <select multiple className="form-control" size={5} {...field}>
      {opciones.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
    </select>
  )}
/>
```

**Móvil:** funciona, pero es incómodo para muchos ítems → preferir `selectgroup-pills` (§4.14)
o `react-select isMulti` (§4.12).

---

### 4.11 `react-select` simple (lista larga con búsqueda)

```jsx
import Select from 'react-select';

<Controller
  name="idestudiante"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <Select
      inputRef={field.ref}
      options={estudiantes}              // [{ value, label }]
      value={estudiantes.find(o => o.value === field.value) || null}
      onChange={(op) => field.onChange(op ? op.value : '')}
      isClearable
      isSearchable
      placeholder="Buscar estudiante…"
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  )}
/>
```

**Móvil:** react-select es táctil; con `menuPortalTarget` el menú no queda cortado por
`overflow`. Úsalo cuando la lista tenga más de ~12 opciones.
**Real:** `comunicadosAdd.js:517`.

---

### 4.12 `react-select` multi (varias opciones)

```jsx
<Controller
  name="group"
  control={control}
  defaultValue={[]}
  render={({ field: { onChange, value, ref } }) => (
    <Select
      inputRef={ref}
      isMulti
      isClearable
      isSearchable
      options={listadoGrupos}
      value={listadoGrupos.filter(o => (value || []).includes(o.value))}
      onChange={(ops) => onChange(ops.map(o => o.value))}
      menuPortalTarget={document.body}
      placeholder="Grupos…"
    />
  )}
/>
```

**Móvil:** los "chips" seleccionados hacen wrap; bien. Evitar `isMulti` para listas enormes sin
búsqueda.

---

### 4.13 Checkbox (una casilla)

```jsx
<div className="form-check">
  <label className="form-check-label">
    <input type="checkbox" className="form-check-input" value="1"
      {...register('aceptaTerminos', { required: true })} />
    <span className="form-check-sign"> Acepto los términos</span>
  </label>
  {errors.aceptaTerminos && <small className="form-text text-danger">Debes aceptar</small>}
</div>
```

**Móvil:** el área táctil es la etiqueta completa. No uses checkbox suelto sin `<label>`.
**Real:** `usuariosAdd.js:345`.

---

### 4.14 Grupo de checkbox tipo "pills" (Atlantis `.selectgroup`)

```jsx
<div className="form-group">
  <label className="form-label d-block">Áreas de interés:</label>
  <div className="selectgroup selectgroup-pills w-100">
    {areas.map((a, i) => (
      <label className="selectgroup-item" key={i}>
        <input type="checkbox" className="selectgroup-input" value={a.value}
          {...register('areas')} />
        <span className="selectgroup-button">{a.label}</span>
      </label>
    ))}
  </div>
</div>
```

**Móvil:** `w-100` + `selectgroup-pills` hacen que los botones se envuelvan en varias filas y
queden con buen tamaño táctil.

---

### 4.15 Radio (única respuesta, 2–4 opciones)

```jsx
<div className="form-group">
  <label className="form-label d-block">¿Estudiante nuevo?</label>
  <div className="selectgroup w-100">
    <label className="selectgroup-item">
      <input type="radio" className="selectgroup-input" value="false" {...register('nuevo')} />
      <span className="selectgroup-button">No</span>
    </label>
    <label className="selectgroup-item">
      <input type="radio" className="selectgroup-input" value="true" {...register('nuevo')} />
      <span className="selectgroup-button">Sí</span>
    </label>
  </div>
</div>
```

**Móvil:** botones grandes en una fila que ocupa el 100 %.
**Real:** `matriculasAdd.js:188-214`.

---

### 4.16 Radio clásico Atlantis (`.form-radio-label`)

```jsx
<div className="form-check">
  <label className="form-radio-label">
    <input className="form-radio-input" type="radio" value="M"
      {...register('sexo', { required: true })} />
    <span className="form-radio-sign">Masculino</span>
  </label>
  <label className="form-radio-label ml-3">
    <input className="form-radio-input" type="radio" value="F" {...register('sexo')} />
    <span className="form-radio-sign">Femenino</span>
  </label>
</div>
```

**Móvil:** quitar `ml-3` y separar con `mr-3`/bloque en pantallas pequeñas.

---

### 4.17 Switch on/off (booleano)

Bootstrap 4 lo trae (`.custom-control.custom-switch`), aunque no esté en la galería Atlantis:

```jsx
<div className="custom-control custom-switch">
  <input type="checkbox" className="custom-control-input" id="activo"
    {...register('activo')} />
  <label className="custom-control-label" htmlFor="activo">Activo</label>
</div>
```

**Móvil:** área táctil amplia. Si no hay `.custom-switch` en el CSS cargado, usar §4.15.

---

### 4.18 Fecha nativa — `input type="date"` / `month`

```jsx
<input
  id="fechaini"
  type="date"
  className="form-control"
  {...register('fechaini', { required: true })}
/>
```

```jsx
<input type="month" className="form-control" {...register('periodo')} />
```

**Móvil:** **el control más confiable** en celular (abre el calendario del sistema). Úsalo por
defecto para fechas en formularios; reserva `DatePicker` (§4.20) para vistas de escritorio.

---

### 4.19 Hora — `input type="time"` y fecha+hora

```jsx
<input type="time" className="form-control" {...register('horaInicio')} />
<input type="datetime-local" className="form-control" {...register('cita')} />
```

**Móvil:** selectores nativos; mejor que dos campos de texto.

---

### 4.20 `DatePicker` (react-datepicker)

```jsx
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
registerLocale('es', es);

<Controller
  name="date_init"
  control={control}
  defaultValue={new Date()}
  rules={{ required: true }}
  render={({ field }) => (
    <DatePicker
      locale="es"
      dateFormat="yyyy-MM-dd"
      className="form-control"
      placeholderText="AAAA-MM-DD"
      selected={field.value}
      onChange={(date) => field.onChange(date)}
      withPortal                    // ← evita que se salga de la pantalla en móvil
      popperPlacement="bottom-start"
    />
  )}
/>
```

**Móvil:** `withPortal` + `popperPlacement` y un ancho que no exceda el viewport. Si el campo es
solo fecha y no requiere lógica de calendario, **cámbialo por `input type="date"` (§4.18)**.
**Real:** `comunicadosAdd.js:464-497`.

---

### 4.21 `input type="file"` — imagen / archivo

```jsx
const [preview, setPreview] = useState(null);

<input
  id="archivo"
  type="file"
  className="form-control-file"
  accept="image/png, image/jpeg, application/pdf"
  capture="environment"              // cámara en móvil (opcional, solo imágenes)
  {...register('file', {
    onChange: (e) => {
      const f = e.target.files?.[0];
      setPreview(f ? URL.createObjectURL(f) : null);
    },
    validate: {
      max3MB: (files) => !files?.[0] || files[0].size < 3 * 1024 * 1024 || 'Máximo 3 MB',
      formato: (files) => !files?.[0] ||
        ['image/png', 'image/jpeg', 'application/pdf'].includes(files[0].type) || 'Formato no válido',
    },
  })}
/>
{preview && <img src={preview} alt="Vista previa" className="img-thumbnail mt-2" style={{ maxWidth: '100%' }} />}
```

Envío con `FormData` + `messenger.posterFile`; la API guarda en
`api/public/archivos/<carpeta>/<idInstitucion>/` y el front envía
`id_institucion = miUsuario.usuarioEmpresaId`.
**Móvil:** `accept` filtra la cámara/galería; `capture` abre la cámara directamente. Previsualizar
siempre (el usuario no ve el nombre del archivo en celular).
**Real:** `comunicadosAdd.js:534`, `observacionesAdd.js:544`, `miPerfil.js`.

---

### 4.22 Varios archivos con `react-dropzone`

```jsx
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: { 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
  maxSize: 3 * 1024 * 1024,
  onDrop: (files) => setValue('archivos', files),
});

<div {...getRootProps()} className="border rounded p-4 text-center" role="button">
  <input {...getInputProps()} />
  {isDragActive ? 'Suelta aquí…' : 'Toca para elegir o arrastra archivos'}
</div>
```

**Móvil:** el área completa es táctil ("toca para elegir"); nunca dependas solo de arrastrar.

---

### 4.23 Color

```jsx
<input type="color" className="form-control" style={{ height: 44, padding: 4 }}
  {...register('color')} />
```

Atlantis también documenta "Color Input" con `.input-group` + muestra (documentation/components/forms.html §colorinput).

---

### 4.24 Rango

```jsx
<input type="range" className="custom-range" min="0" max="100" step="1"
  {...register('porcentaje', { valueAsNumber: true })} />
```

**Móvil:** buen control táctil para porcentajes/escalas.

---

### 4.25 `.input-group` — prefijo, ícono o botón

```jsx
<div className="form-group">
  <div className="input-group">
    <div className="input-group-prepend">
      <span className="input-group-text"><i className="flaticon-user" /></span>
    </div>
    <input type="text" className="form-control" placeholder="Usuario"
      {...register('usuario')} />
  </div>
</div>
```

**Móvil:** cuidado con textos largos en el `addon` (se desbordan). Preferir **íconos** en vez de
texto; si el addon es texto largo, apilar el campo fuera del grupo en pantallas pequeñas.

---

### 4.26 Botones de acción

```jsx
<div className="card-action text-center">
  <button type="submit"
    className={waiting ? 'btn is-loading btn-warning w-100 w-sm-auto' : 'btn btn-primary w-100 w-sm-auto'}
    disabled={waiting}>
    Guardar
  </button>
  <button type="button" className="btn btn-border btn-light mt-2 mt-sm-0 ml-sm-1 w-100 w-sm-auto"
    onClick={() => reset(defaultValues)}>
    Cancelar
  </button>
</div>
```

**Móvil:** `w-100` (full width) en celular y ancho automático desde `sm`. Evita botones pequeños
lado a lado. Atlantis: `btn-round`, `btn-border`, `btn-default`.
**Real:** `comunicadosAdd.js:734`.

---

### 4.27 Listas dinámicas (`useFieldArray`)

```jsx
import { useForm, useFieldArray } from 'react-hook-form';

const { control, register, handleSubmit } = useForm({ defaultValues: { items: [{ nombre: '' }] } });
const { fields, append, remove } = useFieldArray({ control, name: 'items' });

{fields.map((item, idx) => (
  <div className="row" key={item.id}>
    <div className="col-12 col-sm-9">
      <input className="form-control" placeholder="Nombre" {...register(`items.${idx}.nombre`)} />
    </div>
    <div className="col-12 col-sm-3 mt-2 mt-sm-0">
      <button type="button" className="btn btn-danger w-100" onClick={() => remove(idx)}>Quitar</button>
    </div>
  </div>
))}
<button type="button" className="btn btn-success btn-block mt-2" onClick={() => append({ nombre: '' })}>
  + Agregar
</button>
```

**Móvil:** cada fila se apila (`col-12`) y los botones ocupan el ancho.

---

## 5. Estados de validación y mensajes

- Contenedor con error: `className={errors.campo ? 'form-group has-error has-feedback' : 'form-group'}`
  (clases Atlantis `has-error` / `has-success`).
- Mensaje: `<small className="form-text text-danger">…</small>` (o `invalid-feedback` de Bootstrap).
- Evaluar por tipo: `errors.campo?.type === 'required' | 'minLength' | 'pattern' | 'maxLength'`.
- Nunca mostrar los errores con `alert()`/`swal` campo por campo; eso es solo para el resultado del envío.

Bootstrap alterno (`.is-invalid` + `.invalid-feedback`):

```jsx
<input className={errors.correo ? 'form-control is-invalid' : 'form-control'} {...register('correo')} />
{errors.correo && <div className="invalid-feedback d-block">Correo inválido</div>}
```

---

## 6. Reglas de responsive / smartphone

1. **Grid mobile-first:** usar `col-12 col-sm-6 col-lg-4` (no solo `col-md-*` ni `col-3` fijos).
2. **Área táctil mínima 44×44 px:** favorecer `.selectgroup`, `btn-block`/`w-100` en móvil.
3. **Teclados correctos:** `type`/`inputMode` según dato (`email`, `tel`, `numeric`, `decimal`, `url`).
4. **Fechas/horas nativas** (`date`, `time`, `datetime-local`, `month`) por defecto en móvil.
5. **Selects:** nativo para listas cortas (rueda del SO); `react-select` con `menuPortalTarget`
   para listas largas/búsqueda.
6. **Toolbar de SunEditor** reducido; los botones deben envolver, no desbordar.
7. **Tablas:** envolver en `.table-responsive` (scroll horizontal) y no forzar anchos fijos.
8. **Modales:** `modal-dialog-centered modal-dialog-scrollable`; evitar formularios largos en modal.
9. **Imágenes/preview:** `style={{ maxWidth: '100%' }}`.
10. **Sin anchos fijos en px** para campos (usar `.form-control`, `w-100`, grid).
11. **Botones de acción:** full width en móvil, en fila desde `sm`.
12. **Probar a 360 px** de ancho (Chrome DevTools → iPhone SE / Galaxy).

---

## 7. Guía de revisión: "si ves X, cámbialo por Y"

| Si ves… | Cámbialo por… | Sección |
|---|---|---|
| `useState` por cada campo | `register` / `Controller` | §2 |
| `<input type="text">` para correo | `type="email" inputMode="email"` | §4.2 |
| `<input type="text">` para celular | `type="tel" inputMode="tel"` | §4.3 |
| `<input type="text">` para valores | `type="number" inputMode="decimal"` | §4.4 |
| `<input type="text">` para fecha | `type="date"` (o `DatePicker`) | §4.18 / §4.20 |
| `<input type="text">` para hora | `type="time"` | §4.19 |
| `DatePicker` solo para fecha | `input type="date"` en móvil | §4.18 |
| `<select>` con muchísimas opciones | `react-select` con búsqueda | §4.11 |
| selección múltiple con `<select multiple>` | `react-select isMulti` / `selectgroup-pills` | §4.12 / §4.14 |
| opción única con checkbox | radio (`selectgroup`) | §4.15 |
| múltiples respuestas con radio | checkbox (`selectgroup-pills`) | §4.14 |
| booleano Sí/No con texto | switch o selectgroup | §4.17 / §4.15 |
| `textarea` con HTML/formato | `SunEditor` | §4.8 |
| `SunEditor` para texto corto | `textarea` | §4.7 |
| archivo con `type="text"` | `input type="file"` con `accept`/`capture` | §4.21 |
| varios archivos de a uno | `react-dropzone` | §4.22 |
| `<a onClick>` para enviar | `<button type="submit">` | §4.26 |
| `document.getElementById` / jQuery | `register` / `Controller` | §1 |
| campo sin `<label>` | agregar `label htmlFor` | §1 |
| error con `alert`/`swal` | `form-text text-danger` inline | §5 |
| `col-md-6` sin columna base | `col-12 col-sm-6 col-lg-4` | §6 |
| botones pequeños en fila | `w-100` en móvil | §4.26 |
| `input type="hidden"` para autor/institución | inyectar en `onRegister` desde `miUsuario` | §4.6 |

---

## 8. Dónde están los ejemplos reales en el proyecto

| Control | Archivo de referencia |
|---|---|
| Formulario rico completo | [`pages/comunicados/comunicadosAdd.js`](venus/src/pages/comunicados/comunicadosAdd.js) |
| Formulario simple | [`pages/areas/areasAdd.js`](venus/src/pages/areas/areasAdd.js) |
| text / password / checkbox | [`pages/usuarios/usuariosAdd.js`](venus/src/pages/usuarios/usuariosAdd.js) |
| select / radio / number / hidden | [`pages/matriculas/matriculasAdd.js`](venus/src/pages/matriculas/matriculasAdd.js) |
| radio / file / DatePicker / multi-select | [`pages/observaciones/observacionesAdd.js`](venus/src/pages/observaciones/observacionesAdd.js) |
| SunEditor (avisos) | [`pages/avisos/avisosAdd.js`](venus/src/pages/avisos/avisosAdd.js) |
| Catálogo genérico (config) | [`src/main/crudConfig.js`](venus/src/main/crudConfig.js) + [`pages/gestion/gestionAdd.js`](venus/src/pages/gestion/gestionAdd.js) |
| Plantilla de controles HTML | `atlantis/documentation/components/forms.html` y `atlantis/examples/demo1/forms/forms.html` |

---

## 9. Plantilla para reportar un control a cambiar

Al revisar un formulario, reportar así:

```
Pantalla/Ruta : /comunicadosadd
Archivo       : venus/src/pages/comunicados/comunicadosAdd.js:534
Control actual: input type="file" (register dentro de Controller)
Problema      : sin accept/capture ni validación de tamaño en móvil
Cambiar por   : §4.21 input type="file" con accept + capture + validate 3MB y preview
```

Con eso el cambio se aplica directo desde este catálogo.
