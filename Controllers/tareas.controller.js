import { Tarea } from '../Models/tarea.model.js'
import { Usuario } from '../Models/usuario.model.js'

export const tareasController = {

  // GET /tareas  — listado principal (lista o tablero)
  async index(req, res) {
    const { estado, asignado, vista = 'lista' } = req.query
    const usuario = req.usuario

    let tareas
    if (usuario.rol === 'admin') {
      tareas = await Tarea.getAll({ estado, usuarioId: asignado })
    } else {
      tareas = await Tarea.getByUsuario(usuario.id, { estado })
    }

    // Enriquecer con nombre del usuario asignado
    const usuarios = await Usuario.getAll()
    const usuarioMap = {}
    usuarios.forEach(u => { usuarioMap[u._id] = u.nombre })

    tareas = tareas.map(t => ({
      ...t,
      nombreAsignado: t.asignadoA ? usuarioMap[t.asignadoA] || 'Sin usuario' : 'Sin asignar'
    }))

    const stats = usuario.rol === 'admin' ? await Tarea.contarPorEstado() : null

    res.render('tareas/index', {
      tareas,
      usuario,
      filtros: { estado, asignado, vista },
      usuarios: usuario.rol === 'admin' ? usuarios : [],
      stats,
      mensaje: req.query.mensaje || null
    })
  },

  // GET /tareas/nueva
  async nueva(req, res) {
    const usuarios = await Usuario.getAll()
    res.render('tareas/nueva', { usuario: req.usuario, usuarios, error: null, datos: {} })
  },

  // POST /tareas
  async create(req, res) {
    const { titulo, descripcion, estado, prioridad, asignadoA, vencimiento } = req.body

    if (!titulo) {
      const usuarios = await Usuario.getAll()
      return res.status(400).render('tareas/nueva', {
        usuario: req.usuario,
        usuarios,
        error: 'El título es obligatorio',
        datos: req.body
      })
    }

    await Tarea.create({
      titulo,
      descripcion,
      estado: estado || 'pendiente',
      prioridad: prioridad || 'media',
      asignadoA: asignadoA || null,
      vencimiento,
      creadoPor: req.usuario.id
    })

    res.redirect('/tareas?mensaje=Tarea creada correctamente')
  },

  // GET /tareas/:id
  async show(req, res) {
    const tarea = await Tarea.getById(req.params.id)
    if (!tarea) return res.redirect('/tareas')

    // Un usuario solo puede ver sus propias tareas
    if (req.usuario.rol !== 'admin' && tarea.asignadoA !== req.usuario.id) {
      return res.redirect('/tareas')
    }

    const asignado = tarea.asignadoA ? await Usuario.getById(tarea.asignadoA) : null
    const creador = tarea.creadoPor ? await Usuario.getById(tarea.creadoPor) : null

    res.render('tareas/show', {
      tarea,
      asignado,
      creador,
      usuario: req.usuario
    })
  },

  // GET /tareas/:id/editar
  async editar(req, res) {
    const tarea = await Tarea.getById(req.params.id)
    if (!tarea) return res.redirect('/tareas')

    if (req.usuario.rol !== 'admin' && tarea.asignadoA !== req.usuario.id) {
      return res.redirect('/tareas')
    }

    const usuarios = await Usuario.getAll()
    res.render('tareas/editar', {
      tarea,
      usuario: req.usuario,
      usuarios,
      error: null
    })
  },

  // PUT /tareas/:id
  async update(req, res) {
    const { titulo, descripcion, estado, prioridad, asignadoA, vencimiento } = req.body

    if (!titulo) {
      const tarea = await Tarea.getById(req.params.id)
      const usuarios = await Usuario.getAll()
      return res.status(400).render('tareas/editar', {
        tarea: { ...tarea, ...req.body, _id: req.params.id },
        usuario: req.usuario,
        usuarios,
        error: 'El título es obligatorio'
      })
    }

    await Tarea.update(req.params.id, {
      titulo,
      descripcion,
      estado,
      prioridad,
      asignadoA: asignadoA || null,
      vencimiento
    })

    res.redirect(`/tareas/${req.params.id}?mensaje=Tarea actualizada`)
  },

  // DELETE /tareas/:id
  async delete(req, res) {
    await Tarea.delete(req.params.id)
    res.redirect('/tareas?mensaje=Tarea eliminada')
  },

  // PATCH /tareas/:id/estado  — cambio rápido de estado (desde tablero)
  async cambiarEstado(req, res) {
    const { estado } = req.body
    await Tarea.update(req.params.id, { estado })
    res.redirect('/tareas?vista=tablero&mensaje=Estado actualizado')
  }
}
