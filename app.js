import express from 'express'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import authRoutes from './Routes/auth.routes.js'
import tareasRoutes from './Routes/tareas.routes.js'
import usuariosRoutes from './Routes/usuarios.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// ── Motor de vistas ────────────────────────────────
app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))

// ── Archivos estáticos ─────────────────────────────
app.use(express.static(join(__dirname, 'public')))

// ── Middlewares ────────────────────────────────────
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// ── Method Override (PUT/DELETE desde formularios HTML) ──
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method
  }
  return req.query._method
}))

// ── Rutas ──────────────────────────────────────────
app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)
app.use('/usuarios', usuariosRoutes)

// ── Ruta raíz → redirige al listado de tareas ─────
app.get('/', (req, res) => res.redirect('/tareas'))

// ── Error 404 ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', {
    mensaje: 'Página no encontrada',
    usuario: null
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`TaskFlow corriendo en http://localhost:${PORT}`)
  console.log('Ctrl+C para detener')
})
