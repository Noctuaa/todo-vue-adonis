import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import { createHmac } from 'node:crypto'
import env from '#start/env'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {

   /**
   * Generates a secure CSRF token tied to a specific user
   * The token contains user ID + timestamp, signed with the secret key
   * @param userId - The user ID to generate the token for
   * @returns CSRF token in format "userId-timestamp.signature"
   */
   private generateCsrfToken(userId: number): string {
      const timestamp = Math.floor(Date.now() / (1000 * 60 * 30));
      const data = `${userId}-${timestamp}`
      
      const signature = createHmac('sha256', env.get('APP_KEY'))
         .update(data)
         .digest('hex')
      
      return `${data}.${signature}`
   }

   /**
   * Register a new user
   * Validates email uniqueness and creates the account
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

    const user = await User.create({
      email: payload.email,
      password: payload.password,
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
   * Login an existing user
   * Generates an access token and CSRF token for the session
   */
   async login({ request, response }: HttpContext) { 
      // Validate input data
      const payload = await request.validateUsing(loginValidator);
   
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
      const accessTokens = await User.accessTokens.create(user);

      const csrfToken = this.generateCsrfToken(user.id)

      return response.json({
         message: 'Login successful',
         data: {
            user: {
               id: user.id,
               email: user.email,
               fullName: user.fullName
            },
            accessToken: accessTokens.value!.release(),
            csrfToken: csrfToken
         }
      });
   }

   /**
   * Logout the current user
   * Revokes the access token on the server side
   */
   async logout({ auth, response }: HttpContext) {
      const accessTokens = auth.user?.currentAccessToken;
      
      // Revoke the access token
      if (accessTokens) { await User.accessTokens.delete(auth.user, accessTokens.identifier)}

      return response.json({ message: 'Logout successful'})
   }
}
