<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// No imports needed here as components are loaded via router
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
  overflow: hidden; /* Empêcher le scrolling du body */
}

.app-container, #app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  background-color: var(--bg-panel);
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  z-index: 10;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent);
}

.chat-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 0;
  height: calc(100vh - 60px);
  overflow: hidden;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
