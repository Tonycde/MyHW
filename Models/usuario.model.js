import { usuariosDB } from '../config/db.js'
import bcrypt from 'bcryptjs'

export const Usuario = {

  async getAll() {
    return usuariosDB.find({}).sort({ creadoEn: -1 })
  },

  async getById(id) {
    return usuariosDB.findOne({ _id: id })
  },

  async getByEmail(email) {
    return usuariosDB.findOne({ email: email.toLowerCase() })
  },

  async create({ nombre, email, password, rol = 'usuario' }) {
    const hash = await bcrypt.hash(password, 10)
    const nuevo = {
      nombre,
      email: email.toLowerCase(),
      password: hash,
      rol,
      creadoEn: new Date()
    }
    return usuariosDB.insert(nuevo)
  },

  async verificarPassword(plain, hash) {
    return bcrypt.compare(plain, hash)
  },

  async delete(id) {
    return usuariosDB.remove({ _id: id }, {})
  }
}
