import { Especialidad } from "../domain/servicios/especialidad.js";
import { Practica } from "../domain/servicios/practica.js";
import { ServicioRepository } from "../repositories/ServicioRepository.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";
import { logger } from "../config/logger.js";

export class ServicioService {
    constructor({
        serviciosRepository = new ServicioRepository()
    } = {}) {
        this.serviciosRepository = serviciosRepository;
    }

    async getById(idServicio) {
        logger.info("[SERVICIO SERVICE]: Obteniendo servicio: ", idServicio);
        const servicio = await this.serviciosRepository.findById(idServicio);
        if (!servicio) throw new NotFoundError("No se encontro el servicio con el id " + idServicio);
        logger.info("[SERVICIO SERVICE]: Servicio encontrado: ", servicio);
        return this.toDto(servicio);
    }

    async findAll() {
        logger.info("[SERVICIO SERVICE]: Obteniendo todos los servicios",);
        const servicios = await this.serviciosRepository.findAll();
        logger.info("[SERVICIO SERVICE]:Todos los servicios obtenidos: " + servicios);
        return servicios.map(servicio => this.toDto(servicio));
    }

    async getEntityById(idServicio) {
        logger.info("[SERVICIO SERVICE]: Obteniendo servicio: ", idServicio);
        const servicio = await this.serviciosRepository.findById(idServicio);
        if (!servicio) throw new NotFoundError("No se encontro el servicio con el id " + idServicio);
        logger.info("[SERVICIO SERVICE]: Servicio encontrado: ", servicio);
        return servicio;
    }

    async create(datosServicio) {
        logger.info("[SERVICIO SERVICE]: Creando servicio: " + datosServicio);

        if (await this.serviciosRepository.findByNombre(datosServicio.nombre)) throw new ConflictError("Ya existe un servicio con ese nombre");

        const servicio = await this.#crearEntidad(datosServicio);
        const servicioGuardado = await this.serviciosRepository.save(servicio);
        logger.info("[SERVICIO SERVICE]: Servicio creado:", servicioGuardado);
        return this.toDto(servicioGuardado);
    }

    async update(idServicio, datosServicio) {
        logger.info("[SERVICIO SERVICE]: Actualizando servicio.");
        const servicio = await this.serviciosRepository.findById(idServicio);
        if (!servicio) throw new NotFoundError("No se encontro el servicio con el id " + idServicio);

        const servicioActualizado = await this.#crearEntidad(datosServicio);
        servicioActualizado.id = servicio.id;
        logger.info("[SERVICIO SERVICE]: Servicio actualizado: ", servicioActualizado);
        const servicioGuardado = await this.serviciosRepository.save(servicioActualizado);
        logger.info("[SERVICIO SERVICE]: Servicio guardado luego de actualizarse: ", servicioGuardado);
        return this.toDto(servicioActualizado);
    }

    async delete(id) {
        logger.info("[SERVICIO SERVICE]:Eliminando servicio con el id: ", id);
        this.serviciosRepository.deleteById(id);
        logger.info("[SERVICIO SERVICE]:Servicio eliminado.");
    }

    async #crearEntidad(datosServicio) {
        if (!datosServicio.codigo && !datosServicio.especialidadPadreId) {
            logger.info("[SERVICIO SERVICE]: Creando especialidad.");
            const especialidadData = {
                nombre: datosServicio.nombre,
                duracionTurnoEnMins: datosServicio.duracionEnMins,
                costo: datosServicio.costo
            };
            const especialidad = new Especialidad(especialidadData);
            logger.info("[SERVICIO SERVICE]: Especialidad creada: ", especialidad);
            return especialidad;
        } else {
            logger.info("[SERVICIO SERVICE]: Creando practica; obteniendo especialidad padre.");
            const especialidadPadre = await this.serviciosRepository.findById(datosServicio.especialidadPadreId);

            logger.info("[SERVICIO SERVICE]: Creando practica.");
            const practicaData = {
                codigo: datosServicio.codigo,
                nombre: datosServicio.nombre,
                duracionTurnoEnMins: datosServicio.duracionEnMins,
                costo: datosServicio.costo,
                especialidadPadre: especialidadPadre
            };
            const practica = new Practica(practicaData);
            logger.info("[SERVICIO SERVICE]: Practica creada: ", practica);
            return practica;
        }
    }

    async obtenerServiciosFaltantes(servicios) {
        const idsUnicos = [...new Set(servicios.map(id => id.toString()))];
        logger.info("[SERVICIO SERVICE]: Obteniendo servicios faltantes: ", idsUnicos);

        const serviciosEncontrados = await this.serviciosRepository.findByIds(idsUnicos);

        const idsEncontradosSet = new Set(serviciosEncontrados.map(s => s._id.toString()));

        // filtro usando has al haber usado set y es mucho mas rapido, es por clave 
        const faltantes = idsUnicos.filter(id => !idsEncontradosSet.has(id));
        logger.info("[SERVICIO SERVICE]: Servicios faltantes encontrados: ", faltantes);

        return faltantes;
    }

    toDto(servicio) {
        if (servicio.tipo === "Practica") {
            return {
                id: servicio.id,
                nombre: servicio.nombre,
                tipo: servicio.tipo,
                duracionTurnoEnMins: servicio.duracionTurnoEnMins,
                costo: servicio.costo,
                codigo: servicio.codigo,
                especialidadPadreId: servicio.especialidadPadre ? servicio.especialidadPadre._id : null
            };
        } else {
            return {
                id: servicio.id,
                nombre: servicio.nombre,
                tipo: servicio.tipo,
                duracionTurnoEnMins: servicio.duracionTurnoEnMins,
                costo: servicio.costo
            };
        }
    }
}