import { mongoose } from "mongoose";
import { Turno } from "../../domain/turnos/turno.js";
import { historialEstadoTurnoSchema } from "./historialEstadoTurnoSchema.js";

const turnoSchema = new mongoose.Schema({
    fechaHora: {
        type: Date,
        required: true,
    },
    fechaHoraPropuesta: {
        type: Date,
        required: false,
    },
    estado: {
        type: String,
        required: true,
    },
    historialEstado: [historialEstadoTurnoSchema],
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medico",
        required: true,
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        required: false,
    },
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
        required: false,
    },
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sede",
        required: false,
    },
    costo: {
        type: Number,
        required: true,
    },
    eliminado: {
        type: Boolean,
        required: true,
        default: false,
    },
});


turnoSchema.loadClass(Turno);

//indices para la busqueda de los turnos mas eficiente
turnoSchema.index({ medico: 1, fechaHora: 1 });
turnoSchema.index({ estado: 1 });
turnoSchema.index({ paciente: 1 });
turnoSchema.index({ sede: 1 });

export const TurnoModel = mongoose.model("Turno", turnoSchema);