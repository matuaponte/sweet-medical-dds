import { NotificacionRepository } from "../repositories/NotificacionRepository.js";
import { NotFoundError } from "../errors/AppError.js";
import { Notificacion } from "../domain/notificacion.js";
import { UsuarioService } from "./UsuarioService.js";
import { logger } from "../config/logger.js";
import { Usuario } from "../domain/usuario.js";
import { FactoryNotificacion } from "../domain/factoryNotificacion.js";

export class NotificacionService {
    constructor({ 
        notificacionRepository = new NotificacionRepository(), 
        usuarioService = new UsuarioService() 
    } = {}) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioService = usuarioService;
    }

    toDto(notificacion){
        const destinatario = notificacion.destinatario;
        const remitente = notificacion.remitente;
        
        return {
            id: notificacion.id || notificacion._id,
            destinatario: destinatario?.nombreUsuario || destinatario?.nombre || destinatario,
            remitente: remitente?.nombreUsuario || remitente?.nombre || remitente,
            mensaje: notificacion.mensaje,
            fechaHoraCreacion: notificacion.fechaHoraCreacion,
            fechaHoraLeida: notificacion.fechaHoraLeida,
            leida: notificacion.leida,
        };
    }

    async crearNotificacion(notificacionData) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo datos necesarios para crear la notificacion");
        const destinatarioObtenido = await this.usuarioService.findById(notificacionData.destinatario);
        const destinatario = new Usuario(destinatarioObtenido); destinatario.id = destinatarioObtenido.id;
        
        const remitenteObtenido = await this.usuarioService.findById(notificacionData.remitente);
        const remitente = new Usuario(remitenteObtenido); remitente.id = remitenteObtenido.id;

        const notificacion = new Notificacion({
            destinatario: destinatario,
            remitente: remitente,
            mensaje: notificacionData.mensaje
        });
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion creada: ", notificacionGuardada);
        return this.toDto(notificacionGuardada);
    }

    async crearNotificacionSegunEstadoTurno(turno, remitente, destinatario) {
        logger.info("[NOTIFICACIONES SERVICE]: Creando la notificacion con el Factory para el turno ", turno);
        const notificacion = FactoryNotificacion.crearSegunEstadoTurno(turno, remitente, destinatario);
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion creada: ", notificacionGuardada);
        return this.toDto(notificacionGuardada);
    }

    async crearNotificacionSegunFechaTurno(turno, destinatario) {
        logger.info("[NOTIFICACIONES SERVICE]: Creando la notificacion con el Factory para el turno ", turno);
        const notificacion = FactoryNotificacion.crearSegunFechaTurno(turno, destinatario);
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion creada: ", notificacionGuardada);
        return this.toDto(notificacionGuardada);
    }

    async getLeidosNoLeidos(idDestinatario, leido) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones " + ((leido) ? "leidas" : "no leidas") + " del usuario " + idDestinatario);
        const notificaciones = await this.notificacionRepository.getByDestinatarioIdAndLeido(idDestinatario, leido);
        logger.info("[NOTIFICACIONES SERVICE]: Se obtuvieron las notificaciones: ", notificaciones);
        return notificaciones.map(n => this.toDto(n));
    }

    async getLeidosNoLeidosPaginado(idDestinatario, leido, page = 1, limit = 10) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones " + (leido ? "leidas" : "no leidas") + " del usuario " + idDestinatario);
        const resultado = await this.notificacionRepository.getByDestinatarioIdAndLeidoPaginado(idDestinatario, leido, page, limit);

        const notificaciones = resultado.data.map(n => this.toDto(n));
        logger.info("[NOTIFICACIONES SERVICE]: Se obtuvieron las notificaciones:", resultado.data);
        return {
            ...resultado,
            data: notificaciones
        };

    }

    /*
    async obtenerPaginadas(numeroPagina = 1, limitePorPagina = 10, filtros = {}) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo notificaciones paginadas");

        const resultado = await this.notificacionesRepository.obtenerPaginadas(numeroPagina, limitePorPagina, filtros);

        logger.info("[NOTIFICACIONES SERVICE]: Notificaciones obtenidas:", resultado.notificaciones.length);

        return {
            totalNotificaciones: resultado.totalNotificaciones,
            numeroPagina,
            limitePorPagina,
            totalPaginas: Math.ceil(resultado.totalNotificaciones / limitePorPagina),
            notificaciones: resultado.notificaciones.map(n => NotificacionMapper.toDTO(n))
        };
    }*/

    async leer(idNotificacion) {
        logger.info("[NOTIFICACIONES SERVICE]: Obteniendo los datos necesarios para leer la notificacion");
        const notificacion = await this.notificacionRepository.getById(idNotificacion);

        if (!notificacion) throw new NotFoundError("No se encontro la notificacion con el id " + idNotificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Leyendo notificacion: ", idNotificacion);
        if (notificacion.leida === true) return this.toDto(notificacion); //de ultima que tire BadRequestError
        notificacion.marcarComoLeida();
        const notificacionGuardada = await this.notificacionRepository.save(notificacion);
        logger.info("[NOTIFICACIONES SERVICE]: Notificacion leida: ", notificacionGuardada);

        return this.toDto(notificacionGuardada);
    }

    async setUsuarioSistema(usuarioSistemaId) {
        logger.info("[NOTIFICACIONES SERVICE]: Configurando usuario sistema para el factory de notificaciones");
        const usuarioSistema = await this.usuarioService.findEntityById(usuarioSistemaId);
        FactoryNotificacion.setUsuarioSistema(usuarioSistema);
        logger.info("[NOTIFICACIONES SERVICE]: Usuario sistema configurado para el factory de notificaciones");
    }
}