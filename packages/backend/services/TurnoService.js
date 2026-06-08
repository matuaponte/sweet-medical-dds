import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/AppError.js";
import { filtrosTurnoSchema } from "../schemas/zod/turnoSchema.js";
import { Turno } from "../domain/turnos/turno.js";
import { Agenda } from "../domain/agenda.js";
import { NivelCobertura } from "../domain/coberturas/nivelCoberturaEnum.js";
import { EstadoTurnoEnum } from "../domain/turnos/estadoTurnoEnum.js";
import { TurnoRepository } from "../repositories/TurnoRepository.js";
import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { logger } from "../config/logger.js";
import { MedicoService } from "../services/MedicoService.js";
import { UsuarioService } from "../services/UsuarioService.js";
import { NotificacionService } from "./NotificacionService.js";
import { SedeRepository } from "../repositories/SedeRepository.js";
import { ServicioRepository } from "../repositories/ServicioRepository.js";


export class TurnoService {
  constructor({
    turnoRepository = new TurnoRepository(),
    pacienteRepository = new PacienteRepository(),
    obraSocialRepository = new ObraSocialRepository(),
    medicoRepository = new MedicoRepository(),
    medicoService = new MedicoService(),
    agenda = new Agenda(),
    usuarioService = new UsuarioService(),
    notificacionService = new NotificacionService(),
    sedeRepository = new SedeRepository(),
    servicioRepository = new ServicioRepository(),
  } = {}) {
    this.turnoRepository = turnoRepository;
    this.pacienteRepository = pacienteRepository;
    this.obraSocialRepository = obraSocialRepository;
    this.medicoRepository = medicoRepository;
    this.medicoService = medicoService;
    this.agenda = agenda;
    this.usuarioService = usuarioService;
    this.notificacionService = notificacionService;
    this.sedeRepository = sedeRepository;
    this.servicioRepository = servicioRepository;
  }

  toDto(turno) {
    return {
      id: turno.id || turno._id,
      medico: turno.medico,
      servicio: turno.servicio,
      paciente: turno.paciente,
      fechaHora: turno.fechaHora,
      fechaHoraPropuesta: turno.fechaHoraPropuesta,
      sede: turno.sede,
      estado: turno.estado,
      historialEstado: turno.historialEstado,
      costo: turno.costo,
      estadoCobertura: turno.estadoCobertura,
    };
  }

  async cambiarEstadoTurno(id, nuevoEstado, quien, motivo) {
    logger.info(`[TURNO SERVICE]: Intentando cambiar estado del turno ${id} a ${nuevoEstado}`);
    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new BadRequestError("No se encontro el turno con el id " + id);
    }

    if(nuevoEstado === turno.estado){
      throw new ConflictError("El turno ya tiene el estado " + nuevoEstado);
    }

    // Determinar quién realiza el cambio (paciente o médico) y obtener remitente/destinatario
    let remitente;
    let destinatario;
    let quienObj = null;

    if (turno.paciente &&(turno.paciente.toString() === quien || turno.paciente.id === quien)) {
      remitente = turno.paciente;
      destinatario = turno.medico;
      quienObj = await this.pacienteRepository.findById(quien);
    } else if (
      turno.medico &&
      (turno.medico.toString() === quien || turno.medico.id === quien)
    ) {
      remitente = turno.medico;
      destinatario = turno.paciente;
      quienObj = await this.medicoRepository.findById(quien);
    } else {
      throw new BadRequestError("El turno no pertenece a este usuario");
    }

    // La cancelación requiere motivo y 1 hora de anticipación
    if (nuevoEstado === EstadoTurnoEnum.CANCELADO) {
      if (!motivo || typeof motivo !== "string" || motivo.trim().length === 0) {
        throw new BadRequestError("Para cancelar el turno se requiere un motivo");
      }

      const fechaTurno = new Date(turno.fechaHora).getTime();
      const ahora = Date.now();
      const diferenciaMs = fechaTurno - ahora;
      const unaHoraMs = 60 * 60 * 1000;
      if (diferenciaMs < unaHoraMs) {
        throw new BadRequestError(
          "No se puede cancelar un turno con menos de 1 hora de anticipación",
        );
      }
    }

