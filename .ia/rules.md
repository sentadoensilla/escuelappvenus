# Context
Hola, soy Kephrem y tu eres mi senior dev de apoyo, me ayudarás a construir blazmanager, un sistema SaaS multicuenta, multiusuario para empresas que quieran apoyo en certificaciones ISO o ICONTEC, indicadores, etc.  En esta carpeta hacemos el front con ReacJS usando una plantilla HTML adquirida para tal propósito, la plantilla está en /var/www/html/blaz/html, debes aprenderla y usarla en la construcción de los diferentes módulos y tareas que te asignaré.

Si te encomiendo hacer un módulo nuevo, no preguntes, simplemente implementa el código siguiendo la lógica que ya está implementada en /var/www/html/blaz/blazmanager.com/

Si hay que editar algo, haz la proposición y espera a que te confirme o te sugiera distintas formas de hacer la edición.


# Reglas del proyecto
Vamos a construir blazmanager: es un sistema de apoyo para empresas en cuanto a ISO y gestión de indicadores:

- Sistema multicuenta
    - Una empresa tiene una cuenta
    - La cuenta de una empresa puede tener varios usuarios
    - Cada usuario se registra con email, usando un enlace/QR code asociado a la empresa
    - La cuenta de una empresa puede tener una o varias:
        - Usuarios
        - Roles: {Admin, Empresa, QA, empleado, demo}
        - áreas de gestión
        - Procesos
        - Indicadores de gestión ()
        - Rutas de certificación

    - Blazmanager como sistema debe ofrecer a las cuentas:
        
        - Gestión de usuarios
        
        - Gestión de áreas
        
        - Gestión de procesos
        
        - Gestión de indicadores
            - Gestión de tipos de indicador
            - Gestión de niveles de impacto: {Estratégicos, tácticos, Operativos}
            - Gestión de tipos de objeto de medición: {Eficiencia, Eficacia, Productividad, Calidad}
            - Gestión de naturaleza de datos: {Cuantitativos, Cualitativos}
        
        - Dashboard de indicadores
            - Comparativas por tiempo
            - Comparativas tipo versus entre dos indicadores, sean los que sean
            - Indicadores sin datos en este periodo
            - Indicadores que bajaron el rendimiento
            - Indicadores que subieron el rendimiento
    
        - Alertas a los usuarios responsables de un indicador
            - Alerta antes de la revisión de indicadores por parte de la dirección
            - Alerta a la dirección de la empesa sobre quienes no han registrado los indicadores
            - Alerta por evento de acuerdo a niveles de un indicador, establecidos por 

    - Los usuarios pueden estar asociados a una o más áreas de gestión

- Biblioteca de documentos para calidad ISO dentro de la empresa
- Gestion de indicadores de gestión
    - Los indicadores pueden ser de nivel de impacto, de objeto de medición, cuantitativos, cualitativos, 
    - Cada usuario puede crear uno o varios indicadores
    - Cada usuario puede recibir uno o varios indicadores por parte de su jefe inmediato
- Rutas de evaluación para obtener certificaciones ISO
    - Una ruta puede contener uno o varios capítulos o requisitos de una norma ISO, como la ISO 9001:2015
    - La ruta debe asignar uno o varios usuarios responsables por capítulo
    -

## Stack
- FrontEnd: ReactJS 18, react-router 6

## Diseño, templates y Estilo Visual
- La plantilla base está en /var/www/html/blaz/html usar los elementos y estilos que se usan en ésta
- Codificar buscando la responsividad
- Cuando se trata de tablas, esconder columnas a medida que la pantalla se hace más pequeña
- Código limpio y modular
- Para los títulos, labels, mensajes y demás, utiliza /blaz/blazmanager.com/src/main/constants.js, en el caso de labels y títulos, se debe ofrecer como mínimo inglés y español
- Funciones generales dentro de utils/token.js

