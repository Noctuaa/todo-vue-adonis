import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/auth'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {

   /**
    * Register a new user
    * @param param0 - HttpContext
    * @param param0.request - The HTTP request object
    * @param param0.response - The HTTP response object
    */
  async register({ request, response }: HttpContext) {

   // Validate input data
   const payload = await request.validateUsing(registerValidator);

   // Check if email already exists
   const existingUser = await User.findBy('email', payload.email);
   if (existingUser) {
      return response.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Hash the password
    const hashedPassword = await hash.make(payload.password);

    const user = await User.create({
      email: payload.email,
      password: hashedPassword,
      fullName: payload.fullName,
    })

    return response.json({
      message: 'User registered successfully',
      data: {
         id: user.id, 
         email: user.email,
         fullName: user.fullName 
      }
    })
  }

   /**
    * Login a user
    * @param param0 - HttpContext
    * @param param0.request - The HTTP request object
    * @param param0.response - The HTTP response object
    */
   async login({ request, response }: HttpContext) { 
      // Validate input data
      const payload = await request.validateUsing(registerValidator);
   
      // Find user by email
      const user = await User.findBy('email', payload.email);
      if (!user) {
         return response.status(400).json({
            message: 'Invalid email or password',
            error: 'User not found'
         });
      };

      // Verify password
      const isPasswordValid = await hash.verify(user.password, payload.password);
      if (!isPasswordValid) {
         return response.status(400).json({
            message: 'Invalid email or password',
            error: 'Incorrect password'
         });
      };

      // Generate access token
      const accessToken = await User.accessTokens.create(user);

      return response.json({
         message: 'Login successful',
         data: {
            user: {
               id: user.id,
               email: user.email,
               fullName: user.fullName
            },
            accessToken: accessToken.value!.release(),
         }
      });
   }
}
