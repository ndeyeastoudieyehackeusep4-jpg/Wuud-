/**
 * PRODUITS PAGE MODULE - SOLID PRINCIPLES
 * 
 * Single Responsibility Principle: Each class has one specific responsibility
 * Open/Closed Principle: Open for extension, closed for modification
 * Liskov Substitution Principle: Derived classes can substitute base classes
 * Interface Segregation Principle: Specific interfaces for specific needs
 * Dependency Inversion Principle: Depend on abstractions, not concretions
 */

// ============================================
// BASE CLASSES - ABSTRACTION LAYER
// ============================================

/**
 * Base Component Class
 * Provides common functionality for all page components
 */
class Component {
    constructor(selector) {
        this.element = document.querySelector(selector);
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    addClass(className) {
        if (this.element) {
            this.element.classList.add(className);
        }
    }

    removeClass(className) {
        if (this.element) {
            this.element.classList.remove(className);
        }
    }
}

/**
 * Animation Handler Interface
 * Defines contract for animation implementations
 */
class AnimationHandler {
    animate(element) {
        throw new Error('animate() must be implemented');
    }
}

// ============================================
// CONCRETE IMPLEMENTATIONS
// ============================================

/**
 * Scroll Animation Handler
 * Handles scroll-based animations
 */
class ScrollAnimationHandler extends AnimationHandler {
    constructor() {
        super();
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
    }

    animate(elements) {
        // Products should be visible by default, animation is optional enhancement
        elements.forEach(element => {
            // Add fade-in class but immediately show the element
            element.classList.add('fade-in');
            
            // Check if element is already visible (for immediate display)
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Element is already visible, show it immediately
                element.classList.add('fade-in-visible');
            }
        });
    }
}

/**
 * Hero Section Component
 * Manages the hero section functionality
 */
class HeroSection extends Component {
    constructor(selector) {
        super(selector);
        this.init();
    }

    init() {
        if (!this.element) return;
        
        // Add parallax effect on scroll
        this.addParallaxEffect();
    }

    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (this.element) {
                this.element.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
            }
        });
    }
}

/**
 * Content Section Component
 * Manages content sections with animations
 */
class ContentSection extends Component {
    constructor(selector, animationHandler) {
        super(selector);
        this.animationHandler = animationHandler;
        this.init();
    }

    init() {
        if (!this.element) return;
        
        // Ensure content is visible immediately by adding the visible class
        this.element.classList.add('fade-in-visible');
    }
}

/**
 * Collections Section Component
 * Manages the collections display
 */
class CollectionsSection extends Component {
    constructor(selector, animationHandler) {
        super(selector);
        this.animationHandler = animationHandler;
        this.init();
    }

    init() {
        if (!this.element) return;
        
        // Ensure content is visible immediately by adding the visible class
        this.element.classList.add('fade-in-visible');
    }
}

/**
 * Image Loader
 * Handles lazy loading and optimization of images
 */
class ImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.lazyLoad();
        } else {
            this.loadAllImages();
        }
    }

    lazyLoad() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }

    loadAllImages() {
        this.images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Page Manager
 * Orchestrates all page components
 */
class ProduitsPageManager {
    constructor() {
        this.components = [];
        this.animationHandler = new ScrollAnimationHandler();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize hero section
        const heroSection = new HeroSection('.creations-hero');
        this.components.push(heroSection);

        // Initialize content section
        const contentSection = new ContentSection('.maniere-creer', this.animationHandler);
        this.components.push(contentSection);

        // Initialize collections section
        const collectionsSection = new CollectionsSection('.collections', this.animationHandler);
        this.components.push(collectionsSection);

        // Initialize image loader
        new ImageLoader();

        // Add smooth scroll behavior
        this.addSmoothScroll();
    }

    addSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize the page manager
const produitsPage = new ProduitsPageManager();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProduitsPageManager,
        HeroSection,
        ContentSection,
        CollectionsSection,
        ImageLoader,
        ScrollAnimationHandler
    };
}
