import { ObraSocialRepository } from "../repositories/ObraSocialRepository.js";
import { BadRequestError } from "../errors/AppError.js";
import { ObraSocial } from "../domain/obraSocial.js";
import { ServicioService } from "./ServicioService.js";


export class ObraSocialService {
    #obraSocialRepository;
    #servicioService;

    constructor(obraSocialRepository = new ObraSocialRepository(), servicioService = new ServicioService()) {
        this.#obraSocialRepository = obraSocialRepository;
        this.#servicioService = servicioService;
    }

    toDto(obraSocial) {
        return {
            id: obraSocial.id || obraSocial._id,
            nombre: obraSocial.nombre,
            planes: obraSocial.planes ? obraSocial.planes.map((plan) => this.toDtoPlan(plan)) : []
        };
    };

    toDtoPlan(plan) {
        return {
            id: plan.id || plan._id,
            nombre: plan.nombre,
            coberturaEspecialidad: plan.coberturaEspecialidad.map((cobertura) => ({
                id: cobertura.id || cobertura._id,
                especialidad: cobertura.especialidad,
                nivel: cobertura.nivel,
                porcentajeCobertura: cobertura.porcentajeCobertura
            })),
            coberturaPractica: plan.coberturaPractica.map((cobertura) => ({
                id: cobertura.id || cobertura._id,
                practica: cobertura.practica,
                nivel: cobertura.nivel,
                porcentajeCobertura: cobertura.porcentajeCobertura
            }))
        };
    };


    async buscarTodos() {
        const obrasSociales = await this.#obraSocialRepository.findAll();
        if (obrasSociales.length === 0) {
            throw new BadRequestError("No se encontraron obras sociales");
        }
        return obrasSociales.map(obraSocial => this.toDto(obraSocial));
    }

    async crear(data) {
        const obraSocial = new ObraSocial(data);

        const obraSocialExiste = await this.#obraSocialRepository.findByNombre(obraSocial.nombre);

        if (obraSocialExiste) {
            throw new BadRequestError("Ya existe una obra social con el nombre " + obraSocial.nombre);
        }

        const nuevaObraSocial = await this.#obraSocialRepository.crear(obraSocial);
        return nuevaObraSocial;
    }

    async buscar(obraSocialId) {
        const obraSocial = await this.#obraSocialRepository.findById(obraSocialId);
        if (!obraSocial) {
            throw new BadRequestError("No se encontro la obra social con el id " + obraSocialId);
        }
        return this.toDto(obraSocial);
    }

    async actualizar(obraSocialId, obraSocialDto = {}) {
        const obraSocialActualizada = await this.#obraSocialRepository.update(obraSocialId, obraSocialDto);
        if (!obraSocialActualizada) {
            throw new BadRequestError("No se encontro la obra social con el id " + obraSocialId);
        }
        return this.toDto(obraSocialActualizada);
    }

    async eliminar(obraSocialId) {
        const obraSocialEliminada = await this.#obraSocialRepository.delete(obraSocialId);
        if (!obraSocialEliminada) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`);
        }
        return this.toDto(obraSocialEliminada);
    }

    async crearPlan(obraSocialId, planDto = {}) {
        const obraSocial = await this.#obraSocialRepository.findById(obraSocialId);

        if (!obraSocial) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`);
        }
        const planExiste = obraSocial.planes.some(plan => plan.nombre === planDto.nombre);
        if (planExiste) {
            throw new BadRequestError(`Ya existe un plan con el nombre ${planDto.nombre} en la obra social ${obraSocial.nombre}`);
        }

        const especialidades = planDto.coberturaEspecialidad.map((cobEspecialidad) => cobEspecialidad.especialidad);
        const practicas = planDto.coberturaPractica.map((cobPractica) => cobPractica.practica);
        const servicios = [...especialidades, ...practicas];

        const serviciosFaltantes = await this.#servicioService.obtenerServiciosFaltantes(servicios);

        if (serviciosFaltantes.length > 0) {
            throw new BadRequestError(`Los siguientes servicios no existen: ${serviciosFaltantes.join(", ")}`);
        }

        const obraSocialConPlanCreado = await this.#obraSocialRepository.addPlan(obraSocial, planDto);
        return this.toDto(obraSocialConPlanCreado);
    }

    async actualizarPlanDeObraSocial(obraSocialId, planId, planDto = {}) {
        const obraSocialConPlanActualizado = await this.#obraSocialRepository.updatePlan(obraSocialId, planId, planDto);
        if (!obraSocialConPlanActualizado) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`);
        }
        return this.toDto(obraSocialConPlanActualizado);
    }

    async eliminarPlanDeObraSocial(obraSocialId, planId) {
        const obraSocialConPlanEliminado = await this.#obraSocialRepository.deletePlan(obraSocialId, planId);
        if (!obraSocialConPlanEliminado) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`);
        }
        return this.toDto(obraSocialConPlanEliminado);
    }

    async buscarPlanDeObraSocial(obraSocialId, planId) {
        const plan = await this.#obraSocialRepository.findPlanByIdPopulado(obraSocialId, planId);
        if (!plan) {
            throw new BadRequestError(`No se encontró un plan con ID ${planId} en la obra social ${obraSocialId}`);
        }
        return this.toDtoPlan(plan);
    }

    async buscarTodosLosPlanesDeObraSocial(obraSocialId) {
        const planes = await this.#obraSocialRepository.findAllPlans(obraSocialId);
        if (!planes) {
            throw new BadRequestError(`No se encontró una obra social con el ID: ${obraSocialId}`);
        }

        const planesDto = planes.map(plan => this.toDtoPlan(plan));
        return planesDto;
    }
}