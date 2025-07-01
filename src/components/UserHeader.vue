<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="user-info">
        <div class="logo">
          <div class="logo-icon"><img src="../assets/img/dove.png"  alt="" style="width: 150px;"</div>
          <div class="user-details">
            <h2 style="color: white;">Dove Notion</h2>
            <p style="color: white;">Welcome, {{ user?.fullName || 'Guest' }}</p>
          </div>
        </div>
        <div class="generations-info" v-if="user">
          <span class="generations-left" :class="{ warning: user.generationsLeft <= 1 }">
            {{ user.generationsLeft || 0 }} generations left
          </span>
          <button v-if="user.generationsLeft <= 1" @click="$router.push('/subscription')" class="upgrade-btn">
            Upgrade
          </button>
        </div>
      </div>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'UserHeader',
  props: {
    user: {
      type: Object,
      required: false,
      default: null
    }
  },
  methods: {
    logout() {
      if (this.user) {
        this.$store.dispatch('logout')
      }
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.dashboard-header {
  background: rgba(255, 255, 255, 0.1);
 
    /* background: ; */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-bottom: 4px solid #667eea;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.user-details h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.user-details p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.generations-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.generations-left {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.generations-left.warning {
  background: #ef4444;
}

.upgrade-btn {
  background: #ffd700;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
