import { actualizarPacienteSchema, crearPacienteSchema } from "../schemas/zod/pacienteSchema.js";
import { idParamObjectIdSchema } from "../schemas/zod/urlSchema.js";
import { PacienteService } from "../services/PacienteService.js";

export class PacienteController {
    #pacienteService;
    constructor(pacienteService = new PacienteService()) {
        this.#pacienteService = pacienteService;
    }

    async crear(req, res, next) {
        try {
            const pacienteData = crearPacienteSchema.parse(req.body);
            const nuevoPaciente = await this.#pacienteService.crear(pacienteData);
            res.status(201).json({ status: "success", data: nuevoPaciente });
        } catch (error) {
            return next(error);
        }
    }

    async buscarTodos(req, res, next) {
        try {
            const pacientes = await this.#pacienteService.findAll();
            res.status(200).json({ status: "success", data: pacientes });
        } catch (error) {
            return next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const { id } = idParamObjectIdSchema.parse(req.params);
            const paciente = await this.#pacienteService.findById(id);
            res.status(200).json({ status: "success", data: paciente });
        } catch (error) {
            return next(error);
        }
    }

    async modificar(req, res, next) {
        try {
            const { id } = idParamObjectIdSchema.parse(req.params);
            const pacienteData = actualizarPacienteSchema.parse(req.body);
            const pacienteActualizado = await this.#pacienteService.update(id, pacienteData);
            res.status(200).json({ status: "success", data: pacienteActualizado });
        } catch (error) {
            return next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = idParamObjectIdSchema.parse(req.params);
            const pacienteEliminado = await this.#pacienteService.delete(id);
            res.status(200).json({ status: "success", data: pacienteEliminado });
        } catch (error) {
            return next(error);
        }
    }
}