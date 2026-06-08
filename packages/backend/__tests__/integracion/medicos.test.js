import request from "supertest";
import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { buildTestApp } from "./utils/buildMedicosApp.js";
import { Medico } from "../../domain/medico.js";
import { Usuario } from "../../domain/usuario.js";

describe("Medico API - Integración", () => {
    let app;
    let medicoRepositoryMock;

    beforeEach(() => {
        medicoRepositoryMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findByIdUsuario: jest.fn(),
            save: jest.fn(),
        };
        app = buildTestApp(medicoRepositoryMock);
    }
    );

    describe("GET /medicos", () => {
        test("Debería retornar una lista de médicos", async () => {
            const medicos = [
                new Medico({
                    id: "1",
                    nombre: "Dr. Juan Pérez",
                    matricula: "12345",
                    usuario: new Usuario({ id: "6a07ded13b0b9c47c60dde801", nombreUsuario: "juanperez", password: "password" }),
                    honorario: new Number(5000),
                }),
                new Medico({
                    id: "2",
                    nombre: "Dra. María Gómez",
                    matricula: "67890",
                    usuario: new Usuario({ id: "6a07ded13b0b9c47c60dde80", nombreUsuario: "mariagomez", password: "password" }),
                    honorario: new Number(6000),
                })
            ];
            medicoRepositoryMock.findAll.mockResolvedValue(medicos);

            const response = await request(app).get("/medicos");

            console.log("Response body:", response.body); // Agregado para depuración

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    id: medicos[0].id,
                    nombre: "Dr. Juan Pérez",
                    matricula: "12345",
                    usuario: {
                        id: medicos[0].usuario.id,
                        nombreUsuario: "juanperez",
                    },
                    sedes: medicos[0].sedes,
                    disponibilidades: medicos[0].disponibilidades,
                },
                {
                    id: medicos[1].id,
                    nombre: "Dra. María Gómez",
                    matricula: "67890",
                    usuario: {
                        id: medicos[1].usuario.id,
                        nombreUsuario: "mariagomez",
                    },
                    sedes: medicos[1].sedes,
                    disponibilidades: medicos[1].disponibilidades,
                }
            ]);

        });
    });
});