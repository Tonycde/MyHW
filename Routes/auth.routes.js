import { Router } from 'express'
import { authController } from '../Controllers/auth.controller.js'

const router = Router()

router.get('/login', authController.loginForm)
router.post('/login', authController.login)
router.get('/registro', authController.registroForm)
router.post('/registro', authController.registro)
router.get('/logout', authController.logout)

export default router
