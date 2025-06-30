<template>
  <div class="about-container">
    <!-- Navigation -->
    <nav class="nav-header">
      <div class="nav-content">
        <div class="logo">
          <div class="logo-icon"><img src="../assets/img/dove.png" alt="" style="width: 150px; "></div>
          <span class="logo-text">DOVE NOTION</span>
        </div>
        <div class="nav-buttons">
          <button @click="$router.push('/')" class="nav-btn">HOME</button>
          <button @click="$router.push('/about')" class="nav-btn active">ABOUT</button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="about-content">
      <h1 class="about-title">ABOUT US</h1>
      
      <div class="about-section">
        <div class="about-image">
          <img src="../assets/img/main.jpg" 
               alt="Adenaiya Oreoluwa David" class="profile-img" />
          <h4 class="founder-name">
            ADENAIYA OREOLUWA DAVID<br />
            <span>(CEO, DOVE NOTION)</span>
          </h4>
          <p class="founder-title">(VISUAL ALCHEMIST, BRAND WHISPERER, DESIGN ENTHUSIAST)</p>
        </div>
        
        <div class="about-text">
          <p class="about-description">
            <strong>Dove Notion</strong> <span style="font-weight: 200;">(formerly</span> <strong>Dove Graphics</strong>) was founded on June 29, 2021, by Adenaiya Oreoluwa David.
          </p>
          <p class="about-description">
            We are a creative and digital solutions brand committed to excellence in graphic design, tech
            support, and branding.
          </p>
          <p class="about-description">
            At Dove Notion, we transform ideas into compelling visuals, simplify digital tasks, and bring
            innovation to every project.
          </p>
          <p class="about-description">
            Where creativity meets precision, we help you work smarter, faster, and stand out effortlessly.
          </p>
        </div>
      </div>
    </div>
  <Footer />
  </div>
  
</template>

<script>
import Footer from '../components/footer.vue';
export default {
  components: {Footer},
  name: 'About'
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background-color: #0a1d3c;
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

.about-content {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.about-title {
  text-align: center;
  color: #ffd700;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 215, 0, 0.2);
  border-radius: 4px;
  font-size: 2rem;
}

.about-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-image {
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: 50% 20%;
  border-radius: 8px;
}

.about-text {
  width: 100%;
  max-width: 600px;
}

.founder-name {
  margin-top: 20px;
  font-size: 1.2rem;
  color: white;
  text-align: center;
}

.founder-name span {
  font-size: 0.8rem;
  color: #ffd700;
}

.founder-title {
  font-size: 0.9rem;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
}

.about-description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: justify;
}

@media (min-width: 768px) {
  .about-content {
    padding: 4rem 2rem;
  }

  .about-title {
    font-size: 2.5rem;
  }

  .about-section {
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
  }

  .about-image,
  .about-text {
    width: 50%;
  }

  .profile-img {
    width: 250px;
    height: 250px;
  }

  .about-description {
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
