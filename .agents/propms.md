El proyecto Venus, ubicado en "/Users/sentadoensilla/side projects/Venus/venus" contiene archivos .md que explican su estructura, arquitectura y todo lo relacionado.  Leelos para que entres en contexto.  
Luego verifica los archivos .php en la ruta "/Users/sentadoensilla/side projects/sae", crea los archivos .md de contexto y estructura necesarios para hacer una refactorizacion con NodeJS en venus. Primero haz el plan, luego solicita autorización para proceder

Ahora, necesitamos que dentro de la carpeta api/controller, se reflejen funciones CRUD para cada tabla de la DB teniendo en cuenta lo que se analizó en la carpeta sae con los archivos .php.  Modifica los archivos existentes o crea nuevos archivos según sea necesario
---------------------------------------------------------------------------------------------------------------
Lee los archivos .md del proyecto para que entres en contexto

Necesito cambiar las consultas de inicio de sesion
    el schema para menu, opciones de menu, privilegios por rol y privilegios por usuario debe ser logic y no engine.
        Realiza los cambios en las consultas de login y todo lo relacionado con usuario, menues, opciones de menú o privilegios
    Ajusta logic.tabopcimenu para que las rutas coinciden con ReactJS: 
        En el campo copcimenuenla (areas.php -> /areas, anolec.php -> /anolec), 
        El campo copcimenuicon, utiliza iconos de bootstrap o Font awesome
    
    Para hacer pruebas voy a utilizar la institución educativa Patricio Symes, 
        establece como clave a los ssiguientes usuarios o tipo de usuarios relacionados con colpasy:
            para el cusuanick 'colpasy@gmail.com' cusuallave='SW5zdGl0dWNpb24uMjAwMA=='
            para las secretarias relacionadas con 'colpasy@gmail.com' cusuallave='RG9jZW50ZS4yMDAw'
            para los docentes relacionados con 'colpasy@gmail.com' cusuallave='RG9jZW50ZS4yMDAw'
            para los estudiantes relacionados con 'colpasy@gmail.com' cusuallave='RXN0dWRpYW50ZS4yMDAw'
            para los acudientes relacionados con 'colpasy@gmail.com' cusuallave='RXN0dWRpYW50ZS4yMDAw'

Actualiza los .md del proyecto para que se actualice el contexto

---------------------------------------------------------------------------------------------------------------
Lee los archivos .md del proyecto para que entres en contexto

Revisé /avisosadd y tengo algunas observaciones: 
    - El autor de un registro es un dato transparente, tomado del objeto miUsuario (casi siempre usuarioId, dependiendo de lo que pide la funcion en api)
    - Cuando utilizamos un textarea, le agregamos un editor wysiwyg como sunEditor
    - Cuando usamos un formulario, usamos estas librerías: import { Controller, useForm } from 'react-hook-form';
    - Cuando pedimos imagen o archivo para cargar, debe cargarse desde el dispositivo del usuario, como se hace en "/Users/sentadoensilla/side projects/Venus/venus/venus/src/pages/comunicados/comunicadosAdd.js", eso generalmente implica cambios en la API, cargar la imagen en la ruta, usando un identificador segun la institucion, que hace juego con una carpeta nombrada con dicho identificador dentro de "/Users/sentadoensilla/side projects/Venus/venus/api/public/archivos" para cada institucion

Por favor fíjate en lo que hay dentro de "/Users/sentadoensilla/side projects/Venus/venus/venus/src/pages/comunicados" porque Existen buenos ejemplos de:
    - formulario de registro
    - Listado de datos registrados
    - Detalles de un registro (..View)
    - Visualización de datos sin iniciar sesion  (..ViewOpen)
    - Uso de datos de usuario logeado (objeto miUsuario)
    - Uso de alertas para usuario (swal.fire)
    - Envio de datos a la api (const onRegister = async(data) => {)
    - Muchas cosas que definen la forma en la que se trabaja el código y los datos y de esa manera se puede hacer mantenimiento al proyecto

Lo que aprendas ahí, debes usarlo para actualizar los .md, para que te sirvan en las construcción/refactorización de este proyecto

Revisa esos archivos y actualiza "/Users/sentadoensilla/side projects/Venus/venus/venus/src/pages/avisos" para seguir revisando en el navegador

Actualiza los .md del proyecto para que se actualice el contexto
---------------------------------------------------------------------------------------------------------------
Lee los archivos .md del proyecto para que entres en contexto

Ingresa a 
    "/Users/sentadoensilla/side projects/Venus/venus/venus/src/pages/comunicados" 
    "/Users/sentadoensilla/side projects/Venus/venus/venus/src/pages/matriculas"
    "/Users/sentadoensilla/side projects/Venus/venus/venus/src/pages/usuarios"

para que puedas tomar nota de cada tipo de control form utilizando react-hook-form (input (checkbox, radio, hidden, number, button, text, submit, file), textarea, button, select, ...)
Debes crear un catálogo de ejemplos por cada uno y agregar ese catálogo al .md del código
Debes utilizar ese catálogo como guía para los controles de cada formulario en todo el front -> Venus:
    Cuando se requiera usar datos que identifican al usuario en session, utilizar el objeto miUsuario dentro de onRegister o en otros lugares, según la necesidad
    Cuando se requiere subir una imagen usa un input type=file
    Cuando se requiera una lista usa select
    Cuando se requera un texto normal usa input type=text
    Cuando se requera un texto numérico usa input type=number
    Cuando se requiera opción múltiple con múltiple respuesta usar input type=checkbox
    Cuando se requiera opción múltiple con única respuesta usar input type=radio
    Cuando se requiera enivar un dato que el usuario no deba ver, utilizar input type=hidden

Siempre usando react-hook-form y llamando las variables y hooks necesarias para hacer funcionar el formulario
Agregar esta guía al .md correspondiente

Debes crear un archivo plano separado por tabulado, que me sirva para hacer seguimiento y control de las pruebas de todo el front, llámalo control_calidad_formularios.csv y déjalo en 
"/Users/sentadoensilla/side projects/Venus/venus/venus"
Voy a compartirlo con mis compañeros para que me ayuden a hacer las pruebas

Actualiza los .md del proyecto para que se actualice el contexto

Estructura de las ordenes
    Lea el contexto en los archivos .md

    Necesito que haga tal cosa
    ...
    ...
    ...
    ...

    Dejame probar la solucion que encontraste

    Actualiza los archivos .md con la solucion que diste para actualizar el contexto

---------------------------------------------------------------------------------------------------------------
Lee los archivos .md del proyecto para que entres en contexto
utiliza git para crear una rama llamada dashstudent dentro de api y otra igual dentro de venus
Dentro de esa rama, verifica por que cuando el usuario estudiante inicia sesion, la pantalla se queda en blanco
primero planifica y luego corrige

Utiliza git para hacer commit a la rama llamada dashstudent dentro de api y de venus, con el comentario relacionado a lo que hiciste y haz push
Actualiza los archivos .md con la solucion que diste para actualizar el contexto
---------------------------------------------------------------------------------------------------------------
