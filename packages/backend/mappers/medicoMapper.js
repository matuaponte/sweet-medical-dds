import { Medico } from "../domain/medico.js";
import { UsuarioMapper } from "./usuarioMapper.js";
import { DisponibilidadMapper } from "./disponibilidadMapper.js";
import { SedeMapper } from "./sedeMapper.js";
import { ServicioMapper } from "./servicioMapper.js";

export class MedicoMapper {
  static toDomain(medicoDoc) {
    const medico = new Medico({
      nombre: medicoDoc.nombre,
      matricula: medicoDoc.matricula,
      usuario: UsuarioMapper.toDomain(medicoDoc.idUsuario)
    });

    medico.id = medicoDoc._id?.toString() ?? medicoDoc.id;
    medico.disponibilidades = (medicoDoc.disponibilidades ?? []).map(DisponibilidadMapper.toDomain);
    medico.especialidades = (medicoDoc.especialidades ?? []).map((e) => ServicioMapper.toDomain(e)); //usa metodos privados asi que hay que envolverlos, sin usarlos como referencia directa
    medico.practicas = (medicoDoc.practicas ?? []).map((p) => ServicioMapper.toDomain(p));
    medico.sedes = (medicoDoc.sedes ?? []).map(SedeMapper.toDomain);
    medico.honorario = medicoDoc.honorario;

    return medico;
  }

  static toDomainSimple(medicoDoc) {
    if (!medicoDoc) return null;
    const medico = new Medico({
      usuario: medicoDoc.usuario,
      matricula: medicoDoc.matricula,
      nombre: medicoDoc.nombre,
      honorario: medicoDoc.honorario
    });
    medico.id = medicoDoc._id?.toString() ?? medicoDoc.id;
    return medico;
  }

  static toPersistence(medico) {
    return {
      nombre: medico.nombre,
      matricula: medico.matricula,
      idUsuario: medico.usuario.id,
      disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toPersistence),
      especialidades: medico.especialidades.map(e => e.id),
      practicas: medico.practicas.map(p => p.id),
      sedes: medico.sedes.map(s => s.id),
      honorario: medico.honorario
    };
  }

  static toDTO(medico) {
    if (medico instanceof Medico) {
      return {
        id: medico.id,
        nombre: medico.nombre,
        matricula: medico.matricula,
        usuario: UsuarioMapper.toDTO(medico.usuario),
        especialidades: medico.especialidades.map(ServicioMapper.toDTO),
        practicas: medico.practicas.map(ServicioMapper.toDTO),
        disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toDTO),
        sedes: medico.sedes.map(SedeMapper.toDTO),
        honorario: medico.honorario
      };
    } else {
      return {
        id: medico._id,
        nombre: medico.nombre,
        matricula: medico.matricula,
        usuario: UsuarioMapper.toDTO(medico.idUsuario),
        especialidades: medico.especialidades.map(ServicioMapper.toDTO),
        practicas: medico.practicas.map(ServicioMapper.toDTO),
        disponibilidades: medico.disponibilidades.map(DisponibilidadMapper.toDTO),
        sedes: medico.sedes.map(SedeMapper.toDTO),
        honorario: medico.honorario
      };
    }

  }
}