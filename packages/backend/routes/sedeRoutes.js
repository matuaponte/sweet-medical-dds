import express from "express";
import { SedeController } from "../controllers/SedeController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Sede:
 *       type: object
 *       properties:
 *         _id: { $ref: '#/components/schemas/ObjectId' }
 *         nombre: { type: string, minLength: 3, maxLength: 50, pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$' }
 *         direccion: { type: string, minLength: 3, maxLength: 150, pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,-]+$' }
 *         eliminado: { type: boolean }
 *       required: [nombre, direccion]
 */

/**
 * @swagger
 * tags:
 *   name: Sedes
 *   description: Gestión de sedes
 */

export default function sedeRoutes(getController) {
    const router = express.Router();
    const sedeController = getController(SedeController);

    router.route("/")
        /**
         * @swagger
         * /sedes:
         *   get:
         *     summary: Listar todas las sedes
         *     tags: [Sedes]
         *     responses:
         *       200:
         *         description: Lista de sedes
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Sede'
         *       500:
         *         $ref: '#/components/responses/E500'
         */
        .get((req, res, next) => sedeController.findAll(req, res, next))
        /**
         * @swagger
         * /sedes:
         *   post:
         *     summary: Crear una nueva sede
         *     tags: [Sedes]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CrearSedeBody'
         *     responses:
         *       201:
         *         description: Sede creada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Sede'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .post((req, res, next) => sedeController.create(req, res, next));

    router.route("/:id")
        /**
        * @swagger
        * /sedes/{id}:
        *   get:
        *     summary: Obtener sede por ID
        *     tags: [Sedes]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           $ref: '#/components/schemas/ObjectId'
        *     responses:
        *       200:
        *         description: Sede encontrada
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status: { type: string, example: "success" }
        *                 data:
        *                   $ref: '#/components/schemas/Sede'
        *       404:
        *         $ref: '#/components/responses/E404'
         */
        .get((req, res, next) => sedeController.findById(req, res, next))
        /**
         * @swagger
         * /sedes/{id}:
         *   put:
         *     summary: Actualizar sede
         *     tags: [Sedes]
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
         *             $ref: '#/components/schemas/CrearSedeBody'
         *     responses:
         *       200:
         *         description: Sede actualizada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Sede'
         *       400:
         *         $ref: '#/components/responses/E400'
         */
        .put((req, res, next) => sedeController.update(req, res, next))
        /**
        * @swagger
        * /sedes/{id}:
        *   delete:
        *     summary: Eliminar sede
        *     tags: [Sedes]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           $ref: '#/components/schemas/ObjectId'
        *     responses:
        *       200:
        *         description: Sede eliminada
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status: { type: string, example: "success" }
        *                 data:
        *                   $ref: '#/components/schemas/Sede'
        *       404:
        *         $ref: '#/components/responses/E404'
        */
        .delete((req, res, next) => sedeController.delete(req, res, next));

    router.route("/:nombre")
        /**
         * @swagger
         * /sedes/{nombre}:
         *   get:
         *     summary: Buscar sede por nombre
         *     tags: [Sedes]
         *     parameters:
         *       - in: path
         *         name: nombre
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Sede encontrada
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status: { type: string, example: "success" }
         *                 data:
         *                   $ref: '#/components/schemas/Sede'
         *       404:
         *         $ref: '#/components/responses/E404'
         */
        .get((req, res, next) => sedeController.findByName(req, res, next));
    
    return router;
}
