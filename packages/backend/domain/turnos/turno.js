import { EstadoTurno } from "../turno.js";
import { CambioEstadoTurno } from "./cambioEstadoTurno.js";
import { Especialidad } from "../especialidad.js";
import { Sede } from "../sede.js";
import { Practica } from "../practica.js";
export class Turno {
    id;
    medico;
    paciente;
    fechaHora;
    sede;
    practica;
    estado;
    historialEstado;
    costo;
    especialidad

    constructor({ medico, paciente, especialidad, fechaHora, sede, practica }) {

        if (!medico || !paciente || !sede || !practica) {
            throw new Error("Faltan datos obligatorios")
        }
        if (!(medico instanceof Medico)) {
            throw new Error("Medico inválido");
        }
        if (!(paciente instanceof Paciente)) {
            throw new Error("Paciente inválido");
        }
        if (!(especialidad instanceof Especialidad)) {
            throw new Error("Especialidad inválida");
        }
        if (!(sede instanceof Sede)) {
            throw new Error("Sede inválida");
        }
        if (!(practica instanceof Practica)) {
            throw new Error("Practica inválida");
        }
        this.id = randomUUID(); //Lo teniamos asi inicialmente pero lo cambiamos porque no se resuelven los ids ahora
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.especialidad = especialidad;

        this.estado = EstadoTurno.DISPONIBLE;
        this.historialEstado = [];
    }

    actualizarEstadoTurno({ nuevoEstado, quien, motivo }) {
        if (!Object.values(EstadoTurno).includes(nuevoEstado)) {
            throw new Error("No existe ese estado");
        }
        if (!(quien instanceof Usuario)) {
            throw new Error("Usuario inválido");
        }
        if (!(motivo instanceof String)) {
            throw new Error("Motivo inválido");
        }
        this.estado = nuevoEstado;
        cambioEstado = new CambioEstadoTurno({ estado: nuevoEstado, usuario: quien, turno: this, motivo: motivo });
        this.historialEstado.push(cambioEstado);

    }
}