import mongoose from "mongoose";
import { Sede } from "../../domain/sede.js";

const sedeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    eliminado: {
        type: Boolean,
        default: false,
    }
});

sedeSchema.loadClass(Sede);

export const SedeModel = mongoose.model("Sede", sedeSchema);