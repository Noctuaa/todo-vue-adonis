import { defineConfig, drivers } from '@adonisjs/core/hash'
//import type { InferHashers } from '@adonisjs/core/types'

const hashConfig = defineConfig({
  default: 'argon2',
  list: {
    argon2: drivers.argon2({
      variant: 'id',
      memory: 65536, 
      iterations: 3,
      parallelism: 4,    
      saltSize: 16,
    }),
  },
})

export default hashConfig

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
/*declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}*/