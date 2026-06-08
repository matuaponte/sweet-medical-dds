import { NotificacionModel } from "../schemas/dataBase/notificacionSchema.js";
import { logger } from "../config/logger.js";

export class NotificacionRepository {
    constructor() { this.model = NotificacionModel; }

    async getByDestinatarioIdAndLeido(idDestinatario, leida) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificaciones " + ((leida) ? "leidas" : "no leidas") + " del destinatario " + idDestinatario);
        const notificaciones = await this.model.find({ destinatario: idDestinatario, leida: leida }).populate(["destinatario", "remitente"]);
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificaciones obtenidas: ", notificaciones.length);
        return notificaciones;
    }

    async getByDestinatarioIdAndLeidoPaginado(idDestinatario, leida, page, limit) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificaciones " + (leida ? "leidas" : "no leidas") + " del destinatario " + idDestinatario);
        const skip = (page - 1) * limit;

        const [notificaciones, total] = await Promise.all([
            this.model.find({ destinatario: idDestinatario, leida: leida })
                .populate(["destinatario", "remitente"])
                .skip(skip)
                .limit(limit),
            this.model.countDocuments({ destinatario: idDestinatario, leida: leida })
        ]);

        logger.info("[NOTIFICACIONES REPOSITORY]: Notificaciones obtenidas:", notificaciones);

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: notificaciones
        };
    }

    /*async save(notificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Guardando notificacion: ", notificacion);
        const nuevaNotificacion = new this.model(NotificacionMapper.toPersistence(notificacion));
        const notificacionGuardada = await nuevaNotificacion.save();

        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion guardada: ", notificacionGuardada);
        await notificacionGuardada.populate(["destinatarioId", "remitenteId"]);

        return NotificacionMapper.toDomain(notificacionGuardada, notificacionGuardada.destinatarioId, notificacionGuardada.remitenteId);
    }*/

    async save(notificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Guardando notificacion:", notificacion);
        let notificacionGuardada;
        if (notificacion._id) {
            notificacionGuardada = await this.model.findByIdAndUpdate(notificacion.id, notificacion, { new: true, runValidators: true });
        } else {
            notificacionGuardada = await this.model.create(notificacion);
        }
        await notificacionGuardada.populate(["destinatario", "remitente"]);
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion guardada:", notificacionGuardada);

        return notificacionGuardada;
    }

    async getById(idNotificacion) {
        logger.info("[NOTIFICACIONES REPOSITORY]: Obteniendo notificacion por id: ", idNotificacion);
        const notificacion = await this.model.findById(idNotificacion).populate(["destinatario", "remitente"]);
        logger.info("[NOTIFICACIONES REPOSITORY]: Notificacion obtenida: ", notificacion);

        return notificacion;
    }

    //para el futuro
    /*async obtenerPaginadas(numeroPagina, limitePorPagina, filtros = {}) {
        const query = {};
        const inicio = (numeroPagina - 1) * limitePorPagina;

        if (filtros.destinatarioId !== undefined) { //filtro destinatario
            query.destinatario = filtros.destinatarioId;
        }
        if (filtros.remitenteId !== undefined) { //filtro remitente
            query.remitente = filtros.remitenteId;
        }
        if (filtros.leida !== undefined) { //filtro leido
            query.leida = filtros.leida;
        }

        // Ejecutar la consulta y el conteo en paralelo
        const [notificaciones, totalNotificaciones] = await Promise.all([
            this.model.find(query)
                .populate("destinatario remitente")
                .skip(inicio)
                .limit(limitePorPagina)
                .lean()
                .exec(),
            this.model.countDocuments(query).exec()
        ]);

        return {
            notificaciones,
            totalNotificaciones
        };
    }*/
}