import { ErrorDatosObligatorios } from "./errores.js";


export class Notificacion {
    id;
    destinatario;
    remitente;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida = false;

    constructor({ destinatario, remitente, mensaje }) {
        if (!remitente || !mensaje) {
            throw new ErrorDatosObligatorios();
        }
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = new Date();
        this.leida = false;
    }


    marcarComoLeida() {
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }

    marcarComoNoLeida() {
        this.leida = false;
        this.fechaHoraLeida = null;
    }
}
