<template>
  <div class="dashboard-container">
    <!-- Header Component -->
    <UserHeader :user="user" />
    
    <!-- Main Content -->
    <main class="dashboard-main">
      <div v-if="user.generationsLeft <= 0" class="no-generations-warning">
        <h3>⚠️ No Generations Left</h3>
        <p>You've used all your free generations. Please upgrade your plan to continue.</p>
        <button @click="$router.push('/subscription')" class="upgrade-btn-large">
          Upgrade Now
        </button>
      </div>
      
      <div class="generator-section">
        <!-- Generator Form Component -->
        <GeneratorForm 
          :user="user" 
          @code-generated="handleCodeGenerated"
          @content-type-changed="handleContentTypeChanged"
          @input-data-changed="handleInputDataChanged"
        />
        
        <!-- Code Preview Component -->
        <CodePreview :generated-code="generatedCode" />
      </div>
    </main>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <span>{{ loadingMessage }}</span>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
  <footer />
</template>

<script>
import UserHeader from './UserHeader.vue'
import GeneratorForm from './GeneratorForm.vue'
import CodePreview from './CodePreview.vue'
import footer from '@/components/footer.vue'

export default {
  name: 'Dashboard',
  components: {
    UserHeader,
    GeneratorForm,
    CodePreview,
    footer
  },
  data() {
    return {
      generatedCode: null,
      currentContentType: 'url',
      currentInputData: {
        url: '',
        text: '',
        phone: '',
        email: ''
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    loading() {
      return this.$store.state.loading
    },
    loadingMessage() {
      return this.$store.state.loadingMessage
    },
    toast() {
      return this.$store.state.toast
    }
  },
  methods: {
    handleCodeGenerated(codeUrl) {
      this.generatedCode = codeUrl
    },
    handleContentTypeChanged(contentType) {
      this.currentContentType = contentType
    },
    handleInputDataChanged(inputData) {
      this.currentInputData = { ...inputData }
    }
  },
  async mounted() {
    if (!this.user) {
      this.$router.push('/login')
      return
    }
    
    // Load user's existing codes
    try {
      await this.$store.dispatch('getUserCodes')
    } catch (error) {
      console.error('Failed to load user codes:', error)
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  background: linear-gradient(135deg, #0a1d3c 0%, #1e3a8a 100%);

}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.no-generations-warning {
  background: #fee;
  border: 2px solid #fecaca;
  color: #991b1b;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
}

.upgrade-btn-large {
  background: #ffd700;
  color: #333;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.generator-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .generator-section {
    grid-template-columns: 1fr 1fr;
  }
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
  background: white;
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
  border-top: 3px solid #667eea;
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
  background: white;
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
  border-left: 4px solid #10b981;
  color: #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
  color: #ef4444;
}

@media (max-width: 768px) {
  .dashboard-main {
    padding: 1rem;
  }
  
  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
</style>
