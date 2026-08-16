import tool from './tools'

const poster = async (props) => {
    let respuesta = null
    const miUsuario = tool.getUser()
    const requestOptions = {
        method: props.method || 'POST',
        // mode: '*cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization' : `Bearer ${miUsuario.token}`
        },
        body: (props.value !== null)? JSON.stringify(props.value) : null
    };

    if(props.url!==null && props.url !== ""){
        respuesta = await fetch(props.url, requestOptions)
        return respuesta.json()
    }
};

const posterFile = async (props) => {
    let respuesta = null
    const miUsuario = tool.getUser()
    const requestOptions = {
        method: props.method || 'POST',
        // mode: '*cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS, DELETE',
            'Authorization' : `Bearer ${miUsuario.token}`
        },
        body: props.value||null
    };

    if(props.url!==null && props.url !== ""){
        respuesta = await fetch(props.url, requestOptions)
        return respuesta.json()
    }
};

const getFile = async (props) => {
    const miUsuario = tool.getUser()
    // const body = (props.value !== null)? new URLSearchParams(props.value).toString() : null
    const requestOptions = {
        method: props.method || 'POST',
        // mode: '*cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization' : `Bearer ${miUsuario.token}`
        },
        body: (props.value !== null)? JSON.stringify(props.value) : null
    };

    if(props.url!==null && props.url !== ""){

        await fetch(props.url, requestOptions)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(uril => {
          // state.cargando_vistas = false;
          const link = document.createElement("a");
          link.href = uril;
          link.download = props.value.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return true
        })
        .catch(error =>{
            return error
        })
    }
};


export default { poster, posterFile, getFile };
