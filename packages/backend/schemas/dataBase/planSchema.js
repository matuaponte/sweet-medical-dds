import mongoose from "mongoose";
import { coberturaEspecialidadSchema } from "./coberturaEspecialidadSchema.js";
import { coberturaPracticaSchema } from "./coberturaPractica.js";
import { Plan } from "../../domain/plan.js";

export const planSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    coberturaEspecialidad: {
        type: [coberturaEspecialidadSchema],
        required: true,
    },
    coberturaPractica: {
        type: [coberturaPracticaSchema],
        required: true,
    },
    eliminado: {
        type: Boolean,
        required: true,
        default: false,
    }
});

planSchema.loadClass(Plan);