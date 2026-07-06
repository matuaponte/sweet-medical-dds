import mongoose from "mongoose";
import { CoberturaPractica } from "../../domain/coberturas/coberturaPractica.js";

export const coberturaPracticaSchema = new mongoose.Schema({
  practica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Practica",
    required: true,
  },
  nivel: {
    type: String,
    required: true,
  },
  porcentajeCobertura: {
    type: Number,
    required: true,
  },
});

coberturaPracticaSchema.loadClass(CoberturaPractica);
