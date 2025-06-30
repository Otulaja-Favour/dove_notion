<template>
  <div class="home-container">
    <!-- Navigation -->
    <nav class="nav-header">
      <div class="nav-content">
        <div class="logo">
          <div class="logo-icon"><img src="../assets/img/dove.png" alt="" style="width: 150px; "></div>
          <span class="logo-text">DOVE NOTION</span>
        </div>
        <div class="nav-buttons">
          <button @click="$router.push('/')" class="nav-btn active">HOME</button>
          <button @click="$router.push('/about')" class="nav-btn">ABOUT</button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="home-content">
      <h1>WELCOME TO DOVE NOTION'S<br />4TH ANNIVERSARY PORTAL!</h1>
      <p class="subtitle">Your Fast, Smart & Stylish QR/Barcode Generator.</p>

      <div class="anniversary-content">
        <div class="anniversary-img">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-28%20at%2016.24.38_79202e87.jpg-iDMIjVjswFzqAvVs3t6JIdMNDiGU46.jpeg" alt="4th Anniversary" class="anniversary-logo" />
        </div>
        <div class="anniversary-text">
          <p class="description">
            We're celebrating 4 years of creative innovation! As part of our anniversary experience,
            we've built a simple tool that lets YOU generate custom QR codes and barcodes for your
            business, project, or personal use — in just a few clicks.
          </p>
          <h2>Why This? Why Now?</h2>
          <p class="mission">
            Because at Dove Notion, we believe design should be practical, beautiful, and
            accessible—even in the form of a QR code. Let's turn functionality into celebration!
          </p>
        </div>
      </div>

      <button @click="getStarted" class="cta-button">GET STARTED >></button>
    </div>
    
<Navbar />
</div>
</template>

<script>
import Navbar from '@/components/footer.vue';
export default {
  components:{Navbar},
  name: 'Home',
  methods: {
    getStarted() {
      if (this.$store.state.user) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/signup')
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  /* min-height: 100vh; */
  background: linear-gradient(135deg, #0a1d3c 0%, #1e3a8a 100%);
  color: white;
}

.nav-header {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: #ffd700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #0a1d3c;
}

.logo-text {
  font-weight: bold;
  font-size: 1.2rem;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn.active {
  background: white;
  color: #0a1d3c;
}

.nav-btn:hover {
  background: white;
  color: #0a1d3c;
}

.home-content {
  padding: 2rem 1rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  background: white;
  color: #0a1d3c;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
}

.anniversary-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.anniversary-img {
  width: 100%;
  margin-bottom: 1rem;
}

.anniversary-logo {
  width: 250px;
  margin: 1rem 0;
  max-width: 100%;
}

.anniversary-text {
  width: 100%;
  padding: 0 1rem;
}

.description,
.mission {
  text-align: justify;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  color: #ffd700;
  margin: 1.5rem 0;
}

.cta-button {
  margin: 20px 0px;
  background-color: #ffd700;
  color: #0a1d3c;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: scale(1.05);
}

@media (min-width: 768px) {
  .home-content {
    padding: 4rem 2rem;
  }

  h1 {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }

  .anniversary-content {
    flex-direction: row;
    gap: 2rem;
  }

  .anniversary-img,
  .anniversary-text {
    width: 50%;
  }

  .anniversary-logo {
    width: 300px;
  }

  .description,
  .mission {
    font-size: 1.1rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  .cta-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
