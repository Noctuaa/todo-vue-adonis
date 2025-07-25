<script setup lang="ts">
   import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
   <div class="auth-container d-flex j-content-center a-items-center w-100">
      <div class="auth-card w-100">
         <div class="auth-header">
            <h1 class="auth-title">Login</h1>
            <p class="auth-subtitle">Connectez-vous à votre compte</p>
         </div>
         <div class="auth-content">
            <LoginForm />
         </div>
         <div class="auth-footer">
            <p class="text-center">
               Pas encore de compte ? 
               <router-link to="/register" class="auth-link">Inscrivez-vous</router-link>
            </p>
         </div>
      </div>
   </div>
</template>

<style>
   .auth-container {
      padding: var(--spacing-5);
      max-width: 450px;
   }
   
   .auth-card {
      background: white;
      padding: 0 ;
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      overflow: hidden;
   }
   
   .auth-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      text-align: center;
      color: white;
   }
   
   .auth-title {
      font-size: 1.8rem!important;
      margin-bottom: 8px!important;
      font-weight: 600!important;
   }
   
   .auth-subtitle {
      opacity: 0.9;
      font-size: 0.9rem;
   }

   .auth-content {
      padding: var(--spacing-8);
   }
   
   .auth-footer{
      padding: 0 var(--spacing-8) var(--spacing-8);
   }

   .auth-footer p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-primary);
   }

   .auth-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      margin-left: 5px;
   }

</style>