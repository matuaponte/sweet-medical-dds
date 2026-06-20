const medicosEjemplo = [
    { id: 1, nombre: "Dra. María Gómez" },
    { id: 2, nombre: "Dra. Valentina Cruz" },
    { id: 3, nombre: "Dr. Juan Perez" }
];
const especialidadesEjemplo = [
    { id: 1, nombre: "Cardiología" },
    { id: 2, nombre: "Dermatología" },
    { id: 3, nombre: "Neurología" }
];
const practicasEjemplo = [
    { id: 1, nombre: "Electrocardiograma", especialidadPadreId: 1 },
    { id: 2, nombre: "Ecocardiograma", especialidadPadreId: 1 },
    { id: 3, nombre: "Biopsia endomiocárdica", especialidadPadreId: 2 },
    { id: 4, nombre: "Valvuloplastia percutánea", especialidadPadreId: 2 },
    { id: 5, nombre: "Neurofisiología", especialidadPadreId: 3 }
];
const sedesEjemplo = [
    { id: 1, nombre: "Sede Belgrano" },
    { id: 2, nombre: "Sede Vicente López" }
];

export { medicosEjemplo, especialidadesEjemplo, practicasEjemplo, sedesEjemplo };