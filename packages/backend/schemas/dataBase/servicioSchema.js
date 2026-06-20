import mongoose from "mongoose";

export const servicioSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    duracionTurnoEnMins: {
      type: Number,
      required: true,
    },
  },
  {
    discriminatorKey: "tipo",
    collection: "servicios",
  }
);

const ServicioModel = mongoose.model("Servicio", servicioSchema);

const EspecialidadModel = ServicioModel.discriminator(
  "Especialidad",
  new mongoose.Schema({
    costo: {
      type: Number,
      required: true,
    },
  })
);

const PracticaModel = ServicioModel.discriminator(
  "Practica",
  new mongoose.Schema({
    costo: {
      type: Number,
      required: true,
    },
    codigo: {
      type: String,
      required: true,
      trim: true,
    },
    especialidadPadreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
      required: true,
    }
  })
);

export { ServicioModel, EspecialidadModel, PracticaModel };