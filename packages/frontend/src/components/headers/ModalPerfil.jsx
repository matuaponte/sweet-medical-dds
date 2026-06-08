import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Collapse,
  Link,
  Divider,
} from "@mui/material";

export default function ModalPerfil({ open, onClose, userData }) {
  const [showPassword, setShowPassword] = useState(false);

  const user = userData || {
    nombre: "Nombre",
    dni: "45.313.226",
    obraSocial: "Nombre Obra Social",
    plan: "Plan 210",
    username: "nombre_usuario",
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        // Mantenemos este color si es exclusivo del fondo del modal,
        // o podrías pasarlo a theme.palette.background.paper en el futuro.
        sx: { bgcolor: "#fcfaf5", borderRadius: 2 },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* SECCIÓN 1: Avatar, Nombre y DNI */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              fontSize: "2.5rem",
              bgcolor: "primary.main", // ✅ Ahora usa el color primario de tu Theme
            }}
          >
            {user.nombre[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              "{user.nombre}"
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              dni: {user.dni}
            </Typography>
          </Box>
        </Box>

        {/* SECCIÓN 2: Obra Social y Usuario (2 columnas) */}
        <Grid container spacing={4} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Obra social
              </Typography>
              <Link
                href="#"
                underline="none"
                color="primary" // ✅ Usa el color primario automáticamente
                sx={{ fontSize: "0.875rem" }}
              >
                editar
              </Link>
            </Box>
            <Typography variant="body1">
              "{user.obraSocial} | {user.plan}"
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Usuario
              </Typography>
              <Link
                href="#"
                underline="none"
                color="primary" // ✅ Usa el color primario automáticamente
                sx={{ fontSize: "0.875rem" }}
              >
                editar
              </Link>
            </Box>
            <Typography variant="body1">"{user.username}"</Typography>
          </Grid>
        </Grid>

        {/* ✅ Usa el color primario para el divisor */}
        <Divider sx={{ borderColor: "primary.main", borderWidth: 1, my: 2 }} />

        {/* SECCIÓN 3: Cambiar Contraseña */}
        <Box sx={{ mb: 1 }}>
          <Link
            component="button"
            variant="subtitle1"
            onClick={handleTogglePassword}
            underline="none"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
            }}
          >
            {showPassword ? "- ocultar contraseña" : "+ cambiar contraseña"}
          </Link>
        </Box>

        <Collapse in={showPassword}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                Anterior
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                variant="outlined"
                // El fondo de los inputs lo dejamos harcodeado por ahora
                // a menos que quieras agregarlo como "primary.light" en tu theme
                sx={{ bgcolor: "#e6ebff", "& fieldset": { border: "none" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  Nueva contraseña
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  variant="outlined"
                  sx={{ bgcolor: "#e6ebff", "& fieldset": { border: "none" } }}
                />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  Confirmar contraseña
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  variant="outlined"
                  sx={{ bgcolor: "#e6ebff", "& fieldset": { border: "none" } }}
                />
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            console.log("Guardar datos...");
            onClose();
          }}
          variant="contained"
          color="primary" // ✅ Se reemplaza el sx largo por la prop nativa color="primary"
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
