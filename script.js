document.addEventListener('DOMContentLoaded', function() {
    // Super simple dark mode implementation
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check if dark mode was previously enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Toggle dark mode on click
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            icon.className = 'fas fa-sun';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            icon.className = 'fas fa-moon';
        }
        
        // Add animation effect
        themeToggle.classList.add('clicked');
        setTimeout(() => {
            themeToggle.classList.remove('clicked');
        }, 300);
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Bottom Navigation Active State
    const sections = document.querySelectorAll('section');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-container .nav-item');
    const desktopNavItems = document.querySelectorAll('.nav-links a');
    
    function setActiveNavItem() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update bottom nav
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + currentSection) {
                item.classList.add('active');
            }
        });
        
        // Update desktop nav
        desktopNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + currentSection) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    window.addEventListener('load', setActiveNavItem);

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (hamburger && hamburger.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70; // Adjust based on your header height
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll animation to elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add in-view class to make element visible
                entry.target.classList.add('in-view');
                
                // If it's a section, animate its children with staggered delay
                if (entry.target.tagName.toLowerCase() === 'section') {
                    const children = entry.target.querySelectorAll('.skill-card, .publication, .wrapper');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('in-view');
                        }, 100 * (index + 1));
                    });
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should animate
    document.querySelectorAll('section, .contact-item.mobile-only').forEach(el => {
        observer.observe(el);
    });
    
    // Add touch effects for mobile
    const touchElements = document.querySelectorAll('.skill-card, .publication, .contact div, .theme-toggle');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            element.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Separate observer for mobile contact items with different timing
    const contactObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add small delay before starting animation
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, 300 + (200 * index));
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });

    // Observe mobile contact items
    document.querySelectorAll('.contact-item.mobile-only').forEach(el => {
        contactObserver.observe(el);
    });
}); 