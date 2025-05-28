<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Scrape.ia</h1>
      <p class="login-subtitle">Connectez-vous pour continuer</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Email" 
            required 
            class="login-input"
          />
        </div>
        <div class="form-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Mot de passe" 
            required 
            class="login-input"
          />
        </div>
        <button type="submit" class="login-button">
          Se connecter
        </button>
      </form>
      
      <p class="login-footer">
        Pas encore de compte ? 
        <router-link to="/register" class="login-link">Créer un compte</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = () => {
  // Normalement ici vous feriez une requête d'authentification à votre API
  console.log('Login attempt with:', email.value, password.value);
  
  // Pour l'instant, rediriger simplement vers la page de chat
  router.push('/chat');
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-base);
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
}

.login-card {
  width: 380px;
  padding: 40px;
  background-color: var(--bg-panel);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-title {
  color: var(--accent);
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
}

.login-subtitle {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  width: 100%;
}

.login-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(42, 42, 42, 0.7);
  color: var(--text-primary);
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(75, 142, 243, 0.3);
}

.login-input::placeholder {
  color: var(--text-secondary);
}

.login-button {
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4b8ef3, #3875e0);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 142, 243, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.login-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.login-link:hover {
  color: #3f9efc;
  text-decoration: underline;
}
</style>