    turno.actualizarEstadoTurno({ nuevoEstado, quien: quienObj._id, turno, motivo});
    this.notificacionService.crearNotificacionSegunEstadoTurno(turno, remitente.idUsuario, destinatario.idUsuario);
    const turnoActualizado = await this.turnoRepository.update(id, turno);
    logger.info(`[TURNO SERVICE]: Estado de turno ${id} actualizado correctamente`);
    return this.toDto(turnoActualizado);
  }

  async create(data) {
    const { fechaHora, medicoId, sedeId, servicioId, costo } = data;
    logger.info(`[TURNO SERVICE]: Creando turno para el médico ${medicoId} en fecha ${fechaHora}`);

    if (!medicoId || !sedeId || !fechaHora || !servicioId) {
      throw new UnprocessableEntityError(
        "Datos incompletos para crear el turno",
      );
    }

    const yaExiste = await this.turnoRepository.existeTurno(
      medicoId,
      fechaHora,
    );
    if (yaExiste) {
      throw new ConflictError(
        "El médico ya tiene un turno creado en esa fecha y horario",
      );
    }

    const medico = await this.medicoRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundError("No se encontro el medico con el id " + medicoId);
    }

    const sede = await this.sedeRepository.findById(sedeId);
    if (!sede) {
      throw new NotFoundError("No se encontro la sede con el id " + sedeId);
    }

    const servicio = await this.servicioRepository.findById(servicioId);
    if (!servicio) {
      throw new NotFoundError(
        "No se encontro el servicio con el id " + servicioId,
      );
    }

    const turno = new Turno({ medico, sede, fechaHora, servicio, costo });
    const turnoGuardado = await this.turnoRepository.save(turno);
    logger.info("[TURNO SERVICE]: Turno creado con éxito");
    return this.toDto(turnoGuardado);
  }

  async asignarTurno(idTurno, pacienteId, costoTurno) {
    logger.info("[TURNO SERVICE]: Intentando asignar el turno " + idTurno + " al paciente " + pacienteId);

    const turno = await this.turnoRepository.findById(idTurno);
    if (!turno){
      throw new NotFoundError("No se encontro el turno con el id " + idTurno);
    }
    if(turno.paciente){
      throw new ConflictError("El turno ya tiene un paciente asignado");
    }
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente){
      throw new NotFoundError(
        "No se encontro el paciente con el id " + pacienteId,
      );
    }

    turno.paciente = paciente;
    turno.costo = costoTurno;

    turno.actualizarEstadoTurno({
      nuevoEstado: EstadoTurnoEnum.RESERVADO,
      quien: paciente._id,
      turno,
      motivo: "Reserva de turno"
    });
    this.notificacionService.crearNotificacionSegunEstadoTurno(turno, paciente.idUsuario, turno.medico.idUsuario);

    const turnoActualizado = await this.turnoRepository.update(idTurno, turno);
    logger.info(`[TURNO SERVICE]: Turno ${idTurno} asignado correctamente`);
    return this.toDto(turnoActualizado);
  }

  async obtenerTodosPaginados(numeroPagina = 1, limitePorPagina = Number(process.env.ITEMS_PER_PAGE) || 10, filtros = {}) {

    logger.info(`[TURNO SERVICE]: Obteniendo turnos paginados (Pág: ${numeroPagina})`);

    this.validarPaginacion(numeroPagina, limitePorPagina);
    const filtrosValidados = this.validarFiltros(filtros);

    const filtrosParaBD = { ...filtrosValidados };
    // Si buscamos turnos disponibles, quitamos pacienteId para que Mongoose no intente buscar un turno disponible con paciente asignado
    if (filtrosParaBD.estado === EstadoTurnoEnum.DISPONIBLE) {
      delete filtrosParaBD.pacienteId;
    }
    // aseguramos que si no viene la fecha desde, que sea desde hoy, para no mostrar pasados
    if (!filtrosParaBD.fechaHoraInicio) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      filtrosParaBD.fechaHoraInicio = hoy;
    }

    const { turnos, totalTurnos } = await this.turnoRepository.obtenerPaginados(numeroPagina, limitePorPagina, filtrosParaBD);

    const totalPaginas = totalTurnos === 0 ? 0 : Math.ceil(totalTurnos / limitePorPagina);

    let obraSocial = null;
    let plan = null;

    // Solo buscaremos el plan si tenemos un paciente para calcular la cobertura.
    if (filtrosValidados.pacienteId) {
      const { obraSocial: osObtenida, plan: planObtenido } = await this.obtenerObraSocialYPlanPorPaciente(filtrosValidados.pacienteId);
      obraSocial = osObtenida;
      plan = planObtenido;
    }

    //solo se calcula si el turno tiene un servicio y si se filtra por pacienteID para una busqueda de turnos.
    const turnosConCobertura = turnos.map((t) => {
      if (t.servicio && filtrosValidados.pacienteId) {
        const cobertura = this.calcularCostoTurno(obraSocial, plan, t.costo, t.servicio);
        t.costo = cobertura.costoFinal;
        t.estadoCobertura = cobertura.estadoCobertura;
      }
      return this.toDto(t);
    });

    logger.info(`[TURNO SERVICE]: Retornando ${turnosConCobertura.length} turnos`);
    return {
      turnosConCobertura,
      numeroPagina,
      limitePorPagina,
      totalPaginas,
      totalTurnos,
    };
  }

  async obtenerTurnosDeUsuario(filtros, numeroPagina = 1, limitePorPagina = Number(process.env.ITEMS_PER_PAGE) || 10) {
    logger.info(`[TURNO SERVICE]: Obteniendo turnos de usuario (Pág: ${numeroPagina})`);

    this.validarPaginacion(numeroPagina, limitePorPagina);
    const filtrosValidados = this.validarFiltros(filtros);

    // Acá los filtros ya deberían venir validados con `pacienteId` o `medicoId`
    // No calculamos la obra social en tiempo de ejecución porque se supone
    // que estos turnos (RESERVADO, CONFIRMADO, FINALIZADO) ya tienen un costo/asociación guardada

    const { turnos, totalTurnos } = await this.turnoRepository.obtenerPaginados(
      numeroPagina,
      limitePorPagina,
      filtrosValidados,
    );

    const totalPaginas =
      totalTurnos === 0 ? 0 : Math.ceil(totalTurnos / limitePorPagina);

    const turnosDTo = turnos.map((t) => this.toDto(t));

    logger.info(
      `[TURNO SERVICE]: Retornando ${turnosDTo.length} turnos de usuario`,
    );
    return {
      turnos: turnosDTo,
      numeroPagina,
      limitePorPagina,
      totalPaginas,
      totalTurnos,
    };
  }

  async findById(id) {
    logger.info(`[TURNO SERVICE]: Buscando turno ${id}`);
    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new NotFoundError("No se encontro el turno con el id " + id);
    }
    logger.info(`[TURNO SERVICE]: Turno ${id} encontrado`);
    return this.toDto(turno);
  }

  async findByEstado(estado) {
    logger.info(`[TURNO SERVICE]: Buscando turnos por estado ${estado}`);

    const turnos = await this.turnoRepository.findByEstado(estado);

    if (turnos.length === 0) {
      throw new NotFoundError(
        `No se encontró ningún turno con el estado ${estado}`,
      );
    }

    logger.info(`[TURNO SERVICE]: Se encontraron ${turnos.length} turnos con estado ${estado}`);

    return turnos.map((t) => this.toDto(t));
  }

  async update(idTurno, turno) {
    logger.info(`[TURNO SERVICE]: Actualizando turno ${idTurno}`);
    const turnoActualizado = await this.turnoRepository.update(idTurno, turno);

    if (!turnoActualizado) {
      throw new NotFoundError("No se encontro el turno con el id " + idTurno);
    }

    logger.info(`[TURNO SERVICE]: Turno ${idTurno} actualizado con éxito`);

    return this.toDto(turnoActualizado);
  }

  async solicitarCambioFecha(idTurno, nuevaFechaHora, usuarioId) {
    logger.info(`[TURNO SERVICE]: Usuario ${usuarioId} solicita cambio de fecha para turno ${idTurno}`);
    const turno = await this.turnoRepository.findById(idTurno);
    if (!turno) {
      throw new NotFoundError("No se encontro el turno con el id " + idTurno);
    }

    let quien;
    let receptor;
    let rol;
    if (turno.paciente && (turno.paciente.toString() === usuarioId || turno.paciente.id === usuarioId)) {
      quien = await this.pacienteRepository.findById(usuarioId);
      receptor = await this.medicoRepository.findById(turno.medico);
      rol = "paciente";
    } 
    else if (turno.medico && (turno.medico.toString() === usuarioId || turno.medico.id === usuarioId)) {
      quien = await this.medicoRepository.findById(usuarioId);
      receptor = await this.pacienteRepository.findById(turno.paciente);
      rol = "médico";
    } 
    else {
      throw new BadRequestError("El turno no pertenece a este usuario");
    }

    turno.fechaHoraPropuesta = nuevaFechaHora;
    turno.actualizarEstadoTurno({nuevoEstado: EstadoTurnoEnum.PENDIENTECAMBIO, quien: quien._id, turno, motivo: `El ${rol} propone cambio de fecha a ${nuevaFechaHora}`});

    this.notificacionService.crearNotificacionSegunEstadoTurno(turno, quien.idUsuario, receptor.idUsuario);

    const turnoActualizado = await this.turnoRepository.update(idTurno, turno);
    logger.info(`[TURNO SERVICE]: Cambio de fecha solicitado. Turno ${idTurno} actualizado`);
    return this.toDto(turnoActualizado);
  }

  async responderCambioFecha(idTurno, aceptado, usuarioId) {
    logger.info(`[TURNO SERVICE]: Usuario ${usuarioId} responde (Aceptado: ${aceptado}) al cambio de fecha del turno ${idTurno}`);
    const turno = await this.turnoRepository.findById(idTurno);
    if (!turno) {
      throw new NotFoundError("No se encontro el turno con el id " + idTurno);
    }

    if (turno.estado !== EstadoTurnoEnum.PENDIENTECAMBIO) {
      throw new BadRequestError("El turno no está pendiente de cambio");
    }

    let quien;
    let receptor;
    let rol;
    if (turno.paciente && (turno.paciente.toString() === usuarioId || turno.paciente.id === usuarioId)) {
      quien = await this.pacienteRepository.findById(usuarioId);
      receptor = await this.medicoRepository.findById(turno.medico);
      rol = "paciente";
    } else if (turno.medico && (turno.medico.toString() === usuarioId || turno.medico.id === usuarioId)) {
      quien = await this.medicoRepository.findById(usuarioId);
      receptor = await this.pacienteRepository.findById(turno.paciente);
      rol = "médico";
    } else {
      throw new BadRequestError("El turno no pertenece a este usuario");
    }

    if (aceptado) {
      turno.fechaHora = turno.fechaHoraPropuesta;
      turno.fechaHoraPropuesta = undefined;
      turno.actualizarEstadoTurno({
        nuevoEstado: EstadoTurnoEnum.CONFIRMADO,
        quien: quien._id,
        turno,
        motivo: `El ${rol} aceptó la propuesta de cambio de fecha`,
      });
      this.notificacionService.crearNotificacionSegunEstadoTurno(turno, quien.idUsuario, receptor.idUsuario);
    } else {
      turno.fechaHoraPropuesta = undefined;
      turno.actualizarEstadoTurno({
        nuevoEstado: EstadoTurnoEnum.RESERVADO,
        quien: quien._id,
        turno,
        motivo: `El ${rol} rechazó el cambio de fecha. Se conserva la original.`,
      });
      this.notificacionService.crearNotificacionSegunEstadoTurno(turno, quien.idUsuario, receptor.idUsuario);
    }

    const turnoActualizado = await this.turnoRepository.update(idTurno, turno);
    logger.info(`[TURNO SERVICE]: Respuesta a cambio de fecha procesada. Turno ${idTurno} actualizado`);
    return this.toDto(turnoActualizado);
  }

  async generarNotificacionesDeTurnosProximos() {
    logger.info("[TURNO SERVICE]: Generando notificaciones para turnos próximos");
    const turnosProximos = await this.turnoRepository.find({ date: { $e: new Date(Date.now()).getDay() + 1 }, estado: EstadoTurnoEnum.CONFIRMADO }); //turnos confirmados de mañana
    logger.info(`[TURNO SERVICE]: Se encontraron ${turnosProximos.length} turnos próximos para notificar`);
    for (const turno of turnosProximos) {
      await this.notificacionService.crearNotificacionSegunFechaTurno(turno, turno.medico);
      await this.notificacionService.crearNotificacionSegunFechaTurno(turno, turno.paciente);
    }
    logger.info("[TURNO SERVICE]: Se ha notificado a los usuarios de los turnos próximos");
  }

  /* -------------------------------------------------------------------------- */
  /*                            FUNCIONES AUXILIARES                              */
  /* -------------------------------------------------------------------------- */

  calcularCostoTurno(obraSocial, plan, precioBase, servicio) {
    const precioFinal = precioBase;

    if (!obraSocial || !plan) {
      return precioFinal; // Si no hay obra social ni plan, el paciente paga el 100%
    }

    const { nivel, porcentaje } = plan.obtenerCoberturaServicio(servicio); // si el servicio no existe en las cobertura se devuelve nivel: "NO_CUBIERTA" y porcentaje: 0

    switch (nivel) {
      case NivelCobertura.TOTAL:
        return { costoFinal: 0, estadoCobertura: "TOTAL" };
      case NivelCobertura.PARCIAL:
        return {
          costoFinal: precioFinal * porcentaje,
          estadoCobertura: "PARCIAL",
        };
      case NivelCobertura.NO_CUBIERTA:
        return { costoFinal: precioFinal, estadoCobertura: "NO_CUBIERTA" };
      default:
        return { costoFinal: precioFinal, estadoCobertura: "NO_CUBIERTA" };
    }
  }

  async obtenerObraSocialYPlanPorPaciente(pacienteId) {
    const paciente = await this.pacienteRepository.findById(pacienteId);

    if (!paciente.obraSocial) {
      return { obraSocial: null, plan: null };
    }

    const obraSocial = await this.obraSocialRepository.findById(paciente.obraSocial);
    if (!obraSocial) {
      throw new NotFoundError("No se encontro la obra social con el id " + paciente.obraSocialId);
    }
    const plan = obraSocial.obtenerPlanPorId(paciente.plan);

    return {
      obraSocial,
      plan,
    };
  }

  validarFiltros(filtrosRecibidos) {
    const validacion = filtrosTurnoSchema.safeParse(filtrosRecibidos); //Analiza y devuelve un objeto con success y data entonces lo que hacemos es usar ese obkjecto para manejar el estado de la respuesta de success
    if (!validacion.success) {
      const mensajesError = validacion.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new BadRequestError(`Filtros inválidos: ${mensajesError}`);
    }
    return validacion.data;
  }

  validarPaginacion(numeroPagina, limitePorPagina) {
    this.validarEnteroPositivo(numeroPagina, "Numero de página");
    this.validarEnteroPositivo(limitePorPagina, "Límite por página");
  }

  validarEnteroPositivo(numero, parametro) {
    if (!Number.isInteger(numero) || numero <= 0) {
      throw new BadRequestError(`${parametro} debe ser un entero positivo`);
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                            CREACION DE TURNOS                              */
  /* -------------------------------------------------------------------------- */

  async generarTurnosDisponibles() {
    logger.info("Iniciando generación de turnos disponibles");

    const medicos = await this.medicoService.findAll();

    for (const medico of medicos) {
      await this.generarTurnosDisponiblesParaMedico(medico);
    }

    logger.info("Finalizó generación de turnos disponibles");
  }

  async generarTurnosDisponiblesParaMedico(medico) {
    const turnosGenerados = this.agenda.generarTurnosSegunDisponibilidadDelMedico(medico);

    for (const turno of turnosGenerados) {
      const yaExiste = await this.turnoRepository.existeTurno(medico.id, turno.fechaHora);

      if (!yaExiste) {
        await this.turnoRepository.save(turno);
      }
    }
  }

  async refrescarTurnosDisponiblesDelMedico(medico) {
    const ahora = new Date();

    await this.turnoRepository.eliminarTurnosDisponiblesFuturosDelMedico(
      medico.id,
      ahora
    );

    await this.generarTurnosDisponiblesParaMedico(medico);
  }
}