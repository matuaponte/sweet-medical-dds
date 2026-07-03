import { NotificacionService } from "../services/NotificacionService.js";
import { notificacionIdParamsSchema } from "../schemas/zod/notificacionSchema.js";
import { usuarioIdSchema } from "../schemas/zod/usuarioSchema.js";
import { BadRequestError } from "../errors/AppError.js";
import { logger } from "../config/logger.js";

export class NotificacionController {
    constructor({
        notificacionService = new NotificacionService()
    } = {}) {
        this.notificacionService = notificacionService;
    }

    //este endpoint en la siguiente entrega vuela (es por logica del sistema que se crean)
    //    crearNotificacion = async (req, res, next) => {
    //        try {
    //            const notificacionData = notificacionSchema.parse(req.body);
    //            logger.info("[NOTIFICACIONES CONTROLLER]: Creando notificacion: ", notificacionData);
    //            const notificacion = await this.notificacionService.crearNotificacion(notificacionData);
    //            logger.info("[NOTIFICACIONES CONTROLLER]: Notificacion creada: ", notificacion);
    //            res.status(201).json({
    //                status: "success",
    //                data: notificacion
    //            });
    //        } catch (error) {
    //            next(error);
    //        }
    //    };

    getLeidas = async (req, res, next) => {
        try {
            const { idUsuario } = usuarioIdSchema.parse(req.params);
            logger.info("[NOTIFICACIONES CONTROLLER]: Obteniendo notificaciones leidas del usuario:", idUsuario);
            const notificaciones = await this.notificacionService.getLeidosNoLeidos(idUsuario, true);
            res.status(200).json({
                status: "success",
                data: notificaciones
            });
        } catch (error) {
            next(error);
        }
    };

    getLeidasPaginadas = async (req, res, next) => {
        try {
            const { idUsuario } = usuarioIdSchema.parse(req.params);
            const paginacion = this.extraerPaginacion(req.query);
            logger.info("[NOTIFICACIONES CONTROLLER]: Obteniendo notificaciones leidas del usuario:", idUsuario);
            const notificaciones = await this.notificacionService.getLeidosNoLeidosPaginado(idUsuario, true, paginacion.numeroPagina, paginacion.limitePorPagina);
            logger.info("[NOTIFICACIONES CONTROLLER]: Notificaciones leidas obtenidas:", notificaciones);
            res.status(200).json({
                status: "success",
                ...notificaciones
            });
        } catch (error) {
            next(error);
        }
    };

    getNoLeidas = async (req, res, next) => {
        try {
            const { idUsuario } = usuarioIdSchema.parse(req.params);
            logger.info("[NOTIFICACIONES CONTROLLER]: Obteniendo notificaciones no leidas del usuario: ", idUsuario);
            const notificaciones = await this.notificacionService.getLeidosNoLeidos(idUsuario, false);
            logger.info("[NOTIFICACIONES CONTROLLER]: Notificaciones no leidas obtenidas: ", notificaciones);
            res.status(200).json({
                status: "success",
                data: notificaciones
            });
        } catch (error) {
            next(error);
        }
    };

    getNoLeidasPaginadas = async (req, res, next) => {
        try {
            const { idUsuario } = usuarioIdSchema.parse(req.params);
            const paginacion = this.extraerPaginacion(req.query);
            logger.info("[NOTIFICACIONES CONTROLLER]: Obteniendo notificaciones no leidas del usuario:", idUsuario);
            const notificaciones = await this.notificacionService.getLeidosNoLeidosPaginado(idUsuario, false, paginacion.numeroPagina, paginacion.limitePorPagina);
            logger.info("[NOTIFICACIONES CONTROLLER]: Notificaciones no leidas obtenidas:", notificaciones);
            res.status(200).json({
                status: "success",
                ...notificaciones
            });

        } catch (error) {
            next(error);
        }
    };

    actualizarEstadoLeido = async (req, res, next) => {
        try {
            const { idNotificacion } = notificacionIdParamsSchema.parse(req.params);
            const { leida } = req.body;
            if (typeof leida !== "boolean") {
                throw new BadRequestError("El campo 'leida' es obligatorio y debe ser un booleano.");
            }
            logger.info(`[NOTIFICACIONES CONTROLLER]: Actualizando estado leido a ${leida} para notificacion: ${idNotificacion}`);
            const notificacion = await this.notificacionService.actualizarEstadoLeido(idNotificacion, leida);
            res.status(200).json({
                status: "success",
                data: notificacion,
                message: leida
                    ? "Notificación marcada como leída exitosamente."
                    : "Notificación marcada como no leída exitosamente."
            });
        } catch (error) {
            next(error);
        }
    };

    /*getNotificacionesPaginadas = async (req, res, next) => {
        try {
            const paginacion = this.extraerPaginacion(req.query);
            const filtros = this.extraerFiltros(req.query);

            logger.info("[NOTIFICACIONES CONTROLLER]: Obteniendo notificaciones paginadas");
            const resultado = await this.notificacionesService.obtenerPaginadas(numeroPagina, limitePorPagina, filtros);
            logger.info("[NOTIFICACIONES CONTROLLER]: Notificaciones obtenidas");

            res.status(200).json({
                status: "success",
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    };
    
    extraerFiltros(query) {
        const filtros = {}

        if (query.destinatarioId !== undefined) {
            filtros.destinatarioId = query.destinatarioId;
        }
        if (query.remitenteId !== undefined) {
            filtros.remitenteId = query.remitenteId;
        }
        if (query.leida !== undefined) {
            filtros.leida = query.leida === true;
        }

        return filtros
    }*/

    extraerPaginacion(query) {
        logger.info("[NOTIFICACIONES CONTROLLER]: Extrayendo paginacion");
        const numeroPagina = query?.page === undefined ? 1 : Number(query.page);
        const limitePorPagina = query?.limit === undefined ? 10 : Number(query.limit);
        if (numeroPagina <= 0 || limitePorPagina <= 0) throw new BadRequestError("Paginacion invalida");
        logger.info("[NOTIFICACIONES CONTROLLER]: Paginacion extraida");
        return { numeroPagina, limitePorPagina };
    }

    async seed(usuarios) {
        const notificaciones = [
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha generado un turno."
            },
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha reservado un turno."
            },
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha cancelado un turno."
            },
            {
                destinatario: usuarios[1].id,
                remitente: usuarios[0].id,
                mensaje: "Se ha realizado un turno."
            }
        ];

        //await this.notificacionService.setUsuarioSistema(usuarios[0].id); //configuro el usuario sistema para el factory de notificaciones

        return await notificaciones.map(n => this.notificacionService.crearNotificacion(n));
    }
}