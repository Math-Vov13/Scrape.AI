<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">Scrape.ia</h1>
      <div class="auth-forms">
        <button class="tab-btn" @click="mode = 'login'">Login</button>
        <button class="tab-btn" @click="mode = 'register'">Register</button>

        <form
          v-if="mode === 'login'"
          @submit.prevent="handleLogin"
          class="form auth-form"
        >
          <input type="email" v-model="loginEmail" placeholder="Email" required />
          <input type="password" v-model="loginPassword" placeholder="Mot de passe" required />
          <button type="submit">Se connecter</button>
        </form>

        <form
          v-if="mode === 'register'"
          @submit.prevent="handleRegister"
          class="form auth-form"
        >
          <input type="text" v-model="regName" placeholder="Nom" required />
          <input type="email" v-model="regEmail" placeholder="Email" required />
          <input type="password" v-model="regPassword" placeholder="Mot de passe" required />
          <button type="submit">S’inscrire</button>
        </form>
      </div>
    </header>

    <main class="chat-container">
      <Chat />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Chat from './components/Chat.vue';

const mode = ref('login');
const loginEmail = ref('');
const loginPassword = ref('');
const regName = ref('');
const regEmail = ref('');
const regPassword = ref('');

function handleLogin() {
  console.log('Login with', loginEmail.value, loginPassword.value);
}

function handleRegister() {
  console.log('Register with', regName.value, regEmail.value, regPassword.value);
}
</script>

<style>
:root {
  --bg-base: #000000;
  --bg-panel: #1e1e1e;
  --text-primary: #e1e1e1;
  --text-secondary: #a0a0a0;
  --accent: #4b8ef3;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

html, body, #app {
  height: 100%;
  background-color: var(--bg-base);
  color: var(--text-primary);
}

.app-container, #app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  position: relative;
  padding: 16px;
  background-color: var(--bg-panel);
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent);
}

.auth-forms {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: var(--bg-panel);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.tab-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 8px;
}
.tab-btn:hover {
  color: var(--text-primary);
}

.form.auth-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.form.auth-form input {
  background: #2a2a2a;
  border: none;
  padding: 6px 8px;
  color: var(--text-primary);
  border-radius: 4px;
}
.form.auth-form button {
  background: var(--accent);
  color: var(--bg-base);
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
}
.form.auth-form button:hover {
  background: #3f9efc;
}

.chat-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
</style>
