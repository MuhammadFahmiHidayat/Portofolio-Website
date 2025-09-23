// Enhanced Portfolio JavaScript with theme toggle and improved mobile layout
class PortfolioApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.initializeAnimations();
        this.handleHashChange();
        this.startTypingAnimation();
    }

    setupTheme() {
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.querySelector('.theme-toggle');
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    setupEventListeners() {
        // Hash change handling
        window.addEventListener('hashchange', () => this.handleHashChange());
        window.addEventListener('load', () => this.handleHashChange());
        
        // Resize handling
        window.addEventListener('resize', () => this.handleWindowResize());
        
        // Mobile menu close on outside click
        document.addEventListener('click', (e) => this.closeMobileMenuOnOutsideClick(e));
        
        // Escape key handling
        document.addEventListener('keydown', (e) => this.closeMobileMenuOnEscape(e));
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    this.smoothScrollTo(href.substring(1));
                }
            });
        });
    }

    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupCardAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Update active nav link
                    const sectionId = entry.target.id;
                    if (sectionId && ['aboutme', 'skills', 'experience', 'achievement', 'contact'].includes(sectionId)) {
                        this.updateActiveNavLink(sectionId);
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '.about-section, .skills-section, .experience-section, .achievement-section, .contact-section, .why-choose-section, ' +
            '.skill-card, .experience-card, .certificate-item, .quality-card, .tool-item'
        );
        
        animatableElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });
    }

    setupHoverAnimations() {
        // Skill cards hover animation
        document.querySelectorAll('.skill-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                const icon = card.querySelector('.skill-icon');
                if (icon) icon.style.transform = 'rotate(10deg) scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                const icon = card.querySelector('.skill-icon');
                if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
            });
        });

        // Quality cards hover animation
        document.querySelectorAll('.quality-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                const icon = card.querySelector('.quality-icon');
                if (icon) icon.style.transform = 'rotate(5deg) scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                const icon = card.querySelector('.quality-icon');
                if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
            });
        });

        // Experience cards hover animation
        document.querySelectorAll('.experience-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            });
        });

        // Certificate hover animation
        document.querySelectorAll('.certificate-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px)';
                const img = item.querySelector('.certificate-img');
                if (img) img.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                const img = item.querySelector('.certificate-img');
                if (img) img.style.transform = 'scale(1)';
            });
        });

        // Tool items hover animation
        document.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }

    setupCardAnimations() {
        // Staggered animation for grid items
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -20px 0px'
        };

        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply staggered animation to grids
        document.querySelectorAll('.skills-grid, .qualities-grid, .certificate-grid, .tools-grid, .experience-grid').forEach(grid => {
            Array.from(grid.children).forEach(child => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            staggerObserver.observe(grid);
        });
    }

    startTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.borderRight = '3px solid #FD853A';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    typingElement.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing after delay
        setTimeout(typeWriter, 1000);
    }

    // Mobile menu functionality
    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            navMenu.classList.add('active');
            menuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenuOnOutsideClick(event) {
        const navbar = document.querySelector('.navbar');
        const navMenu = document.getElementById('navMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!navbar.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    closeMobileMenuOnEscape(event) {
        if (event.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    }

    handleWindowResize() {
        const navMenu = document.getElementById('navMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Navigation functionality
    showSection(sectionId) {
        this.closeMobileMenu();
        
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        history.replaceState(null, null, '#' + sectionId);
        this.updateActiveNavLink(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    smoothScrollTo(sectionId) {
        this.closeMobileMenu();
        
        if (!document.getElementById('home').classList.contains('active')) {
            this.showSection('home');
            setTimeout(() => {
                this.scrollToSection(sectionId);
            }, 100);
        } else {
            this.scrollToSection(sectionId);
        }
    }

    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.updateActiveNavLink(sectionId);
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        navMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkDataSection = link.getAttribute('data-section');
            
            if (linkHref === '#' + sectionId || linkDataSection === sectionId) {
                link.classList.add('active');
            }
        });
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            if (hash === 'home') {
                this.showSection('home');
            } else if (['aboutme', 'skills', 'experience', 'achievement', 'contact'].includes(hash)) {
                this.smoothScrollTo(hash);
            }
        } else {
            this.showSection('home');
        }
    }

    // Tab functionality for experience and achievement sections
    showExperienceTab(tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabContents.forEach(content => content.style.display = 'none');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        const targetTab = document.getElementById(tabName + '-tab');
        if (targetTab) {
            targetTab.style.display = 'block';
            targetTab.style.opacity = '0';
            targetTab.style.transform = 'translateY(20px)';
            
            // Animate in
            setTimeout(() => {
                targetTab.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetTab.style.opacity = '1';
                targetTab.style.transform = 'translateY(0)';
            }, 10);
        }
        
        // Update active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName) || 
                (tabName === 'internship' && btn.textContent.includes('Internship')) ||
                (tabName === 'organization' && btn.textContent.includes('Organization')) ||
                (tabName === 'work' && btn.textContent.includes('Work'))) {
                btn.classList.add('active');
            }
        });
    }

    showAchievementTab(tabName) {
        const tabContents = document.querySelectorAll('.achievement-tab-content');
        const tabButtons = document.querySelectorAll('.achievement-tab-btn');
        
        tabContents.forEach(content => content.style.display = 'none');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        const targetTab = document.getElementById(tabName + '-tab');
        if (targetTab) {
            targetTab.style.display = 'block';
            targetTab.style.opacity = '0';
            targetTab.style.transform = 'translateY(20px)';
            
            // Animate in
            setTimeout(() => {
                targetTab.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetTab.style.opacity = '1';
                targetTab.style.transform = 'translateY(0)';
            }, 10);
        }
        
        // Update active button
        document.querySelectorAll('.achievement-tab-btn').forEach(btn => {
            const btnText = btn.textContent.toLowerCase();
            if ((tabName.includes('internship') && btnText.includes('internship')) ||
                (tabName.includes('course') && btnText.includes('course')) ||
                (tabName.includes('competition') && btnText.includes('competition')) ||
                (tabName.includes('organization') && btnText.includes('organization')) ||
                (tabName.includes('webinar') && btnText.includes('webinar'))) {
                btn.classList.add('active');
            }
        });
    }
}

// Global functions for inline event handlers
function toggleTheme() {
    portfolioApp.toggleTheme();
}

function toggleMobileMenu() {
    portfolioApp.toggleMobileMenu();
}

function showSection(sectionId) {
    portfolioApp.showSection(sectionId);
}

function scrollToAboutMe() {
    portfolioApp.smoothScrollTo('aboutme');
}

function scrollToSkills() {
    portfolioApp.smoothScrollTo('skills');
}

function scrollToExperience() {
    portfolioApp.smoothScrollTo('experience');
}

function scrollToAchievement() {
    portfolioApp.smoothScrollTo('achievement');
}

function scrollToContact() {
    portfolioApp.smoothScrollTo('contact');
}

function showExperienceTab(tabName) {
    portfolioApp.showExperienceTab(tabName);
}

function showAchievementTab(tabName) {
    portfolioApp.showAchievementTab(tabName);
}

// Initialize the app
let portfolioApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portfolioApp = new PortfolioApp();
    });
} else {
    portfolioApp = new PortfolioApp();
}