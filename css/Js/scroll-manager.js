// Scroll management with smooth animations
class ScrollManager {
    constructor() {
        this.currentScroll = 0;
        this.targetScroll = 0;
        this.ease = 0.1;
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupScrollAnimations();
    }

    setupSmoothScroll() {
        // Use native smooth scroll for better performance
        // Additional custom easing can be added here
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger 3D animations if element has data-project
                    const projectId = entry.target.getAttribute('data-project');
                    if (projectId) {
                        this.triggerProjectAnimation(projectId);
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with fade-in class
        document.querySelectorAll('.fade-in, .project-item').forEach(el => {
            observer.observe(el);
        });
    }

    scrollToElement(element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    triggerProjectAnimation(projectId) {
        // This will be handled by the ThreeScene class
        console.log(`Animating project ${projectId}`);
    }

    getScrollProgress() {
        return (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight));
    }
}