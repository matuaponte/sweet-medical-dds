import { ServicioModel, EspecialidadModel, PracticaModel } from "../schemas/dataBase/servicioSchema.js";
import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { logger } from "../config/logger.js";

export class ServicioRepository {
    constructor() {
        this.model = ServicioModel;
    }

    #resolverModelo(servicio) {
        if (servicio instanceof Especialidad) return EspecialidadModel;
        if (servicio instanceof Practica) return PracticaModel;
        throw new Error(`Tipo de servicio desconocido: ${servicio?.constructor?.name}`);
    }

    async save(servicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Guardando servicio: ", servicio);
        const modelo = this.#resolverModelo(servicio);
        let servicioGuardado;
        if (servicio.id) {
            servicioGuardado = await modelo.findByIdAndUpdate(servicio.id, servicio, { new: true, runValidators: true });
        } else {
            const nuevoServicio = new modelo(servicio);
            servicioGuardado = await nuevoServicio.save();
        }
        if (servicioGuardado.tipo === "Practica") await servicioGuardado.populate("especialidadPadre");
        logger.info("[SERVICIO REPOSTIRORY]: Servicio guardado: ", servicioGuardado);

        return servicioGuardado;
    }

    async findAll() {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo todos los servicios");
        const servicios = await this.model.find();
        return servicios;
    }

    async findById(idServicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo servicio de id: " + idServicio);
        const servicio = await this.model.findById(idServicio);
        const mensaje = (servicio) ? ("Servicio obtenido: " + servicio) : ("No se encontro el servicio con id: " + idServicio);
        logger.info("[SERVICIO REPOSTIRORY]: " + mensaje);
        if (servicio && servicio.tipo === "Practica") await servicio.populate("especialidadPadre");

        return servicio;
    }

    async findByNombre(nombreServicio) {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo servicio de nombre: " + nombreServicio);
        const servicio = await this.model.findOne({ nombre: nombreServicio });
        const mensaje = (servicio) ? ("Servicio obtenido: " + servicio) : ("No se encontro el servicio con nombre: " + nombreServicio);
        logger.info("[SERVICIO REPOSTIRORY]: " + mensaje);
        if (servicio && servicio.tipo === "Practica") await servicio.populate("especialidadPadre");

        return servicio;
    }

    async deleteById(idServicio) { //TODO: faltaria ver que hacer cuando borramos una especialidad con practicas hijas (si se borran tambien o que hacemos)
        logger.info("[SERVICIO REPOSTIRORY]: Eliminando servicio: ", idServicio);
        await this.model.findByIdAndDelete(idServicio);
        logger.info("[SERVICIO REPOSTIRORY]: Servicio eliminado");
    }

    // Busca todos los que coincidan con el array de ids, y devuelve un array con los que no se encontraron
    async findByIds(ids) {
        logger.info("[SERVICIO REPOSTIRORY]: Obteniendo servicios de ids: " + ids.join(", "));
        return await this.model.find({ _id: { $in: ids } }); 
}
}