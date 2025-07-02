<template>
  <div class="generator-card">
    <h2>🎯 Generator Settings</h2>
    
    <!-- Code Type Selection -->
    <div class="form-group">
      <label class="form-label">Code Type</label>
      <div class="code-type-buttons">
        <button
          v-for="type in codeTypes"
          :key="type.value"
          @click="updateSelectedType(type.value)"
          :class="['type-btn', { active: selectedType === type.value }]"
        >
          <div class="type-label">{{ type.label }}</div>
          <div class="type-desc">{{ type.description }}</div>
        </button>
      </div>
    </div>
    
    <!-- Content Type -->
    <div class="form-group">
      <label class="form-label">Content Type</label>
      <select v-model="contentType" @change="updateContentType" class="form-select">
        <option v-for="type in contentTypes" :key="type.value" :value="type.value">
          {{ type.label }}
        </option>
      </select>
    </div>
    
    <!-- Dynamic Input Fields -->
    <div class="form-group">
      <div v-if="contentType === 'url'">
        <label class="form-label">Website URL</label>
        <input v-model="inputData.url" @input="updateInputData" type="url" class="form-input" placeholder="https://example.com">
      </div>
      
      <div v-if="contentType === 'text'">
        <label class="form-label">Text Content</label>
        <textarea v-model="inputData.text" @input="updateInputData" class="form-textarea" rows="3" placeholder="Enter your text here..."></textarea>
      </div>
      
      <div v-if="contentType === 'phone'">
        <label class="form-label">Phone Number</label>
        <input v-model="inputData.phone" @input="updateInputData" type="tel" class="form-input" placeholder="+1234567890">
      </div>
      
      <div v-if="contentType === 'email'">
        <label class="form-label">Email Address</label>
        <input v-model="inputData.email" @input="updateInputData" type="email" class="form-input" placeholder="example@email.com">
      </div>
    </div>
    
    <!-- Generate Button -->
    <button 
      @click="handleGenerate" 
      :disabled="!canGenerate" 
      :class="['generate-btn', { 'disabled': !canGenerate }]"
    >
      <span v-if="user?.generationsLeft <= 0">
        🔒 No Generations Left - Upgrade Required
      </span>
      <span v-else>
        ⚡ Generate {{ selectedType === 'qr' ? 'QR Code' : 'Barcode' }}
        <small>({{ user?.generationsLeft || 0 }}/3 left)</small>
      </span>
    </button>
    
    <!-- Upgrade Prompt for GeneratorForm -->
    <div v-if="user?.generationsLeft <= 0" class="upgrade-prompt">
      <p>You've used all 3 free generations. Upgrade to continue!</p>
      <button @click="goToSubscription" class="upgrade-btn-small">
        <i class="fas fa-crown me-1"></i>
        Upgrade Now
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeneratorForm',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedType: 'qr',
      contentType: 'url',
      inputData: {
        url: '',
        text: '',
        phone: '',
        email: ''
      },
      codeTypes: [
        { value: 'qr', label: 'QR Code', description: 'Square matrix barcode' },
        { value: 'barcode', label: 'Barcode', description: 'Linear barcode' }
      ],
      contentTypes: [
        { value: 'url', label: 'Website URL' },
        { value: 'text', label: 'Plain Text' },
        { value: 'phone', label: 'Phone Number' },
        { value: 'email', label: 'Email Address' }
      ]
    }
  },
  computed: {
    canGenerate() {
      if (this.user?.generationsLeft <= 0) return false
      const data = this.getCurrentData()
      return data && data.trim().length > 0
    }
  },
  methods: {
    getCurrentData() {
      switch (this.contentType) {
        case 'url': return this.inputData.url
        case 'text': return this.inputData.text
        case 'phone': return `tel:${this.inputData.phone}`
        case 'email': return `mailto:${this.inputData.email}`
        default: return ''
      }
    },
    updateSelectedType(type) {
      this.selectedType = type
    },
    updateContentType() {
      this.$emit('content-type-changed', this.contentType)
    },
    updateInputData() {
      this.$emit('input-data-changed', this.inputData)
    },
    async handleGenerate() {
      if (!this.canGenerate) return

      this.$store.commit('setLoading', { loading: true, message: 'Generating code...' })
      
      try {
        const data = this.getCurrentData()
        let codeUrl

        if (this.selectedType === 'qr') {
          codeUrl = await this.generateQRWithWatermark(data)
        } else {
          codeUrl = await this.generateBarcodeWithWatermark(data)
        }

        // Save to database
        await this.saveCodeToDatabase(data, codeUrl)
        
        // Update user generations
        const newCount = this.user.generationsLeft - 1
        await this.updateUserGenerations(newCount)

        this.$emit('code-generated', codeUrl)
        
        this.$store.commit('showToast', { 
          message: `Code generated! ${newCount} generations left.`, 
          type: 'success' 
        })
      } catch (error) {
        this.$store.commit('showToast', { message: 'Failed to generate code', type: 'error' })
      } finally {
        this.$store.commit('setLoading', { loading: false })
      }
    },
    async generateQRWithWatermark(data) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const size = 300
      canvas.width = size
      canvas.height = size

      // Generate QR code URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`

      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          // Draw QR code
          ctx.drawImage(img, 0, 0, size, size)
          
          // Add watermark background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          ctx.fillRect(size/2 - 60, size/2 - 15, 120, 30)
          
          // Add watermark text
          ctx.fillStyle = '#000000'
          ctx.font = 'bold 12px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('DOVE NOTION', size/2, size/2 + 5)
          
          resolve(canvas.toDataURL())
        }
        img.src = qrUrl
      })
    },
    async generateBarcodeWithWatermark(data) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 400
      canvas.height = 100

      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000000'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'

      // Draw simple bars
      const barWidth = 3
      const spacing = 2
      let x = 20

      for (let i = 0; i < data.length && x < canvas.width - 20; i++) {
        const charCode = data.charCodeAt(i)
        const bars = (charCode % 8) + 1
        for (let j = 0; j < bars; j++) {
          ctx.fillRect(x, 20, barWidth, 60)
          x += barWidth + spacing
        }
        x += spacing * 2
      }

      // Add watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillRect(canvas.width/2 - 40, 35, 80, 20)
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('DOVE NOTION', canvas.width/2, 48)
      ctx.fillText(data.substring(0, 20), canvas.width/2, 95)

      return canvas.toDataURL()
    },
    async saveCodeToDatabase(data, codeUrl) {
      try {
        const codeData = {
          userId: this.user.id,
          type: this.selectedType,
          contentType: this.contentType,
          data: data,
          codeUrl: codeUrl,
          createdAt: new Date().toISOString()
        }
        
        await this.$store.dispatch('createCode', codeData)
      } catch (error) {
        this.$store.commit('showToast', {
          message: `❌ Failed to save code: ${error.message || 'Unknown error'}`,
          type: 'error'
        })
      }
    },
    async updateUserGenerations(count) {
      try {
        const response = await fetch(`${this.$store.getters.apiUrl}/users/${this.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ generationsLeft: count })
        })
        
        if (response.ok) {
          this.$store.commit('updateUserGenerations', count)
        }
      } catch (error) {
        this.$store.commit('showToast', {
          message: `❌ Failed to update user generations: ${error.message || 'Unknown error'}`,
          type: 'error'
        })
      }
    },
    
    goToSubscription() {
      this.$router.push('/subscription')
    }
  }
}
</script>

<style scoped>
.generator-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.generator-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.code-type-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.type-btn {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s;
}

.type-btn.active {
  border-color: #667eea;
  background: #f0f4ff;
  color: #667eea;
}

.type-label {
  font-weight: bold;
  font-size: 1rem;
}

.type-desc {
  font-size: 0.8rem;
  opacity: 0.8;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
}

.generate-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #9ca3af;
}

.generate-btn small {
  display: block;
  font-size: 0.8rem;
  font-weight: normal;
  opacity: 0.9;
}

.upgrade-prompt {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  text-align: center;
  color: #92400e;
}

.upgrade-btn-small {
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  color: #1a202c;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.upgrade-btn-small:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}
</style>
