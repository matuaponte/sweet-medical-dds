import { ErrorDatosObligatorios } from "../errores.js";
import { EstadoTurnoEnum } from "./estadoTurnoEnum.js";
import { CambioEstadoTurno } from "./cambioEstadoTurno.js";
export class Turno {
    id;
    medico;
    servicio;
    paciente;
    fechaHora;
    fechaHoraPropuesta;
    sede;
    estado;
    historialEstado;
    costo;

    constructor({ medico, fechaHora, sede, servicio, costo = 0 }) {
        if (!medico || !sede || !fechaHora) {
            throw new ErrorDatosObligatorios();
        }

        this.medico = medico;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.servicio = servicio;
        this.costo = costo;
        this.estado = EstadoTurnoEnum.DISPONIBLE;
        this.historialEstado = [];
    }

    //motivo opcional
    actualizarEstadoTurno({ nuevoEstado, quien, motivo = undefined,turno }) {
        if (!Object.values(EstadoTurnoEnum).includes(nuevoEstado)) {
            throw new Error("No existe ese estado");
        }

        /* TODO: Tambien se puede implementar la logica de transiciones de estados con una maquina de estados donde se validen transacciones validas. Ademas hacer la logica de cambios de estados con los metodos de mas abajo para que sean usados en el service
                        const transicionesValidas = {
                            [EstadoTurno.DISPONIBLE]: [EstadoTurno.RESERVADO, EstadoTurno.CANCELADO],
                            [EstadoTurno.RESERVADO]: [EstadoTurno.CONFIRMADO, EstadoTurno.CANCELADO, EstadoTurno.DISPONIBLE],
                            [EstadoTurno.CONFIRMADO]: [EstadoTurno.REALIZADO, EstadoTurno.CANCELADO],
                            [EstadoTurno.CANCELADO]: [EstadoTurno.DISPONIBLE], //Solo con mucha anticipacion
                            [EstadoTurno.REALIZADO]: []  // Estado final 
                        };
                        const transicionesPermitidas = transicionesValidas[this.estado] || [];
                        if (!transicionesPermitidas.includes(nuevoEstado)) {
                            throw new Error(`Transición inválida: un turno en estado '${this.estado}' no puede pasar a '${nuevoEstado}'.`);
                        }
                        */
        if (motivo !== undefined && typeof motivo !== "string") {
            throw new Error("Motivo inválido");
        }
        this.estado = nuevoEstado;
        const cambioEstado = new CambioEstadoTurno({
            estado: nuevoEstado,
            usuario: quien,
            turno: turno,
            motivo: motivo,
        });
        this.historialEstado.push(cambioEstado);
    }
}
