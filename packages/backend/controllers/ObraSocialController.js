import { ObraSocialService } from "../services/ObraSocialService.js";
import { actualizarObraSocialSchema, actualizarPlanObraSocialSchema, crearObraSocialSchema, crearPlanObraSocialSchema, obraSocialIdParamSchema, planIdParamSchema } from "../schemas/zod/obraSocialSchema.js";

export class ObraSocialController {
    #obraSocialService;
    constructor(obraSocialService = new ObraSocialService()) {
        this.#obraSocialService = obraSocialService;
    }

    async crear(req, res, next) {
        try {
            const crearObraSocialDto = crearObraSocialSchema.parse(req.body);
            const nuevaObraSocial = await this.#obraSocialService.crear(crearObraSocialDto);
            res.status(201).json({ status: "success", data: nuevaObraSocial });
        } catch (error) {
            return next(error);
        }
    }
    async buscarTodos(req, res, next) {
        try {
            // TODO evaluar paginación
            const obrasSociales = await this.#obraSocialService.buscarTodos();
            res.status(200).json({ status: "success", data: obrasSociales });
        } catch (error) {
            return next(error);
        }
    }

    async buscar(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const obraSocial = await this.#obraSocialService.buscar(obraSocialId);
            res.status(200).json({ status: "success", data: obraSocial });
        } catch (error) {
            return next(error);
        }
    }
    async eliminar(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const obraSocialEliminada = await this.#obraSocialService.eliminar(obraSocialId);
            res.status(202).json({ status: "success", data: obraSocialEliminada });
        } catch (error) {
           return next(error);
        }
    }
    async actualizar(req, res, next) {
        const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
        const actualizarObraSocialDto = actualizarObraSocialSchema.parse(req.body);
        try {
            const obraSocialActualizada = await this.#obraSocialService.actualizar(obraSocialId, actualizarObraSocialDto);
            res.status(200).json({ status: "success", data: obraSocialActualizada });
        } catch (error) {
            return next(error);
        }
    }

    async crearPlan(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const crearPlanDto = crearPlanObraSocialSchema.parse(req.body);
            const planObraSocialCreado = await this.#obraSocialService.crearPlan(obraSocialId, crearPlanDto);
            res.status(201).json({ status: "success", data: planObraSocialCreado });
        } catch (error) {
            return next(error);
        }
    }
    async buscarTodosLosPlanes(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const planesObraSocial = await this.#obraSocialService.buscarTodosLosPlanesDeObraSocial(obraSocialId);
            res.status(200).json({ status: "success", data: planesObraSocial });
        } catch (error) {
            return next(error);
        }
    }

    async eliminarPlan(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const { planId } = planIdParamSchema.parse(req.params);
            const planObraSocialEliminado = await this.#obraSocialService.eliminarPlanDeObraSocial(obraSocialId, planId);
            res.status(202).json({ status: "success", data: planObraSocialEliminado });
        } catch (error) {
            return next(error);
        }
    }
    async actualizarPlan(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const { planId } = planIdParamSchema.parse(req.params);
            const actualizarPlanDto = actualizarPlanObraSocialSchema.parse(req.body);
            const planObraSocialActualizado = await this.#obraSocialService.actualizarPlanDeObraSocial(obraSocialId, planId, actualizarPlanDto);
            res.status(200).json({ status: "success", data: planObraSocialActualizado });
        } catch (error) {
            return next(error);
        }
    }
    async buscarPlan(req, res, next) {
        try {
            const { obraSocialId } = obraSocialIdParamSchema.parse(req.params);
            const { planId } = planIdParamSchema.parse(req.params);
            const planObraSocialEncontrado = await this.#obraSocialService.buscarPlanDeObraSocial(obraSocialId, planId);
            res.status(200).json({ status: "success", data: planObraSocialEncontrado });
        } catch (error) {
            return next(error);
        }
    }
}