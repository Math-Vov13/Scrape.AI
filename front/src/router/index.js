// Import Vue Router and components
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Chat from '../components/Chat.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
  },
  // Add more routes as needed
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
