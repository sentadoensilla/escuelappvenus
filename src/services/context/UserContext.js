import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [waiting, setWaiting] = useState(false)
    const [elUsuario, setElUsuario] = useState({
        isLogged: false,
        token: null,
        socketId: null,
        usuarioId: null,
        academicoId: null,
        usuarioIndex: null,
        usuarioNick: null,
        usuarioUnion: null,
        usuarioAnoId: null,
        usuarioNombre: null,
        usuarioRollId: null,
        usuarioRollNombre: null,
        usuarioRollDescripcion: null,
        usuarioEmpresaId: null,
        empresaLema: null,        
        empresaEscudo: null,
        empresaTelefono: null,
        usuarioEstado: null,
        usuarioInstitucionNombre: null
    });
    return (
        <UserContext.Provider value={{ waiting, setWaiting, elUsuario, setElUsuario}}>
            {children}
        </UserContext.Provider>
    );
}