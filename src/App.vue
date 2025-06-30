<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    
    onMounted(() => {
      store.dispatch('initAuth')
    })

    return {}
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

:root {
  --primary-color: #0a1d3c;
  --secondary-color: #ffd700;
  --text-color: #333;
  --bg-color: #f5f5f5;
  --white: #ffffff;
  --error: #ef4444;
  --success: #10b981;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--white);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.success {
  border-left: 4px solid var(--success);
  color: var(--success);
}

.toast.error {
  border-left: 4px solid var(--error);
  color: var(--error);
}

@media (max-width: 768px) {
  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
</style>
