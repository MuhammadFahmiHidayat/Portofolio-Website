// Enhanced Portfolio JavaScript with all new features
class PortfolioApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLightboxIndex = 0;
        this.lightboxImages = [];
        this.backgroundState = 0; // For smooth gradient changes
        this.init();
    }

    init() {
        this.showPreloader();
        this.setupTheme();
        this.setupEventListeners();
        this.initializeAnimations();
        this.handleHashChange();
        this.setupLightbox();
        this.setupScrollableTabs();
        this.setupSmoothGradientChange();
    }

    // Preloader Animation
    showPreloader() {
        const preloader = document.getElementById('preloader');
        const loadingFill = document.querySelector('.loading-fill');
        const logoPreloader = document.querySelector('.logo-preloader');
        
        // Start loading animation
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Hide preloader after loading completes
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        this.startLetterAnimation();
                        this.startTypingAnimation();
                    }, 500);
                }, 300);
            }
            loadingFill.style.width = progress + '%';
        }, 100);

        // Rotate logo during loading
        logoPreloader.style.animation = 'spin 2s linear infinite';
    }

    // Letter by letter animation for headline
    startLetterAnimation() {
        const letterElement = document.querySelector('.letter-animate');
        if (!letterElement) return;

        const text = letterElement.innerHTML;
        letterElement.innerHTML = '';
        letterElement.style.opacity = '1';

        // Split text into individual letters while preserving HTML tags
        const letters = [];
        let inTag = false;
        let tagBuffer = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === '<') {
                inTag = true;
                tagBuffer = char;
            } else if (char === '>' && inTag) {
                inTag = false;
                tagBuffer += char;
                letters.push(tagBuffer);
                tagBuffer = '';
            } else if (inTag) {
                tagBuffer += char;
            } else if (char === ' ') {
                letters.push('<span class="letter">&nbsp;</span>');
            } else {
                letters.push(`<span class="letter" style="opacity: 0; transform: translateY(20px);">${char}</span>`);
            }
        }

        letterElement.innerHTML = letters.join('');

        // Animate letters one by one
        const letterSpans = letterElement.querySelectorAll('.letter');
        letterSpans.forEach((letter, index) => {
            if (letter.innerHTML !== '&nbsp;') {
                setTimeout(() => {
                    letter.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    letter.style.opacity = '1';
                    letter.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }

    setupSmoothGradientChange() {
        // Smooth background gradient animation
        document.body.style.background = 'linear-gradient(135deg, var(--bg-light) 0%, var(--bg-light) 50%, rgba(253, 133, 58, 0.05) 100%)';
        
        // Animate gradient on scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
            const hue = 200 + (scrollPercent * 160); // From blue to orange
            const opacity = 0.03 + (scrollPercent * 0.07);
            
            document.documentElement.style.setProperty('--dynamic-bg', 
                `linear-gradient(135deg, var(--bg-light) 0%, var(--bg-light) ${50 + scrollPercent * 30}%, hsla(${hue}, 70%, 60%, ${opacity}) 100%)`
            );
        });
    }

    setupTheme() {
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeContainer = document.querySelector('.theme-icon-container');
        const sunIcon = themeContainer.querySelector('.sun-icon');
        const moonIcon = themeContainer.querySelector('.moon-icon');
        
        // Add rotation animation
        themeContainer.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        themeContainer.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            if (this.currentTheme === 'dark') {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
            
            themeContainer.style.transform = 'rotate(0deg)';
        }, 250);
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
        
        // Scroll handling for navbar and timeline
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateTimelineProgress();
        });
        
        // Mobile menu close on outside click
        document.addEventListener('click', (e) => this.closeMobileMenuOnOutsideClick(e));
        
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            this.closeMobileMenuOnEscape(e);
            this.closeLightboxOnEscape(e);
        });
        
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

    // Progressive timeline fill animation
    updateTimelineProgress() {
        const timelineLines = document.querySelectorAll('.timeline-line');
        
        timelineLines.forEach((line, tabIndex) => {
            if (!line.parentElement.parentElement.style.display || line.parentElement.parentElement.style.display !== 'none') {
                const timeline = line.parentElement;
                const timelineTop = timeline.offsetTop;
                const timelineHeight = timeline.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                
                const timelineProgress = Math.max(0, Math.min(1, 
                    (scrollTop + windowHeight - timelineTop) / (timelineHeight + windowHeight)
                ));
                
                line.style.height = `${timelineProgress * 100}%`;
            }
        });
    }

    // Lightbox functionality
    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');

        // Click handlers for certificate images
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('certificate-img') || e.target.classList.contains('certificate-zoom')) {
                const certificateImg = e.target.classList.contains('certificate-img') ? 
                    e.target : e.target.closest('.certificate-item').querySelector('.certificate-img');
                const grid = certificateImg.closest('.certificate-grid');
                this.openLightbox(certificateImg, grid);
            }
        });

        // Close lightbox
        lightboxClose.addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox-overlay').addEventListener('click', () => this.closeLightbox());

        // Navigation
        lightboxPrev.addEventListener('click', () => this.prevImage());
        lightboxNext.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    openLightbox(clickedImg, grid) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCurrent = document.getElementById('lightbox-current');
        const lightboxTotal = document.getElementById('lightbox-total');

        // Get all images in the current grid
        this.lightboxImages = Array.from(grid.querySelectorAll('.certificate-img'));
        this.currentLightboxIndex = this.lightboxImages.indexOf(clickedImg);

        // Update lightbox
        lightboxImg.src = clickedImg.src;
        lightboxImg.alt = clickedImg.alt;
        lightboxCurrent.textContent = this.currentLightboxIndex + 1;
        lightboxTotal.textContent = this.lightboxImages.length;

        // Show lightbox with animation
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate image
        setTimeout(() => {
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 50);
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightboxImg.style.transform = 'scale(0.8)';
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    prevImage() {
        if (this.currentLightboxIndex > 0) {
            this.currentLightboxIndex--;
        } else {
            this.currentLightboxIndex = this.lightboxImages.length - 1;
        }
        this.updateLightboxImage();
    }

    nextImage() {
        if (this.currentLightboxIndex < this.lightboxImages.length - 1) {
            this.currentLightboxIndex++;
        } else {
            this.currentLightboxIndex = 0;
        }
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCurrent = document.getElementById('lightbox-current');
        const currentImg = this.lightboxImages[this.currentLightboxIndex];

        // Slide animation
        lightboxImg.style.transform = 'translateX(100px)';
        lightboxImg.style.opacity = '0';

        setTimeout(() => {
            lightboxImg.src = currentImg.src;
            lightboxImg.alt = currentImg.alt;
            lightboxCurrent.textContent = this.currentLightboxIndex + 1;
            
            lightboxImg.style.transform = 'translateX(-100px)';
            setTimeout(() => {
                lightboxImg.style.transform = 'translateX(0)';
                lightboxImg.style.opacity = '1';
            }, 50);
        }, 150);
    }

    closeLightboxOnEscape(event) {
        if (event.key === 'Escape') {
            const lightbox = document.getElementById('lightbox');
            if (lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        }
    }

    handleScroll() {
        // Check if we're at the top of the page (home section)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const homeSection = document.querySelector('.home-hero');
        
        if (scrollTop < 100) {
            // We're at the top, activate home
            this.updateActiveNavLink('home');
        } else {
            // Check which section is currently in view
            const sections = ['aboutme', 'skills', 'experience', 'achievement', 'contact'];
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop - navbarHeight - 100;
                    if (scrollTop >= sectionTop) {
                        this.updateActiveNavLink(sections[i]);
                        break;
                    }
                }
            }
        }
    }

    setupScrollableTabs() {
        // Make achievement tabs scrollable with touch
        const achievementTabs = document.querySelector('.achievement-tabs');
        if (achievementTabs) {
            let isScrolling = false;
            let startX = 0;
            let scrollLeft = 0;

            achievementTabs.addEventListener('mousedown', (e) => {
                isScrolling = true;
                startX = e.pageX - achievementTabs.offsetLeft;
                scrollLeft = achievementTabs.scrollLeft;
                achievementTabs.style.cursor = 'grabbing';
            });

            achievementTabs.addEventListener('mouseleave', () => {
                isScrolling = false;
                achievementTabs.style.cursor = 'grab';
            });

            achievementTabs.addEventListener('mouseup', () => {
                isScrolling = false;
                achievementTabs.style.cursor = 'grab';
            });

            achievementTabs.addEventListener('mousemove', (e) => {
                if (!isScrolling) return;
                e.preventDefault();
                const x = e.pageX - achievementTabs.offsetLeft;
                const walk = (x - startX) * 2;
                achievementTabs.scrollLeft = scrollLeft - walk;
            });

            // Touch events for mobile
            achievementTabs.addEventListener('touchstart', (e) => {
                startX = e.touches[0].pageX;
                scrollLeft = achievementTabs.scrollLeft;
            });

            achievementTabs.addEventListener('touchmove', (e) => {
                if (!startX) return;
                const x = e.touches[0].pageX;
                const walk = (x - startX) * 2;
                achievementTabs.scrollLeft = scrollLeft - walk;
            });

            achievementTabs.addEventListener('touchend', () => {
                startX = 0;
            });
        }
    }

    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupCardAnimations();
        this.setupTimelineAnimations();
        this.setupSectionTransitions();
    }

    setupSectionTransitions() {
        // Add smooth transitions between sections/tabs
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe tab contents for smooth transitions
        document.querySelectorAll('.tab-content, .achievement-tab-content').forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            observer.observe(content);
        });
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
            '.skill-card, .certificate-item, .quality-card, .tool-item, .timeline-item'
        );
        
        animatableElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });

        // Add special observer for home section to handle navbar
        const homeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const homeHero = document.querySelector('.home-hero');
                    if (homeHero && this.isElementInViewport(homeHero)) {
                        this.updateActiveNavLink('home');
                    }
                }
            });
        }, { threshold: 0.3 });

        const homeSection = document.querySelector('.home-hero');
        if (homeSection) {
            homeObserver.observe(homeSection);
        }
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    setupTimelineAnimations() {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-timeline');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.timeline-item').forEach(item => {
            timelineObserver.observe(item);
        });
    }

    setupHoverAnimations() {
        // Enhanced skill cards hover animation
        document.querySelectorAll('.skill-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 25px 35px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)';
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'rotate(10deg) scale(1.1)';
                    icon.style.background = 'linear-gradient(135deg, var(--primary-color), var(--accent-color))';
                    icon.style.color = 'white';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                    icon.style.background = '';
                    icon.style.color = '';
                }
            });
        });

        // Enhanced quality cards hover animation
        document.querySelectorAll('.quality-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                const icon = card.querySelector('.quality-icon');
                if (icon) {
                    icon.style.transform = 'rotate(5deg) scale(1.1)';
                    icon.style.background = 'linear-gradient(135deg, var(--primary-color), var(--accent-color))';
                    icon.style.color = 'white';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                const icon = card.querySelector('.quality-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                    icon.style.background = '';
                    icon.style.color = '';
                }
            });
        });

        // Enhanced experience cards hover animation
        document.querySelectorAll('.experience-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });

        // Enhanced certificate hover animation with zoom overlay
        document.querySelectorAll('.certificate-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px)';
                const img = item.querySelector('.certificate-img');
                const overlay = item.querySelector('.certificate-overlay');
                if (img) img.style.transform = 'scale(1.05)';
                if (overlay) overlay.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                const img = item.querySelector('.certificate-img');
                const overlay = item.querySelector('.certificate-overlay');
                if (img) img.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
            });
        });

        // Tool items hover animation
        document.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
                const logo = item.querySelector('.tool-logo');
                if (logo) logo.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                const logo = item.querySelector('.tool-logo');
                if (logo) logo.style.transform = 'scale(1) rotate(0deg)';
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
        document.querySelectorAll('.skills-grid, .qualities-grid, .certificate-grid, .tools-grid').forEach(grid => {
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

        // Start typing after delay (after letter animation)
        setTimeout(typeWriter, 2000);
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
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Smooth fade-in transition
            setTimeout(() => {
                targetSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
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

    // Enhanced tab functionality with smooth transitions
    showExperienceTab(tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        // Hide all tabs with fade out
        tabContents.forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        });
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Show target tab after delay
        setTimeout(() => {
            const targetTab = document.getElementById(tabName + '-tab');
            if (targetTab) {
                targetTab.style.display = 'block';
                targetTab.style.opacity = '0';
                targetTab.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    targetTab.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    targetTab.style.opacity = '1';
                    targetTab.style.transform = 'translateY(0)';
                }, 50);

                // Trigger timeline animation with stagger
                setTimeout(() => {
                    const timelineItems = targetTab.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-timeline');
                        }, index * 200);
                    });
                }, 200);
            }
        }, 300);
        
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
        
        // Hide all tabs with fade out
        tabContents.forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        });
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Show target tab after delay
        setTimeout(() => {
            const targetTab = document.getElementById(tabName + '-tab');
            if (targetTab) {
                targetTab.style.display = 'block';
                targetTab.style.opacity = '0';
                targetTab.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    targetTab.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    targetTab.style.opacity = '1';
                    targetTab.style.transform = 'translateY(0)';
                }, 50);

                // Trigger certificate animations with stagger
                setTimeout(() => {
                    const certificates = targetTab.querySelectorAll('.certificate-item');
                    certificates.forEach((cert, index) => {
                        setTimeout(() => {
                            cert.style.opacity = '1';
                            cert.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 200);
            }
        }, 300);
        
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