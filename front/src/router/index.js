// Import Vue Router and components
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: App,
  },
  // Add more routes as needed
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
