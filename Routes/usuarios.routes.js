import { Router } from 'express'
import { usuariosController } from '../Controllers/usuarios.controller.js'
import { requireAuth, requireAdmin } from '../config/auth.js'

const router = Router()

router.use(requireAuth)
router.use(requireAdmin)

router.get('/', usuariosController.index)
router.delete('/:id', usuariosController.delete)

export default router
