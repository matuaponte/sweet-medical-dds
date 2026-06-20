import { TurnoService } from "../services/TurnoService.js";
import {
  idParamsSchema,
  bodyCambioEstadoTurnoSchema,
  bodyAsignarTurnoSchema,
  bodyUpdateTurnoSchema,
  turnoBaseSchema,
  bodySolicitarCambioFechaSchema,
  bodyResponderCambioFechaSchema,
} from "../schemas/zod/turnoSchema.js";
import { logger } from "../config/logger.js";

export class TurnoController {
  constructor({ turnoService = new TurnoService() } = {}) {
    this.turnoService = turnoService;
  }

  create = async (req, res, next) => {
    try {
      const turnoData = turnoBaseSchema.parse(req.body);
      logger.info("[TURNOS CONTROLLER]: Creando turno con datos: ", turnoData);
      const nuevoTurno = await this.turnoService.create(turnoData);
      logger.info("[TURNOS CONTROLLER]: Turno creado con éxito");
      return res.status(201).json({ status: "success", data: nuevoTurno });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: No se pudo crear el turno");
      return next(error);
    }
  };

  cambiarEstadoTurno = async (req, res, next) => {
    try {
      const {id} = idParamsSchema.parse(req.params);
      const cambioTurnoData = bodyCambioEstadoTurnoSchema.parse(req.body);

      logger.info(`[TURNOS CONTROLLER]: Cambiando estado del turno a ${cambioTurnoData.nuevoEstado}`);
      const turnoActualizado = await this.turnoService.cambiarEstadoTurno(id,
        cambioTurnoData.nuevoEstado,
        cambioTurnoData.quien,
        cambioTurnoData.motivo);

      logger.info("[TURNOS CONTROLLER]: Estado de turno actualizado");
      return res
        .status(200)
        .json({ status: "success", data: turnoActualizado });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al cambiar el estado del turno");
      return next(error);
    }
  };

  asignarTurno = async (req, res, next) => {
    try {
      const {id} = idParamsSchema.parse(req.params);
      const turnoData = bodyAsignarTurnoSchema.parse(req.body);

      logger.info(`[TURNOS CONTROLLER]: Asignando turno a paciente: ${turnoData.pacienteId}`);
      const turnoAsignado = await this.turnoService.asignarTurno(
        id,
        turnoData.pacienteId,
        turnoData.costoTurno,
      );

      logger.info("[TURNOS CONTROLLER]: Turno asignado con éxito");
      return res.status(200).json({ status: "success", data: turnoAsignado });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al asignar paciente al turno");
      return next(error);
    }
  };

  findAllPaginated = async (req, res, next) => {
    try {
      const paginacion = this.extraerPaginacion(req.query);
      const filtros = this.extraerFiltros(req.query);

      logger.info(`[TURNOS CONTROLLER]: Obteniendo turnos paginados con estos filtros: ${JSON.stringify(filtros)}`);
      logger.info(`[TURNOS CONTROLLER]: Obteniendo turnos paginados con esta paginacion: ${JSON.stringify(paginacion)}`);
      const resultado = await this.turnoService.obtenerTodosPaginados(
        paginacion.numeroPagina,
        paginacion.limitePorPagina,
        filtros,
      );

      logger.info(`[TURNOS CONTROLLER]: Turnos obtenidos: ${resultado.turnosConCobertura.length}`);
      res.status(200).json({
        status: "success",
        data: resultado.turnosConCobertura,
        paginacion: {
          numeroPagina: resultado.numeroPagina,
          limitePorPagina: resultado.limitePorPagina,
          totalPaginas: resultado.totalPaginas,
          totalTurnos: resultado.totalTurnos,
        },
      });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al obtener turnos paginados");
      return next(error);
    }
  };

  findAllPaginatedByUsuario = async (req, res, next) => {
    try {
      const paginacion = this.extraerPaginacion(req.query);
      const filtros = this.extraerFiltros(req.query);

      logger.info(
        "[TURNOS CONTROLLER]: Obteniendo turnos de usuario paginados: ",
        filtros,
      );
      const resultado = await this.turnoService.obtenerTurnosDeUsuario(
        filtros,
        paginacion.numeroPagina,
        paginacion.limitePorPagina,
      );

      logger.info(`[TURNOS CONTROLLER]: Turnos de usuario obtenidos: ${resultado.turnos.length}`);
      res.status(200).json({
        status: "success",
        data: resultado.turnos,
        paginacion: {
          numeroPagina: resultado.numeroPagina,
          limitePorPagina: resultado.limitePorPagina,
          totalPaginas: resultado.totalPaginas,
          totalTurnos: resultado.totalTurnos,
        },
      });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al obtener turnos de usuario");
      return next(error);
    }
  };

