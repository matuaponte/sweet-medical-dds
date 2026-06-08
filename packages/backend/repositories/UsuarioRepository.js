import { BadRequestError } from "../errors/AppError.js";
import { UsuarioModel } from "../schemas/dataBase/usuarioSchema.js";
import { logger } from "../config/logger.js";

export class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    async save(usuario) {
        logger.info("[USUARIO REPOSITORY]: Guardando usuario: ", usuario);

        const usuarioGuardado = await this.model.create(usuario);

        logger.info("[USUARIO REPOSITORY]: Usuario guardado: ", usuarioGuardado);

        return usuarioGuardado;
    }

    async findById(id) {
        logger.info("[USUARIO REPOSITORY]: Obteniendo usuario: " + id);
        const usuario = await this.model.findById(id);
        if (!usuario) throw new BadRequestError("Usuario no encontrado");
        logger.info("[USUARIO REPOSITORY]: Usuario obtenido: ", usuario);

        return usuario;
    }

    async findByUsername(nombreUsuarioBuscado) {
        logger.info("[USUARIO REPOSITORY]: Buscando usuario por nombre: " + nombreUsuarioBuscado);
        const usuario = await this.model.findOne({ nombreUsuario: nombreUsuarioBuscado });
        return usuario;
    }

    /* TODO VER SI FUNCIONAN
    async save(usuario) {
        if (!(usuario instanceof Usuario)) {
            throw new Error("No es un Usuario valido");
        }
        const usuarioGuardado = new this.model(usuario);
        return await usuarioGuardado.save();
    }

    async findById(id) {
        const usuario = await this.model.findById(id);
        if (!usuario) {
            throw new BadRequestError("Usuario no encontrado");
        }
        return usuario;
    }
    */
    async findAll() {
        return await this.model.find();
    }

    async deleteByID(id) {
        await this.model.findByIdAndDelete(id);
    }

    async update(usuario) {
        const usuarioExistente = await this.findById(usuario.id); // Verificar que el usuario existe, si no lanza un error
        if (!usuarioExistente) {
            throw new BadRequestError("Usuario no encontrado");
        }
        const usuarioActualizado = await this.model.findByIdAndUpdate(usuario.id, usuario, { new: true });
        return usuarioActualizado;
    }
}