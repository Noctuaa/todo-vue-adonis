import vine from '@vinejs/vine'

/**
 * Validator for creating a new Todo 
 */
export const createTodoValidator = vine.compile(
   vine.object({
      title: vine.string().minLength(1).maxLength(255).trim(),
   })
)

/**
 * Validator for updating an existing Todo
 */
export const updateTodoValidator = vine.compile(
   vine.object({
      title: vine.string().minLength(1).maxLength(255).trim().optional(),
      completed: vine.boolean().optional(),
   })
)
