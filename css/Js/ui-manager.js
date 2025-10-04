// UI state management
class UIManager {
    constructor() {
        this.currentLanguage = 'en';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupFormHandling();
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking on links
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    toggleMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        toggle.classList.toggle('active');
        menu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        this.isMobileMenuOpen = false;
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'pl' : 'en';
        
        // Update UI elements based on language
        this.updateLanguageUI();
        
        // In a real implementation, you would:
        // 1. Update all text content
        // 2. Trigger content reload from CMS
        // 3. Update meta tags
    }

    updateLanguageUI() {
        const toggle = document.querySelector('.lang-toggle');
        if (toggle) {
            toggle.textContent = this.currentLanguage === 'en' ? 'EN / PL' : 'PL / EN';
        }
    }

    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // In production, replace with your form handling endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}
