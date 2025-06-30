<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Create Account,</h1>
      <p class="auth-subtitle">Sign up to get started!</p>
      
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label class="form-label">Full Name: <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              v-model="formData.fullName"
              type="text" 
              class="form-input"
              :class="{ error: errors.fullName, valid: isFieldValid('fullName') }"
              placeholder=""
              @blur="validateField('fullName')"
              required
            >
          </div>
          <div v-if="errors.fullName" class="error-message">{{ errors.fullName }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Email: <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input 
              v-model="formData.email"
              type="email" 
              class="form-input"
              :class="{ error: errors.email, valid: isFieldValid('email') }"
              placeholder=""
              @blur="validateField('email')"
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
              v-model="formData.password"
              type="password" 
              class="form-input"
              :class="{ error: errors.password, valid: isFieldValid('password') }"
              placeholder=""
              @blur="validateField('password')"
              required
            >
          </div>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          <div v-if="formData.password" class="password-strength" :class="passwordStrength">
            Password Strength: {{ passwordStrength }}
          </div>
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading || !isFormValid">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="auth-link">
        Already a member? <a href="#" @click.prevent="$router.push('/login')">Login In</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        password: ''
      },
      errors: {},
      loading: false,
      validations: {
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{5,}$/
      }
    }
  },
  computed: {
    isFormValid() {
      return this.formData.fullName &&
             this.formData.email &&
             this.formData.password &&
             Object.keys(this.errors).length === 0
    },
    passwordStrength() {
      const password = this.formData.password
      if (!password) return ''
      if (password.length < 5) return 'weak'
      if (password.length < 8) return 'medium'
      if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
        return 'strong'
      }
      return 'medium'
    }
  },
  methods: {
    validateField(field) {
      const value = this.formData[field]
      delete this.errors[field]
      
      switch (field) {
        case 'fullName':
          if (!value.trim()) {
            this.errors.fullName = 'Full name is required'
          } else if (value.trim().length < 2) {
            this.errors.fullName = 'Full name must be at least 2 characters'
          }
          break
        case 'email':
          if (!value) {
            this.errors.email = 'Email is required'
          } else if (!this.validations.email.test(value)) {
            this.errors.email = 'Please enter a valid email address'
          }
          break
        case 'password':
          if (!value) {
            this.errors.password = 'Password is required'
          } else if (value.length < 5) {
            this.errors.password = 'Password must be at least 5 characters'
          } else if (!this.validations.password.test(value)) {
            this.errors.password = 'Password must contain uppercase, lowercase, number and special character'
          }
          break
      }
    },
    isFieldValid(field) {
      return this.formData[field] && !this.errors[field]
    },
    async handleSignup() {
      try {
        this.loading = true
        this.errors = {}
        
        // Validate all fields first
        Object.keys(this.formData).forEach(this.validateField)
        
        if (Object.keys(this.errors).length > 0) {
          this.$store.commit('showToast', {
            message: 'Please fix the form errors before submitting.',
            type: 'error'
          })
          return
        }

        // Use the store action for signup
        const result = await this.$store.dispatch('signup', this.formData)
        
        if (result.success) {
          // Clear the form
          this.formData = {
            fullName: '',
            email: '',
            password: ''
          }
          
          // Redirect to login page
          this.$router.push('/login')
        } else {
          // Handle specific errors
          if (result.error === 'Email already registered') {
            this.errors.email = result.error
          } else {
            this.$store.commit('showToast', {
              message: result.error || 'Registration failed. Please try again.',
              type: 'error'
            })
          }
        }
      } catch (error) {
        this.$store.commit('showToast', {
          message: 'An unexpected error occurred. Please try again.',
          type: 'error'
        })
        console.error('Signup error:', error)
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
  animation: shake 0.5s;
}

.form-input.valid {
  border-color: #48bb78;
  background-color: #f0fff4;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-strength {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: right;
  font-weight: 600;
}

.password-strength.weak {
  color: #e53e3e;
}

.password-strength.medium {
  color: #ed8936;
}

.password-strength.strong {
  color: #48bb78;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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
  transition: color 0.2s;
}

.auth-link a:hover {
  color: #5a67d8;
  text-decoration: underline;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Responsive Design */
@media (max-width: 480px) {
  .auth-container {
    padding: 0.5rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
}
</style>
