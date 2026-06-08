const turnosEjemplo = [
    {
        id: 1,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 2,
            nombre: "Ecocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T08:00:00",
        costo: 0,
        estadoCobertura: "TOTALMENTE CUBIERTA"
    },
    {
        id: 2,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 2,
            nombre: "Ecocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T08:45:00",
        costo: 0,
        estadoCobertura: "TOTALMENTE CUBIERTA"
    },
    {
        id: 3,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 1,
            nombre: "Electrocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T09:30:00",
        costo: 0,
        estadoCobertura: "TOTALMENTE CUBIERTA"
    },
    {
        id: 4,
        medico: {
            id: 1,
            nombre: "Dra. María Gómez"
        },
        servicio: {
            id: 1,
            nombre: "Electrocardiograma",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T10:45:00",
        costo: 0,
        estadoCobertura: "TOTALMENTE CUBIERTA"
    },
    {
        id: 5,
        medico: {
            id: 2,
            nombre: "Dra. Valentina Cruz"
        },
        servicio: {
            id: 5,
            nombre: "Neurofisiología",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T08:30:00",
        costo: 18000,
        estadoCobertura: "PARCIALMENTE CUBIERTA"
    },
    {
        id: 6,
        medico: {
            id: 2,
            nombre: "Dra. Valentina Cruz"
        },
        servicio: {
            id: 5,
            nombre: "Neurofisiología",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T09:00:00",
        costo: 18000,
        estadoCobertura: "PARCIALMENTE CUBIERTA"
    },
    {
        id: 7,
        medico: {
            id: 2,
            nombre: "Dra. Valentina Cruz"
        },
        servicio: {
            id: 5,
            nombre: "Neurofisiología",
            tipo: "practica"
        },
        sede: {
            id: 1,
            nombre: "Sede Belgrano"
        },
        fechaHora: "2024-06-04T09:30:00",
        costo: 18000,
        estadoCobertura: "PARCIALMENTE CUBIERTA"
    },
    {
        id: 8,
        medico: {
            id: 3,
            nombre: "Dr. Juan Pérez"
        },
        servicio: {
            id: 2,
            nombre: "Dermatología",
            tipo: "especialidad"
        },
        sede: {
            id: 2,
            nombre: "Sede Vicente López"
        },
        fechaHora: "2024-06-04T14:00:00",
        costo: 25000,
        estadoCobertura: "NO CUBIERTA"
    },
    {
        id: 9,
        medico: {
            id: 3,
            nombre: "Dr. Juan Pérez"
        },
        servicio: {
            id: 2,
            nombre: "Dermatología",
            tipo: "especialidad"
        },
        sede: {
            id: 2,
            nombre: "Sede Vicente López"
        },
        fechaHora: "2024-06-04T14:30:00",
        costo: 25000,
        estadoCobertura: "NO CUBIERTA"
    },
    {
        id: 10,
        medico: {
            id: 3,
            nombre: "Dr. Juan Pérez"
        },
        servicio: {
            id: 2,
            nombre: "Dermatología",
            tipo: "especialidad"
        },
        sede: {
            id: 2,
            nombre: "Sede Vicente López"
        },
        fechaHora: "2024-06-04T16:30:00",
        costo: 25000,
        estadoCobertura: "NO CUBIERTA"
    }
];
const datosPaginacionEjemplo = {
    numeroPagina: 1,
    limitePorPagina: 10,
    totalPaginas: 4,
    totalResultados: 32
};
const proximosTurnos = [

    {
        id: 1,
        doctor: "Dra. Ana López",
        foto: "https://randomuser.me/api/portraits/women/68.jpg",
        especialidad: "Cardiología",
        fecha: "Lunes, 1 de Junio de 2026",
        hora: "10:00 hs",
        sede: "Av. Cabildo 1234, CABA",
        cobertura: "OSDE 210 - Sin cargo",
        estado: "CONFIRMADO",
    },
    {
        id: 2,
        doctor: "Dra. Camila Ibáñez",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
        especialidad: "Dermatología",
        fecha: "Lunes, 15 de Junio de 2026",
        hora: "12:00 hs",
        sede: "Sede Palermo",
        cobertura: "Cobertura parcial · Abonás $4.200",
        estado: "RESERVADO",
    },
    {
        id: 3,
        doctor: "Dra. Ana López",
        foto: "https://randomuser.me/api/portraits/women/68.jpg",
        especialidad: "Cardiología",
        fecha: "Lunes, 1 de Junio de 2026",
        hora: "10:00 hs",
        sede: "Av. Cabildo 1234, CABA",
        cobertura: "OSDE 210 - Sin cargo",
        estado: "CONFIRMADO",
    },
    /*
    {
        id: 4,
        doctor: "Dra. Camila Ibáñez",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
        especialidad: "Dermatología",
        fecha: "Lunes, 15 de Junio de 2026",
        hora: "12:00 hs",
        sede: "Sede Palermo",
        cobertura: "Cobertura parcial · Abonás $4.200",
        estado: "RESERVADO",
    },
    {
        id: 5,
        doctor: "Dra. Ana López",
        foto: "https://randomuser.me/api/portraits/women/68.jpg",
        especialidad: "Cardiología",
        fecha: "Lunes, 1 de Junio de 2026",
        hora: "10:00 hs",
        sede: "Av. Cabildo 1234, CABA",
        cobertura: "OSDE 210 - Sin cargo",
        estado: "CONFIRMADO",
    },
    
{
id: 6,
doctor: "Dra. Camila Ibáñez",
foto: "https://randomuser.me/api/portraits/women/44.jpg",
especialidad: "Dermatología",
fecha: "Lunes, 15 de Junio de 2026",
hora: "12:00 hs",
sede: "Sede Palermo",
cobertura: "Cobertura parcial · Abonás $4.200",
estado: "RESERVADO",
},
{
id: 7,
doctor: "Dra. Camila Ibáñez",
foto: "https://randomuser.me/api/portraits/women/44.jpg",
especialidad: "Dermatología",
fecha: "Lunes, 15 de Junio de 2026",
hora: "12:00 hs",
sede: "Sede Palermo",
cobertura: "Cobertura parcial · Abonás $4.200",
estado: "RESERVADO",
}
*/
];

const historialTurnos = [

    {
        id: 10,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 11,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 12,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 13,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
    {
        id: 14,
        doctor: "Dra. María Fernández",
        foto: "https://randomuser.me/api/portraits/women/48.jpg",
        especialidad: "Pediatría",
        fecha: "15/11/2025",
        hora: "09:30 hs",
        sede: "Sede Centro",
        cobertura: "Turno realizado",
        estado: "REALIZADO",
    },
];

export { turnosEjemplo, datosPaginacionEjemplo, proximosTurnos, historialTurnos };