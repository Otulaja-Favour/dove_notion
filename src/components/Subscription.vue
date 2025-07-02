<template>
  <div class="subscription-container">
    <!-- Header -->
    <UserHeader :user="user" />
    
    <!-- Main Content -->
    <main class="subscription-main">
      <div class="subscription-content">
        <router-link to="/dashboard">Go Back</router-link>
        <!-- Header Section -->
        <div class="header-section">
          <div class="header-icon">💎</div>
          <h1>Choose Your Plan</h1>
          <p>Upgrade your account to generate more QR codes and barcodes</p>        <div class="current-status" v-if="user">
          <span class="status-label">Current Plan:</span>
          <span class="status-value">{{ user.subscription || 'Free' }}</span>
          <span class="generations-left">{{ user.generationsLeft || 0 }} generations remaining</span>
        </div>
        </div>


        <!-- Plans Grid -->
        <div class="plans-grid">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            :class="['plan-card', { 
              popular: plan.popular, 
              current: isCurrentPlan(plan),
              recommended: plan.recommended 
            }]"
          >
            <!-- Plan Badge -->
            <div v-if="plan.popular" class="plan-badge popular">MOST POPULAR</div>
            <div v-else-if="plan.recommended" class="plan-badge recommended">RECOMMENDED</div>
            <div v-else-if="isCurrentPlan(plan)" class="plan-badge current">CURRENT PLAN</div>
            
            <!-- Plan Header -->
            <div class="plan-header">
              <div class="plan-icon">{{ plan.icon }}</div>
              <h3 class="plan-name">{{ plan.name }}</h3>
              <div class="plan-price">
                <span class="currency">₦</span>
                <span class="amount">{{ plan.price.toLocaleString() }}</span>
                <span class="period" v-if="plan.price > 0">/one-time</span>
              </div>
              <div class="plan-subtitle">{{ plan.subtitle }}</div>
            </div>

            <!-- Plan Features -->
            <div class="plan-features">
              <div class="feature-item primary">
                <span class="feature-icon">⚡</span>
                <span class="feature-text">{{ plan.generations }} Code Generations</span>
              </div>
              
              <div class="feature-item" v-for="feature in plan.features" :key="feature">
                <span class="feature-icon">✅</span>
                <span class="feature-text">{{ feature }}</span>
              </div>
              
             
            </div>

            <!-- Plan Action -->
            <div class="plan-action">
              <button 
                @click="subscribeToPlan(plan)" 
                :class="['subscribe-btn', { 
                  popular: plan.popular,
                  current: isCurrentPlan(plan) && !canRenewPlan(plan),
                  renewal: isCurrentPlan(plan) && canRenewPlan(plan),
                  free: plan.price === 0
                }]"
                :disabled="loading || !user"
              >
                <span v-if="!user">Please Login First</span>
                <span v-else-if="isCurrentPlan(plan) && canRenewPlan(plan)">
                  <i class="fas fa-sync-alt me-1"></i>
                  {{ loading ? 'Processing...' : `Renew Plan for ₦${plan.price.toLocaleString()}` }}
                </span>
                <span v-else-if="isCurrentPlan(plan) && !canRenewPlan(plan)">
                  <i class="fas fa-check me-1"></i>
                  Current Plan - No Renewal Needed
                </span>
                <span v-else-if="plan.price === 0">Get Started Free</span>
                <span v-else>
                  {{ loading ? 'Processing...' : `Upgrade for ₦${plan.price.toLocaleString()}` }}
                </span>
              </button>
              
              <!-- Renewal Info for Current Plan -->
              <div v-if="isCurrentPlan(plan)" class="renewal-info">
                <div v-if="canRenewPlan(plan)" class="renewal-needed">
                  <i class="fas fa-info-circle me-1"></i>
                  You have {{ user.generationsLeft || 0 }} generations left. 
                  Renew to add {{ plan.generations }} more!
                </div>
                <div v-else class="renewal-not-needed">
                  <i class="fas fa-check-circle me-1"></i>
                  You have plenty of generations remaining ({{ user.generationsLeft || 0 }})
                </div>
              </div>
              
              <div class="plan-note" v-if="plan.note">
                {{ plan.note }}
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="benefits-section">
          <h4>🌟 Why Choose Dove Notion?</h4>
          <div class="benefits-grid">
            <div class="benefit-item">
              <div class="benefit-icon">🎯</div>
              <div class="benefit-content">
                <h5>High Quality Codes</h5>
                <p>Generate crisp, scannable QR codes and barcodes</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">⚡</div>
              <div class="benefit-content">
                <h5>Instant Generation</h5>
                <p>Create codes instantly with our fast generator</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">📱</div>
              <div class="benefit-content">
                <h5>Multiple Formats</h5>
                <p>Support for URLs, text, email, and phone numbers</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">💾</div>
              <div class="benefit-content">
                <h5>Download & Save</h5>
                <p>Download codes in high-quality PNG format</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">📋</div>
              <div class="benefit-content">
                <h5>History Tracking</h5>
                <p>Keep track of all your generated codes</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">🔒</div>
              <div class="benefit-content">
                <h5>Secure & Private</h5>
                <p>Your data is safe and secure with us</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="faq-section">
          <h4>❓ Frequently Asked Questions</h4>
          <div class="faq-grid">
            <div class="faq-item">
              <h5>How do generations work?</h5>
              <p>Each time you generate a QR code or barcode, it uses one generation. Generations don't expire.</p>
            </div>
            <div class="faq-item">
              <h5>Can I upgrade my plan later?</h5>
              <p>Yes! You can upgrade at any time and your remaining generations will be preserved.</p>
            </div>
            <div class="faq-item">
              <h5>What payment methods do you accept?</h5>
              <p>We accept all major Nigerian payment methods through Paystack including cards, bank transfers, and USSD.</p>
            </div>
            <div class="faq-item">
              <h5>Is there a refund policy?</h5>
              <p>Due to the digital nature of our service, all sales are final. However, we're here to help if you have any issues.</p>
            </div>
          </div>
        </div>
      </div>
      <footer /> 
    </main>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <span>Processing your payment...</span>
      </div>
    </div>
  </div>
