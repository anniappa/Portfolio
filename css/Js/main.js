// Main application initialization
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize managers
        this.scrollManager = new ScrollManager();
        this.uiManager = new UIManager();
        this.threeScene = new ThreeScene();

        // Set up event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.threeScene.onWindowResize();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.scrollManager.scrollToElement(target);
                }
            });
        });

        // Language toggle
        document.querySelector('.lang-toggle').addEventListener('click', () => {
            this.uiManager.toggleLanguage();
        });

        // Mobile menu toggle
        document.querySelector('.nav-toggle').addEventListener('click', () => {
            this.uiManager.toggleMobileMenu();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.threeScene.update();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});