import { ServicioService } from "../services/ServicioService.js";
import { servicioSchema, servicioIdParamsSchema } from "../schemas/zod/servicioSchema.js";
import { logger } from "../config/logger.js";

export class ServicioController {
    constructor({
        servicioService = new ServicioService()
    } = {}) {
        this.servicioService = servicioService;
    }

    findById = async (req, res, next) => {
        try {
            const { idServicio } = servicioIdParamsSchema.parse(req.params);
            logger.info("[SERVICIOS CONTROLLER]: Obteniendo servicio: " + idServicio);
            const servicio = await this.servicioService.getById(idServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio obtenido: " + servicio);
            res.status(200).json({
                status: "success",
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const datosServicio = servicioSchema.parse(req.body);
            logger.info("[SERVICIOS CONTROLLER]: Creando servicio: ", datosServicio);
            const servicio = await this.servicioService.create(datosServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio creado:", servicio);
            res.status(201).json({
                status: "success",
                data: servicio
            });
        } catch (error) {
            logger.error("No se pudo crear el servicio.");
            next(error);
        }
    };

    findAll = async (req, res, next) => {
        try {
            logger.info("[SERVICIOS CONTROLLER]: Obteniendo todos los servicios");
            const servicios = await this.servicioService.findAll();
            logger.info("[SERVICIOS CONTROLLER]: Servicios obtenidos:", servicios.length);
            res.status(200).json(servicios);
        } catch (error) {
            logger.error("No se pudo crear el servicio.");
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { idServicio } = servicioIdParamsSchema.parse(req.params);
            const datosServicio = servicioSchema.parse(req.body);
            logger.info("[SERVICIOS CONTROLLER]: Actualizando servicio: ", datosServicio);
            const servicio = await this.servicioService.update(idServicio, datosServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio actualizado: ", servicio);
            res.status(200).json({
                status: "success",
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => { //idSchema
        try {
            const { idServicio } = servicioIdParamsSchema.parse(req.params);
            logger.info("[SERVICIOS CONTROLLER]: Eliminando servicio: ", idServicio);
            await this.servicioService.delete(idServicio);
            logger.info("[SERVICIOS CONTROLLER]: Servicio eliminado");
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    async seed() {
        const cardiologia = {
            nombre: "Cardiologia",
            duracionEnMin: 25,
            costo: 200,
            codigo: null,
            especialidadPadreId: null
        };
        const practicas = [
            {
                nombre: "Biopsia endomiocárdica",
                duracionEnMin: 60,
                costo: 700,
                codigo: "#be347" //ni idea que es el codigo la verdad
            },
            {
                nombre: "Valvuloplastia percutánea",
                duracionEnMin: 75,
                costo: 650,
                codigo: "#vp150"
            }
        ];

        const especialidad = await this.servicioService.create(cardiologia);
        practicas.map(p => p.especialidadPadreId = especialidad.id);

        const practicasGuardadas = await Promise.all(
            practicas.map(p => this.servicioService.create(p))
        );

        return [especialidad, ...practicasGuardadas];
    }
}