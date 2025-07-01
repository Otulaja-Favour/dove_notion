<template>
  <div id="app">
    <!-- Toast Component -->
    <div 
      v-if="toast.show" 
      :class="['toast-notification', toast.type]"
      @click="hideToast"
    >
      <div class="toast-content">
        <i :class="toastIcon"></i>
        <span>{{ toast.message }}</span>
        <button class="toast-close" @click.stop="hideToast">×</button>
      </div>
    </div>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['toast']),
    toastIcon() {
      switch (this.toast.type) {
        case 'success': return 'fas fa-check-circle'
        case 'error': return 'fas fa-exclamation-circle'
        case 'warning': return 'fas fa-exclamation-triangle'
        case 'info': return 'fas fa-info-circle'
        default: return 'fas fa-info-circle'
      }
    }
  },
  methods: {
    hideToast() {
      this.$store.commit('hideToast')
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('initAuth')
      if (this.$store.state.user?.fullName) {
        this.$store.commit('showToast', {
          message: `👋 Welcome back, ${this.$store.state.user.fullName}!`,
          type: 'success'
        })
      }
    } catch (error) {
      this.$store.commit('showToast', {
        message: '❌ App initialization failed. Please refresh the page.',
        type: 'error'
      })
    }
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

/* Enhanced Toast Notifications */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  animation: slideInRight 0.4s ease-out;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  min-width: 280px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-notification.success {
  background: linear-gradient(135deg, #10b981, #059669);
  border-left: 4px solid #065f46;
}

.toast-notification.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-left: 4px solid #991b1b;
}

.toast-notification.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-left: 4px solid #92400e;
}

.toast-notification.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-left: 4px solid #1d4ed8;
}

@media (max-width: 768px) {
  .toast-notification {
    top: auto;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
