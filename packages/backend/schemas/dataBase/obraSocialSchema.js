import mongoose from "mongoose";
import { ObraSocial } from "../../domain/obraSocial.js";
import { planSchema } from "./planSchema.js";

const obraSocialSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  planes: {
    type: [planSchema],
    default: [],
    required: false,
  },
  eliminado: {
    type: Boolean,
    required: true,
    default: false,
  },
});

obraSocialSchema.loadClass(ObraSocial);

export const ObraSocialModel = mongoose.model("ObraSocial", obraSocialSchema);
