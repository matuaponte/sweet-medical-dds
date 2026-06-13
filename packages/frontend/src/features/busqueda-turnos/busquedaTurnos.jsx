import React, { use } from 'react';
import { useEffect, useState, useCallback } from "react";
import SidebarFiltros from '../../components/busqueda-turnos/sidebarFiltros.jsx';
import TarjetaTurno from '../../components/busqueda-turnos/tarjetaTurno.jsx';
import TarjetaTurnoSkeleton from '../../components/busqueda-turnos/tarjetaTurnoSkeleton.jsx';
import CarritoTurnos from '../../components/headers/carritoTurnos.jsx';
import Drawer from '@mui/material/Drawer';
import Pagination from '@mui/material/Pagination';
import { turnosEjemplo, datosPaginacionEjemplo } from '../../mockdata/turnos.js';
import { medicosEjemplo, especialidadesEjemplo, practicasEjemplo, sedesEjemplo } from '../../mockdata/busquedaTurnos.js';
import { getTurnosDisponiblesFiltradoPaginado, getListadoMedicos, getListadoEspecialidades, getListadoPracticas, getListadoSedes, getListadoServicios } from '../../api/api.js';
import './busquedaTurnos.css';
import { useAuth } from '../../context/AuthContext.jsx';

function agruparTurnos(turnos) {
    const mapa = new Map();

    turnos.forEach((turno) => {
        const clave = [
            turno.medico.nombre,
            turno.servicio.id,
            turno.sede.nombre,
            turno.costo,
            turno.estadoCobertura,
        ].join("|");

        if (!mapa.has(clave)) {
            mapa.set(clave, {
                medico: turno.medico,
                servicio: turno.servicio,
                sede: turno.sede,
                costo: turno.costo,
                estadoCobertura: turno.estadoCobertura,
                turnos: [],
            });
        }

        mapa.get(clave).turnos.push({
            id: turno.id,
            horario: turno.fechaHora,
        });
    });

    return Array.from(mapa.values());
}

export default function BusquedaTurnos({ idUsuario, carrito, agregarTurnoAlCarrito, eliminarTurnoDelCarrito, limpiarElCarrito, manejoCarrito }) {
    //datos para los filtros:
    const [pacienteID, setPacienteID] = useState("6a0b720ada9b7c8a035d96a9"); //por ahora; hasta tener el login
    const [medicos, setMedicos] = useState(medicosEjemplo);
    const [especialidades, setEspecialidades] = useState(especialidadesEjemplo);
    const [practicas, setPracticas] = useState(practicasEjemplo);
    const [sedes, setSedes] = useState(sedesEjemplo);
    //los turnos en si:
    const [turnos, setTurnos] = useState(turnosEjemplo);
    const [conjuntosTurnos, setConjuntosTurnos] = useState(agruparTurnos(turnosEjemplo));
    const [dataPaginacion, setDataPaginacion] = useState(datosPaginacionEjemplo);
    const [numeroPagina, setNumeroPagina] = useState(1);
    //funcionamiento general de la vista:
    const [ordenarPor, setOrdenarPor] = useState("ordenarPorFecha");
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //const {user} = useAuth(); //obtenemos el id del usuario logueado desde el contexto de autenticación
        const cargarListados = async () => {
            //const pacienteId = await getPacienteByIdUsuario(user.id)
            //setPacienteID(pacienteId)
            try {
                /*
                const listadoMedicos = await getListadoMedicos();
                setMedicos(listadoMedicos);
                const listadoServicios = await getListadoServicios();
                const listadoEspecialidades = listadoServicios.filter(s => s.tipo === 'Especialidad');
                const listadoPracticas = listadoServicios.filter(s => s.tipo === 'Practica');
                console.log("servicios:", listadoServicios);
                console.log("especialidadesList:", listadoEspecialidades);
                console.log("practicasList:", listadoPracticas)
                const listadoSedes = await getListadoSedes();
                setEspecialidades(listadoEspecialidades);
                setPracticas(listadoPracticas);
                setSedes(listadoSedes);
                console.log("medicos:", medicos)
                console.log("especialidades:", especialidades);
                console.log("practicas:", practicas);
                console.log("sedes:", sedes);
                */
            } catch (e) {
                console.error("Error cargando listados:", e);
            }
        }
        cargarListados();
    }, []);

    const cargarTurnos = useCallback(async (filtros = {}) => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
        const filtrosCompletos = {
            ...filtros,
            'pacienteId': pacienteID,
            ordenarPor: 'asc'
        };
        const dataPaginacion = { numeroPagina };
            //const turnosFiltrados = getTurnosDisponiblesFiltradoPaginado(filtros, paginacion);
            //setTurnos(response.turnos);
            //setDataPaginacion(response.paginacion);
            //setLoading(false);
    }, [ordenarPor, numeroPagina, pacienteID]);

    const agregarAlCarrito = (id) => {
        const turno = turnos.find(t => t.id === id);
        agregarTurnoAlCarrito(turno);
        manejoCarrito.abrir();
    };
    const eliminarDelCarrito = (id) => {
        eliminarTurnoDelCarrito(id);
    };

    useEffect(() => {
        cargarTurnos();
    }, [cargarTurnos]);

    return (
        <div className="container-busqueda">

            {/* Sidebar de filtros desarrollado con Material UI */}
            <SidebarFiltros
                medicos={medicos}
                sedes={sedes}
                especialidades={especialidades}
                practicas={practicas}
                nuevosFiltros={cargarTurnos}
            />

            {/* Contenedor de Resultados del lado derecho */}
            <main className="contenido-resultados">
                <header className="header-resultados">
                    <h3>{dataPaginacion.totalResultados} turnos disponibles</h3>
                    <div className="ordenar-por">
                        <label>Ordenar por:</label>
                        <select defaultValue="ordenarPorFecha" onChange={(e) => setOrdenarPor(e.target.value)}>
                            <option value="ordenarPorFecha">Fecha (más próximos)</option>
                            <option value="ordenarPorCosto">Costo (más barato)</option>
                        </select>
                    </div>
                </header>

                {/* Listado dinámico de las tarjetas médicas */}
                <section className="lista-turno">
                    {loading
                        ? Array.from({ length: dataPaginacion.limitePorPagina }).map((_, i) => ( //que la cantidad de skeletons sea igual al tamaño de pagina
                            <TarjetaTurnoSkeleton key={i} />
                        ))
                        : conjuntosTurnos.map((turno) => (
                            <TarjetaTurno
                                key={turno.id}
                                turno={turno}
                                especialidades={especialidades}
                                practicas={practicas}
                                carrito={carrito}
                                onReservar={agregarAlCarrito}
                            />
                        ))}
                </section>
                <Pagination count={dataPaginacion.totalPaginas} color="#137333"
                    page={numeroPagina}
                    onChange={(e, page) => {
                        setNumeroPagina(page);
                        cargarTurnos();
                    }}
                />
            </main>
        </div>
    );
}