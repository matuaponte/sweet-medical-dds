import express from "express";
import { ServicioController } from "../controllers/ServicioController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         nombre: { type: string }
 *         duracionTurnoEnMins: { type: integer, minimum: 1 }
 *       required: [nombre, duracionTurnoEnMins]
 *     Especialidad:
 *       allOf:
 *         - $ref: '#/components/schemas/Servicio'
 *         - type: object
 *           properties:
 *             costo: { type: number }
 *           required: [costo]
 *     Practica:
 *       allOf:
 *         - $ref: '#/components/schemas/Servicio'
 *         - type: object
 *           properties:
 *             costo: { type: number }
 *             codigo: { type: string, nullable: true }
 *             especialidadPadre: { $ref: '#/components/schemas/ObjectId' }
 *           required: [costo]
 */

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Gestión de servicios, especialidades y prácticas
 */
export default function servicioRoutes(getController) {
  const router = express.Router();
  const servicioController = getController(ServicioController);

  router
    .route("/")
    /**
     * @swagger
     * /servicios:
     *   post:
     *     summary: Crear un nuevo servicio
     *     tags: [Servicios]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CrearServicioBody'
     *     responses:
     *       201:
     *         description: Servicio creado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Servicio'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .post((req, res, next) => servicioController.create(req, res, next))
    /**
     * @swagger
     * /servicios:
     *   get:
     *     summary: Listar todos los servicios
     *     tags: [Servicios]
     *     responses:
     *       200:
     *         description: Lista de servicios
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Servicio'
     */
    .get((req, res, next) => servicioController.findAll(req, res, next));
  router
    .route("/:idServicio")
    /**
     * @swagger
     * /servicios/{idServicio}:
     *   get:
     *     summary: Obtener servicio por ID
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: idServicio
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Servicio encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Servicio'
     *       404:
     *         $ref: '#/components/responses/E404'
     */
    .get((req, res, next) => servicioController.findById(req, res, next))
    /**
     * @swagger
     * /servicios/{idServicio}:
     *   put:
     *     summary: Actualizar servicio
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: idServicio
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CrearServicioBody'
     *     responses:
     *       200:
     *         description: Servicio actualizado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Servicio'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    .put((req, res, next) => servicioController.update(req, res, next))
    /**
     * @swagger
     * /servicios/{idServicio}:
     *   delete:
     *     summary: Eliminar servicio
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: idServicio
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       204:
     *         description: Servicio eliminado
     *       404:
     *         $ref: '#/components/responses/E404'
     */
    .delete((req, res, next) => servicioController.delete(req, res, next));

  return router;
}
