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

    // Enhanced hover effects for desktop
    if (window.innerWidth >= 769) {
        // Add hover effect for skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                const heading = this.querySelector('h3');
                const paragraph = this.querySelector('p');
                
                if (icon) {
                    icon.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    icon.style.transform = 'scale(1.2) translateY(-5px)';
                }
                
                // Add staggered animation to heading and paragraph
                if (heading) {
                    heading.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease';
                    heading.style.transform = 'translateY(-5px)';
                    heading.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                }
                
                if (paragraph) {
                    setTimeout(() => {
                        paragraph.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        paragraph.style.transform = 'translateY(-3px)';
                    }, 100);
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                const heading = this.querySelector('h3');
                const paragraph = this.querySelector('p');
                
                if (icon) {
                    icon.style.transform = 'scale(1) translateY(0)';
                }
                
                if (heading) {
                    heading.style.transform = 'translateY(0)';
                    heading.style.color = '';
                }
                
                if (paragraph) {
                    paragraph.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Add hover effect for publications
        const publications = document.querySelectorAll('.publication');
        publications.forEach(pub => {
            pub.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease';
                this.style.zIndex = '1';
                
                // Add subtle movement to the text and force color change
                const link = this.querySelector('a');
                if (link) {
                    // Force color change directly
                    link.style.color = document.body.classList.contains('dark-mode') ? '#bd5cff' : '#bd5cff';
                    link.style.textShadow = '0 0 8px rgba(189, 92, 255, 0.3)';
                    link.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease, text-shadow 0.3s ease';
                    link.style.display = 'inline-block';
                    link.style.transform = 'translateX(5px)';
                    
                    // Also apply to all spans and em elements inside
                    const spans = link.querySelectorAll('span, em, sub');
                    spans.forEach(span => {
                        span.style.color = document.body.classList.contains('dark-mode') ? '#bd5cff' : '#bd5cff';
                        span.style.transition = 'color 0.3s ease';
                    });
                }
            });
            
            pub.addEventListener('mouseleave', function() {
                this.style.zIndex = '0';
                
                const link = this.querySelector('a');
                if (link) {
                    link.style.transform = 'translateX(0)';
                    link.style.color = '';
                    link.style.textShadow = '';
                    
                    // Reset spans and em elements
                    const spans = link.querySelectorAll('span, em, sub');
                    spans.forEach(span => {
                        span.style.color = '';
                    });
                    
                    // Stop any animations
                    const animations = link.getAnimations();
                    animations.forEach(animation => animation.cancel());
                }
            });
        });
        
        // Add magnetic effect to the logo
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mousemove', function(e) {
                const bounds = this.getBoundingClientRect();
                const mouseX = e.clientX - bounds.left;
                const mouseY = e.clientY - bounds.top;
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;
                const maxDistance = 10;
                
                const moveX = (mouseX - centerX) / centerX * maxDistance;
                const moveY = (mouseY - centerY) / centerY * maxDistance;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
            });
            
            logo.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0) scale(1)';
            });
        }
        
        // Add subtle parallax effect to sections
        const allSections = document.querySelectorAll('section');
        allSections.forEach(section => {
            section.addEventListener('mousemove', function(e) {
                // Only apply to desktop and if section is in view
                if (window.innerWidth >= 769 && this.classList.contains('in-view')) {
                    const sectionRect = this.getBoundingClientRect();
                    const sectionWidth = sectionRect.width;
                    const sectionHeight = sectionRect.height;
                    
                    // Calculate mouse position relative to section center
                    const mouseX = e.clientX - sectionRect.left;
                    const mouseY = e.clientY - sectionRect.top;
                    
                    // Calculate percentage from center (-50 to 50)
                    const xPercent = ((mouseX / sectionWidth) - 0.5) * 100;
                    const yPercent = ((mouseY / sectionHeight) - 0.5) * 100;
                    
                    // Apply subtle rotation and movement
                    const maxTilt = 0.5; // degrees
                    const maxMove = 5; // pixels
                    
                    this.style.transform = `perspective(1000px) 
                                          rotateX(${-yPercent * (maxTilt/50)}deg) 
                                          rotateY(${xPercent * (maxTilt/50)}deg)
                                          translateX(${xPercent * (maxMove/50)}px)
                                          translateY(${yPercent * (maxMove/50)}px)`;
                    
                    // Move elements inside the section with a parallax effect
                    const cards = this.querySelectorAll('.skill-card, .publication, .wrapper');
                    cards.forEach(card => {
                        // Create a subtle parallax effect for inner elements
                        const depth = 0.05; // Adjust for more/less movement
                        card.style.transform = `translate(${-xPercent * depth}px, ${-yPercent * depth}px)`;
                    });
                }
            });
            
            section.addEventListener('mouseleave', function() {
                // Reset transform when mouse leaves
                this.style.transform = '';
                
                // Reset all cards inside
                const cards = this.querySelectorAll('.skill-card, .publication, .wrapper');
                cards.forEach(card => {
                    card.style.transform = '';
                });
            });
        });
        
        // Add hover effect to education cards
        const educationCards = document.querySelectorAll('.wrapper');
        educationCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const degree = this.querySelector('.degree');
                const place = this.querySelector('.place');
                const percentages = this.querySelectorAll('.percentage');
                
                if (degree) {
                    degree.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease';
                    degree.style.transform = 'translateY(-3px)';
                    degree.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                }
                
                if (place) {
                    setTimeout(() => {
                        place.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        place.style.transform = 'translateY(-2px)';
                    }, 100);
                }
                
                if (percentages.length) {
                    percentages.forEach((percentage, index) => {
                        setTimeout(() => {
                            percentage.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                            percentage.style.transform = 'translateY(-1px)';
                        }, 150 + (index * 50));
                    });
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const degree = this.querySelector('.degree');
                const place = this.querySelector('.place');
                const percentages = this.querySelectorAll('.percentage');
                
                if (degree) {
                    degree.style.transform = 'translateY(0)';
                    degree.style.color = '';
                }
                
                if (place) {
                    place.style.transform = 'translateY(0)';
                }
                
                if (percentages.length) {
                    percentages.forEach(percentage => {
                        percentage.style.transform = 'translateY(0)';
                    });
                }
            });
        });
    }
}); 