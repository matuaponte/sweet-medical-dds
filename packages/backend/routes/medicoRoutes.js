import express from "express";
import { MedicoController } from "../controllers/MedicoController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Medico:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         nombre: { type: string }
 *         usuarioId: { $ref: '#/components/schemas/ObjectId' }
 *         matricula: { type: string, maxLength: 10 }
 *         honorario: { type: number, minimum: 0, nullable: true }
 *         disponibilidades:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DisponibilidadHoraria'
 *         especialidades: { type: array, items: { $ref: '#/components/schemas/ObjectId' } }
 *         practicas: { type: array, items: { $ref: '#/components/schemas/ObjectId' } }
 *         sedes: { type: array, items: { $ref: '#/components/schemas/ObjectId' } }
 *       required: [nombre, usuarioId, matricula]
 *     DisponibilidadHoraria:
 *       type: object
 *       properties:
 *         diaSemana: { $ref: '#/components/schemas/DiaSemana' }
 *         horaDesde: { $ref: '#/components/schemas/TiempoHHMM' }
 *         horaHasta: { $ref: '#/components/schemas/TiempoHHMM' }
 *         sede: { $ref: '#/components/schemas/ObjectId' }
 *         servicio: { $ref: '#/components/schemas/ObjectId' }
 *       required: [diaSemana, horaDesde, horaHasta, sede, servicio]
 */

/**
 * @swagger
 * tags:
 *   name: Medicos
 *   description: Gestión de médicos, disponibilidades, sedes y servicios
 */

export default function medicoRoutes(getController) {
  const router = express.Router();
  const medicoController = getController(MedicoController);

  router.route("/")
    /**
     * @swagger
     * /medicos:
     *   get:
     *     summary: Listar todos los médicos
     *     tags: [Medicos]
     *     responses:
     *       200:
     *         description: Lista de médicos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Medico'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .get((req, res, next) => medicoController.findAll(req, res, next))
    /**
     * @swagger
     * /medicos:
     *   post:
     *     summary: Crear un nuevo médico
     *     tags: [Medicos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CrearMedicoBody'
     *     responses:
     *       201:
     *         description: Médico creado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    .post((req, res, next) => medicoController.create(req, res, next));

  router.route("/seed")
    /**
     * @swagger
     * /medicos/seed:
     *   get:
     *     summary: Seed de médicos y usuarios
     *     tags: [Medicos]
     *     responses:
     *       201:
     *         description: Datos de seed generados
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Medico'
     */
    .get((req, res, next) => medicoController.seedGeneral(req, res, next));

  router.route("/:id/disponibilidades")
    /**
     * @swagger
     * /medicos/{id}/disponibilidades:
     *   get:
     *     summary: Consultar disponibilidad de un médico
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Disponibilidades del médico
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/DisponibilidadHoraria'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .get((req, res, next) => medicoController.consultarDisponibilidad(req, res, next)) // Puede ser que no vaya asi esto.
    /**
     * @swagger
     * /medicos/{id}/disponibilidades:
     *   post:
     *     summary: Definir disponibilidad para un médico
     *     tags: [Medicos]
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
     *             $ref: '#/components/schemas/DefinirDisponibilidadBody'
     *     responses:
     *       201:
     *         description: Disponibilidad definida
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .post((req, res, next) => medicoController.definirDisponibilidad(req, res, next)) // agrego una disponibilidad al medico
    /**
     * @swagger
     * /medicos/{id}/disponibilidades:
     *   put:
     *     summary: Modificar disponibilidad de un médico
     *     tags: [Medicos]
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
     *             $ref: '#/components/schemas/DefinirDisponibilidadBody'
     *     responses:
     *       200:
     *         description: Disponibilidad modificada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .put((req, res, next) => medicoController.modificarDisponibilidad(req, res, next)) // Reemplazar disponibilidad existente del medico
    /**
     * @swagger
     * /medicos/{id}/disponibilidades:
     *   delete:
     *     summary: Eliminar disponibilidad de un médico
     *     tags: [Medicos]
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
     *             $ref: '#/components/schemas/EliminarDisponibilidadBody'
     *     responses:
     *       200:
     *         description: Disponibilidad eliminada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .delete((req, res, next) => medicoController.eliminarDisponibilidad(req, res, next)); // Eliminar disponibilidad existente del medico

  router.route("/:id")
    /**
     * @swagger
     * /medicos/{id}:
     *   get:
     *     summary: Obtener médico por ID
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Médico encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       404:
     *         description: Médico no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Médico no encontrado" }
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .get((req, res, next) => medicoController.findById(req, res, next))
    /**
     * @swagger
     * /medicos/{id}:
     *   delete:
     *     summary: Eliminar médico
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Médico eliminado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       404:
     *         description: Médico no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Médico no encontrado" }
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .delete((req, res, next) => medicoController.delete(req, res, next))
    /**
     * @swagger
     * /medicos/{id}:
     *   put:
     *     summary: Actualizar médico
     *     tags: [Medicos]
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
     *             $ref: '#/components/schemas/CrearMedicoBody'
     *     responses:
     *       200:
     *         description: Médico actualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .put((req, res, next) => medicoController.update(req, res, next));

  router.route("/:id/sedes/:sedeId")
    /**
     * @swagger
     * /medicos/{id}/sedes/{sedeId}:
     *   post:
     *     summary: Agregar sede a un médico
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *       - in: path
     *         name: sedeId
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Sede agregada al médico
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .post((req, res, next) => medicoController.agregarSede(req, res, next));

  router.route("/:id/sedes/:sedeId")
    /**
     * @swagger
     * /medicos/{id}/sedes/{sedeId}:
     *   delete:
     *     summary: Eliminar sede de un médico
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *       - in: path
     *         name: sedeId
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Sede eliminada del médico
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .delete((req, res, next) => medicoController.eliminarSede(req, res, next));

  router.route("/:idMedico/servicios/:idServicio")
    /**
     * @swagger
     * /medicos/{idMedico}/servicios/{idServicio}:
     *   post:
     *     summary: Agregar servicio a un médico
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: idMedico
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *       - in: path
     *         name: idServicio
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Servicio agregado al médico
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *                 message: { type: string }
     */
    .post((req, res, next) => medicoController.agregarServicio(req, res, next)) // Agregar un servicio existente al medico
    /**
     * @swagger
     * /medicos/{idMedico}/servicios/{idServicio}:
     *   delete:
     *     summary: Eliminar servicio de un médico
     *     tags: [Medicos]
     *     parameters:
     *       - in: path
     *         name: idMedico
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *       - in: path
     *         name: idServicio
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Servicio eliminado del médico
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Medico'
     *                 message: { type: string }
     */
    .delete((req, res, next) => medicoController.eliminarServicio(req, res, next)); // Eliminar servicio existente del medico

  return router;
}