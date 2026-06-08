import mongoose from "mongoose";
import { Notificacion } from "../../domain/notificacion.js";

const notificacionSchema = new mongoose.Schema({
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        index: true
    },
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        index: true
    },
    mensaje: {
        type: String,
        required: true,
        trim: true
    },
    fechaHoraCreacion: {
        type: Date,
        required: true
    },
    fechaHoraLeida: {
        type: Date
    },
    leida: {
        type: Boolean,
        required: true,
        default: false,
        index: true
    }
    /* ver si lo usamos o no
    eliminado: {
        type: Boolean,
        required: true,
        default: false
    },*/
},{
    timestamps: true,
    collection: "notificaciones"
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model("Notificacion", notificacionSchema);