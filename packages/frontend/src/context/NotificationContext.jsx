import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import axiosInstance from '../api/axiosInstance';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      // Obtener notificaciones leídas y no leídas en paralelo
      const [readRes, unreadRes] = await Promise.all([
        axiosInstance.get(`/usuarios/${user.id}/notificaciones/leidas`),
        axiosInstance.get(`/usuarios/${user.id}/notificaciones/no-leidas`)
      ]);
      
      const readData = readRes.data.data || [];
      const unreadData = unreadRes.data.data || [];
      
      // Combinar y ordenar por fecha de creación decreciente
      const combined = [...readData, ...unreadData].sort((a, b) => {
        return new Date(b.fechaHoraCreacion) - new Date(a.fechaHoraCreacion);
      });
      
      setNotifications(combined);
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Ejecución inicial y polling cada 30 segundos
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user, fetchNotifications]);

  // Marcar como leída (PATCH con body { leida: true })
  const markAsRead = async (notificationId) => {
    if (!user) return;
    try {
      await axiosInstance.patch(`/usuarios/${user.id}/notificaciones/${notificationId}`, { leida: true });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId || n._id === notificationId
            ? { ...n, leida: true, fechaHoraLeida: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  // Marcar como no leída (PATCH con body { leida: false })
  const markAsUnread = async (notificationId) => {
    if (!user) return;
    try {
      await axiosInstance.patch(`/usuarios/${user.id}/notificaciones/${notificationId}`, { leida: false });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId || n._id === notificationId
            ? { ...n, leida: false, fechaHoraLeida: null }
            : n
        )
      );
    } catch (error) {
      console.error('Error al marcar la notificación como no leída:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAsUnread,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