</template>

<script>
import UserHeader from './UserHeader.vue'
import footer from './footer.vue'

export default {
  name: 'Subscription',
  components: {
    UserHeader, 
    footer
  },
  data() {
    return {
      loading: false,
      plans: [
        // 
        { 
          id: 'basic',
          name: 'Basic', 
          price: 500, 
          generations: 6, 
          icon: '🚀',
          subtitle: 'For light usage',
          popular: false,
          recommended: true,
          features: [
            'All Free features',
            'Higher quality output',
            'Priority support',
            'Code history tracking'
          ],
         
          note: 'Most popular for individuals'
        },
        { 
          id: 'standard',
          name: 'Standard', 
          price: 1000, 
          generations: 12, 
          icon: '⭐',
          subtitle: 'For regular users',
          popular: true,
          recommended: false,
          features: [
             'All Free features',
            'Higher quality output',
            'Priority support',
            'Code history tracking'
          ],
        
          note: 'Best value for money'
        },
        { 
          id: 'premium',
          name: 'Premium', 
          price: 2000, 
          generations: 25, 
          icon: '💎',
          subtitle: 'For power users',
          popular: false,
          recommended: false,
          features: [
             'All Free features',
            'Higher quality output',
            'Priority support',
            'Code history tracking'
          ],
          
          note: 'Perfect for businesses'
        }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user || null
    }
  },
  methods: {
    isCurrentPlan(plan) {
      if (!this.user) return false
      const userPlan = this.user.subscription || 'free'
      return userPlan.toLowerCase() === plan.id.toLowerCase()
    },
    
    canRenewPlan(plan) {
      if (!this.user || !this.isCurrentPlan(plan)) return false
      
      // Allow renewal if user has low generations (less than 25% of plan's generations)
      const renewalThreshold = Math.floor(plan.generations * 0.25)
      const currentGenerations = this.user.generationsLeft || 0
      
      return currentGenerations <= renewalThreshold
    },
    
    async subscribeToPlan(plan) {
      if (!this.user) {
        this.$store.commit('showToast', {
          message: 'Please login to subscribe',
          type: 'error'
        })
        this.$router.push('/login')
        return
      }

      // Check if this is a renewal of current plan
      const isRenewal = this.isCurrentPlan(plan) && this.canRenewPlan(plan)
      
      // Handle free plan
      if (plan.price === 0) {
        try {
          await this.updateUserPlan(plan, 'free_upgrade')
          this.$store.commit('showToast', { 
            message: 'Welcome to Dove Notion! You now have 3 free generations.', 
            type: 'success' 
          })
          this.$router.push('/dashboard')
        } catch (error) {
          this.$store.commit('showToast', {
            message: 'Failed to activate free plan. Please try again.',
            type: 'error'
          })
        }
        return
      }

      // Handle paid plans (both new subscriptions and renewals)
      this.loading = true
      
      try {
        const reference = `dove_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Check if Paystack is loaded
        if (typeof window.PaystackPop === 'undefined') {
          throw new Error('Payment system not loaded. Please refresh the page.')
        }

        // Store reference to this component for callbacks
        const self = this

        const handler = window.PaystackPop.setup({
          key: 'pk_test_e8011d0aec4bd45296062e3d5675cb7fcb9be5cd',
          email: this.user.email,
          amount: plan.price * 100, // Convert to kobo
          currency: 'NGN',
          ref: reference,
          metadata: {
            userId: this.user.id,
            planId: plan.id,
            planName: plan.name,
            generations: plan.generations,
            userEmail: this.user.email,
            userName: this.user.fullName,
            isRenewal: isRenewal
          },
          callback: function(response) {
            self.handlePaymentSuccess(response, plan, isRenewal)
          },
          onClose: function() {
            self.handlePaymentClose()
          }
        })

        handler.openIframe()

      } catch (error) {
        console.error('Payment error:', error)
        this.$store.commit('showToast', { 
          message: error.message || 'Payment initialization failed. Please try again.', 
          type: 'error' 
        })
        this.loading = false
      }
    },

    async handlePaymentSuccess(response, plan, isRenewal = false) {
      try {
        await this.updateUserPlan(plan, response.reference, isRenewal)
        
        const updatedGenerations = (this.user?.generationsLeft || 0) + plan.generations
        
        const messageType = isRenewal ? 'renewed' : 'upgraded'
        const actionText = isRenewal ? 'Plan renewed' : 'Payment successful'
        
        this.$store.commit('showToast', { 
          message: `${actionText}! You now have ${updatedGenerations} generations.`, 
          type: 'success' 
        })
        
        this.$router.push('/dashboard')
      } catch (error) {
        this.$store.commit('showToast', {
          message: 'Payment successful but failed to update account. Please contact support.',
          type: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    handlePaymentClose() {
      this.loading = false
      this.$store.commit('showToast', {
        message: 'Payment cancelled',
        type: 'info'
      })
    },

    async updateUserPlan(plan, reference, isRenewal = false) {
      if (!this.user || !this.user.id) {
        throw new Error('User data not available')
      }
      
      const currentGenerations = this.user.generationsLeft || 0
      const newGenerations = currentGenerations + plan.generations
      
      // Update user in database
      const updateData = {
        generationsLeft: newGenerations,
        lastPayment: new Date().toISOString()
      }
      
      // Only update subscription if it's not a renewal or if upgrading from free
      if (!isRenewal || this.user.subscription === 'free' || !this.user.subscription) {
        updateData.subscription = plan.id
        updateData.lastPlanUpgrade = new Date().toISOString()
      } else {
        updateData.lastRenewal = new Date().toISOString()
      }
      
      const updateResponse = await fetch(`${this.$store.getters.apiUrl}/books/${this.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.user, ...updateData })
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update user data')
      }

      const updatedUser = await updateResponse.json()

      // Transaction recording is disabled since no transactions endpoint is available
      // TODO: Add transaction recording when transactions endpoint is set up

      // Update store
      this.$store.commit('updateUser', updatedUser)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dove_notion_user', JSON.stringify(updatedUser))
      }
    }
  },
  
  mounted() {
    // Check user authentication
    if (!this.user) {
      this.$store.commit('showToast', {
        message: '🔐 Please log in to view subscription plans',
        type: 'warning'
      })
      this.$router.push('/login')
      return
    }

    // Load Paystack script if not already loaded
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="paystack"]')) {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => {
        console.log('Paystack script loaded successfully')
      }
      script.onerror = () => {
        this.$store.commit('showToast', {
          message: 'Failed to load payment system. Please refresh the page.',
          type: 'error'
        })
      }
      document.head.appendChild(script)
    }
  },

  beforeUnmount() {
    // Cancel any pending loading states
    this.loading = false
    
    // Close any open Paystack modals
    if (typeof window !== 'undefined' && typeof window.PaystackPop !== 'undefined') {
      try {
        // This will close any open Paystack modals
        window.PaystackPop.closeIframe && window.PaystackPop.closeIframe()
      } catch (error) {
        // Silently handle any errors
      }
    }
  }
}
</script>

