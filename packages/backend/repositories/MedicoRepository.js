import { MedicoModel } from "../schemas/dataBase/medicoSchema.js";
import { MedicoMapper } from "../mappers/medicoMapper.js";
import { Medico } from "../domain/medico.js";
import { logger } from "../config/logger.js";
import { BadRequestError } from "../errors/AppError.js";

export class MedicoRepository {
  constructor() {
    this.model = MedicoModel;
  }

  async findAll() {
    return await this.model.find().populate([
      "idUsuario",
      "especialidades",
      {
        path: "practicas",
        populate: { path: "especialidadPadreId" }
      },
      {
        path: "disponibilidades",
        populate: [
          { path: "sede" },
          {
            path: "servicio",
            populate: {
              path: "especialidadPadreId",
              strictPopulate: false
            }
          }
        ],
      },
      "sedes",
    ]);
  }

  async findById(idMedico) {
    logger.info("[MEDICO REPOSTIRORY]: Buscando medico: por id", idMedico);
    const medico = await this.model
      .findById(idMedico)
      .populate([
        "idUsuario",
        "especialidades",
        { path: "practicas", populate: { path: "especialidadPadreId" } },
        {
          path: "disponibilidades",
          populate: [
            { path: "sede" },
            {
              path: "servicio",
              populate: { path: "especialidadPadreId", strictPopulate: false },
            },
          ],
        },
        "sedes",
      ]);
    const mensaje = medico
      ? "Medico obtenido: " + medico
      : "No se encontro el medico con id: " + idMedico;
    logger.info("[MEDICO REPOSTIRORY]: " + mensaje);

    if (!medico) return;
    return medico;
  }

  async save(medico) {
    logger.info("[MEDICO REPOSTIRORY]: Guardando medico: ", medico);

    if (!(medico instanceof Medico)) throw new BadRequestError("No es un Medico valido");

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
    await medicoGuardado.populate([
      "usuario",
      "especialidades",
      { path: "practicas", populate: { path: "especialidadPadreId" } },
      {
        path: "disponibilidades",
        populate: [
          { path: "sede" },
          {
            path: "servicio",
            populate: { path: "especialidadPadreId", strictPopulate: false },
          },
        ],
      },
      "sedes",]);
    logger.info("[MEDICO REPOSTIRORY]: Medico guardado: ", medicoGuardado);

    return medicoGuardado;
  }

  async findByIdUsuario(idUsuario) {
    logger.info(
      "[MEDICO REPOSTIRORY]: Buscando medico: por id de usuario",
      idUsuario,
    );
    const medico = await this.model
      .findOne({ usuario: idUsuario })
      .populate([
        "usuario",
        "especialidades",
        "practicas",
        { path: "practicas", populate: { path: "especialidadPadreId" } },
        "disponibilidades",
        { path: "disponibilidades", populate: { path: "sede" } },
        { path: "disponibilidades", populate: { path: "servicio" } },
        "sedes",
      ])
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
