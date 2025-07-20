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
const TodoController = () => import('#controllers/todo_controller')

// Public routes (no authentication needed)
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth')

// Protected routes (authentication required)
router.group(() => {
  router.post('/logout', [AuthController, 'logout'])
}).prefix('/auth').middleware(middleware.auth())

// Protected todo routes
router.group(() => {
  router.get('/todos', [TodoController, 'index'])      // GET /todos
  router.post('/todos', [TodoController, 'store'])     // POST /todos  
  router.put('/todos/:id', [TodoController, 'update']) // PUT /todos/:id
  router.delete('/todos/:id', [TodoController, 'destroy']) // DELETE /todos/:id
}).middleware(middleware.auth())