document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Sticky Navigation Header & Back-To-Top Toggle ---
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Header Sticky Glass Transition
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to Top Button Visibility
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  // Back to Top Action
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- Mobile Navigation Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Toggle hamburger icon animation states
    const spans = mobileToggle.querySelectorAll('span');
    if (mobileToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // --- Intersection Observer for Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger active state when section enters sweet spot
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target); // Trigger animation once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- Dynamic Timeline Progress Filler ---
  const timelineContainer = document.querySelector('.timeline-container');
  const progressFill = document.getElementById('timeline-progress-fill');
  const stepItems = document.querySelectorAll('.timeline-step-item');

  function updateTimeline() {
    if (!timelineContainer) return;
    const rect = timelineContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how much of the timeline has been scrolled past
    const containerHeight = rect.height;
    const scrollStart = viewportHeight * 0.75; // Start filling when timeline enters 75% height
    const scrolledAmount = scrollStart - rect.top;
    
    let percent = Math.min(Math.max((scrolledAmount / containerHeight) * 100, 0), 100);
    
    // Check orientation matches responsive design
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) {
      progressFill.style.height = `${percent}%`;
      progressFill.style.width = '100%';
    } else {
      progressFill.style.width = `${percent}%`;
      progressFill.style.height = '100%';
    }

    // Activate/deactivate individual steps as they cross 60% viewport height
    stepItems.forEach(item => {
      const node = item.querySelector('.timeline-node');
      const nodeRect = node.getBoundingClientRect();
      if (nodeRect.top + nodeRect.height / 2 < viewportHeight * 0.6) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Bind scrolling timelines
  window.addEventListener('scroll', updateTimeline);
  window.addEventListener('resize', updateTimeline);
  updateTimeline(); // Initial call

  // --- FAQ Collapsible Accordions ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other panels
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = '0px';
        }
      });

      // Toggle current panel
      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- Modal Popup Dialogs ---
  const modal = document.getElementById('audit-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close');
  const auditForm = document.getElementById('audit-form');

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtn.addEventListener('click', closeModal);

  // Close when clicking gray backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape keypress
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal form submit redirection simulation
  auditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('audit-name').value;
    const email = document.getElementById('audit-email').value;
    const website = document.getElementById('audit-website').value;
    
    // Custom Success Card HTML Content Injection
    const cardContent = modal.querySelector('.modal-card');
    const originalHTML = cardContent.innerHTML;
    
    cardContent.innerHTML = `
      <button class="modal-close" id="modal-success-close" aria-label="Close modal"><i data-lucide="x" size="18"></i></button>
      <div style="text-align: center; padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(10, 132, 255, 0.1); border: 2px solid var(--accent-primary); display: flex; align-items: center; justify-content: center; color: var(--accent-primary); margin-bottom: 8px;">
          <i data-lucide="check-circle-2" size="32"></i>
        </div>
        <h3 class="modal-title gradient-text" style="margin-bottom: 0;">Strategy Call Booked!</h3>
        <p class="modal-desc" style="margin-bottom: 0;">Thank you, ${name}. We've received your details for <strong>${website}</strong>.</p>
        <p style="font-size: 0.9rem; color: var(--text-gray);">A meeting link and confirmation have been dispatched to <strong>${email}</strong>.</p>
        <button class="btn btn-primary" id="success-close-btn" style="margin-top: 10px; width: 100%;">Done</button>
      </div>
    `;

    // Reinitialize icons in success card
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Success close logic
    const closeSuccess = () => {
      closeModal();
      setTimeout(() => {
        cardContent.innerHTML = originalHTML;
        
        // Re-attach listeners to original elements
        const newCloseBtn = document.getElementById('modal-close');
        newCloseBtn.addEventListener('click', closeModal);
        
        const newAuditForm = document.getElementById('audit-form');
        newAuditForm.addEventListener('submit', arguments.callee);
        
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 500);
    };

    document.getElementById('modal-success-close').addEventListener('click', closeSuccess);
    document.getElementById('success-close-btn').addEventListener('click', closeSuccess);
  });
});
