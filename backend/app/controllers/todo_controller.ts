import type { HttpContext } from '@adonisjs/core/http'
import { createTodoValidator, updateTodoValidator } from '#validators/todo'
import Todo from '#models/todo'

export default class TodosController {

   /**
    * List all todos for authenticated user
    * @param param0 - HttpContext
    * @param param0.auth - The authentication service
    * @param param0.response - The HTTP response object
    * @returns 
    */
   async index({ auth, response }: HttpContext) {
      const user = auth.getUserOrFail()
      const todos = await Todo.query().where('userId', user.id).orderBy('createdAt', 'desc')

      return response.json({
         message: 'Todos retrieved successfully',
         data: todos
      })
   }
   
   /**
    * Create a new todo
    * @param param0 - HttpContext
    * @param param0.auth - The authentication service
    * @param param0.request - The HTTP request object
    * @param param0.response - The HTTP response object
    * @returns 
    */
   async store({ auth, request, response }: HttpContext) {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(createTodoValidator)
      
      const todo = await Todo.create({
         title: payload.title,
         completed: false,
         userId: user.id
      })
      
      return response.status(201).json({
         message: 'Todo created successfully',
         data: todo
      })
   }

   /**
   * PUT /todos/:id - Update an existing todo
   * 
   * Updates a todo belonging to the authenticated user.
   * Can update title, completed status, or both.
   * 
   * @param {number} params.id - Todo ID to update
   * @param {string} [body.title] - New title (optional, 1-255 chars)
   * @param {boolean} [body.completed] - New completion status (optional)
   * 
   * @returns {object} Updated todo object
   */
   async update({ auth, params, request, response }: HttpContext) {
      const user = auth.getUserOrFail();

      const payload = await request.validateUsing(updateTodoValidator);
      
      const todo = await Todo.query().where('id', params.id).where('user_id', user.id).firstOrFail();

      todo.merge(payload);
      await todo.save();

      return response.status(201).json({
         message: 'Todo updated successfully',
         data: todo
      })
   }

}