/**
 * PORTFOLIO v3.0 — Hassam Khan
 * Interaction & Animation Engine
 * Production-Ready, Mobile-Safe
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. PAGE LOAD FADE-IN
  // ============================================================
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });
  });


  // ============================================================
  // 2. PARTICLES CANVAS
  // ============================================================
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];

  const resizeCanvas = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.size   = Math.random() * 1.6 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.alpha  = Math.random() * 0.45 + 0.08;
      this.color  = Math.random() > 0.5 ? '99,102,241' : '6,182,212';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  };

  const connectParticles = () => {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx   = particles[a].x - particles[b].x;
        const dy   = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.055 * (1 - dist / 115)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  };

  initParticles();
  animateParticles();


  // ============================================================
  // 3. HEADER — SCROLL STATE & ACTIVE NAV LINK
  // ============================================================
  const header   = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    // Scrolled class
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Top-bar scroll progress
    const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scroll-progress-bar').style.width = Math.min(progress, 100) + '%';

    // Active nav link
    const scrollPos = window.scrollY + 140;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ============================================================
  // 4. MOBILE DRAWER
  // ============================================================
  const hamburger    = document.getElementById('hamburger');
  const drawer       = document.getElementById('mobile-drawer');
  const overlay      = document.getElementById('drawer-overlay');
  const drawerLinks  = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);
  
  // Handle all drawer navigation links properly
  document.querySelectorAll('.drawer-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      // External links (LinkedIn, WhatsApp, etc.) - don't close drawer, let them open
      if (link.hasAttribute('data-external') || link.target === '_blank') {
        return;
      }
      // Internal anchor links - close drawer
      closeDrawer();
    });
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });


  // ============================================================
  // 5. SMOOTH ANCHOR SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ============================================================
  // 6. SCROLL REVEAL
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  // ============================================================
  // 7. TYPEWRITER
  // ============================================================
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const phrases = [
      'WordPress & Webflow Developer',
      'Figma to Code Expert',
      'Elementor Pro Specialist',
      'Web Performance Guru',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;

    const type = () => {
      const current = phrases[pIdx];
      typeEl.textContent = current.slice(0, cIdx);
      cIdx = deleting ? cIdx - 1 : cIdx + 1;

      let speed = deleting ? 55 : 85;
      if (!deleting && cIdx > current.length)  { speed = 2200; deleting = true; }
      if (deleting && cIdx < 0)                { deleting = false; pIdx = (pIdx + 1) % phrases.length; cIdx = 0; speed = 350; }

      setTimeout(type, speed);
    };
    setTimeout(type, 900);
  }


  // ============================================================
  // 8. HERO PARALLAX (Desktop only — no parallax on mobile to avoid layout bugs)
  // ============================================================
  const heroPhoto = document.querySelector('.hero-photo');
  const heroText  = document.querySelector('.hero-text');

  if (heroPhoto && window.innerWidth >= 1024) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroPhoto.style.transform = `translateY(${y * 0.07}px)`;
          heroText.style.transform  = `translateY(${y * 0.035}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }, { passive: true });

    // Reset on resize so mobile gets no transform
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) {
        heroPhoto.style.transform = '';
        heroText.style.transform  = '';
      }
    }, { passive: true });
  }


  // ============================================================
  // 9. SKILLS ANIMATION (count-up + bar fill)
  // ============================================================
  const skillsSection = document.getElementById('skills');
  let skillsDone = false;

  const countUp = (el, target, duration = 1400) => {
    const start = performance.now();
    const tick = now => {
      const pct  = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 4);
      el.textContent = Math.round(ease * target) + '%';
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const animateSkills = () => {
    if (skillsDone) return;
    skillsDone = true;
    document.querySelectorAll('.skill-item').forEach((item, i) => {
      const pctEl   = item.querySelector('.skill-pct');
      const barFill = item.querySelector('.bar-fill');
      const target  = parseInt(pctEl.dataset.target);
      setTimeout(() => {
        barFill.style.width = target + '%';
        countUp(pctEl, target);
      }, i * 100);
    });
  };

  if (skillsSection) {
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) animateSkills(); });
    }, { threshold: 0.12 }).observe(skillsSection);
  }


  // ============================================================
  // 10. MOUSE-TRACKING GLOW ON SERVICE CARDS
  // ============================================================
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - r.left}px`);
      card.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  });


  // ============================================================
  // 11. CONTACT FORM (Web3Forms)
  // ============================================================
  const form      = document.getElementById('contact-form');
  const feedback  = document.getElementById('form-feedback');
  const btnSubmit = document.getElementById('btn-submit');
  const btnText   = document.getElementById('btn-text');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const nameVal  = document.getElementById('form-name').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();

      btnSubmit.disabled = true;
      btnText.textContent = 'Sending…';
      feedback.className  = 'form-feedback';
      feedback.textContent = '';

      const accessKey = form.querySelector('input[name="access_key"]')?.value;

      // Test mode if no real key set
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        await delay(1200);
        showFeedback('success', `✓ Thanks, ${nameVal}! Message received. I'll reply to ${emailVal} within 24 hours.`);
        form.reset();
        resetBtn();
        return;
      }

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();

        if (res.ok) {
          showFeedback('success', `✓ Thanks, ${nameVal}! Message sent. I'll get back to ${emailVal} within 24 hours.`);
          form.reset();
        } else {
          showFeedback('error', `Error: ${data.message}`);
        }
      } catch {
        showFeedback('error', 'Network error. Please try again.');
      } finally {
        resetBtn();
      }
    });
  }

  const showFeedback = (type, msg) => {
    feedback.className   = `form-feedback ${type}`;
    feedback.textContent = msg;
  };
  const resetBtn = () => {
    btnSubmit.disabled  = false;
    btnText.textContent = 'Send Message';
  };
  const delay = ms => new Promise(r => setTimeout(r, ms));

});