/**
 * Module de Navigation - Respecte le principe SOLID (Single Responsibility)
 * Gère uniquement la navigation active
 */
const NavigationModule = (() => {
    const init = () => {
        setActiveLink();
        window.addEventListener('hashchange', setActiveLink);
    };

    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav a');

        links.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href').split('/').pop() || 'index.html';
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    };

    return { init };
})();

/**
 * Module d'Animations - Respecte le principe SOLID (Single Responsibility)
 * Gère les animations au scroll
 */
const AnimationModule = (() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const init = () => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(handleIntersection, observerOptions);
            
            const elementsToAnimate = document.querySelectorAll(
                '.valeur-detail-card, .pourquoi-images img, .materiaux-description'
            );
            
            elementsToAnimate.forEach(element => {
                observer.observe(element);
            });
        }
    };

    const handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    return { init };
})();

/**
 * Module de Gestion des Boutons - Respecte le principe SOLID (Open/Closed)
 * Facile d'ajouter de nouveaux boutons sans modifier le code existant
 */
const ButtonModule = (() => {
    const init = () => {
        attachEventListeners();
    };

    const attachEventListeners = () => {
        const buttons = document.querySelectorAll('.btn-decouvrir, .btn-explorer, .btn-produits');
        buttons.forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });
    };

    const handleButtonClick = (e) => {
        const button = e.target;
        button.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    };

    return { init };
})();

/**
 * Module de Formulaire/Contact - Extensible pour futures intégrations
 */
const ContactModule = (() => {
    const init = () => {
        const contactForm = document.querySelector('form[name="contact"]');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // À implémenter selon les besoins
        console.log('Form submitted - À implémenter');
    };

    return { init };
})();

/**
 * Module Utilitaire - Respecte le principe SOLID (DRY - Don't Repeat Yourself)
 * Fonctions réutilisables
 */
const UtilityModule = (() => {
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    return { smoothScroll, debounce };
})();

/**
 * Application Bootstrap - Initialise tous les modules
 * Respecte le principe SOLID (Dependency Inversion)
 */
const App = (() => {
    const init = () => {
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeModules);
        } else {
            initializeModules();
        }
    };

    const initializeModules = () => {
        NavigationModule.init();
        AnimationModule.init();
        ButtonModule.init();
        ContactModule.init();
    };

    return { init };
})();

// Démarrage de l'application
App.init();
