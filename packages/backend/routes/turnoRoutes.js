import express from "express";
import { TurnoController } from "../controllers/TurnoController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         fechaHora: { type: string, format: date-time }
 *         fechaHoraPropuesta: { type: string, format: date-time, nullable: true }
 *         estado: { $ref: '#/components/schemas/EstadoTurno' }
 *         historialEstado:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HistorialEstadoTurno'
 *         medico: { $ref: '#/components/schemas/ObjectId' }
 *         paciente: { $ref: '#/components/schemas/ObjectId', nullable: true }
 *         servicio: { $ref: '#/components/schemas/ObjectId' }
 *         sede: { $ref: '#/components/schemas/ObjectId' }
 *         costo: { type: number, minimum: 0 }
 *         eliminado: { type: boolean }
 *       required: [fechaHora, estado, medico, servicio, sede]
 *     HistorialEstadoTurno:
 *       type: object
 *       properties:
 *         fechaHoraIngreso: { type: string, format: date-time }
 *         estado: { $ref: '#/components/schemas/EstadoTurno' }
 *         usuario: { type: string }
 *         motivo: { type: string, nullable: true }
 *       required: [fechaHoraIngreso, estado, usuario]
 */

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos médicos
 */
export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);

    router.route("/")
        /**
         * @swagger
         * /turno:
         *   get:
         *     summary: Listar turnos paginados
         *     tags: [Turnos]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema: { type: integer, minimum: 1, example: 1 }
         *         description: Número de página
         *       - in: query
         *         name: limit
         *         schema: { type: integer, minimum: 1, example: 10 }
         *         description: Límite de resultados por página
         *       - in: query
         *         name: pacienteId
         *         schema: { $ref: '#/components/schemas/ObjectId' }
         *       - in: query
         *         name: estado
         *         schema: { $ref: '#/components/schemas/EstadoTurno' }
         *       - in: query
         *         name: medicoId
         *         schema: { $ref: '#/components/schemas/ObjectId' }
         *       - in: query
         *         name: servicioId
         *         schema: { $ref: '#/components/schemas/ObjectId' }
         *       - in: query
         *         name: sedeId
         *         schema: { $ref: '#/components/schemas/ObjectId' }
         *       - in: query
         *         name: fechaHoraInicio
         *         schema: { type: string, format: date-time }
         *       - in: query
         *         name: fechaHoraFin
         *         schema: { type: string, format: date-time }
         *       - in: query
         *         name: ordenPorCosto
         *         schema: { type: string, enum: [asc, desc] }
         *       - in: query
         *         name: ordenPorFecha
         *         schema: { type: string, enum: [asc, desc] }
         *     responses:
         *       200:
         *         description: Lista paginada de turnos
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Turno'
         *                 paginacion:
         *                   $ref: '#/components/schemas/Paginacion'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .get((req, res, next) => turnoController.findAllPaginated(req, res, next))
        /**
         * @swagger
         * /turno:
         *   post:
         *     summary: Crear un nuevo turno
         *     tags: [Turnos]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CrearTurnoBody'
         *     responses:
         *       201:
         *         description: Turno creado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .post((req, res, next) => turnoController.create(req, res, next));

    router.route("/:id/asignar")
        /**
         * @swagger
         * /turno/{id}/asignar:
         *   put:
         *     summary: Asignar turno a un paciente
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AsignarTurnoBody'
         *     responses:
         *       200:
         *         description: Turno asignado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .put((req, res, next) => turnoController.asignarTurno(req, res, next));

    router.route("/:id/cambiar-estado")
        /**
         * @swagger
         * /turno/{id}/cambiar-estado:
         *   patch:
         *     summary: Cambiar el estado de un turno
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CambiarEstadoTurnoBody'
         *     responses:
         *       200:
         *         description: Estado cambiado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .patch((req, res, next) => turnoController.cambiarEstadoTurno(req, res, next));

    router.route("/:id/solicitar-cambio-fecha")
        /**
         * @swagger
         * /turno/{id}/solicitar-cambio-fecha:
         *   patch:
         *     summary: Solicitar cambio de fecha para un turno
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SolicitarCambioFechaBody'
         *     responses:
         *       200:
         *         description: Solicitud enviada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .patch((req, res, next) => turnoController.solicitarCambioFecha(req, res, next));

    router.route("/:id/responder-cambio-fecha")
        /**
         * @swagger
         * /turno/{id}/responder-cambio-fecha:
         *   patch:
         *     summary: Responder solicitud de cambio de fecha
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ResponderCambioFechaBody'
         *     responses:
         *       200:
         *         description: Respuesta procesada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .patch((req, res, next) => turnoController.responderCambioFecha(req, res, next));

    router.route("/:estadoId")
        /**
         * @swagger
         * /turno/{estado}:
         *   get:
         *     summary: Buscar turnos por estado
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: estado
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/EstadoTurno'
         *     responses:
         *       200:
         *         description: Turnos encontrados
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Turno'
         */
        .get((req, res, next) => turnoController.findByEstado(req, res, next));

    router.route("/:id")
        /**
         * @swagger
         * /turno/{id}:
         *   get:
         *     summary: Obtener turno por ID
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     responses:
         *       200:
         *         description: Turno encontrado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       404:
         *         $ref: '#/components/responses/E404'
         */
        .get((req, res, next) => turnoController.findById(req, res, next))
        /**
         * @swagger
         * /turno/{id}:
         *   patch:
         *     summary: Actualizar turno
         *     tags: [Turnos]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ActualizarTurnoBody'
         *     responses:
         *       200:
         *         description: Turno actualizado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Turno'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .patch((req, res, next) => turnoController.update(req, res, next));
    
    router.route("/mis-turnos")
        /**
         * @swagger
         * /turno/mis-turnos:
         *   get:
         *     summary: Listar mis turnos
         *     tags: [Turnos]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema: { type: integer, minimum: 1 }
         *       - in: query
         *         name: limit
         *         schema: { type: integer, minimum: 1 }
         *     responses:
         *       200:
         *         description: Turnos del usuario
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Turno'
         *                 paginacion:
         *                   $ref: '#/components/schemas/Paginacion'
         */
        .get((req, res, next) => turnoController.findAllPaginatedByUsuario(req, res, next));

    return router;
}
