import { Router } from 'express'
import { tareasController } from '../Controllers/tareas.controller.js'
import { requireAuth } from '../config/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', tareasController.index)
router.get('/nueva', tareasController.nueva)
router.get('/:id', tareasController.show)
router.get('/:id/editar', tareasController.editar)

router.post('/', tareasController.create)
router.put('/:id', tareasController.update)
router.delete('/:id', tareasController.delete)
router.post('/:id/estado', tareasController.cambiarEstado)

export default router
