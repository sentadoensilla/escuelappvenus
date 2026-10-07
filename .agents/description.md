Ingresa a la siguiente dirección
"/home/sentadoensilla/Projects/Venus/venus"

Es un proyecto donde buscamos integrar un software para gestion de escuelas hecho en PHP con un software de agenda escolar digital hecho en nodejs+ReactJS
La gestión de escuela para docentes, secretarias y la agenda escolar digital para padres de familia y estudiantes.
Al final todo el código debe estar en NodeJS+ReactJS divididos en backend y Frontend, versión web responsive con notificaciones a través de whatsapp

Las bases de datos unidas se llaman bdsae2 y tiene los siguientes schemas:
Distinciones
    Escuelapp: Agenda Escolar Digital 
    SAE: Sistema de Administración Educativa

Schemas:
    contact: (Escuelapp) gestion de datos de las cuentas de whatsapp
    data: (Escuelapp) los datos que se gestionan con la agenda escolar: asistencias, nombres de los docentes, cronogramas, etc
    engine: (Escuelapp) lógica para usuarios menues y opciones de menu, login, privilegios, etc.
    estadistica: (sae) Registra el historial de visitas de cada usuario
    integration: (sae) 
    logic: (sae)  lógica para usuarios menues y opciones de menu, login, privilegios, etc.
    observador: (sae) registros de la disciplina, de la bitácora de clases y de cada estudiante
    preescolar: (sae) registros para preescolar, su dinámica educativa es diferente y se califica de forma diferente a básica y media
    public: (sae) los datos que se gestionan con el Sistema de Administración Educativa: asistencias, nombres de los docentes, cronogramas, etc
    temporal: (sae) datos que se usaron en alguna etapa del proyecto o se usaron para transformar otras tablas
    varios: (sae) Datos adicionales para una tarea especifica o que afectaban a una sola institucion

Para conectarte a la base de datos usa esto:
PG_HOST="localhost"
PG_PORT="5432"
PG_DB_NAME="bdsae2"
PG_USER="adminit4_saeroot"
PG_PASSWORD="*HelpDesk/F1*"

Conectate a la base de datos y comprende cada schema, tabla, columna y las relaciones entre cada entidad, los índices, los constraints, todo...
agrega los comentarios descriptivos y funcionales a cada schema, tabla, columna, etc.

Luego ingresa al siguiente archivo y registra todos los datos que necesita una IA para comprender la base de datos 
"/home/sentadoensilla/Projects/Venus/venus/.agents/structure_db.md"

==========================================================================================
Ingresa a la siguiente dirección
"/home/sentadoensilla/Projects/Venus/venus"

Es un proyecto donde buscamos integrar un software para gestion de escuelas hecho en PHP con un software de agenda escolar digital hecho en nodejs+ReactJS
La gestión de escuela para docentes, secretarias y la agenda escolar digital para padres de familia y estudiantes.
Al final todo el código debe estar en NodeJS+ReactJS divididos en backend y Frontend, versión web responsive con notificaciones a través de whatsapp


La aplicación que combina Escuelapp y SAE se va a llamar Escuelapp
    Hay que tener especial cuidado en el manejo de los primary_key y sus valores porque se necesita conservar los registros históricos de manera coherente, que los datos correspondan a cada usuario, docente, estudiante, acudiente, etc.

En primer escalon tenemos el backend o api "/home/sentadoensilla/Projects/Venus/venus/api/"
La api se encarga de: 
    gestionar los datos de las tablas
    de enviar notificaciones por whatsapp
    de generar los reportes, dashboard y exportables
    de gestionar el inicio de sesion de los usuarios
    gestionar el ingreso y sesiones de los usuarios

Verifica el estado actual del backend, aprende la forma como está construida, registra esa investigación en un archivo .md
que sirva de guia para cualquier agente IA para comprender y seguir codificando, el .md es "/home/sentadoensilla/Projects/Venus/venus/.agents/structure_api.md" y genera un plan
para terminar los CRUD por cada tabla que haga falta, teniendo en cuenta lo que se describe en los siguientes archivos:
"/home/sentadoensilla/Projects/Venus/Sae 2.0.xlsx" y "/home/sentadoensilla/Projects/Venus/Venus_Caracteristicas.xlsx"

==========================================================================================
Ingresa a la siguiente dirección
"/home/sentadoensilla/Projects/Venus/venus"

