/**
 * Playnex Labs - Interactive Frontend Logic (App Development Focused)
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavigation();
  initContactModal();
});

/* ==========================================================================
   1. AMBIENT COSMIC BACKGROUND (Particle System)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('cosmic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35; // Slow floating speeds
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 2 + 1; // Subtle small particles
      this.color = Math.random() > 0.5 ? '#7C3AED' : '#06B6D4'; // Violet or Cyan
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off borders
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }

  function createParticles() {
    const density = Math.floor((width * height) / 18000); // Scaled by screensize
    particles = [];
    const count = Math.min(density, 80); // Cap at 80 particles for optimization
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw and connect particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        // Connect nearby particles with gradient-like thin neon webs
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = '#3B82F6';
          ctx.globalAlpha = (1 - dist / 120) * 0.08; // Very soft connecting lines
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

/* ==========================================================================
   2. HEADER & MOBILE NAVIGATION
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('site-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu-list');
  const navLinks = navMenu.querySelectorAll('a');

  // Sticky navbar shadow and border glows on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Mobile Menu toggle action
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close Mobile Menu on navigation link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. CONTACT / COLLABORATE MODAL HANDLERS
   ========================================================================== */
function initContactModal() {
  const modalOverlay = document.getElementById('contact-modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');
  const openTriggers = document.querySelectorAll('.open-contact-trigger');
  
  const formContainer = document.getElementById('modal-form-container');
  const successContainer = document.getElementById('modal-success-container');
  const contactForm = document.getElementById('contact-form');
  const successCloseBtn = document.getElementById('btn-success-close');

  const openModal = () => {
    // Reset view states when opening
    formContainer.style.display = 'block';
    successContainer.style.display = 'none';
    contactForm.reset();
    
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable scroll under modal
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Restore scroll
  };

  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  successCloseBtn.addEventListener('click', closeModal);

  // Close on backdrop overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Form submission handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate submission loading delay
    const submitBtn = document.getElementById('btn-submit-form');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Transmitting Proposal...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Transition to success screen inside modal
      formContainer.style.display = 'none';
      successContainer.style.display = 'flex';
    }, 1200);
  });
}


