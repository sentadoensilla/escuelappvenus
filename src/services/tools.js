import jwtDecode from 'jwt-decode'
import { Buffer } from 'buffer';
window.Buffer = Buffer
// ESTA LINEA SIRVE PARA UTILIZAR JQUERY CUANDO SE IMPORTE ESTA LIBRERIA
window.$ = window.jQuery = require('jquery')

const tool = {
    outUser: function() {
        // SETTING LOCALS FOR USER
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("nav");
        window.localStorage.removeItem("socketid");
        window.localStorage.removeItem("usuarioid");
        window.localStorage.removeItem("academicoid");
        window.localStorage.removeItem("usuarioindex");
        window.localStorage.removeItem("usuarionick");
        window.localStorage.removeItem("usuariounion");
        window.localStorage.removeItem("usuarioanoid");
        window.localStorage.removeItem("usuarionombre");
        window.localStorage.removeItem("usuariogrado");
        window.localStorage.removeItem("usuariogrupo");
        window.localStorage.removeItem("usuariorollid");
        window.localStorage.removeItem("usuariorollnombre");
        window.localStorage.removeItem("usuariorolldescripcion");
        window.localStorage.removeItem("empresaid");
        window.localStorage.removeItem("empresalema");
        window.localStorage.removeItem("empresaescudo");
        window.localStorage.removeItem("empresatelefono");
        window.localStorage.removeItem("usuarioestado");
        window.localStorage.removeItem("usuarioinstitucionnombre");
        // window.localStorage.removeItem("campanawhatsapp");
        window.localStorage.clear();
    },

    setUser: function(arreglo){
        // SETTING LOCALS FOR USER
        window.localStorage.setItem("socketid", "");

        if(typeof arreglo.token !== "undefined" && arreglo.token!=="" && arreglo.token !==null){
            window.localStorage.setItem("token", JSON.stringify(arreglo.token));
        }

        if(typeof arreglo.privilegees !== "undefined" && arreglo.privilegees!=="" && arreglo.privilegees !==null){
            window.localStorage.setItem("nav", JSON.stringify(arreglo.privilegees));
        }
        
        if(typeof arreglo.usuarioId !== "undefined" && arreglo.usuarioId !=="" && arreglo.usuarioId !==null){
            window.localStorage.setItem("usuarioid", JSON.stringify(arreglo.usuarioId));
        }
        if(typeof arreglo.academicoId !== "undefined" && arreglo.academicoId !=="" && arreglo.academicoId !==null){
            window.localStorage.setItem("academicoid", JSON.stringify(arreglo.academicoId));
        }
        if(typeof arreglo.usuarioIndex !== "undefined" && arreglo.usuarioIndex !=="" && arreglo.usuarioIndex !==null){
            window.localStorage.setItem("usuarioindex", JSON.stringify(arreglo.usuarioIndex));
        }

        if(typeof arreglo.usuarioNick !== "undefined" && arreglo.usuarioNick !=="" && arreglo.usuarioNick !==null){
            window.localStorage.setItem("usuarionick", JSON.stringify(arreglo.usuarioNick));
        }

        if(typeof arreglo.usuarioUnion !== "undefined" && arreglo.usuarioUnion !=="" && arreglo.usuarioUnion !==null){
            window.localStorage.setItem("usuariounion", JSON.stringify(arreglo.usuarioUnion));
        }

        if(typeof arreglo.usuarioNombre !== "undefined" && arreglo.usuarioNombre !=="" && arreglo.usuarioNombre !==null){
            window.localStorage.setItem("usuarionombre", JSON.stringify(arreglo.usuarioNombre));
        }

        if(typeof arreglo.usuarioRollId !== "undefined" && arreglo.usuarioRollId !=="" && arreglo.usuarioRollId !==null){
            window.localStorage.setItem("usuariorollid", JSON.stringify(arreglo.usuarioRollId));
        }

        if(typeof arreglo.usuarioRollNombre !== "undefined" && arreglo.usuarioRollNombre !=="" && arreglo.usuarioRollNombre !==null){
            window.localStorage.setItem("usuariorollnombre", JSON.stringify(arreglo.usuarioRollNombre));
        }

        if(typeof arreglo.usuarioInstitucionNombre !== "undefined" && arreglo.usuarioInstitucionNombre !=="" && arreglo.usuarioInstitucionNombre !==null){
            window.localStorage.setItem("usuarioinstitucionnombre", JSON.stringify(arreglo.usuarioInstitucionNombre));
        }

        if(typeof arreglo.usuarioEmpresaId !== "undefined" && arreglo.usuarioEmpresaId !=="" && arreglo.usuarioEmpresaId !==null){
            window.localStorage.setItem("empresaid", JSON.stringify(arreglo.usuarioEmpresaId));
        }

        if(typeof arreglo.usuarioAnoId !== "undefined" && arreglo.usuarioAnoId !=="" && arreglo.usuarioAnoId !==null){
            window.localStorage.setItem("usuarioanoid", JSON.stringify(arreglo.usuarioAnoId));
        }

        if(typeof arreglo.usuarioGrupo !== "undefined" && arreglo.usuarioGrupo !=="" && arreglo.usuarioGrupo !==null){
            window.localStorage.setItem("usuariogrupo", JSON.stringify(arreglo.usuarioGrupo));
        }

        if(typeof arreglo.usuarioGrado !== "undefined" && arreglo.usuarioGrado !=="" && arreglo.usuarioGrado !==null){
            window.localStorage.setItem("usuariogrado", JSON.stringify(arreglo.usuarioGrado));
        }

        if(typeof arreglo.empresaLema !== "undefined" && arreglo.empresaLema !=="" && arreglo.empresaLema !==null){
            window.localStorage.setItem("empresalema", JSON.stringify(arreglo.empresaLema));
        }

        if(typeof arreglo.empresaEscudo !== "undefined" && arreglo.empresaEscudo !=="" && arreglo.empresaEscudo !==null){
            window.localStorage.setItem("empresaescudo",JSON.stringify(arreglo.empresaEscudo));
        }

        if(typeof arreglo.empresaTelefono !== "undefined" && arreglo.empresaTelefono !=="" && arreglo.empresaTelefono !==null){
            window.localStorage.setItem("empresatelefono", JSON.stringify(arreglo.empresaTelefono));
        }

        if(typeof arreglo.usuarioEstado !== "undefined" && arreglo.usuarioEstado !=="" && arreglo.usuarioEstado !==null){
            window.localStorage.setItem("usuarioestado", JSON.stringify(arreglo.usuarioEstado));
        }
/*         window.localStorage.setItem(
            "campanawhatsapp",
            JSON.stringify(arreglo.usuarioCampanaWP)
        ); */
    },

    getUser: function(){
        // GIVE USER DATA
        // eslint-disable-next-line no-unneeded-ternary
        const estaLogeado = (JSON.parse(window.localStorage.getItem("usuarionick")) !== null )? true : false;
        return {
            isLogged: estaLogeado,
            token: JSON.parse(window.localStorage.getItem("token")),
            socketId: window.localStorage.getItem("socketid"),
            usuarioId: JSON.parse(window.localStorage.getItem("usuarioid")),
            academicoId: JSON.parse(window.localStorage.getItem("academicoid")),
            usuarioIndex: JSON.parse(window.localStorage.getItem("usuarioindex")),
            usuarioNick: JSON.parse(window.localStorage.getItem("usuarionick")),
            usuarioUnion: JSON.parse(window.localStorage.getItem("usuariounion")),
            usuarioAnoId: JSON.parse(window.localStorage.getItem("usuarioanoid")),            
            usuarioNombre: JSON.parse(window.localStorage.getItem("usuarionombre")),
            usuarioGrado: JSON.parse(window.localStorage.getItem("usuariogrado")),
            usuarioGrupo: JSON.parse(window.localStorage.getItem("usuariogrupo")),
            usuarioRollId: JSON.parse(window.localStorage.getItem("usuariorollid")),
            usuarioRollNombre: JSON.parse(window.localStorage.getItem("usuariorollnombre")),
            usuarioRollDescripcion: JSON.parse(window.localStorage.getItem("usuariorolldescripcion")),
            usuarioEmpresaId: JSON.parse(window.localStorage.getItem("empresaid")),
            empresaLema: JSON.parse(window.localStorage.getItem("empresalema")),
            empresaEscudo: JSON.parse(window.localStorage.getItem("empresaescudo")),
            empresaTelefono: JSON.parse(window.localStorage.getItem("empresatelefono")),
            usuarioEstado: JSON.parse(window.localStorage.getItem("usuarioestado")),
            usuarioInstitucionNombre: JSON.parse(window.localStorage.getItem("usuarioinstitucionnombre")),
            // usuarioCampanaWP: JSON.parse(window.localStorage.getItem("campanawhatsapp"))
        }
    },

    setSocket: function(elsocket){
        if(typeof elsocket !== "undefined" && elsocket !=="" && elsocket !==null){
            window.localStorage.setItem("socketid", JSON.stringify(elsocket));
        }
    },

    getSocket: function(eluser){
        if(eluser === JSON.parse(window.localStorage.getItem("usuarioid"))){
            return window.localStorage.getItem("socketid")
        }else{
            return null
        }
    },

    parseJwt: function(token){
        if(token !== null){
            const decode = JSON.parse(atob(token.split('.')[1]));
            // console.log('Time TOKENIZED: ', process.env.REACT_APP_JWT_PRIVATE_KEY);
            if (decode.exp * 1000 < new Date().getTime()) {
                tool.outUser()
                // console.log('Time Expired')
                return null
            }
        }   
        return token
        
    },

    decodeJWT: function(token){
        return jwtDecode(token)
    },

    /**
     * encriptar RECEIVE A STRING TO MASK
     * @param {*} text 
     * @returns 
     */
    encriptar: (text) => {
        let encoded = ""
        if (text !== "undefined" && text !== null && text !== "") {
            encoded = Buffer.from(text.toString(), 'utf-8')
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')
        }
        return encoded
    },

    /**
     * decriptar RECEIVE A MASK TO UN-MASK-IT
     * Tolerante: acepta base64url (nuevo) y base64 estándar (legado).
     * @param {*} text 
     * @returns 
     */
    decriptar: (text) => {
        let plain = ""
        if (text !== "undefined" && text !== null && text !== "") {
            const s = text.toString()
            const decodeUtf8 = (b64) => {
                const d = Buffer.from(b64, 'base64').toString('utf-8')
                return (d === '' || d.indexOf('\uFFFD') !== -1) ? null : d
            }
            // 1) base64url (nuevo): round-trip canónico.
            if (/^[A-Za-z0-9_-]+$/.test(s)) {
                const d = decodeUtf8(s.replace(/-/g, '+').replace(/_/g, '/'))
                if (d !== null && tool.encriptar(d) === s) { plain = d; return plain }
            }
            // 2) base64 estándar (legado).
            if (s.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(s)) {
                const d = decodeUtf8(s)
                if (d !== null) { plain = d; return plain }
            }
            // 3) passthrough.
            plain = s
        }
        return plain
    },

    verifyUser: function(){
        // GET USER PROPERTIES
        const preuser = tool.getUser()
        if(preuser.token !== null){
            // TOKEN VALIDITY
            const pretoken = tool.parseJwt(preuser.token)
            // COMPARE FOR RETURNS
            if(pretoken !== preuser.token){
                return null
            }else{
                return preuser
            }
        }else{
            return null
        }
    },

    /**
     * getNav: return object for navigator or null to -> index
     * @param {*} elUsuario: localStorage with user definition set in login
     * @returns {menu:{options}}
     */
    getNav: function(){
        // TOKEN DECODE
        const elToken = window.localStorage.getItem("nav")
        // console.log('El token para el menu: ', elToken)
        if(elToken !== null && elToken !== "undefined"){
            const decodedtoken = tool.decodeJWT(elToken)
            // CHECK PRIVILEGES FOR RETURNS
            return (decodedtoken.sub.length > 0)? decodedtoken.sub : null ;
        }
    },

    /**
     * setRecord: write a record to localStorage for change route and reuse it
     * @param {*} theScript: path to script
     * @returns none
     */
    setRecord: function(elRecord){
        if(elRecord !== ""){
            window.localStorage.setItem("record", JSON.stringify(elRecord))
        }
    },

    /**
     * removeStorage: blanco es y gallina lo pone
     * @param {*} theScript: path to script
     * @returns none
     */
     removeStorage: function(elStorage){
        if(elStorage !== ""){
            window.localStorage.removeItem(elStorage)
        }
    },

    /**
     * getRecord: return a localStorage record or null
     *
     * @returns none
     */
     getRecord: function(){
        let record = null;
        if(window.localStorage.getItem("record") !== null){   
            record = JSON.parse(window.localStorage.getItem("record"))
        }
        return record
    },

    /**
     * appendScript: add script to document body
     * @param {*} theScript: path to script
     * @returns none
     */
    appendScript: function(theScript){
        const script = document.createElement("script");
        script.src = theScript;
        script.async = true;
        document.head.appendChild(script);        
    },

    /**
     * dateNow: show current date|time|timestamp
     * @param {*} theScript: path to script
     * @returns none
     */
    dateNow: function(){
        const date = new Date();
        let [month, day, year] = [
          date.getUTCMonth()+1,
          date.getDate(),
          date.getFullYear(),
        ];
        let [hour, minutes, seconds] = [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ]

          day = (day < 10)? '0' + day : day ;
          month = (month < 10)? '0' + month : month ;

          // new Date(tool.addDays(new Date(), -30).toISOString().split('T')[0])
        return ({
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minutes,
            second: seconds,
            date: year + '-' + month + '-' + day,
            time: hour + ':' + minutes + ':' + seconds,
            timestamp: new Date(), // year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds,
            totaldays: 32 - new Date(year, month-1, 32).getDate(),
            lastday:  new Date(year, month, 0)
        })    
    },

    /**
     * addDays: from current_date add days to that date
     * @param {date,days}  timestamp,integer
     * @returns 2023-12-11T20:26:36.915Z
     */
    addDays: function(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

	/**
	 * validEmail RETURN RANDOM STRING AS LONG AS LENGHT
	 * @param {*} length (INTEGER)
	 * @returns 'aS.u$F'
	 */
	validEmail: function(email){
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	},

    /**
	 * statsColor RETURN ['textcolor','backgroundcolor'] by valor in semaphore colors
	 * @param {*} valor (float)
	 * @returns {text:'',background:''}
	 */
    statsColor: function(type,valor){
        switch(type){
            case 'hex':
                if(valor < 0.5){return {text:'#F1F1F1', background:'#F25961'}} 
                if(valor >= 0.5 && valor < 0.85){return {text:'#F1F1F1', background:'#FF9E27'}} 
                if(valor >= 0.85 && valor <= 1){return {text:'#F1F1F1', background:'#2BB930'}}
                if(valor > 1 ){return {text:'#F1F1F1', background:'#48ABf7'}}
            break;
            case 'light':
                if(valor < 0.5){return {text:'white', background:'red'}} 
                if(valor >= 0.5 && valor < 0.85){return {text:'black', background:'orange'}} 
                if(valor >= 0.85 && valor <= 1){return {text:'white', background:'green'}}
                if(valor > 1 ){return {text:'white', background:'blue'}}
            break;
            default:
                if(valor < 0.5){return {text:'white', background:'danger'}} 
                if(valor >= 0.5 && valor < 0.85){return {text:'dark', background:'warning'}} 
                if(valor >= 0.85 && valor <= 1){return {text:'white', background:'success'}}
                if(valor > 1 ){return {text:'white', background:'info'}}
            break; 
        }
    },

    /**
     * scrollId: scroll h bar to #element
     * @param {element} id of element to scroll 
     */
    scrollId: function(element){
        const section = document.querySelector( '#'+element);
        section.scrollIntoView( { behavior: 'smooth', block: 'center' } );
    },

    /**
     * removeTags use Regular expression to identify HTML tags in
        the input string. Replacing the identified
        HTML tag with a null string.
    * @param {*} str 
    * @returns 
    */
    removeTags: function(str) {
        if ((str===null) || (str===''))
            return false;
        else
            str = str.toString();
            
        return str.replace( /(<([^>]+)>)/ig, '');
    },

    /**
     * getBrowserName: return navigator info
     * 
     */
    getBrowserName: function(userAgent){
        if (userAgent.includes("Firefox")) {
            // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
            return "Mozilla Firefox";
        } else if (userAgent.includes("SamsungBrowser")) {
            // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
            return "Samsung Internet";
        } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
            // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
            return "Opera";
        } else if (userAgent.includes("Edge")) {
            // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
            return "Microsoft Edge (Legacy)";
        } else if (userAgent.includes("Edg")) {
            // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
            return "Microsoft Edge (Chromium)";
        } else if (userAgent.includes("Chrome")) {
            // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
            return "Google Chrome or Chromium";
        } else if (userAgent.includes("Safari")) {
            // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
            return "Apple Safari";
        } else {
            return "unknown";
        }
    },

    deviceInfo: function(){
        const module = {
            options: [],
            header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
            dataos: [
                { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
                { name: 'Windows', value: 'Win', version: 'NT' },
                { name: 'iPhone', value: 'iPhone', version: 'OS' },
                { name: 'iPad', value: 'iPad', version: 'OS' },
                { name: 'Kindle', value: 'Silk', version: 'Silk' },
                { name: 'Android', value: 'Android', version: 'Android' },
                { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
                { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
                { name: 'Macintosh', value: 'Mac', version: 'OS X' },
                { name: 'Linux', value: 'Linux', version: 'rv' },
                { name: 'Palm', value: 'Palm', version: 'PalmOS' }
            ],
            databrowser: [
                { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
                { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
                { name: 'Safari', value: 'Safari', version: 'Version' },
                { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
                { name: 'Opera', value: 'Opera', version: 'Opera' },
                { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
                { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
            ],
            init: function () {
                const agent = this.header.join(' ')
                const os = this.matchItem(agent, this.dataos)
                const browser = this.matchItem(agent, this.databrowser)                
                return { os, browser };
            },
            matchItem: function (string, data) {
                let i = 0
                let j = 0
                // eslint-disable-next-line
                const html = ''
                let regex
                let regexv
                let match
                let matches
                let version
                
                for (i = 0; i < data.length; i += 1) {
                    regex = new RegExp(data[i].value, 'i');
                    match = regex.test(string);
                    if (match) {
                        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                        matches = string.match(regexv);
                        version = '';
                        if (matches) { if (matches[1]) { matches = matches[1]; } }
                        if (matches) {
                            matches = matches.split(/[._]+/);
                            for (j = 0; j < matches.length; j += 1) {
                                if (j === 0) {
                                    version += matches[j] + '.';
                                } else {
                                    version += matches[j];
                                }
                            }
                        } else {
                            version = '0';
                        }
                        return {
                            name: data[i].name,
                            version: parseFloat(version)
                        };
                    }
                }
                return { name: 'unknown', version: 0 };
            }
        };
        
        const e = module.init()

        return ({
            os:{
                name:e.os.name,
                version:e.os.version
            },
            browser:{
                name:e.browser.name,
                version:e.browser.version
            },
            navigator:{
                userAgent:navigator.userAgent,
                appVersion:navigator.appVersion,
                platform:navigator.platform,
                vendor:navigator.vendor
            }
        })      
    },

/*     geoLocation: function(){
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
          
        const position = (pos) => {
            const crd = pos.coords;

            return ({
                lat: `${crd.latitude}`,
                long: `${crd.longitude}`,
                accuracy: `${crd.accuracy}`
            })
        }
          
        const error = (err) => {
            return ({
                code: `${err.code}`,
                error: `${err.message}`
            })
        }
    
        navigator.geolocation.getCurrentPosition(position, error, options)
    }, */


}

export default tool;