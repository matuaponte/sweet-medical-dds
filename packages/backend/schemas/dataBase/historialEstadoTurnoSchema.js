import mongoose from "mongoose";

export const historialEstadoTurnoSchema = new mongoose.Schema({
    fechaHoraIngreso: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    usuario: {
        type: String, //referenciamos el uuid del usuario 
        ref: "Usuario",
        required: true,
    },
    motivo: {
        type: String,
        required: true,
    },
});  // posibilidad de poner { _id: false }
/*
fechaHoraIngreso; 
    estado;
    turno;
    usuario;   
    motivo;
*/