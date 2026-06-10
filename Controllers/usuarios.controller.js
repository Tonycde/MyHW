import { Usuario } from '../Models/usuario.model.js'

export const usuariosController = {

  // GET /usuarios  (solo admin)
  async index(req, res) {
    const usuarios = await Usuario.getAll()
    res.render('usuarios/index', {
      usuarios,
      usuario: req.usuario,
      mensaje: req.query.mensaje || null
    })
  },

  // DELETE /usuarios/:id
  async delete(req, res) {
    if (req.params.id === req.usuario.id) {
      return res.redirect('/usuarios?mensaje=No puedes eliminar tu propia cuenta')
    }
    await Usuario.delete(req.params.id)
    res.redirect('/usuarios?mensaje=Usuario eliminado')
  }
}