Es un proyecto donde buscamos integrar un software para gestion de escuelas hecho en PHP con un software de agenda escolar digital hecho en nodejs+ReactJS
La gestión de escuela para docentes, secretarias y la agenda escolar digital para padres de familia y estudiantes.
Al final todo el código debe estar en NodeJS+ReactJS divididos en backend y Frontend, versión web responsive con notificaciones a través de whatsapp


Ahora debes hacer el código para el frontend del proyecto, que está ubicado en "/home/sentadoensilla/Projects/Venus/venus/venus/" y su archivo .md es "/home/sentadoensilla/Projects/Venus/venus/.agents/structure_venus.md"

Debes leer los .md de api y de venus y tener en cuenta

Primero realiza una investigación del proyecto frontend, aprende cómo está hecho el código, toma nota de cómo está hecho el tema de las rutas
ya que esas rutas debes registrarlas en las tablas logic.tabmenu y logic.tabopcimenu para ser accedidas desde el navegador web.

Entonces, realiza un plan para crear los módulos que deben encajar con lo que hay en la api

Luego realiza la codificación de los módulos que deben encajar con lo que hiciste antes en la api
    Importante que los datos que hacen referencia a primary-key o foreign-key se enmascaren con las funciones encriptar y decriptar, hacer lo necesario en api y venus para que esa encripcion funcione

Luego de realizar el código debes actualizar los archivos .md de api y de venus, para que cualquier agente IA pueda entender y continuar codificando

==========================================================================================
Normalmente utilizo el archivo "/home/sentadoensilla/Projects/Venus/venus/api/comprimir.sh"
para hacer el backup del código en archivo .tar.bz2, teniendo en cuenta esa idea
necesito que 
1. Crees un archivo bash para realizar copia de la base de datos en un archivo tar.bz2
2. Crees un archivo bash para restaurar la copia de la base de datos en otro PC o server, utilizando el archivo tar.bz2

==========================================================================================
Convierte los archivos "/home/sentadoensilla/Projects/Venus/Sae 2.0.xlsx" y "/home/sentadoensilla/Projects/Venus/Venus_Caracteristicas.xlsx"
en archivos legibles para la IA, ya que tienen descripciones de características faltantes, por usuario y lo que hay que hacer dentro de la aplicacion
Ubica estos archivos legibles dentro de "/home/sentadoensilla/Projects/Venus/"

==========================================================================================
Ingresa a la siguiente dirección
"/home/sentadoensilla/Projects/Venus/venus/venus"

Es un proyecto donde buscamos integrar un software para gestion de escuelas hecho en PHP con un software de agenda escolar digital hecho en nodejs+ReactJS
La gestión de escuela para docentes, secretarias y la agenda escolar digital para padres de familia y estudiantes.
Al final todo el código debe estar en NodeJS+ReactJS divididos en backend y Frontend, versión web responsive con notificaciones a través de whatsapp


Ahora debes hacer el código para el frontend del proyecto, que está ubicado en "/home/sentadoensilla/Projects/Venus/venus/venus/" 
revisa los archivos .md  que están en "/home/sentadoensilla/Projects/Venus/venus/.agents"
Luego revisar las características que están pendientes por implementar 
en los archivos en "/home/sentadoensilla/Projects/Venus/Sae_2.0.md" y "/home/sentadoensilla/Projects/Venus/Venus_Caracteristicas.md"

Para realizar el código del front debes tomar como referencia lo que hay en "/home/sentadoensilla/Projects/Venus/venus/venus/src/pages/observaciones"
y sus dependencias relacionadas. Aprende, toma notas para ti mismo sobre la forma y fondo del código

Las características pendientes están Dentro del archivo "/home/sentadoensilla/Projects/Venus/Venus_Caracteristicas.md", comienza con:
La característica "Gestion de instituciones" que sirve para registrar una insitución en el sistema, verifica los archivos .md para tomar
de api lo que haga falta para que la "Gestion de instituciones" permita crear una institución.  
Recuerda aprender cómo está hecho el código, toma nota de cómo está hecho el tema de las rutas
ya que esas rutas debes registrarlas en las tablas logic.tabmenu y logic.tabopcimenu para ser accedidas desde el navegador web.
Luego prosigue con las demás características

==========================================================================================

Los datos de Escuelapp no coinciden con los de SAE en instituciones o en estudiantes.  Para hacer pruebas; asocia los estudiantes de Escuelapp a una institución de SAE, entonces prosigue con las pruebas de login y demás