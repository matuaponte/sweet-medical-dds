import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from "@mui/material";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";

export default function ItemNotificacion({
  notificacion,
  onMarcarLeida,
  onMarcarNoLeida,
  pantallaCompleta = false
}) {
  const { id, mensaje, remitente, fechaHoraCreacion, leida, fechaHoraLeida } = notificacion;
  const [openModal, setOpenModal] = useState(false);

  const lineas = mensaje?.split("\n") || [];
  const titulo = lineas[0] || "";
  const cuerpo = lineas.slice(1).join("\n").trim();

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
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

  const formatearTiempoRelativo = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const fecha = new Date(fechaStr);
      const ahora = new Date();
      const diffMs = ahora - fecha;
      const diffSeg = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSeg / 60);
      const diffHor = Math.floor(diffMin / 60);
      const diffDias = Math.floor(diffHor / 24);

      if (diffSeg < 60) return "Ahora";
      if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin !== 1 ? "s" : ""}`;
      if (diffHor < 24) return `Hace ${diffHor} hora${diffHor !== 1 ? "s" : ""}`;
      if (diffDias < 7) return `Hace ${diffDias} día${diffDias !== 1 ? "s" : ""}`;

      return formatearFecha(fechaStr);
    } catch {
      return fechaStr;
    }
  };

  const handleToggleEstado = async () => {
    if (!leida) {
      await onMarcarLeida(id);
    } else {
      await onMarcarNoLeida(id);
    }
    setOpenModal(false);
  };

  return (
    <>
      <ListItem
        sx={{
          width: '100%',
          p: pantallaCompleta ? 2.5 : 2,
          borderRadius: "8px",
          mb: pantallaCompleta ? 1.5 : 0,
          bgcolor: "transparent",
          border: pantallaCompleta ? "1px solid" : "none",
          borderLeft: !leida && !pantallaCompleta ? "3px solid" : "none",
          borderLeftColor: !leida && !pantallaCompleta ? "primary.main" : "transparent",
          borderColor: !leida && pantallaCompleta ? "action.selected" : "divider",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: pantallaCompleta ? "0px 4px 12px rgba(0, 0, 0, 0.04)" : "none",
            bgcolor: !leida && pantallaCompleta ? "action.selected" : "action.hover"
          },
          pr: pantallaCompleta ? 8 : 6,
          position: "relative"
        }}
      >
        <ListItemText
          primary={
            <Box>
              <Typography
                variant="body2"
                fontWeight={!leida ? "600" : "400"}
                color="text.primary"
                sx={{
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  fontSize: pantallaCompleta ? '15px' : '14px',
                  lineHeight: 1.6
                }}
              >
                {mensaje}
              </Typography>
              {mensaje && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    color="primary"
                    onClick={() => setOpenModal(true)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      display: "inline-block",
                      "&:hover": { color: "primary.dark" }
                    }}
                  >
                    Ver más
                  </Typography>
                </Box>
              )}
            </Box>
          }
          secondary={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.8,
                gap: 1,
                width: "100%"
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: pantallaCompleta ? "65%" : "55%",
                  fontSize: "12px"
                }}
                title={`De: ${remitente}`}
              >
                De: <strong>{remitente}</strong>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: "12px"
                }}
                title={formatearFecha(fechaHoraCreacion)}
              >
                {formatearTiempoRelativo(fechaHoraCreacion)}
              </Typography>
            </Box>
          }
        />

        {!leida ? (
          <Tooltip title="Marcar como leída">
            <IconButton
              edge="end"
              size="small"
              onClick={() => onMarcarLeida(id)}
              sx={{
                position: "absolute",
                right: pantallaCompleta ? 20 : 16,
                top: pantallaCompleta ? "22px" : "18px", // Posición vertical fija respecto a la cabecera
                color: "success.main",
                bgcolor: "success.light",
                opacity: 0.85,
                "&:hover": { bgcolor: "success.light", opacity: 1 },
              }}
            >
              <MarkAsUnreadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Marcar como no leída">
            <IconButton
              edge="end"
              size="small"
              onClick={() => onMarcarNoLeida(id)}
              sx={{
                position: "absolute",
                right: pantallaCompleta ? 20 : 16,
                top: pantallaCompleta ? "22px" : "18px", // Posición vertical fija respecto a la cabecera
                color: "text.secondary",
                bgcolor: "action.disabledBackground",
                "&:hover": { bgcolor: "action.focus" },
              }}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </ListItem>

      {/* Modal de Detalle */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: "16px" } }
        }}
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Header: emoji + título + tiempo */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0
              }}
            >
              {titulo.match(/^(\p{Emoji})/u)?.[1] || "📬"}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.3 }}>
                {titulo.replace(/^\p{Emoji}\s*/u, "")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatearTiempoRelativo(fechaHoraCreacion)}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenModal(false)} size="small" sx={{ mt: -0.5, mr: -0.5 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Cuerpo del mensaje */}
          {cuerpo && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                whiteSpace: "pre-line",
                lineHeight: 1.8,
                color: "text.primary",
                fontSize: "15px"
              }}
            >
              {cuerpo}
            </Box>
          )}

          {/* Metadatos */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              p: 2,
              borderRadius: "10px",
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider"
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">De</Typography>
              <Typography variant="body2" fontWeight="600">{remitente}</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {formatearFecha(fechaHoraCreacion)}
              </Typography>
              <Chip
                label={leida ? "Leída" : "Sin leer"}
                color={leida ? "success" : "info"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: "bold", height: 24 }}
              />
            </Box>
          </Box>

          {leida && fechaHoraLeida && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right", mt: -1.5 }}>
              Leído: {formatearFecha(fechaHoraLeida)}
            </Typography>
          )}

          {/* Acciones */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleToggleEstado}
              sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
            >
              {leida ? "Marcar como no leída" : "Marcar como leída"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(false)}
              sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
