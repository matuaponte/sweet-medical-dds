import { PacienteModel } from "../schemas/dataBase/pacienteSchema.js";
import { logger } from "../config/logger.js";

export class PacienteRepository {
  #model;
  constructor() {
    this.#model = PacienteModel;
  }

  async findAll() {
    logger.info("[PACIENTE REPOSITORY]: Buscando todos los pacientes");
    const pacientes = await this.#model.find()
      .populate("idUsuario")
      .populate("obraSocial");
    logger.info("[PACIENTE REPOSITORY]: Pacientes obtenidos: ", pacientes);
    return pacientes;
  }

  async findById(idPaciente) {
    logger.info("[PACIENTE REPOSITORY]: Buscando paciente por id: ", idPaciente);
    const paciente = await this.#model.findById(idPaciente)
      .populate("idUsuario obraSocial");
    
    if (!paciente) {
      logger.info("[PACIENTE REPOSITORY]: Paciente no encontrado: ", idPaciente);
      return null;
    }
    
    logger.info("[PACIENTE REPOSITORY]: Paciente obtenido: ", paciente);
    return paciente;
  }

  async findByIdUsuario(idUsuario) {
    logger.info("[PACIENTE REPOSITORY]: Buscando paciente por id de usuario: ", idUsuario);
    const paciente = await this.#model.findOne({ idUsuario: idUsuario })
      .populate("idUsuario")
      .populate("obraSocial");
    
    if (!paciente) {
      logger.info("[PACIENTE REPOSITORY]: Paciente no encontrado para usuario: ", idUsuario);
      return null;
    }
    
    logger.info("[PACIENTE REPOSITORY]: Paciente obtenido: ", paciente);
    return paciente;
  }

  async save(paciente) {
    logger.info("[PACIENTE REPOSITORY]: Guardando paciente: ", paciente);
    const nuevoPaciente = new this.#model(paciente);
    const pacienteGuardado = await nuevoPaciente.save();

    await pacienteGuardado.populate("idUsuario");
    await pacienteGuardado.populate("obraSocial");

    logger.info("[PACIENTE REPOSITORY]: Paciente guardado: ", pacienteGuardado);
    return pacienteGuardado;
  }

  async delete(idPaciente) {
    logger.info("[PACIENTE REPOSITORY]: Eliminando paciente: ", idPaciente);
    const pacienteEliminado = await this.#model.findByIdAndDelete(idPaciente)
      .populate("idUsuario")
      .populate("obraSocial");
    
    if (!pacienteEliminado) {
      logger.info("[PACIENTE REPOSITORY]: Paciente no encontrado para eliminar: ", idPaciente);
      return null;
    }
    
    logger.info("[PACIENTE REPOSITORY]: Paciente eliminado: ", pacienteEliminado);
    return pacienteEliminado;
  }
}
