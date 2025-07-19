/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Import controller (lazy loading)
const AuthController = () => import('#controllers/auth_controller')

// Public routes (no authentication needed)
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth')

// Protected routes (authentication required)
router.group(() => {
  router.post('/logout', [AuthController, 'logout'])
}).prefix('/auth').middleware(middleware.auth())
