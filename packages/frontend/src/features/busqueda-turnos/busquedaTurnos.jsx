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
import { getTurnosDisponiblesFiltradoPaginado, getListadoMedicos, getListadoEspecialidades, getListadoPracticas, getListadoSedes } from '../../api/api.js';
import './busquedaTurnos.css';

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

export default function BusquedaTurnos({ idUsuario, carrito, agregarTurnoAlCarrito, eliminarTurnoDelCarrito, limpiarElCarrito }) {
    //datos para los filtros:
    const [pacienteID, setPacienteID] = useState(""); //por ahora; hasta tener el login
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
        const cargarListados = async () => {
            /*
            const pacienteId = await getPacienteByIdUsuario(idUsuario)
            setPacienteID(pacienteId)
            const listadoMedicos = await getListadoMedicos();
            setMedicos(listadoMedicos);
            const listadoServicios = await getListadoEspecialidades();
            setEspecialidades(listadoServicios.filter(s => s.tipo === 'Especialidad));
            setPracticas(listadoServicios.filter(s => s.tipo === 'Practica'));
            const listadoSedes = await getListadoSedes();
            setSedes(listadoSedes);
        */
        }
    }, []);

    const cargarTurnos = useCallback((filtros = {}) => {
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
    }, [ordenarPor, numeroPagina]);

    const agregarAlCarrito = (id) => {
        const turno = turnos.find(t => t.id === id);
        agregarTurnoAlCarrito(turno);
        setCarritoAbierto(true);
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
            
            <Drawer
                anchor="right"
                open={carritoAbierto}
                onClose={() => setCarritoAbierto(false)}
            >
                <CarritoTurnos
                    items={carrito}
                    onEliminar={eliminarDelCarrito}
                    onConfirmar={limpiarElCarrito}
                    onCerrar={() => setCarritoAbierto(false)}
                />
            </Drawer>
        </div>
    );
}