## Convenciones Backend
- Usar async/await, disponibles en /blaz/blazmanager.com/src/services/messenger.js; no callbacks
- Arquitectura por módulos y algunas flexibilidades, la idea principal es código organizado y de fácil mantenimiento: 

    dentro de /blaz/blazmanager.com/src/main Tenemos algunas librerías de uso general 
        - /routes/mainroutes.js: Las rutas de Router para que el sistema pueda entregar cada recurso
        - constants.js: Librería con todo tipo de constantes para alcanzar los recursos de la api, para mostrar títulos, labels, mensajes, themes, etc..

    dentro de /blaz/blazmanager.com/src/services Tenemos algunas librerías de uso general 
        - /context/UserContext: la identificación del usuario logeado. Se llama en cada módulo para conservar los datos haciendo la función de variables de session
        - messenger.js: Librería con métodos para enviar información usando el protocolo http
        - navigator.js: Crea el menú de cada usuario
        - routes.js: Constantes con las rutas de URL, esta librería se importa y se utiliza en todo el front
        - tools.js: Librería con métodos de uso general, si una función se usa en dos módulos distintos, debe estar acá, recibir argumentos, procesar la tarea y si es el caso, entregar el resultado

    dentro de /blaz/blazmanager.com/src/pages crearemos una carpeta para cada módulo: 
        - moduloAdd.js: El formulario para registro y edición
        - moduloList.js: Listado de datos y botonera de opciones: {ver, editar, eliminar}
        
        Dentro de /blaz/blazmanager.com/src/pages/components:
            - char*.js: componentes que entregan un gráfico
            - head.js: componente con el encabezado de un usuario logeado
            - headOff.js: componente con el encabezado público del sistema
            - footPublic.js: componente con el pie de página público del sistema
            - initWP.js: componente para conectar el whatsapp web
            - tables.js: componente para hacer tablas con opciones para cada registro
            - userCard.js: componente para mostrar la info del usuario logeado
        
        Dentro de /blaz/blazmanager.com/src/pages/system: Tenemos diferentes módulos del sistema, para ser usados por el administrador, rara vez por el cliente
            - /blaz/blazmanager.com/src/pages/system/usuarios: Para gestionar todos los usuarios del sistema
            - /blaz/blazmanager.com/src/pages/system/menu: Para gestionar los menues y submenues
            - /blaz/blazmanager.com/src/pages/system/privilegios: Para gestionar los privilegios de cada usuario y rol

        En /blaz/blazmanager.com/src/pages/default.js:
            - La index de blazmanager
                - Da el brief del sistema, también da acceso al login, demo, crear cuenta, etc.

        En /blaz/blazmanager.com/src/pages/forbidden.js: Aviso de ingreso prohibido
        En /blaz/blazmanager.com/src/pages/notFound.js: Aviso de recurso o ruta no encontrada
        En /blaz/blazmanager.com/src/pages/contact.js: Los datos de contacto de blazmanager
        En /blaz/blazmanager.com/src/pages/about.js: A cerca de blazmanager
        En /blaz/blazmanager.com/src/pages/login.js: Solicitan usuario y clave para ingresar al sistema, también se ofrece enlace a "olvidé mi clave"
        En /blaz/blazmanager.com/src/pages/resetpass.js: Funcionalidad que sirve para resetear la clave de un usuario, solicitando el email, enviando un enlace a dicho email
        En /blaz/blazmanager.com/src/pages/newaccount.js: Crear una nueva cuenta, para empresas que serán nuestros clientes

        Dentro de /blaz/blazmanager.com/src/pages/dashboardadmin.js:
            - La primera pantalla del usuario admin logeado
                - Debe mostrar estadísticas de uso de la aplicación, espacio en disco, whatsapp conectados, registros pendientes de procesar, etc.

        Dentro de /blaz/blazmanager.com/src/pages/dashboardenterprise.js:
            - La primera pantalla del usuario empresa (nuestro cliente) logeado
                - Debe mostrar estadísticas de los indicadores, estado de las rutas de certificación, tareas pendientes, información cambiante

        Dentro de /blaz/blazmanager.com/src/pages/dashboard.js:
            - La primera pantalla del usuario empleado logeado
                - Debe mostrarle el estado de sus tareas, enfocandose en las que están pendientes

        Dentro de /blaz/blazmanager.com/src/pages/dashboarddemo.js:
            - La primera pantalla del usuario demo logeado
                - Debe mostrar estadísticas de los indicadores, estado de las rutas de certificación, tareas pendientes, información cambiante