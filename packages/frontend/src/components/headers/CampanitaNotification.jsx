import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DoneIcon from "@mui/icons-material/Done";
import UndoIcon from "@mui/icons-material/Undo";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function CampanitaNotificacion() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    fetchNotifications,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0 = No Leídas, 1 = Leídas

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.leida);
    for (const n of unreadNotifications) {
      await markAsRead(n.id || n._id);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;

  // Filtrar notificaciones según la pestaña activa
  const filteredNotifications = notifications.filter((n) => {
    if (tabValue === 0) return !n.leida;
    return n.leida;
  });

  // Retorna un ícono temático según las palabras clave del mensaje
  const getNotificationIcon = (mensaje) => {
    const msgLower = mensaje.toLowerCase();
    if (msgLower.includes("cancelado")) {
      return (
        <Avatar sx={{ bgcolor: "error.light", color: "error.main" }}>
          <CancelIcon />
        </Avatar>
      );
    }
    if (msgLower.includes("confirmado") || msgLower.includes("reservado")) {
      return (
        <Avatar sx={{ bgcolor: "success.light", color: "success.main" }}>
          <CheckCircleIcon />
        </Avatar>
      );
    }
    if (msgLower.includes("pendiente de cambio") || msgLower.includes("propuesta")) {
      return (
        <Avatar sx={{ bgcolor: "warning.light", color: "warning.main" }}>
          <SwapHorizIcon />
        </Avatar>
      );
    }
    return (
      <Avatar sx={{ bgcolor: "info.light", color: "info.main" }}>
        <NotificationsIcon />
      </Avatar>
    );
  };

  const formatFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          color="primary"
          onClick={handleOpen}
          aria-describedby={id}
          className="notification-btn"
          id="btn-campanita-notificaciones"
          sx={{ transition: "transform 0.2s", "&:hover": { transform: "scale(1.1)" } }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ fontSize: 28 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: "bold" }}
            >
              Marcar todas
            </Button>
          )}
        </Box>

        <Divider />

        {/* Selector de pestañas */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label={`No Leídas (${notifications.filter((n) => !n.leida).length})`}
            sx={{ textTransform: "none", fontWeight: "bold" }}
            id="tab-notificaciones-no-leidas"
          />
          <Tab
            label="Leídas"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            id="tab-notificaciones-leidas"
          />
        </Tabs>

        {/* Cuerpo / Lista */}
        <Box sx={{ overflowY: "auto", flexGrow: 1, maxHeight: 340 }}>
          {filteredNotifications.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                px: 2,
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              <NotificationsOffIcon sx={{ fontSize: 48, mb: 1, color: "text.disabled" }} />
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {tabValue === 0
                  ? "¡Estás al día! No tenés notificaciones sin leer."
                  : "No tenés notificaciones leídas."}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredNotifications.map((notif, index) => (
                <React.Fragment key={notif.id || notif._id || index}>
                  <ListItem
                    secondaryAction={
                      notif.leida ? (
                        <Tooltip title="Marcar como no leída">
                          <IconButton
                            edge="end"
                            aria-label="marcar como no leida"
                            onClick={() => markAsUnread(notif.id || notif._id)}
                            sx={{ color: "primary.main" }}
                            className="btn-marcar-no-leida"
                          >
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Marcar como leída">
                          <IconButton
                            edge="end"
                            aria-label="marcar como leida"
                            onClick={() => markAsRead(notif.id || notif._id)}
                            sx={{ color: "success.main" }}
                            className="btn-marcar-leida"
                          >
                            <DoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                    sx={{
                      alignItems: "flex-start",
                      py: 1.5,
                      px: 2,
                      bgcolor: notif.leida ? "action.hover" : "background.paper",
                      "&:hover": { bgcolor: "action.selected" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <ListItemAvatar sx={{ mt: 0.5 }}>
                      {getNotificationIcon(notif.mensaje)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            pr: 4,
                            fontWeight: notif.leida ? "normal" : "bold",
                            lineHeight: 1.4,
                          }}
                        >
                          {notif.mensaje}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
                        >
                          {formatFecha(notif.fechaHoraCreacion)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}
