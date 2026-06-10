import { tareasDB } from '../config/db.js'

export const Tarea = {

  async getAll(filtros = {}) {
    const query = {}
    if (filtros.estado) query.estado = filtros.estado
    if (filtros.usuarioId) query.asignadoA = filtros.usuarioId
    return tareasDB.find(query).sort({ creadoEn: -1 })
  },

  // Tareas visibles para un usuario normal (las suyas o sin asignar)
  async getByUsuario(usuarioId, filtros = {}) {
    const query = { asignadoA: usuarioId }
    if (filtros.estado) query.estado = filtros.estado
    return tareasDB.find(query).sort({ creadoEn: -1 })
  },

  async getById(id) {
    return tareasDB.findOne({ _id: id })
  },

  async create({ titulo, descripcion, estado = 'pendiente', prioridad = 'media', asignadoA, vencimiento, creadoPor }) {
    const nueva = {
      titulo,
      descripcion: descripcion || '',
      estado,       // pendiente | en_progreso | completada
      prioridad,    // baja | media | alta
      asignadoA: asignadoA || null,
      vencimiento: vencimiento ? new Date(vencimiento) : null,
      creadoPor,
      creadoEn: new Date(),
      actualizadoEn: new Date()
    }
    return tareasDB.insert(nueva)
  },

  async update(id, data) {
    const cambios = { ...data, actualizadoEn: new Date() }
    if (data.vencimiento) cambios.vencimiento = new Date(data.vencimiento)
    const n = await tareasDB.update({ _id: id }, { $set: cambios }, {})
    if (!n) return null
    return tareasDB.findOne({ _id: id })
  },

  async delete(id) {
    return tareasDB.remove({ _id: id }, {})
  },

  // Estadísticas rápidas para el dashboard
  async contarPorEstado() {
    const todas = await tareasDB.find({})
    return {
      pendiente: todas.filter(t => t.estado === 'pendiente').length,
      en_progreso: todas.filter(t => t.estado === 'en_progreso').length,
      completada: todas.filter(t => t.estado === 'completada').length,
      total: todas.length
    }
  }
}
