import { Usuario } from '../Models/usuario.model.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/auth.js'

export const authController = {

  // GET /auth/login
  loginForm(req, res) {
    if (req.cookies?.token) return res.redirect('/tareas')
    res.render('auth/login', { error: null })
  },

  // POST /auth/login
  async login(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
      return res.render('auth/login', { error: 'Ingresa email y contraseña' })
    }

    const usuario = await Usuario.getByEmail(email)
    if (!usuario) {
      return res.render('auth/login', { error: 'Credenciales incorrectas' })
    }

    const valido = await Usuario.verificarPassword(password, usuario.password)
    if (!valido) {
      return res.render('auth/login', { error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.cookie('token', token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 })
    res.redirect('/tareas')
  },

  // GET /auth/registro
  registroForm(req, res) {
    if (req.cookies?.token) return res.redirect('/tareas')
    res.render('auth/registro', { error: null, datos: {} })
  },

  // POST /auth/registro
  async registro(req, res) {
    const { nombre, email, password, confirmar } = req.body

    if (!nombre || !email || !password) {
      return res.render('auth/registro', { error: 'Todos los campos son obligatorios', datos: req.body })
    }

    if (password !== confirmar) {
      return res.render('auth/registro', { error: 'Las contraseñas no coinciden', datos: req.body })
    }

    if (password.length < 6) {
      return res.render('auth/registro', { error: 'La contraseña debe tener al menos 6 caracteres', datos: req.body })
    }

    const existe = await Usuario.getByEmail(email)
    if (existe) {
      return res.render('auth/registro', { error: 'El correo ya está registrado', datos: req.body })
    }

    await Usuario.create({ nombre, email, password, rol: 'usuario' })
    res.redirect('/auth/login?ok=1')
  },

  // GET /auth/logout
  logout(req, res) {
    res.clearCookie('token')
    res.redirect('/auth/login')
  }
}