<style scoped>
.subscription-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1d3c 0%, #1e3a8a 100%);
}

.subscription-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.subscription-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.header-section h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.header-section p {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.current-status {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  padding: 1rem 2rem;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid #667eea;
}

.status-label {
  font-weight: bold;
  color: #333;
}

.status-value {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: capitalize;
}

.generations-left {
  color: #666;
  font-weight: 600;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.plan-card {
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  background: white;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.plan-card.popular {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fffbf0 0%, #fff8e1 100%);
  transform: scale(1.05);
}

.plan-card.recommended {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.plan-card.current {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0f2fe 100%);
}

.plan-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-badge.popular {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
}

.plan-badge.recommended {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.plan-badge.current {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.plan-header {
  text-align: center;
  margin-bottom: 2rem;
}

.plan-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.plan-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.2rem;
  color: #667eea;
  font-weight: bold;
}

.amount {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.period {
  font-size: 1rem;
  color: #666;
}

.plan-subtitle {
  color: #666;
  font-size: 1rem;
  font-style: italic;
}

.plan-features {
  flex: 1;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.feature-item:hover {
  background: #e9ecef;
}

.feature-item.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.feature-item.primary .feature-icon {
  font-size: 1.2rem;
}

.feature-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.feature-text {
  font-size: 0.95rem;
  line-height: 1.4;
}

.feature-text.bonus {
  color: #10b981;
  font-weight: bold;
}

.plan-action {
  margin-top: auto;
}

.subscribe-btn {
  width: 100%;
  padding: 1.25rem;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.subscribe-btn:not(.current):not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.subscribe-btn.popular {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.subscribe-btn.current {
  background: #e2e8f0;
  color: #666;
  cursor: not-allowed;
}

.subscribe-btn.renewal {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border: 2px solid #10b981;
  animation: pulse 2s infinite;
}

.subscribe-btn.renewal:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.renewal-info {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
}

.renewal-needed {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border: 1px solid #f59e0b;
}

.renewal-not-needed {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: 1px solid #10b981;
}

.subscribe-btn.free {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.subscribe-btn:hover:not(:disabled):not(.current) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.subscribe-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.plan-note {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.benefits-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 3rem;
}

.benefits-section h4 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.benefit-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.benefit-icon {
  font-size: 2rem;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.benefit-content h5 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.benefit-content p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.faq-section {
  background: #f0f4ff;
  border-radius: 16px;
  padding: 2.5rem;
}

.faq-section h4 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.faq-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.faq-item h5 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.75rem;
}

.faq-item p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .subscription-main {
    padding: 1rem;
  }
  
  .subscription-content {
    padding: 2rem 1.5rem;
  }
  
  .header-section h1 {
    font-size: 2rem;
  }
  
  .current-status {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .plan-card.popular {
    transform: none;
  }
  
  .benefits-grid,
  .faq-grid {
    grid-template-columns: 1fr;
  }
  
  .benefit-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
