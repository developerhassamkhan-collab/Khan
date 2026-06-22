/**
 * PREMIUM PORTFOLIO — INTERACTION & ANIMATION ENGINE v2.0
 * Developer: Hassam Khan
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. PARTICLES CANVAS SYSTEM
  // ============================================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '99,102,241' : '6,182,212';
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
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    particlesArray = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < Math.min(count, 100); i++) {
      particlesArray.push(new Particle());
    }
  };

  const connectParticles = () => {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  };

  initParticles();
  animateParticles();


  // ============================================================
  // 2. HEADER SCROLL STATE
  // ============================================================
  const header = document.querySelector('.main-header');
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ============================================================
  // 2b. LEFT-SIDE SCROLL PROGRESS INDICATOR
  // ============================================================
  const scrollTrack = document.getElementById('scroll-progress-track');
  const scrollFill  = document.getElementById('scroll-progress-fill');
  const scrollDot   = document.getElementById('scroll-progress-dot');

  if (scrollTrack && scrollFill && scrollDot) {
    const updateScrollProgress = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1) * 100;

      // Show the track only after scrolling past the hero
      if (scrollTop > 200) {
        scrollTrack.classList.add('visible');
      } else {
        scrollTrack.classList.remove('visible');
      }

      // Update the fill height and dot position
      scrollFill.style.height = scrollPercent + '%';
      scrollDot.style.top     = `calc(${scrollPercent}% - 5px)`;
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }


  // ============================================================
  // 3. MOBILE MENU OVERLAY
  // ============================================================
  const mobileToggle  = document.getElementById('mobile-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks   = document.querySelectorAll('.mobile-nav-item');

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));


  // ============================================================
  // 4. ACTIVE NAVIGATION HIGHLIGHTER
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-item');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 130;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) item.classList.add('active');
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();


  // ============================================================
  // 5. HEAVY SCROLL REVEAL SYSTEM
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || 0);
        setTimeout(() => el.classList.add('revealed'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  // ============================================================
  // 6. PARALLAX SCROLL ON HERO IMAGE
  // ============================================================
  const heroImg = document.querySelector('.hero-image-container');
  const heroText = document.querySelector('.hero-text-content');

  if (heroImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroImg.style.transform  = `translateY(${scrollY * 0.08}px)`;
            heroText.style.transform = `translateY(${scrollY * 0.04}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  // ============================================================
  // 7. TYPEWRITER EFFECT ON HERO TITLE
  // ============================================================
  const titles = ['WordPress & Webflow Developer', 'Figma to Code Expert', 'Elementor Pro Specialist', 'Web Performance Guru'];
  let titleIndex    = 0;
  let charIndex     = 0;
  let isDeleting    = false;
  let typewriterEl  = document.querySelector('.hero-subtitle');

  if (typewriterEl) {
    const type = () => {
      const currentTitle = titles[titleIndex];
      const displayed    = isDeleting
        ? currentTitle.substring(0, charIndex - 1)
        : currentTitle.substring(0, charIndex + 1);

      typewriterEl.textContent = displayed;
      charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

      let speed = isDeleting ? 60 : 90;

      if (!isDeleting && charIndex === currentTitle.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 400;
      }

      setTimeout(type, speed);
    };

    // Start typewriter after hero reveal animation completes
    setTimeout(type, 800);
  }


  // ============================================================
  // 8. SKILLS VIEWPORT ANIMATOR (COUNT-UP + PROGRESS BAR)
  // ============================================================
  const skillsSection   = document.getElementById('skills');
  const skillPercentEls = document.querySelectorAll('.skill-percent');
  const skillBarFills   = document.querySelectorAll('.progress-bar-fill');
  let skillsAnimated    = false;

  const animateCountUp = (el, target, duration = 1400) => {
    let current  = 0;
    const start  = performance.now();
    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 4);
      current        = Math.round(ease * target);
      el.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const triggerSkillsAnimation = () => {
    if (skillsAnimated) return;
    skillBarFills.forEach((fill, i) => {
      const percentEl    = skillPercentEls[i];
      const targetVal    = parseInt(percentEl.getAttribute('data-target'));
      setTimeout(() => {
        fill.style.width = targetVal + '%';
        animateCountUp(percentEl, targetVal);
      }, i * 120);
    });
    skillsAnimated = true;
  };

  const skillsObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) triggerSkillsAnimation(); }),
    { threshold: 0.15 }
  );
  if (skillsSection) skillsObserver.observe(skillsSection);


  // ============================================================
  // 9. MOUSE-TRACKING GLOW ON SERVICE CARDS
  // ============================================================
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });


  // ============================================================
  // 10. COUNTER ANIMATION FOR HERO STATS (COUNT-UP ON APPEAR)
  // ============================================================
  const heroSection = document.getElementById('home');
  if (heroSection) {
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger stagger on stat boxes
          document.querySelectorAll('.stat-box').forEach((box, i) => {
            setTimeout(() => {
              box.style.opacity    = '1';
              box.style.transform  = 'translateY(0)';
            }, 800 + i * 150);
          });
          statObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(heroSection);
  }


  // ============================================================
  // 11. CONTACT FORM HANDLER (Web3Forms)
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  const feedbackEl  = document.getElementById('form-feedback');
  const btnSubmit   = document.getElementById('btn-submit-form');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameVal  = document.getElementById('form-name').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();

      btnSubmit.disabled = true;
      const btnSpan = btnSubmit.querySelector('span');
      const origText = btnSpan.textContent;
      btnSpan.textContent = 'Sending...';
      feedbackEl.className = 'form-feedback-message';
      feedbackEl.textContent = '';

      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');

      if (!accessKeyInput || accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
        setTimeout(() => {
          feedbackEl.className = 'form-feedback-message warning';
          feedbackEl.textContent = '[Test Mode] Message simulated successfully!';
          setTimeout(() => {
            feedbackEl.className = 'form-feedback-message success';
            feedbackEl.innerHTML = `✓ Thanks, ${nameVal}! Message received. I'll reply to ${emailVal} within 24 hours.`;
            btnSubmit.disabled   = false;
            btnSpan.textContent  = origText;
            contactForm.reset();
          }, 1500);
        }, 1000);
        return;
      }

      const formData = new FormData(contactForm);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      .then(async res => {
        const json = await res.json();
        if (res.status === 200) {
          feedbackEl.className = 'form-feedback-message success';
          feedbackEl.innerHTML = `✓ Thanks, ${nameVal}! Message sent. I'll get back to ${emailVal} within 24 hours.`;
          contactForm.reset();
        } else {
          feedbackEl.className = 'form-feedback-message error';
          feedbackEl.textContent = `Error: ${json.message}`;
        }
      })
      .catch(() => {
        feedbackEl.className = 'form-feedback-message error';
        feedbackEl.textContent = 'Network error. Please try again.';
      })
      .finally(() => {
        btnSubmit.disabled  = false;
        btnSpan.textContent = origText;
      });
    });
  }


  // ============================================================
  // 12. SMOOTH ANCHOR SCROLL WITH HIGHLIGHT EFFECT
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ============================================================
  // 13. TILT EFFECT ON PROFILE IMAGE CARD
  // ============================================================
  const imgWrapper = document.querySelector('.image-wrapper');
  if (imgWrapper) {
    imgWrapper.addEventListener('mousemove', e => {
      const rect   = imgWrapper.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = dy * -6;
      const rotY   = dx * 6;
      imgWrapper.style.transform      = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      imgWrapper.style.transition     = 'transform 0.1s ease';
    });
    imgWrapper.addEventListener('mouseleave', () => {
      imgWrapper.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      imgWrapper.style.transition = 'transform 0.5s ease';
    });
  }


  // ============================================================
  // 14. SECTION FADE-IN STAGGER ON TIMELINE ITEMS
  // ============================================================
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  timelineItems.forEach(item => timelineObserver.observe(item));


  // ============================================================
  // 15. FLOATING TAGS ANIMATION INITIALIZATION
  // ============================================================
  // Tags are animated via CSS but we add a small random offset for variety
  document.querySelectorAll('.floating-tag').forEach((tag, i) => {
    tag.style.animationDuration = `${3.5 + i * 0.8}s`;
    tag.style.animationDelay    = `${i * 0.6}s`;
  });


  // ============================================================
  // 16. PAGE LOADING FADE-IN
  // ============================================================
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

});
