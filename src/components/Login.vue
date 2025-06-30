<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Welcome,</h1>
      <p class="auth-subtitle">Sign in to continue!</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email: <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input 
              v-model="email"
              type="email" 
              class="form-input"
              :class="{ error: errors.email }"
              placeholder=""
              required
            >
          </div>
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Password: <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              v-model="password"
              type="password" 
              class="form-input"
              :class="{ error: errors.password }"
              placeholder=""
              required
            >
          </div>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          <div class="forgot-password">
            <a href="#" @click.prevent>Forgot Password?</a>
          </div>
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
      
      <div class="auth-link">
        I'm a new user? <a href="#" @click.prevent="$router.push('/signup')">Sign Up</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async handleLogin() {
      this.errors = {}
      this.loading = true
      
      try {
        if (!this.email || !this.password) {
          if (!this.email) this.errors.email = 'Email is required'
          if (!this.password) this.errors.password = 'Password is required'
          return
        }

        const result = await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })

        if (result?.success) {
          this.$router.push('/dashboard')
        } else {
          this.errors.general = result?.error || 'Login failed'
          this.$store.commit('showToast', { 
            message: result?.error || 'Login failed', 
            type: 'error' 
          })
        }
      } catch (error) {
        this.errors.general = 'An error occurred during login'
        this.$store.commit('showToast', { 
          message: 'Login failed. Please try again.', 
          type: 'error' 
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
    background: linear-gradient(135deg, #0a1d3c 0%, #1e3a8a 100%);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.required {
  color: #e53e3e;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.forgot-password {
  text-align: right;
  margin-top: 0.5rem;
}

.forgot-password a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
    background: linear-gradient(135deg, #0a1d3c 0%, #1e3a8a 100%);

  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}
</style>
