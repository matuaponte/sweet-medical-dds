import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

// crea un estado global para utilizar en cualquier componente hijo
const SnackbarContext = createContext(null);

// envuelve componentes hijos a los que les da el contexto
export function SnackbarProvider({ children }) {
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [estado, setEstado] = useState("success");

    const mostrarSnackbar = useCallback( (msg, sev = "success") => {
        setMensaje(msg);
        setEstado(sev);
        setAbierto(true);
    })

    return (
        // Todo componente hijo que llame a useContext(SnackbarContext) va a recibir la función mostrar snackbar
        <SnackbarContext.Provider value={{mostrarSnackbar}}>
            {children}
            <Snackbar open={abierto} autoHideDuration={3000}>
                <Alert severity={estado} variant="filled">
                    {mensaje}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}

export function useSnackbar() {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error("useSnackbar debe usarse dentro de SnackbarProvider");
    return ctx;
}