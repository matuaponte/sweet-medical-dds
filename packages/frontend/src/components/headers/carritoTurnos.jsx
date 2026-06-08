import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, Stack, IconButton, Button, Divider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import './carritoTurnos.css';
import { Message } from '@mui/icons-material';

export default function CarritoTurnos({ items, onEliminar, onConfirmar, onCerrar }) {
  const total = items.reduce((acc, item) => acc + item.costo, 0);
  const navigate = useNavigate();

  return (
    <Box component="aside" sx={{ 
        width: 320,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
        }}>
      {/* Título */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <ShoppingCartIcon sx={{ color: '#475569', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
          Preselección de Turnos
        </Typography>
        <IconButton
          size="small"
          className="carrito-item-eliminar"
          onClick={() => onCerrar()}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Lista de items */}
      <Stack spacing={1.5} sx={{ 
        flex: 1,
        overflowY: 'auto',
        py: 1,
      }}>
        {items.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', mt: 4 }}>
            No hay turnos seleccionados.
          </Typography>
        )}
        {items.map((item, index) => (
          <Box key={index} className="carrito-item">
            <IconButton
              size="small"
              className="carrito-item-eliminar"
              onClick={() => onEliminar(index)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Typography fontWeight={700} fontSize={14}>{item.medico.nombre}</Typography>
            <Typography fontSize={13} sx={{ color: '#2563eb' }}>{item.servicio.nombre}</Typography>
            <Typography fontSize={13} sx={{ color: '#475569' }}>{item.fechaHora}</Typography>
            <Typography fontSize={13} sx={{ color: '#475569' }}>{item.sede.nombre}</Typography>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <span className={`badge-cobertura ${item.estadoCobertura === 'TOTAL' ? 'cubierto' : item.estadoCobertura === 'PARCIAL' ? 'parcial' : 'no-cubierto'}`}>
                {item.estadoCobertura === 'TOTAL' ? 'Cubierto' : item.estadoCobertura === 'PARCIAL' ? 'Parcial' : 'No cubierto'}
              </span>
              <Typography fontWeight={700} fontSize={14}>
                {item.costo === 0 ? 'Sin cargo' : `$${item.costo.toLocaleString()}`}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Footer */}
      <Box className="carrito-footer" position="fixed">
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography fontWeight={600}>Total a pagar:</Typography>
          <Typography fontWeight={700}>${total.toLocaleString()}</Typography>
        </Stack>
        <Button
          fullWidth
          variant="contained"
          disabled={items.length === 0}
          startIcon={<CheckCircleIcon />}
          onClick={() => {
            alert("Turnos reservados exitosamente");
            onCerrar();
            onConfirmar();
            navigate("/mis-turnos");
          }}
          sx={{
            backgroundColor: '#1d4ed8',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#1e40af' },
            '&:disabled': { backgroundColor: '#cbd5e1', color: '#94a3b8' }
          }}
        >
          Confirmar Turnos
        </Button>
      </Box>
    </Box>
  );
}