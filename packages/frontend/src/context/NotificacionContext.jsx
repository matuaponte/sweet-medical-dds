import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import {
  getNotificacionesMe,
  getContadoresMe,
  marcarNotificacionComoLeida,
  marcarNotificacionComoNoLeida,
  marcarTodasLasNotificacionesComoLeidas
} from "../api/notificacion";

const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const { user } = useAuth();
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);
  
  // Totales reales del backend
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);
  const [cantidadLeidas, setCantidadLeidas] = useState(0);

  // Estados de paginación
  const [pageNoLeidas, setPageNoLeidas] = useState(1);
  const [pageLeidas, setPageLeidas] = useState(1);
  const [hasMoreNoLeidas, setHasMoreNoLeidas] = useState(false);
  const [hasMoreLeidas, setHasMoreLeidas] = useState(false);

  const [cargando, setCargando] = useState(false);
  const pollingTimerRef = useRef(null);

  const ordenarPorFechaDesc = (arr) =>
    [...arr].sort((a, b) => new Date(b.fechaHoraCreacion) - new Date(a.fechaHoraCreacion));

  // Carga inicial (limpia y carga la página 1)
  const obtenerNotificaciones = useCallback(async () => {
    if (!user) return;
    try {
      setCargando(true);
      const [contadoresRes, noLeidasRes, leidasRes] = await Promise.all([
        getContadoresMe(),
        getNotificacionesMe(false, 1, 5),
        getNotificacionesMe(true, 1, 5)
      ]);

      setCantidadNoLeidas(contadoresRes.data.noLeidas);
      setCantidadLeidas(contadoresRes.data.leidas);

      setNotificacionesNoLeidas(ordenarPorFechaDesc(noLeidasRes.data || []));
      setPageNoLeidas(1);
      setHasMoreNoLeidas(noLeidasRes.page < noLeidasRes.totalPages);

      setNotificacionesLeidas(ordenarPorFechaDesc(leidasRes.data || []));
      setPageLeidas(1);
      setHasMoreLeidas(leidasRes.page < leidasRes.totalPages);
    } catch (error) {
      console.error("[NotificacionContext]: Error en carga inicial", error);
    } finally {
      setCargando(false);
    }
  }, [user]);

  // Carga progresiva (Cargar Más) para No Leídas
  const cargarMasNoLeidas = async () => {
    if (cargando || !hasMoreNoLeidas) return;
    try {
      setCargando(true);
      const nextPage = pageNoLeidas + 1;
      const res = await getNotificacionesMe(false, nextPage, 5);
      
      setNotificacionesNoLeidas((prev) => ordenarPorFechaDesc([...prev, ...(res.data || [])]));
      setPageNoLeidas(nextPage);
      setHasMoreNoLeidas(res.page < res.totalPages);
    } catch (error) {
      console.error("[NotificacionContext]: Error al cargar más no leídas", error);
    } finally {
      setCargando(false);
    }
  };

  // Carga progresiva (Cargar Más) para Leídas
  const cargarMasLeidas = async () => {
    if (cargando || !hasMoreLeidas) return;
    try {
      setCargando(true);
      const nextPage = pageLeidas + 1;
      const res = await getNotificacionesMe(true, nextPage, 5);
      
      setNotificacionesLeidas((prev) => ordenarPorFechaDesc([...prev, ...(res.data || [])]));
      setPageLeidas(nextPage);
      setHasMoreLeidas(res.page < res.totalPages);
    } catch (error) {
      console.error("[NotificacionContext]: Error al cargar más leídas", error);
    } finally {
      setCargando(false);
    }
  };

  // Polling silencioso de contadores
  const refrescarContadoresYAlerta = useCallback(async () => {
    if (!user) return;
    try {
      const contadoresRes = await getContadoresMe();
      const nuevosPendientes = contadoresRes.data.noLeidas;
      const nuevosLeidos = contadoresRes.data.leidas;

      // Si cambió el total de no leídas respecto a nuestro estado local,
      // actualizamos y recargamos silenciosamente la página 1 de pendientes
      if (nuevosPendientes !== cantidadNoLeidas) {
        setCantidadNoLeidas(nuevosPendientes);
        setCantidadLeidas(nuevosLeidos);
        
        const noLeidasRes = await getNotificacionesMe(false, 1, 5);
        setNotificacionesNoLeidas(ordenarPorFechaDesc(noLeidasRes.data || []));
        setPageNoLeidas(1);
        setHasMoreNoLeidas(noLeidasRes.page < noLeidasRes.totalPages);
      }
    } catch (error) {
      console.error("[NotificacionContext]: Error en polling de contadores", error);
    }
  }, [user, cantidadNoLeidas]);

  const refrescarNotificacionesSilenciosamente = useCallback(async () => {
    if (!user) return;
    try {
      const [contadoresRes, noLeidasRes, leidasRes] = await Promise.all([
        getContadoresMe(),
        getNotificacionesMe(false, 1, 5),
        getNotificacionesMe(true, 1, 5)
      ]);
      setCantidadNoLeidas(contadoresRes.data.noLeidas);
      setCantidadLeidas(contadoresRes.data.leidas);
      setNotificacionesNoLeidas(ordenarPorFechaDesc(noLeidasRes.data || []));
      setPageNoLeidas(1);
      setHasMoreNoLeidas(noLeidasRes.page < noLeidasRes.totalPages);
      setNotificacionesLeidas(ordenarPorFechaDesc(leidasRes.data || []));
      setPageLeidas(1);
      setHasMoreLeidas(leidasRes.page < leidasRes.totalPages);
    } catch (error) {
      console.error("[NotificacionContext]: Error en refresco silencioso", error);
    }
  }, [user]);

  // Marcar una notificación individual como leída
  const marcarComoLeida = async (idNotificacion) => {
    if (!user) return;
    const targetNotif = notificacionesNoLeidas.find((n) => n.id === idNotificacion);

    // Modificación optimista si está en la lista de la campanita
    if (targetNotif) {
      setNotificacionesNoLeidas((prev) => prev.filter((n) => n.id !== idNotificacion));
      setNotificacionesLeidas((prev) => [
        { ...targetNotif, leida: true, fechaHoraLeida: new Date().toISOString() },
        ...prev
      ]);
    }
    setCantidadNoLeidas((prev) => Math.max(0, prev - 1));
    setCantidadLeidas((prev) => prev + 1);

    try {
      await marcarNotificacionComoLeida(idNotificacion);
      if (!targetNotif) {
        // Refresco silencioso para sincronizar de fondo
        refrescarNotificacionesSilenciosamente();
      }
    } catch (error) {
      console.error("[NotificacionContext]: Error al marcar como leída", error);
      obtenerNotificaciones();
    }
  };

  // Marcar una notificación individual como no leída
  const marcarComoNoLeida = async (idNotificacion) => {
    if (!user) return;
    const targetNotif = notificacionesLeidas.find((n) => n.id === idNotificacion);

    // Modificación optimista si está en la lista de la campanita
    if (targetNotif) {
      setNotificacionesLeidas((prev) => prev.filter((n) => n.id !== idNotificacion));
      setNotificacionesNoLeidas((prev) => [
        { ...targetNotif, leida: false, fechaHoraLeida: null },
        ...prev
      ]);
    }
    setCantidadLeidas((prev) => Math.max(0, prev - 1));
    setCantidadNoLeidas((prev) => prev + 1);

    try {
      await marcarNotificacionComoNoLeida(idNotificacion);
      if (!targetNotif) {
        refrescarNotificacionesSilenciosamente();
      }
    } catch (error) {
      console.error("[NotificacionContext]: Error al marcar como no leída", error);
      obtenerNotificaciones();
    }
  };

  // Marcar todas las notificaciones pendientes como leídas
  const marcarTodasComoLeidas = async () => {
    if (!user) return;

    // Modificación optimista
    setNotificacionesNoLeidas([]);
    setCantidadLeidas((prev) => prev + cantidadNoLeidas);
    setCantidadNoLeidas(0);

    try {
      await marcarTodasLasNotificacionesComoLeidas();
      refrescarNotificacionesSilenciosamente();
    } catch (error) {
      console.error("[NotificacionContext]: Error al marcar todas como leídas", error);
      obtenerNotificaciones();
    }
  };

  // Configuración del ciclo de vida y polling
  useEffect(() => {
    if (user) {
      obtenerNotificaciones();
      pollingTimerRef.current = setInterval(() => {
        refrescarContadoresYAlerta();
      }, 30000);
    } else {
      setNotificacionesLeidas([]);
      setNotificacionesNoLeidas([]);
      setCantidadNoLeidas(0);
      setCantidadLeidas(0);
      setPageNoLeidas(1);
      setPageLeidas(1);
      setHasMoreNoLeidas(false);
      setHasMoreLeidas(false);
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    };
  }, [user, obtenerNotificaciones, refrescarContadoresYAlerta]);

  return (
    <NotificacionContext.Provider
      value={{
        notificacionesLeidas,
        notificacionesNoLeidas,
        cargando,
        cantidadNoLeidas,
        cantidadLeidas,
        hasMoreNoLeidas,
        hasMoreLeidas,
        obtenerNotificaciones,
        cargarMasNoLeidas,
        cargarMasLeidas,
        marcarComoLeida,
        marcarComoNoLeida,
        marcarTodasComoLeidas
      }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};

export const useNotificaciones = () => {
  const context = useContext(NotificacionContext);
  if (!context) {
    throw new Error("useNotificaciones debe usarse dentro de un NotificacionProvider");
  }
  return context;
};
