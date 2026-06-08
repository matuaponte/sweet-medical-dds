import express from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import notificacionRoutes from "./notificacionRoutes.js";

/**
 * 
 * @swagger
 * components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      properties:
 *        _id: { $ref: '#/components/schemas/ObjectId' }
 *        nombreUsuario: { type: string, minLength: 4, maxLength: 20, pattern: '^[a-zA-Z0-9_]+$' }
 *        password: { type: string, minLength: 8 }
 *      required: [nombreUsuario, password]
 */

/**
 * 
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Gestión de usuarios 
 */
export default function usuarioRoutes(getController) {
  const router = express.Router();
  const usuarioController = getController(UsuarioController);

  router
    .route("/")
    /**
     * @swagger
     * /usuarios:
     *  get:
     *    summary: Listar todos los usuarios
     *    tags: [Usuarios]
     *    responses:
     *      200:
     *        description: Lista de usuarios
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: '#/components/schemas/Usuario'
     *      500:
     *        $ref: '#/components/responses/E500'
     */
    .get((req, res, next) => usuarioController.findAll(req, res, next))
    /**
     * @swagger
     * /usuarios:
     *  post:
     *    summary: Crear un nuevo usuario
     *    tags: [Usuarios]
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/CrearUsuarioBody'
     *    responses:
     *      201:
     *        description: Usuario creado
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Usuario'
     *      400:
     *        $ref: '#/components/responses/E400'
     *      500:
     *        $ref: '#/components/responses/E500'
     * 
     */
    .post((req, res, next) => usuarioController.create(req, res, next));

  router
    .route("/:id")
    /**
     * @swagger
     * /usuarios/{id}:
     *  get:
     *    summary: Obtener un usuario por ID
     *    tags: [Usuarios]
     *    responses:
     *      200:
     *        description: Usuario encontrado
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Usuario'
     *      404:
     *        description: Usuario no encontrado
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message: { type; string, example: "Usuario no encontrado" }
     *      400:
     *        $ref: '#/components/responses/E400'
     *      
     */
    .get((req, res, next) => usuarioController.findById(req, res, next))
    /**
     * @swagger
     * /usuarios/{id}:
     *  delete:
     *    summary: Eliminar un usuario
     *    tags: [Usuarios]
     *    responses:
     *      204:
     *        description: Usuario eliminado
     *      404:
     *        $ref: '#/components/responses/E404'
     *      500:
     *        $ref: '#/components/responses/E500'
     */
    .delete((req, res, next) => usuarioController.delete(req, res, next))
    /**
     * @swagger
     * /usuarios/{id}:
     *  put:
     *    summary: Actualizar un usuario
     *    tags: [Usuarios]
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/CrearUsuarioBody'
     *    responses:
     *      200:
     *        description: Usuario actualizado
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Usuario'
     *      404:
     *        $ref: '#/components/responses/E404'
     *      500:
     *        $ref: '#/components/responses/E500'
     */
    .put((req, res, next) => usuarioController.update(req, res, next));

  router.use("/:idUsuario/notificaciones", notificacionRoutes(getController));

  return router;
}