  findById = async (req, res, next) => {
    try {
      logger.info("[TURNOS CONTROLLER]: Obteniendo turno: " + req.params.id);
      const turno = await this.turnoService.findById(req.params.id);
      logger.info("[TURNOS CONTROLLER]: Turno obtenido con éxito");
      res.status(200).json({
        status: "success",
        data: turno,
      });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al obtener el turno");
      next(error);
    }
  };

  findByEstado = async (req, res, next) => {
    try {
      const estado = req.params.estado;
      logger.info(`[TURNOS CONTROLLER]: Obteniendo turnos por estado: ${estado}`);
      const turnos = await this.turnoService.findByEstado(estado);
      logger.info(`[TURNOS CONTROLLER]: Turnos obtenidos (${turnos.length})`);
      res.status(200).json({
        status: "success",
        data: turnos,
      });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al obtener turnos por estado");
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const id = idParamsSchema.parse(req.params).id;
      const turnoData = bodyUpdateTurnoSchema.parse(req.body);

      logger.info("[TURNOS CONTROLLER]: Actualizando turno: ", turnoData);
      const turnoActualizado = await this.turnoService.update(
        id,
        turnoData,
      );

      logger.info("[TURNOS CONTROLLER]: Turno actualizado con éxito");
      return res
        .status(200)
        .json({ status: "success", data: turnoActualizado });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al actualizar el turno");
      return next(error);
    }
  };

  solicitarCambioFecha = async (req, res, next) => {
    try {
      const id = idParamsSchema.parse(req.params).id;
      const { nuevaFechaHora, usuarioId } =
        bodySolicitarCambioFechaSchema.parse(req.body);

      logger.info(`[TURNOS CONTROLLER]: Solicitando cambio de fecha para turno ${id} a fecha ${nuevaFechaHora}`);
      const turnoActualizado = await this.turnoService.solicitarCambioFecha(
        id,
        nuevaFechaHora,
        usuarioId,
      );

      logger.info("[TURNOS CONTROLLER]: Cambio de fecha solicitado con éxito");
      return res
        .status(200)
        .json({ status: "success", data: turnoActualizado });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al solicitar cambio de fecha");
      return next(error);
    }
  };

  responderCambioFecha = async (req, res, next) => {
    try {
      const id = idParamsSchema.parse(req.params).id;
      const { aceptado, usuarioId } = bodyResponderCambioFechaSchema.parse(
        req.body,
      );

      logger.info(`[TURNOS CONTROLLER]: Respondiendo cambio de fecha para turno ${id} (Aceptado: ${aceptado})`);
      const turnoActualizado = await this.turnoService.responderCambioFecha(
        id,
        aceptado,
        usuarioId,
      );

      logger.info("[TURNOS CONTROLLER]: Respuesta de cambio de fecha procesada");
      return res
        .status(200)
        .json({ status: "success", data: turnoActualizado });
    } catch (error) {
      logger.error("[TURNOS CONTROLLER]: Error al responder cambio de fecha");
      return next(error);
    }
  };

  extraerFiltros(query) {
    const filtros = {};

    if (query.pacienteId !== undefined) {
      filtros.pacienteId = query.pacienteId;
    }
    if (query.medicoId !== undefined) {
      filtros.medicoId = query.medicoId;
    }
    if (query.estado !== undefined) {
      filtros.estado = query.estado;
    }
    //if (query.especialidadId !== undefined) {
    //  filtros.especialidadId = query.especialidadId;
    //}
    //if (query.practicaId !== undefined) {
    //  filtros.practicaId = query.practicaId;
    if (query.servicioId !== undefined) {
      filtros.servicioId = query.servicioId;
    }
    if (query.sedeId !== undefined) {
      filtros.sedeId = query.sedeId;
    }
    if (query.fechaHoraInicio !== undefined) {
      filtros.fechaHoraInicio = query.fechaHoraInicio;
    }
    if (query.fechaHoraFin !== undefined) {
      filtros.fechaHoraFin = query.fechaHoraFin;
    }
    if (query.ordenPorCosto !== undefined) {
      filtros.ordenPorCosto = query.ordenPorCosto;
    }
    if (query.ordenPorFecha !== undefined) {
      filtros.ordenPorFecha = query.ordenPorFecha;
    }

    return filtros;
  }

  extraerPaginacion(query) {
    const numeroPagina = query?.page === undefined ? 1 : Number(query.page);
    const limitePorPagina =
      query?.limit === undefined ? Number(process.env.ITEMS_PER_PAGE) : Number(query.limit);

    this.turnoService.validarEnteroPositivo(numeroPagina, "page");
    this.turnoService.validarEnteroPositivo(limitePorPagina, "limit");

    return { numeroPagina, limitePorPagina };
  }
}
