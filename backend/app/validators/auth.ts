import vine from '@vinejs/vine'

/**
 * Validator for user regstration
 */
export const registerValidator = vine.compile(
   vine.object({
      email: vine.string().email(),
      password: vine.string().minLength(6),
      fullName: vine.string().minLength(2),
   })
);

/**
 * Validator for user login
 */
export const loginValidator = vine.compile(
   vine.object({
      email: vine.string().email(),
      password: vine.string().minLength(6),
   })
);