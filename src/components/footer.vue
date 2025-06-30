<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <!-- Company Info Section -->
        <div class="footer-section company-info">
          <div class="company-logo">
            <div class="logo-icon"><img src="../assets/img/dove.png" alt="" style="width: 150px; "></div>
            <div class="company-details">
              <h3>Dove Notion</h3>
              <p>Professional QR & Barcode Solutions</p>
            </div>
          </div>
          <p class="company-description">
            Empowering businesses and individuals with cutting-edge QR code and barcode generation technology. 
            Create, customize, and manage your codes with ease.
          </p>
        
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#">Home</a></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/subscription">Pricing</router-link></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <h4>Services</h4>
          <ul class="footer-links">
            <li><router-link to="/dashboard">QR Code Generator</router-link></li>
            <li><router-link to="/dashboard">Barcode Generator</router-link></li>
            <li><router-link to="/dashboard">Bulk Generation</router-link></li>

        
          </ul>
        </div>

        <!-- Support -->
        <div class="footer-section">
          <h4>Support</h4>
          <ul class="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Contact Support</a></li>
            
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section contact-info">
          <h4>Get in Touch</h4>
          <div class="contact-details">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <div class="contact-text">
                <strong>Email:</strong>
                <a href="mailto:dovenotion24@gmail.com">dovenotion24@gmail.com</a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <div class="contact-text">
                <strong>Phone:</strong>
                <a href="tel:+2348123456789">+234 815 485 4553</a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🌍</span>
              <div class="contact-text">
                <strong>Location:</strong>
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    

      <!-- Footer Bottom -->
      <div class="footer-bottom" style="display: flex; justify-content: center;">
        <div class="footer-bottom-content" style="text-align: center; width: 50%; display: flex; justify-content: center;">
          <div class="copyright">
            <p style="text-align: center;">&copy; {{ currentYear }} Dove Notion. All rights reserved.</p>
            <p style="text-align: center;" class="partnership-note">In partnership with OFC Enterprise</p>
          </div>
     
       
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem 0;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h4 {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  position: relative;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #ffd700 0%, #667eea 100%);
}

/* Company Info Section */
.company-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.company-details h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(135deg, #ffd700 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-details p {
  color: #b0b7c3;
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
}

.company-description {
  color: #b0b7c3;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.social-link span {
  font-size: 1.2rem;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #b0b7c3;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.footer-links a:hover {
  color: #ffd700;
  padding-left: 0.5rem;
}

.footer-links a::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background: #ffd700;
  transition: width 0.3s ease;
}

.footer-links a:hover::before {
  width: 0.25rem;
}

/* Contact Info */
.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.contact-icon {
  font-size: 1.2rem;
  margin-top: 0.1rem;
}

.contact-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-text strong {
  color: #ffd700;
  font-size: 0.9rem;
}

.contact-text a {
  color: #b0b7c3;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-text a:hover {
  color: #ffd700;
}

/* Leadership Section */
.leadership-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.leadership-section h4 {
  text-align: center;
  color: #ffd700;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.leadership-section h4::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffd700 0%, #667eea 100%);
  border-radius: 2px;
}

.ceo-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.ceo-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ceo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.ceo-avatar {
  margin-bottom: 1.5rem;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.ceo-info h5 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.ceo-title {
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.company-name {
  color: #667eea;
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.ceo-description {
  color: #b0b7c3;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.ceo-social {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.ceo-social-link {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.ceo-social-link:hover {
  background: linear-gradient(135deg, #ffd700 0%, #667eea 100%);
  transform: scale(1.1);
}

/* Partnership Banner */
.partnership-banner {
  background: linear-gradient(135deg, #ffd700 0%, #667eea 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.partnership-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.partnership-icon {
  font-size: 2rem;
}

.partnership-text h4 {
  color: #1a1a2e;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
}

.partnership-text p {
  color: #1a1a2e;
  margin: 0;
  font-weight: 500;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  /* text-align: center !important; */
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright p {
  margin: 0;
  color: #b0b7c3;
  font-size: 0.9rem;
 
}

.partnership-note {
  color: #667eea !important;
  font-weight: 500;
}

.footer-badges {
  display: flex;
  gap: 1rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 1rem;
}

.badge-text {
  color: #b0b7c3;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-main {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
  
  .company-info {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 2rem 1rem 0;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .ceo-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .partnership-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-badges {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .leadership-section {
    padding: 1.5rem;
  }
  
  .ceo-card {
    padding: 1.5rem;
  }
  
  .company-logo {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-badges {
    flex-wrap: wrap;
  }
}
</style>
