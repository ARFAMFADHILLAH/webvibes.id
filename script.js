// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Form Submission dengan Formspree
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Simple validation
        if (name === '' || message === '') {
            showNotification('Harap isi nama lengkap dan pesan Anda!', 'error');
            return;
        }

        // Disable button during submission
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;

        try {
            // Kirim form menggunakan Formspree
            const formData = new FormData(this);
            
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification(`Terima kasih ${name}! Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.`, 'success');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    showNotification(data.errors.map(error => error.message).join(", "), 'error');
                } else {
                    throw new Error('Response not OK');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Oops! Terjadi kesalahan. Silakan coba lagi.', 'error');
        } finally {
            // Re-enable button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Header scroll effect
let scrollTimeout;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;

    // Debounce scroll event
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(5px)';
        }
    }, 10);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL hash
            history.pushState(null, null, targetId);
        }
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email === '') {
            showNotification('Harap masukkan alamat email Anda!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Harap masukkan alamat email yang valid!', 'error');
            return;
        }
        
        // Simulate API call
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Berlangganan...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Terima kasih telah berlangganan newsletter kami!', 'success');
            emailInput.value = '';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Animation on scroll dengan Intersection Observer (lebih efisien)
function initScrollAnimation() {
    const elements = document.querySelectorAll('.service-card, .team-member, .about-image, .contact-info, .value-item, .testimonial-card, .contact-form, .contact-image');
    
    // Set initial state untuk animated elements
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Gunakan Intersection Observer untuk performa lebih baik
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 1000;
                max-width: 400px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                animation: slideIn 0.3s ease;
            }
            .notification-success { background: #4CAF50; }
            .notification-error { background: #f44336; }
            .notification-info { background: #2196F3; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Page load handler
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    initScrollAnimation();
});

// Resize handler untuk mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Keyboard accessibility untuk mobile menu
if (hamburger) {
    hamburger.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// Preload images untuk performa lebih baik
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
}

// Initialize image preloading
preloadImages();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker terdaftar:', reg.scope))
      .catch(err => console.error('Service Worker gagal:', err));
  });
}
