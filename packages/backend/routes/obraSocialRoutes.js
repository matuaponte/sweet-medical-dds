import { Router } from "express";
import { ObraSocialController } from "../controllers/ObraSocialController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ObraSocial:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         nombre: { type: string, minLength: 4, maxLength: 50, pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$' }
 *         planes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Plan'
 *         eliminado: { type: boolean }
 *       required: [nombre]
 *     Plan:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         nombre: { type: string, minLength: 1 }
 *         coberturaEspecialidad:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CoberturaEspecialidad'
 *         coberturaPractica:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CoberturaPractica'
 *         eliminado: { type: boolean }
 *       required: [nombre]
 *     CoberturaEspecialidad:
 *       type: object
 *       properties:
 *         especialidad: { $ref: '#/components/schemas/ObjectId' }
 *         nivel: { $ref: '#/components/schemas/NivelCobertura' }
 *         porcentajeCobertura: { type: number, minimum: 0, maximum: 1 }
 *       required: [especialidad, nivel, porcentajeCobertura]
 *     CoberturaPractica:
 *       type: object
 *       properties:
 *         practica: { $ref: '#/components/schemas/ObjectId' }
 *         nivel: { $ref: '#/components/schemas/NivelCobertura' }
 *         porcentajeCobertura: { type: number, minimum: 0, maximum: 1 }
 *       required: [practica, nivel, porcentajeCobertura]
 */

/**
 * @swagger
 * tags:
 *   name: Obras Sociales
 *   description: Gestión de obras sociales y planes
 */
export default function obraSocialRoutes(getController) {
    const router = new Router();
    /**@type {InstanceType<typeof ObraSocialController>} */
    const obraSocialController = getController(ObraSocialController);

    router.route("/")
        /**
         * @swagger
         * /obra-social:
         *   get:
         *     summary: Listar todas las obras sociales
         *     tags: [Obras Sociales]
         *     responses:
         *       200:
         *         description: Lista de obras sociales
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/ObraSocial'
         *       500:
         *         $ref: '#/components/responses/E500'
         */
        .get((req, res, next) => obraSocialController.buscarTodos(req, res, next))
        /**
         * @swagger
         * /obra-social:
         *   post:
         *     summary: Crear una nueva obra social
         *     tags: [Obras Sociales]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CrearObraSocialBody'
         *     responses:
         *       201:
         *         description: Obra social creada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/ObraSocial'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .post((req, res, next) => obraSocialController.crear(req, res, next));

    router.route("/:obraSocialId")
        /**
         * @swagger
         * /obra-social/{obraSocialId}:
         *   get:
         *     summary: Obtener obra social por ID
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     responses:
         *       200:
         *         description: Obra social encontrada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/ObraSocial'
         *       404:
         *         $ref: '#/components/responses/E404'
         */
        .get((req, res, next) => obraSocialController.buscar(req, res, next))
        /**
         * @swagger
         * /obra-social/{obraSocialId}:
         *   put:
         *     summary: Actualizar obra social
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CrearObraSocialBody'
         *     responses:
         *       200:
         *         description: Obra social actualizada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/ObraSocial'
         *       400:
         *         $ref: '#/components/responses/E400'
         *       404:
         *         $ref: '#/components/responses/E404'
         */
        .put((req, res, next) => obraSocialController.actualizar(req, res, next))
        /**
         * @swagger
         * /obra-social/{obraSocialId}:
         *   delete:
         *     summary: Eliminar obra social
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     responses:
         *       202:
         *         description: Obra social eliminada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/ObraSocial'
         *       404:
         *         $ref: '#/components/responses/E404'
         */

        .delete((req, res, next) => obraSocialController.eliminar(req, res, next));

    router.route("/:obraSocialId/plan")
        /**
         * @swagger
         * /obra-social/{obraSocialId}/plan:
         *   get:
         *     summary: Listar planes de una obra social
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     responses:
         *       200:
         *         description: Planes de la obra social
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Plan'
         */
        .get((req, res, next) => obraSocialController.buscarTodosLosPlanes(req, res, next))
        /**
         * @swagger
         * /obra-social/{obraSocialId}/plan:
         *   post:
         *     summary: Crear plan para una obra social
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CrearPlanBody'
         *     responses:
         *       201:
         *         description: Plan creado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Plan'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .post((req, res, next) => obraSocialController.crearPlan(req, res, next));

    router.route("/:obraSocialId/plan/:planId")
        /**
         * @swagger
         * /obra-social/{obraSocialId}/plan/{planId}:
         *   get:
         *     summary: Obtener plan por ID
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *       - in: path
         *         name: planId
         *         required: true
         *         schema:
         *           oneOf:
         *             - $ref: '#/components/schemas/ObjectId'
         *             - $ref: '#/components/schemas/UUID'
         *     responses:
         *       200:
         *         description: Plan encontrado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Plan'
         *       404:
         *         $ref: '#/components/responses/E404'
         */
        .get((req, res, next) => obraSocialController.buscarPlan(req, res, next))
        /**
         * @swagger
         * /obra-social/{obraSocialId}/plan/{planId}:
         *   put:
         *     summary: Actualizar plan
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *       - in: path
         *         name: planId
         *         required: true
         *         schema:
         *           oneOf:
         *             - $ref: '#/components/schemas/ObjectId'
         *             - $ref: '#/components/schemas/UUID'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CrearPlanBody'
         *     responses:
         *       200:
         *         description: Plan actualizado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Plan'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .put((req, res, next) => obraSocialController.actualizarPlan(req, res, next))
        /**
         * @swagger
         * /obra-social/{obraSocialId}/plan/{planId}:
         *   delete:
         *     summary: Eliminar plan
         *     tags: [Obras Sociales]
         *     parameters:
         *       - in: path
         *         name: obraSocialId
         *         required: true
         *         schema:
         *           $ref: '#/components/schemas/ObjectId'
         *       - in: path
         *         name: planId
         *         required: true
         *         schema:
         *           oneOf:
         *             - $ref: '#/components/schemas/ObjectId'
         *             - $ref: '#/components/schemas/UUID'
         *     responses:
         *       202:
         *         description: Plan eliminado
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Plan'
         *       404:
         *         $ref: '#/components/responses/E404'
         */
        .delete((req, res, next) => obraSocialController.eliminarPlan(req, res, next));

    return router;
}