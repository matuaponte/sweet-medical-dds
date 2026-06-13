import { SedeService } from "../services/SedeService.js";
import { bodyCrearSedeSchema, bodyUpdateSedeSchema } from "../schemas/zod/sedeSchema.js";

export class SedeController {
    constructor({ sedeService = new SedeService() } = {}) {
        this.sedeService = sedeService;
    }

    findAll = async (req, res, next) => {
        try {
            const sedes = await this.sedeService.findAll();
            res.status(200).json(sedes);
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const validatedBody = bodyCrearSedeSchema.parse(req.body);
            const sede = await this.sedeService.create(validatedBody);
            res.status(201).json({
                status: "success",
                data: sede
            });
        } catch (error) {
            next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const sede = await this.sedeService.findById(req.params.id);
            res.status(200).json({
                status: "success",
                data: sede
            });
        } catch (error) {
            next(error);
        }
    };

    findByName = async (req, res, next) => {
        try {
            const sede = await this.sedeService.findByName(req.params.nombre);
            res.status(200).json({
                status: "success",
                data: sede
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const validatedBody = bodyUpdateSedeSchema.parse(req.body);
            const sede = await this.sedeService.update(req.params.id, validatedBody);
            res.status(200).json({
                status: "success",
                data: sede
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const sede = await this.sedeService.delete(req.params.id);
            res.status(200).json({
                status: "success",
                data: sede
            });
        } catch (error) {
            next(error);
        }
    };

}
