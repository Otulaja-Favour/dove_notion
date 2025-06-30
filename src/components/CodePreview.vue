<template>
  <div class="output-card">
    <!-- Current Generated Code Section -->
    <div class="current-code-section">
      <h2>📱 Generated Code</h2>
      
      <div v-if="!generatedCode" class="empty-state">
        <div class="empty-icon">📱</div>
        <p>Your generated code will appear here</p>
      </div>
      
      <div v-else class="code-result">
        <div class="code-preview">
          <img :src="generatedCode" alt="Generated Code" class="code-image">
        </div>
        <div class="code-actions">
          <button @click="downloadCode" class="action-btn download">
            📥 Download
          </button>
          <button @click="copyToClipboard" class="action-btn copy">
            📋 Copy Link
          </button>
        </div>
      </div>
    </div>

    <!-- History Section -->
    <div class="history-section">
      <div class="history-header">
        <h3>📋 Recent History</h3>
        <div class="history-controls">
          <button @click="refreshHistory" class="refresh-btn" :disabled="loading">
            🔄 {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button @click="toggleHistoryView" class="toggle-btn">
            {{ showAllHistory ? '👁️ Show Less' : '👁️ Show All' }}
          </button>
        </div>
      </div>

      <!-- History Stats -->
      <div class="history-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalCodes }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ qrCodes }}</span>
          <span class="stat-label">QR Codes</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ barcodes }}</span>
          <span class="stat-label">Barcodes</span>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="history-filters" v-if="showAllHistory">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search codes..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        <select v-model="filterType" class="filter-select">
          <option value="all">All Types</option>
          <option value="qr">QR Codes</option>
          <option value="barcode">Barcodes</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="history-loading">
        <div class="loading-spinner"></div>
        <p>Loading history...</p>
      </div>

      <!-- Empty History State -->
      <div v-else-if="displayedCodes.length === 0" class="empty-history">
        <div class="empty-icon">📱</div>
        <p>{{ searchQuery || filterType !== 'all' ? 'No codes match your search' : 'No codes generated yet' }}</p>
        <p class="empty-subtitle">Start generating codes to see them here!</p>
      </div>

      <!-- History List -->
      <div v-else class="history-list">
        <div 
          v-for="code in displayedCodes" 
          :key="code.id" 
          class="history-item"
          @click="selectHistoryCode(code)"
        >
          <!-- Code Thumbnail -->
          <div class="history-thumbnail">
            <img 
              :src="code.codeUrl || code.imageUrl" 
              :alt="`${code.type} code`"
              class="thumbnail-image"
              @error="handleImageError"
            >
            <div class="code-type-badge" :class="code.type">
              {{ code.type.toUpperCase() }}
            </div>
          </div>

          <!-- Code Info -->
          <div class="history-info">
            <div class="code-content">
              <div class="content-type">
                <span class="content-icon">{{ getContentIcon(code.contentType) }}</span>
                {{ getContentLabel(code.contentType) }}
              </div>
              <div class="code-data" :title="code.data">
                {{ truncateText(code.data, 40) }}
              </div>
            </div>
            <div class="code-date">
              {{ formatDate(code.createdAt) }}
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="history-actions">
            <button @click.stop="downloadHistoryCode(code)" class="history-action-btn" title="Download">
              📥
            </button>
            <button @click.stop="copyHistoryContent(code.data)" class="history-action-btn" title="Copy">
              📋
            </button>
            <button @click.stop="useAsTemplate(code)" class="history-action-btn" title="Use as Template">
              🔄
            </button>
            <button @click.stop="deleteHistoryCode(code)" class="history-action-btn delete" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Show More Button -->
      <div v-if="!showAllHistory && userCodes.length > displayLimit" class="show-more">
        <button @click="showAllHistory = true" class="show-more-btn">
          Show All {{ userCodes.length }} Codes
        </button>
      </div>

      <!-- Pagination for All History -->
      <div v-if="showAllHistory && totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ← Previous
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Code Detail Modal -->
    <div v-if="selectedCode" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Code Details</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="modal-preview">
            <img :src="selectedCode.codeUrl || selectedCode.imageUrl" :alt="selectedCode.type" class="modal-image">
          </div>
          
          <div class="modal-details">
            <div class="detail-row">
              <label>Type:</label>
              <span>{{ selectedCode.type.toUpperCase() }}</span>
            </div>
            <div class="detail-row">
              <label>Content Type:</label>
              <span>{{ getContentLabel(selectedCode.contentType) }}</span>
            </div>
            <div class="detail-row">
              <label>Created:</label>
              <span>{{ formatFullDate(selectedCode.createdAt) }}</span>
            </div>
            <div class="detail-row full-width">
              <label>Content:</label>
              <span class="content-text">{{ selectedCode.data }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="downloadHistoryCode(selectedCode)" class="modal-btn download">
            📥 Download
          </button>
          <button @click="copyHistoryContent(selectedCode.data)" class="modal-btn copy">
            📋 Copy Content
          </button>
          <button @click="useAsTemplate(selectedCode)" class="modal-btn template">
            🔄 Use as Template
          </button>
          <button @click="deleteHistoryCode(selectedCode)" class="modal-btn delete">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodePreview',
  props: {
    generatedCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      showAllHistory: false,
      searchQuery: '',
      filterType: 'all',
      selectedCode: null,
      currentPage: 1,
      displayLimit: 5,
      itemsPerPage: 10
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    userCodes() {
      if (!this.user) return []
      return this.$store.state.codes
        .filter(code => code.userId === this.user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    totalCodes() {
      return this.userCodes.length
    },
    qrCodes() {
      return this.userCodes.filter(code => code.type === 'qr').length
    },
    barcodes() {
      return this.userCodes.filter(code => code.type === 'barcode').length
    },
    filteredCodes() {
      let filtered = [...this.userCodes]

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(code => 
          code.data.toLowerCase().includes(query) ||
          code.type.toLowerCase().includes(query) ||
          (code.contentType && code.contentType.toLowerCase().includes(query))
        )
      }

      // Apply type filter
      if (this.filterType !== 'all') {
        filtered = filtered.filter(code => code.type === this.filterType)
      }

      return filtered
    },
    displayedCodes() {
      if (!this.showAllHistory) {
        return this.filteredCodes.slice(0, this.displayLimit)
      }
      
      // Pagination for all history
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredCodes.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredCodes.length / this.itemsPerPage)
    }
  },
  methods: {
    async refreshHistory() {
      if (!this.user) return
      
      this.loading = true
      try {
        await this.$store.dispatch('getUserCodes')
        this.$store.commit('showToast', {
          message: 'History refreshed!',
          type: 'success'
        })
      } catch (error) {
        this.$store.commit('showToast', {
          message: 'Failed to refresh history',
          type: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    
    toggleHistoryView() {
      this.showAllHistory = !this.showAllHistory
      if (this.showAllHistory) {
        this.currentPage = 1
      }
    },

    selectHistoryCode(code) {
      this.selectedCode = code
    },

    closeModal() {
      this.selectedCode = null
    },

    downloadCode() {
      if (!this.generatedCode) return

      const link = document.createElement('a')
      link.download = `dove-notion-code-${Date.now()}.png`
      link.href = this.generatedCode
      link.click()
      
      this.$store.commit('showToast', { 
        message: 'Code downloaded successfully!', 
        type: 'success' 
      })
    },

    downloadHistoryCode(code) {
      const link = document.createElement('a')
      link.download = `dove-notion-${code.type}-${Date.now()}.png`
      link.href = code.codeUrl || code.imageUrl
      link.click()
      
      this.$store.commit('showToast', { 
        message: 'Code downloaded successfully!', 
        type: 'success' 
      })
    },

    async copyToClipboard() {
      if (!this.generatedCode) return

      try {
        await navigator.clipboard.writeText(this.generatedCode)
        this.$store.commit('showToast', { 
          message: 'Code link copied to clipboard!', 
          type: 'success' 
        })
      } catch (err) {
        this.$store.commit('showToast', { 
          message: 'Failed to copy to clipboard', 
          type: 'error' 
        })
      }
    },

    async copyHistoryContent(content) {
      try {
        await navigator.clipboard.writeText(content)
        this.$store.commit('showToast', { 
          message: 'Content copied to clipboard!', 
          type: 'success' 
        })
      } catch (err) {
        this.$store.commit('showToast', { 
          message: 'Failed to copy to clipboard', 
          type: 'error' 
        })
      }
    },

    useAsTemplate(code) {
      // Emit event to parent component to use this code as template
      this.$emit('use-template', {
        type: code.type,
        contentType: code.contentType,
        data: code.data
      })
      
      this.$store.commit('showToast', { 
        message: 'Template loaded! You can now generate a similar code.', 
        type: 'success' 
      })
      
      this.closeModal()
    },

    getContentIcon(contentType) {
      const icons = {
        url: '🌐',
        text: '📝',
        email: '✉️',
        phone: '📞'
      }
      return icons[contentType] || '📄'
    },

    getContentLabel(contentType) {
      const labels = {
        url: 'Website URL',
        text: 'Plain Text',
        email: 'Email Address',
        phone: 'Phone Number'
      }
      return labels[contentType] || 'Unknown'
    },

    truncateText(text, length) {
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Today'
      if (diffDays === 2) return 'Yesterday'
      if (diffDays <= 7) return `${diffDays - 1} days ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },

    formatFullDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    handleImageError(event) {
      event.target.src = '/placeholder.svg?height=60&width=60'
    },
    async deleteHistoryCode(code) {
      if (confirm(`Are you sure you want to delete this ${code.type.toUpperCase()} code?\n\nContent: ${code.data.substring(0, 50)}${code.data.length > 50 ? '...' : ''}`)) {
        try {
          await this.$store.dispatch('deleteCode', code.id)
          
          // Close modal if the deleted code was selected
          if (this.selectedCode?.id === code.id) {
            this.selectedCode = null
          }
          
          this.$store.commit('showToast', {
            message: 'Code deleted successfully!',
            type: 'success'
          })
          
          // Refresh the history to update counts
          await this.refreshHistory()
        } catch (error) {
          this.$store.commit('showToast', {
            message: 'Failed to delete code. Please try again.',
            type: 'error'
          })
        }
      }
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    filterType() {
      this.currentPage = 1
    }
  },

  async mounted() {
    if (this.user) {
      await this.refreshHistory()
    }
  }
}
</script>

<style scoped>
.output-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-height: 80vh;
  overflow-y: auto;
}

.current-code-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.output-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.code-result {
  text-align: center;
}

.code-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.code-image {
  max-width: 100%;
  height: auto;
  max-height: 300px;
}

.code-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-btn {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.download {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn.copy {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

/* History Section Styles */
.history-section {
  margin-top: 2rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.history-header h3 {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.history-controls {
  display: flex;
  gap: 0.5rem;
}

.refresh-btn, .toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn {
  background: #667eea;
  color: white;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-btn {
  background: #f1f5f9;
  color: #64748b;
}

.toggle-btn:hover {
  background: #e2e8f0;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
}

.history-loading {
  text-align: center;
  padding: 2rem 0;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-history {
  text-align: center;
  padding: 2rem 0;
}

.empty-history .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.history-thumbnail {
  position: relative;
  flex-shrink: 0;
}

.thumbnail-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: #f8f9fa;
}

.code-type-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.625rem;
  font-weight: bold;
  text-transform: uppercase;
}

.code-type-badge.qr {
  background: #dbeafe;
  color: #1d4ed8;
}

.code-type-badge.barcode {
  background: #dcfce7;
  color: #166534;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.content-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.code-data {
  font-size: 0.875rem;
  color: #333;
  word-break: break-all;
  margin-bottom: 0.25rem;
}

.code-date {
  font-size: 0.75rem;
  color: #64748b;
}

.history-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.history-action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-action-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.show-more {
  text-align: center;
  margin-top: 1rem;
}

.show-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.show-more-btn:hover {
  transform: translateY(-2px);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
  color: #333;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-preview {
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.modal-image {
  max-width: 100%;
  max-height: 250px;
}

.modal-details {
  display: grid;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.detail-row.full-width {
  flex-direction: column;
  align-items: stretch;
}

.detail-row label {
  font-weight: bold;
  color: #333;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.detail-row span {
  color: #64748b;
  font-size: 0.875rem;
}

.content-text {
  word-break: break-all;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  margin-top: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
}

.modal-btn.download {
  background: #10b981;
  color: white;
}

.modal-btn.copy {
  background: #3b82f6;
  color: white;
}

.modal-btn.template {
  background: #8b5cf6;
  color: white;
}

@media (max-width: 768px) {
  .output-card {
    padding: 1.5rem;
  }
  
  .code-actions {
    grid-template-columns: 1fr;
  }
  
  .history-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .history-controls {
    justify-content: center;
  }
  
  .history-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .stat-item {
    padding: 0.75rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .history-filters {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .history-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .history-info {
    order: -1;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

.history-action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.history-action-btn.delete:hover {
  background: #dc2626;
  color: white;
}

.modal-btn.delete {
  background: #dc2626;
  color: white;
}

.modal-btn.delete:hover {
  background: #b91c1c;
}
</style>
