import mongoose from "mongoose";
import { Medico } from "../../domain/medico.js";
import { disponibilidadHorariaSchema } from "./disponibilidadHorariaSchema.js";;

const MedicoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true,
        }, // referenciado
        matricula: {
            type: String,
            required: true,
            trim: true,
            maxlength: 10,
            minlength: 1,
        },
        disponibilidades: [
            disponibilidadHorariaSchema
        ], // embebido
        especialidades: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Especialidad",
                required: true
            }
        ],
        practicas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Practica",
                required: true
            }
        ],
        sedes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sede",
                required: true
            }
        ],
        honorario: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true },
);

MedicoSchema.loadClass(Medico);

export const MedicoModel = mongoose.model("Medico", MedicoSchema);
