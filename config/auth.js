import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_secret_2024'

// Verifica que el usuario esté autenticado (cookie con token)
export function requireAuth(req, res, next) {
  const token = req.cookies?.token
  if (!token) return res.redirect('/auth/login')

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.usuario = decoded
    next()
  } catch {
    res.clearCookie('token')
    return res.redirect('/auth/login')
  }
}

// Solo permite acceso a administradores
export function requireAdmin(req, res, next) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).render('error', {
      mensaje: 'Acceso denegado. Solo administradores.',
      usuario: req.usuario
    })
  }
  next()
}

export { JWT_SECRET }
