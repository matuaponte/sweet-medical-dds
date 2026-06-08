import { MedicoModel } from "../schemas/dataBase/medicoSchema.js";
import { logger } from "../config/logger.js";

const POPULATE_MEDICO_CONFIG = [
  "usuario",
  "especialidades",
  {
    path: "practicas",
    populate: { path: "especialidadPadre" }
  },
  {
    path: "disponibilidades",
    /* populate: [
      { path: "sede" },
      {
        path: "servicio",
        populate: {
          path: "especialidadPadre",
          strictPopulate: false
        }
      }
    ], */
  },
  "sedes",
];

export class MedicoRepository {
  constructor() {
    this.model = MedicoModel;
  }

  async findAll() {
    return await this.model.find().populate(POPULATE_MEDICO_CONFIG);
  }

  async findById(idMedico) {
    logger.info("[MEDICO REPOSTIRORY]: Buscando medico: por id", idMedico);
    const medico = await this.model
      .findById(idMedico)
      .populate(POPULATE_MEDICO_CONFIG);

    const mensaje = medico
      ? "Medico obtenido: " + medico
      : "No se encontro el medico con id: " + idMedico;
    logger.info("[MEDICO REPOSTIRORY]: " + mensaje);

    if (!medico) return;
    return medico;
  }

  async save(medico) {
    logger.info("[MEDICO REPOSTIRORY]: Guardando medico: ", medico);

    let medicoGuardado = null;
    if (medico.id) {
      medicoGuardado = await this.model.findByIdAndUpdate(
        medico.id,
        medico,
        { new: true, runValidators: true },
      );
    } else {
      const nuevoMedico = new this.model(medico); //
      medicoGuardado = await nuevoMedico.save();
    }
    await medicoGuardado.populate(POPULATE_MEDICO_CONFIG);
    logger.info("[MEDICO REPOSTIRORY]: Medico guardado: ", medicoGuardado);

    return medicoGuardado;
  }

  async update(id, medico) {
    logger.info("[MEDICO REPOSTIRORY]: Actualizando medico con id: ", id, "el medico es: ", medico);
    const medicoActualizado = await this.model.findByIdAndUpdate(
      id,
      medico,
      { new: true, runValidators: true }
    ).populate(POPULATE_MEDICO_CONFIG);
    if (!medicoActualizado) {
      return null;
    }
    logger.info("[MEDICO REPOSTIRORY]: Medico actualizado: ", medicoActualizado);
    return medicoActualizado;
  }

  async findByIdUsuario(idUsuario) {
    logger.info(
      "[MEDICO REPOSTIRORY]: Buscando medico: por id de usuario",
      idUsuario,
    );
    const medico = await this.model
      .findOne({ usuario: idUsuario })
      .populate(POPULATE_MEDICO_CONFIG)
      .lean(); //TODO: faltan las sedes

    const mensaje = medico
      ? "Medico obtenido: " + medico
      : "No se encontro el medico con id de usuario: " + idUsuario;
    logger.info("[MEDICO REPOSTIRORY]: " + mensaje);

    if (!medico) return;
    return medico;
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
