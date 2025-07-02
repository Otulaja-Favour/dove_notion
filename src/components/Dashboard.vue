<template>
  <div class="dashboard-container">
    <!-- Header Component -->
    <UserHeader v-if="user" :user="user" />
    
    <!-- Main Content -->
    <main class="dashboard-main">
      <div v-if="user && user.generationsLeft <= 0" class="no-generations-warning">
        <h3>⚠️ No Generations Left</h3>
        <p>You've used all your free generations (3/3). Please upgrade your plan to continue generating codes.</p>
        <div class="action-buttons">
          <button @click="goToSubscription" class="upgrade-btn-large">
            <i class="fas fa-crown me-2"></i>
            Upgrade
          </button>
          <button @click="showDeleteModal = true" class="delete-account-btn" title="Delete Account">
            <i class="fas fa-trash-alt"></i> Delete account
          </button>
        </div>
      </div>
      
      <div v-else-if="user && user.generationsLeft <= 1" class="low-generations-warning">
        <h3>⚠️ Limited Generations Remaining</h3>
        <p>You have {{ user.generationsLeft }} generation{{ user.generationsLeft === 1 ? '' : 's' }} left. Consider upgrading soon!</p>
        <div class="action-buttons">
          <button @click="goToSubscription" class="upgrade-btn-small">
            <i class="fas fa-star me-2"></i>
            Upgrade Plan
          </button>
          <button @click="showDeleteModal = true" class="delete-account-btn" title="Delete Account">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
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

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⚠️ Delete Account</h3>
          <button @click="showDeleteModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <div class="warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          
          <p><strong>This action will permanently delete:</strong></p>
          <ul class="delete-list">
            <li>Your account and profile information</li>
            <li>All generated QR codes and barcodes</li>
            <li>Transaction history and payment records</li>
            <li>Subscription data and remaining generations ({{ user.generationsLeft || 0 }})</li>
          </ul>
          
          <div class="confirmation-input">
            <label>Type "DELETE" to confirm:</label>
            <input 
              v-model="deleteConfirmText" 
              type="text" 
              placeholder="Type DELETE"
              class="confirm-input"
              @keyup.enter="deleteAccount"
            >
          </div>
          
          <p class="warning-text">
            <i class="fas fa-exclamation-triangle me-1"></i>
            This action cannot be undone. All your data will be permanently lost.
          </p>
        </div>
        
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="cancel-btn">
            Cancel
          </button>
          <button 
            @click="deleteAccount" 
            :disabled="deleteConfirmText !== 'DELETE' || deleting"
            class="confirm-delete-btn"
          >
            <span v-if="deleting">
              <i class="fas fa-spinner fa-spin me-1"></i>
              Deleting...
            </span>
            <span v-else>
              <i class="fas fa-trash me-1"></i>
              Delete Account
            </span>
          </button>
        </div>
      </div>
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
      },
      showDeleteModal: false,
      deleteConfirmText: '',
      deleting: false
    }
  },
  watch: {
    user(newUser) {
      // If user becomes null (after deletion), redirect immediately
      if (!newUser) {
        this.$router.push('/').catch(() => {})
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
      
      // Show success toast with remaining generations
      const remaining = this.user.generationsLeft
      this.$store.commit('showToast', {
        message: `🎉 Code generated successfully! ${remaining} generation${remaining === 1 ? '' : 's'} remaining.`,
        type: 'success'
      })
      
      // If user has 0 generations left, show upgrade prompt
      if (remaining <= 0) {
        setTimeout(() => {
          this.$store.commit('showToast', {
            message: '💎 You\'ve used all free generations! Upgrade to continue creating codes.',
            type: 'warning',
            duration: 5000
          })
        }, 2000)
      }
    },
    
    handleContentTypeChanged(contentType) {
      this.currentContentType = contentType
    },
    
    handleInputDataChanged(inputData) {
      this.currentInputData = { ...inputData }
    },
    
    goToSubscription() {
      this.$store.commit('showToast', {
        message: '🚀 Redirecting to subscription page...',
        type: 'info'
      })
      this.$router.push('/subscription')
    },

    async deleteAccount() {
      if (this.deleteConfirmText !== 'DELETE') {
        this.$store.commit('showToast', {
          message: 'Please type "DELETE" to confirm account deletion',
          type: 'warning'
        })
        return
      }

      this.deleting = true

      try {
        // Show immediate feedback
        this.$store.commit('showToast', {
          message: '🗑️ Deleting your account...',
          type: 'info'
        })

        // Delete user's codes first
        const codesResponse = await fetch(`${this.$store.getters.apiUrl}/codes?userId=${this.user.id}`)
        if (codesResponse.ok) {
          const codes = await codesResponse.json()
          for (const code of codes) {
            await fetch(`${this.$store.getters.apiUrl}/codes/${code.id}`, {
              method: 'DELETE'
            })
          }
        }

        // Delete user's transactions
        const transactionsResponse = await fetch(`${this.$store.getters.apiUrl}/transactions?userId=${this.user.id}`)
        if (transactionsResponse.ok) {
          const transactions = await transactionsResponse.json()
          for (const transaction of transactions) {
            await fetch(`${this.$store.getters.apiUrl}/transactions/${transaction.id}`, {
              method: 'DELETE'
            })
          }
        }

        // Delete user account
        const userResponse = await fetch(`${this.$store.getters.apiUrl}/users/${this.user.id}`, {
          method: 'DELETE'
        })

        if (!userResponse.ok) {
          throw new Error('Failed to delete account')
        }

        // Close modal immediately and redirect
        this.showDeleteModal = false
        this.deleteConfirmText = ''

        // Clear local storage and store
        localStorage.removeItem('dove_notion_user')
        this.$store.commit('setUser', null)

        // Show success message and redirect immediately
        this.$store.commit('showToast', {
          message: '🗑️ Your account has been permanently deleted.',
          type: 'success'
        })

        // Immediate redirect to prevent component errors
        this.$router.push('/').catch(() => {})

      } catch (error) {
        this.$store.commit('showToast', {
          message: `Failed to delete account: ${error.message}`,
          type: 'error'
        })
      } finally {
        this.deleting = false
      }
    }
  },
  async mounted() {
    if (!this.user) {
      this.$store.commit('showToast', {
        message: '🔐 Please log in to access the dashboard',
        type: 'warning'
      })
      this.$router.push('/login')
      return
    }
    
    // Welcome message with generation count
    this.$store.commit('showToast', {
      message: `👋 Welcome back, ${this.user.fullName}! You have ${this.user.generationsLeft}/3 generations remaining.`,
      type: 'info'
    })
    
    // Load user's existing codes
    try {
      await this.$store.dispatch('getUserCodes')
    } catch (error) {
      this.$store.commit('showToast', {
        message: '❌ Failed to load your codes. Please refresh the page.',
        type: 'error'
      })
    }
  },

  beforeUnmount() {
    // Clean up any pending states
    this.showDeleteModal = false
    this.deleting = false
    this.deleteConfirmText = ''
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

.no-generations-warning {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border: 2px solid #f87171;
  color: #991b1b;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(248, 113, 113, 0.2);
}

.low-generations-warning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #f59e0b;
  color: #92400e;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
}

.upgrade-btn-large {
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  color: #1a202c;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.upgrade-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.upgrade-btn-small {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
}

.upgrade-btn-small:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.delete-account-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.delete-account-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #ef4444;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.delete-list {
  text-align: left;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  list-style-type: none;
}

.delete-list li {
  padding: 0.25rem 0;
  color: #991b1b;
}

.delete-list li:before {
  content: "❌ ";
  margin-right: 0.5rem;
}

.confirmation-input {
  margin: 1.5rem 0;
}

.confirmation-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #374151;
}

.confirm-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  font-weight: bold;
}

.confirm-input:focus {
  outline: none;
  border-color: #ef4444;
}

.warning-text {
  background: #fef2f2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  margin-top: 1rem;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  flex: 1;
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-delete-btn {
  flex: 1;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.confirm-delete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.confirm-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
