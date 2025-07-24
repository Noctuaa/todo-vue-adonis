import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { createHmac } from 'node:crypto'
import env from '#start/env'


export default class CsrfMiddleware {
	private protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

	/**
   * Verifies the validity of a CSRF token
   * 
   * @param token - CSRF token in format "userId-timestamp.signature"
   * @param ctx - HTTP context containing the connected user
   * @returns true if token is valid, false otherwise
   */
	private verifyCsrfToken(token: string, ctx: HttpContext) {
		try {
			const [data, receivedSignature] = token.split('.')
      
			if (!data || !receivedSignature) {
				return false
			}
			
			const [tokenUserId] = data.split('-')
			
			// The token must belong to the currently authenticated user
			const currentUserId = ctx.auth.user?.id?.toString() || 'anonymous'
			
			if (tokenUserId !== currentUserId) {
			console.log(`🚨 CSRF mismatch: token=${tokenUserId}, user=${currentUserId}`)
			return false
			}
			
			// Recalculate expected signature with secret key
			const expectedSignature = createHmac('sha256', env.get('APP_KEY'))
			.update(data)
			.digest('hex')
			
			// Secure signature comparison
			return receivedSignature === expectedSignature
		} catch (error) {
			console.log('CSRF token parsing error:', error)
      	return false
		}
	}

	/**
   * Main middleware handler
   * Checks CSRF token for protected HTTP methods
   */
  	async handle(ctx: HttpContext, next: NextFn) {

		const method = ctx.request.method()

		if(this.protectedMethods.includes(method)){
			const csrfToken = ctx.request.header('X-CSRF-Token');

			// Validation: token present AND valid
			if(!csrfToken || !this.verifyCsrfToken(csrfToken, ctx) ){
				return ctx.response.status(403).json({
					message: 'CSRF token is invalid',
					error: 'The provided CSRF token is not valid or expired'
				})
			}
		}

   //Call next method in the pipeline and return its output  
    const output = await next()
    return output
  }
}