import express from "express";
import { MedicoController } from "../../../controllers/MedicoController.js";
import { MedicoService } from "../../../services/MedicoService.js";
import { notFoundHandler } from "../../../middlewares/notFoundHandler.js";
import { errorHandler } from "../../../middlewares/errorHandler.js";

export function buildTestApp(medicoRepository) {
    const medicoService = new MedicoService({ medicoRepository });
    const medicoController = new MedicoController({ medicoService });

    const app = express();
    app.use(express.json());

    const router = express.Router();
    router.route("/")
        .get((req, res, next) => medicoController.findAll(req, res, next))
        .post((req, res, next) => medicoController.create(req, res, next));
    router.route("/:id")
        .get((req, res, next) => medicoController.findById(req, res, next))
        .put((req, res, next) => medicoController.update(req, res, next))
        .delete((req, res, next) => medicoController.delete(req, res, next));

    app.use("/medicos", router);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}