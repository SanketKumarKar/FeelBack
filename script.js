// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const stickyCTA = document.getElementById('stickyCTA');
const experienceCounter = document.getElementById('experienceCounter');
const timelineTrack = document.getElementById('timelineTrack');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initCounters();
    initTestimonialCarousel();
    initStickyCtA();
    initScrollAnimations();
    initTimelineInteraction();
    initFormHandling();
    initVideoPlaceholder();
    initAdvancedInteractions();
    initMobileOptimizations();
    optimizeMobilePerformance();
    initMobilePerformanceMonitoring();
    initNetworkAwareLoading();
});

// Initialize advanced interactions
function initAdvancedInteractions() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.primary-cta, .secondary-cta, .submit-btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            gsap.to(e.target, {
                scale: 1.05,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        button.addEventListener('mouseleave', (e) => {
            gsap.to(e.target, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        button.addEventListener('click', (e) => {
            gsap.to(e.target, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            });
        });
    });
    
    // Enhanced card interactions
    const cards = document.querySelectorAll('.step, .feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            gsap.to(e.target, {
                y: -5,
                rotationY: 2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', (e) => {
            gsap.to(e.target, {
                y: 0,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Magnetic effect for logo
    const logo = document.querySelector('.logo-container');
    if (logo) {
        logo.addEventListener('mousemove', (e) => {
            const rect = logo.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(logo, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        logo.addEventListener('mouseleave', () => {
            gsap.to(logo, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
    
    // Newsletter form enhancement
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            const btn = newsletterForm.querySelector('.newsletter-btn');
            
            if (input.value.trim()) {
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        btn.textContent = '✓ Subscribed!';
                        input.value = '';
                        setTimeout(() => {
                            btn.textContent = 'Subscribe';
                        }, 2000);
                    }
                });
            }
        });
    }
}

// Initialize enhanced entrance animations
function initAnimations() {
    // Ensure hero elements are visible first
    gsap.set(['.hero-title', '.hero-subtitle', '.hero-cta', '.logo-container'], { opacity: 1 });
    
    // Enhanced hero animations with playful bounces and professional timing
    const tl = gsap.timeline();
    
    tl.fromTo('.logo-container', {
        scale: 0,
        rotation: 360,
        opacity: 0,
        y: -100
    }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2
    })
    .fromTo('.hero-title .glitch-text', {
        y: 80,
        opacity: 0,
        rotationX: 90
    }, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1,
        ease: "back.out(1.7)"
    }, "-=0.6")
    .fromTo('.hero-title .neon-text', {
        y: 80,
        opacity: 0,
        scale: 0.8
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(2)"
    }, "-=0.8")
    .fromTo('.hero-subtitle', {
        y: 50,
        opacity: 0,
        filter: "blur(10px)"
    }, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.4")
    .fromTo('.primary-cta', {
        scale: 0,
        rotation: -180,
        opacity: 0
    }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(2.5)"
    }, "-=0.2")
    .fromTo('.secondary-cta', {
        scale: 0,
        rotation: 180,
        opacity: 0
    }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(2.5)"
    }, "-=0.6")
    .fromTo('.social-proof-mini', {
        y: 30,
        opacity: 0,
        scale: 0.9
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.3");

    // Enhanced floating elements with more dynamic movement
    gsap.set('.mood-bubble', { y: 100, opacity: 0, scale: 0 });
    gsap.to('.mood-bubble', {
        duration: 1.5,
        y: 0,
        opacity: 0.8,
        scale: 1,
        ease: "elastic.out(1, 0.3)",
        stagger: {
            each: 0.2,
            from: "random"
        },
        delay: 1
    });

    // Continuous floating animation for mood bubbles
    gsap.to('.mood-bubble', {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-15, 15)",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
            each: 0.5,
            from: "random"
        },
        delay: 2
    });
}

// Initialize enhanced scroll-triggered animations
function initScrollAnimations() {
    // Enhanced steps animation with magnetic effect
    gsap.fromTo('.step', {
        y: 120,
        opacity: 0,
        scale: 0.7,
        rotationY: 45
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        stagger: {
            each: 0.15,
            from: "start"
        },
        scrollTrigger: {
            trigger: '.steps-container',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });

    // Enhanced features animation with 3D flip effect
    gsap.fromTo('.feature-card', {
        y: 100,
        opacity: 0,
        rotationY: 90,
        scale: 0.8
    }, {
        y: 0,
        opacity: 1,
        rotationY: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.5)",
        stagger: {
            each: 0.2,
            from: "center"
        },
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });

    // Enhanced stats animation with bounce and scale
    gsap.fromTo('.stat', {
        scale: 0,
        rotation: 360,
        y: 50
    }, {
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 1,
        ease: "bounce.out",
        stagger: {
            each: 0.1,
            from: "random"
        },
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });

    // Timeline items animation
    gsap.fromTo('.timeline-item', {
        x: 100,
        opacity: 0,
        rotationY: 90
    }, {
        x: 0,
        opacity: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    // Conversion section animation
    gsap.fromTo('.conversion-content', {
        y: 50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.conversion',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Initialize counters
function initCounters() {
    // Experience counter animation
    const experienceCounter = document.getElementById('experienceCounter');
    if (experienceCounter) {
        const targetCount = parseInt(experienceCounter.getAttribute('data-target') || '127843');
        let currentCount = 0;
        const increment = Math.ceil(targetCount / 100);
        
        function updateCounter() {
            currentCount += increment;
            if (currentCount > targetCount) {
                currentCount = targetCount;
            }
            
            experienceCounter.textContent = currentCount.toLocaleString();
            
            if (currentCount < targetCount) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        // Start counter when hero is visible
        setTimeout(updateCounter, 2000);
    }

    // Stats counters with improved triggering
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length > 0) {
            // Create multiple triggers for better reliability
            
            // 1. Intersection Observer with lower threshold
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                        animateStatCounter(entry.target);
                        entry.target.setAttribute('data-animated', 'true');
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            // 2. Scroll-based trigger as backup
            let scrollTriggered = false;
            function checkScrollPosition() {
                if (scrollTriggered) return;
                
                const socialProofSection = document.getElementById('social-proof');
                if (socialProofSection) {
                    const rect = socialProofSection.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        scrollTriggered = true;
                        statNumbers.forEach(stat => {
                            if (!stat.hasAttribute('data-animated')) {
                                animateStatCounter(stat);
                                stat.setAttribute('data-animated', 'true');
                            }
                        });
                        window.removeEventListener('scroll', checkScrollPosition);
                    }
                }
            }
            
            statNumbers.forEach((stat, index) => {
                // ScrollTrigger (GSAP)
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.create({
                        trigger: stat,
                        start: 'top 85%',
                        onEnter: () => {
                            if (!stat.hasAttribute('data-animated')) {
                                animateStatCounter(stat);
                                stat.setAttribute('data-animated', 'true');
                            }
                        }
                    });
                }
                
                // Intersection Observer
                statsObserver.observe(stat);
            });
            
            // Scroll listener as additional backup
            window.addEventListener('scroll', checkScrollPosition);
            
            // Final fallback - trigger after delay if nothing else worked
            setTimeout(() => {
                statNumbers.forEach(stat => {
                    if (!stat.hasAttribute('data-animated')) {
                        animateStatCounter(stat);
                        stat.setAttribute('data-animated', 'true');
                    }
                });
            }, 5000);
        }
    }, 1000);
}

function animateStatCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    // Add animation class for visual feedback
    element.classList.add('animating');
    
    function updateStat() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        // Format the number based on target value
        if (target >= 1000000) {
            // For millions (like 2,500,000), show as "2.5M"
            const millions = current / 1000000;
            element.textContent = millions.toFixed(1) + 'M';
        } else if (target >= 100000) {
            // For hundreds of thousands (like 500,000), show as "500K"
            const thousands = current / 1000;
            element.textContent = Math.floor(thousands) + 'K';
        } else if (target >= 1000) {
            // For thousands, show as "XK"
            const thousands = current / 1000;
            element.textContent = thousands.toFixed(1) + 'K';
        } else {
            // For smaller numbers (like 98%), show as is with potential suffix
            element.textContent = current.toString();
            
            // Check if this is the satisfaction percentage
            const label = element.nextElementSibling?.textContent;
            if (label && label.includes('Satisfaction')) {
                element.textContent = current + '%';
            }
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateStat);
        } else {
            // Remove animation class when done
            element.classList.remove('animating');
        }
    }
    
    updateStat();
}

// Testimonial carousel
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showNextTestimonial() {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }
    
    // Auto-rotate testimonials every 4 seconds
    setInterval(showNextTestimonial, 4000);
}

// Sticky CTA functionality
function initStickyCtA() {
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'bottom top',
        end: '.conversion',
        onEnter: () => stickyCTA.classList.add('visible'),
        onLeave: () => stickyCTA.classList.remove('visible'),
        onEnterBack: () => stickyCTA.classList.add('visible'),
        onLeaveBack: () => stickyCTA.classList.remove('visible')
    });
    
    // Hide sticky CTA when reaching conversion section
    ScrollTrigger.create({
        trigger: '.conversion',
        start: 'top bottom',
        onEnter: () => stickyCTA.classList.remove('visible'),
        onLeaveBack: () => stickyCTA.classList.add('visible')
    });
}

// Timeline interaction
function initTimelineInteraction() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                duration: 0.3,
                scale: 1.05,
                rotationY: 5,
                ease: "power2.out"
            });
            
            // Add sparkle effect
            createSparkleEffect(item);
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                duration: 0.3,
                scale: 1,
                rotationY: 0,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('click', () => {
            // Create ripple effect
            createRippleEffect(item);
            
            // Show more info (could be expanded)
            const year = item.dataset.year;
            showTimelineInfo(year);
        });
    });
}

function createSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.top = '10px';
    sparkle.style.right = '10px';
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '10';
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    gsap.fromTo(sparkle, {
        scale: 0,
        rotation: 0
    }, {
        scale: 1,
        rotation: 360,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
            gsap.to(sparkle, {
                scale: 0,
                duration: 0.3,
                delay: 1,
                onComplete: () => sparkle.remove()
            });
        }
    });
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'rgba(255, 0, 128, 0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '5';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    gsap.to(ripple, {
        scale: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
    });
}

function showTimelineInfo(year) {
    // This could be expanded to show a modal or more detailed info
    console.log(`Clicked on year: ${year}`);
    
    // For now, just show a simple notification
    showNotification(`Exploring viral trends from ${year}! 🎉`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '25px';
    notification.style.zIndex = '9999';
    notification.style.fontWeight = '600';
    notification.style.boxShadow = '0 5px 20px rgba(255, 0, 128, 0.3)';
    notification.style.transform = 'translateX(400px)';
    
    document.body.appendChild(notification);
    
    gsap.to(notification, {
        x: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            x: 400,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// Form handling
function initFormHandling() {
    const signupForm = document.querySelector('.signup-form');
    const emailInput = signupForm.querySelector('input[type="email"]');
    const submitBtn = signupForm.querySelector('.submit-btn');
    
    signupForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation effects
    emailInput.addEventListener('focus', () => {
        gsap.to(emailInput, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    emailInput.addEventListener('blur', () => {
        gsap.to(emailInput, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!isValidEmail(email)) {
        showFormError('Please enter a valid email address');
        return;
    }
    
    // Enhanced form submission with professional animations
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Professional loading state
    submitBtn.textContent = 'Creating your account...';
    submitBtn.disabled = true;
    
    // Enhanced loading animation with magnetic effect
    const loadingTl = gsap.timeline();
    loadingTl
        .to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.inOut"
        })
        .to(submitBtn, {
            scale: 1.02,
            duration: 0.2,
            ease: "elastic.out(1, 0.3)",
            repeat: 3,
            yoyo: true
        })
        .to(submitBtn, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    
    // Add shimmer effect during loading
    gsap.fromTo(submitBtn, {
        background: 'var(--logo-gradient)'
    }, {
        background: 'var(--logo-gradient-reverse)',
        duration: 0.8,
        ease: "power2.inOut",
        repeat: 2,
        yoyo: true
    });
    
    setTimeout(() => {
        // Success animation with celebration
        gsap.to(submitBtn, {
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(3)",
            onComplete: () => {
                submitBtn.textContent = '🎉 Welcome to FeelBack!';
                gsap.to(submitBtn, {
                    scale: 1,
                    duration: 0.3,
                    ease: "elastic.out(1, 0.5)"
                });
            }
        });
        
        // Create confetti effect
        createConfettiEffect(submitBtn);
        
        showNotification('✨ You\'re now part of the nostalgia revolution!');
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            emailInput.value = '';
            
            // Reset button with smooth transition
            gsap.fromTo(submitBtn, {
                opacity: 0.7
            }, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
            });
        }, 3500);
    }, 2000);
}

// Enhanced confetti effect
function createConfettiEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, var(--logo-orange), var(--logo-red));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        document.body.appendChild(confetti);
        
        gsap.to(confetti, {
            x: `random(-150, 150)`,
            y: `random(-100, -200)`,
            rotation: `random(0, 360)`,
            scale: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => confetti.remove()
        });
    }
}

function handleSocialLogin(e) {
    const platform = e.target.textContent.includes('Google') ? 'Google' : 'Apple';
    showNotification(`Connecting with ${platform}... 🔗`);
    
    // Add button animation
    gsap.to(e.target, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--neon-pink)';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.classList.add('form-error');
    
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const formGroup = document.querySelector('.form-group');
    formGroup.parentNode.insertBefore(errorDiv, formGroup.nextSibling);
    
    gsap.fromTo(errorDiv, {
        opacity: 0,
        y: -10
    }, {
        opacity: 1,
        y: 0,
        duration: 0.3
    });
    
    setTimeout(() => {
        gsap.to(errorDiv, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            onComplete: () => errorDiv.remove()
        });
    }, 3000);
}

// Video placeholder interaction
function initVideoPlaceholder() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const playButton = document.querySelector('.play-button');
    
    videoPlaceholder.addEventListener('click', () => {
        // Simulate video play
        gsap.to(playButton, {
            scale: 0,
            rotation: 180,
            duration: 0.3,
            ease: "power2.in"
        });
        
        setTimeout(() => {
            videoPlaceholder.innerHTML = `
                <div style="
                    background: linear-gradient(45deg, var(--neon-pink), var(--neon-blue));
                    color: white;
                    padding: 3rem;
                    border-radius: 15px;
                    font-size: 1.2rem;
                    font-weight: 600;
                ">
                    🎬 Demo video would play here!<br>
                    <small style="font-size: 0.9rem; opacity: 0.8;">
                        Experience the magic of FeelBack in action
                    </small>
                </div>
            `;
            
            gsap.fromTo(videoPlaceholder.firstElementChild, {
                scale: 0,
                rotation: 180
            }, {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        }, 300);
    });
}

// CTA Button interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.primary-cta, .secondary-cta, .cta-button')) {
        // Create button click effect
        gsap.to(e.target, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
        
        // Show notification for demo purposes
        if (e.target.textContent.includes('Try FeelBack') || e.target.textContent.includes('Get Started')) {
            showNotification('🚀 Launching FeelBack experience...');
        } else if (e.target.textContent.includes('Watch Demo')) {
            showNotification('🎥 Demo coming right up!');
        }
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            gsap.to(window, {
                duration: 1,
                scrollTo: targetElement,
                ease: "power2.inOut"
            });
        }
    }
});

// Parallax effect for retro grid
ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
        gsap.to('.retro-grid', {
            y: self.progress * 100,
            duration: 0.3
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.matches('.timeline-item, .feature-card, .step')) {
            e.target.click();
        }
    }
});

// Add intersection observer for fade-in effects
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.step, .feature-card, .testimonial, .stat');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Performance optimization: Ensure hero elements are visible by default
// Remove initial hidden states to prevent invisible hero section

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Ensure body is fully visible
    gsap.set('body', { opacity: 1 });
});

// Error handling for GSAP animations
gsap.config({
    force3D: true,
    nullTargetWarn: false
});

// Add custom cursor effect for interactive elements
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, var(--neon-pink), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.1s ease;
    opacity: 0;
`;

document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Add hover effects for interactive elements
const interactiveElements = document.querySelectorAll('button, a, .timeline-item, .feature-card, .step');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// Add scroll progress indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
document.body.appendChild(scrollIndicator);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height);
    
    gsap.to(scrollIndicator, {
        scaleX: scrolled,
        duration: 0.1,
        ease: "none"
    });
});

// Mobile-specific optimizations
function initMobileOptimizations() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth <= 768;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isTouch) {
        document.body.classList.add('touch-device');
    }
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Optimize animations for mobile
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            gsap.set('*', { animation: 'none' });
            return;
        }
        
        // Add mobile-specific interaction handlers
        addMobileTouchFeedback();
        optimizeScrollPerformance();
        handleMobileKeyboard();
        
        // Prevent zoom on double tap for better UX
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
    
    if (isIOS) {
        document.body.classList.add('ios-device');
        handleIOSSpecificOptimizations();
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, 0);
            initResponsiveLayout();
        }, 500);
    });
    
    // Initialize responsive layout
    initResponsiveLayout();
}

function addMobileTouchFeedback() {
    const interactiveElements = document.querySelectorAll(
        '.primary-cta, .secondary-cta, .submit-btn, .newsletter-btn, .social-icon, .step, .feature-card'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
            
            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
        
        element.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
}

function optimizeScrollPerformance() {
    // Use passive event listeners for better scroll performance
    let ticking = false;
    
    function updateScrollElements() {
        const scrollY = window.pageYOffset;
        
        // Update sticky CTA visibility
        const stickyCtA = document.getElementById('stickyCTA');
        if (stickyCtA) {
            if (scrollY > 200) {
                stickyCtA.style.opacity = '1';
                stickyCtA.style.pointerEvents = 'auto';
            } else {
                stickyCtA.style.opacity = '0';
                stickyCtA.style.pointerEvents = 'none';
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

function handleMobileKeyboard() {
    // Handle virtual keyboard on mobile
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => {
                this.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }, 300);
        });
        
        input.addEventListener('blur', function() {
            // Reset viewport on keyboard close
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 300);
        });
    });
}

function handleIOSSpecificOptimizations() {
    // Handle iOS safe areas
    const style = document.createElement('style');
    style.textContent = `
        @supports (-webkit-touch-callout: none) {
            .sticky-cta {
                bottom: calc(15px + env(safe-area-inset-bottom, 0));
            }
            
            .footer {
                padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
            }
            
            .hero {
                padding-top: calc(2rem + env(safe-area-inset-top, 0));
            }
            
            /* Prevent zoom on input focus */
            input, textarea, select {
                font-size: 16px !important;
                transform: scale(1);
            }
            
            /* Fix iOS bounce scroll */
            body {
                -webkit-overflow-scrolling: touch;
                overflow-scrolling: touch;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle iOS viewport issues
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
    }
}

function initResponsiveLayout() {
    const screenWidth = window.innerWidth;
    
    // Adjust grid layouts based on screen size
    const stepsContainer = document.querySelector('.steps-container');
    const featuresGrid = document.querySelector('.features-grid');
    
    if (screenWidth <= 480) {
        // Single column for very small screens
        if (stepsContainer) stepsContainer.style.gridTemplateColumns = '1fr';
        if (featuresGrid) featuresGrid.style.gridTemplateColumns = '1fr';
    } else if (screenWidth <= 768) {
        // Single column for tablets
        if (stepsContainer) stepsContainer.style.gridTemplateColumns = '1fr';
        if (featuresGrid) featuresGrid.style.gridTemplateColumns = '1fr';
    } else if (screenWidth <= 1024) {
        // Two columns for larger tablets
        if (stepsContainer) stepsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        if (featuresGrid) featuresGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    
    // Optimize image loading for mobile
    if (screenWidth <= 768) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            img.setAttribute('decoding', 'async');
        });
    }
}

// Enhanced mobile performance optimization
function optimizeMobilePerformance() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce complex animations on mobile
        const complexAnimElements = document.querySelectorAll('.retro-grid, .floating-elements');
        complexAnimElements.forEach(element => {
            element.style.willChange = 'auto';
            element.style.opacity = '0.1';
        });
        
        // Optimize GSAP for mobile
        gsap.config({
            force3D: true,
            nullTargetWarn: false
        });
        
        // Reduce particle count for mobile
        const moodBubbles = document.querySelectorAll('.mood-bubble');
        moodBubbles.forEach((bubble, index) => {
            if (index > 3) { // Keep only first 4 bubbles on mobile
                bubble.style.display = 'none';
            }
        });
        
        // Add mobile-specific styles
        const mobileCSS = `
            /* Mobile touch feedback */
            .touch-active {
                transform: scale(0.98) !important;
                transition: transform 0.1s ease !important;
            }
            
            .touch-active.social-icon {
                transform: scale(0.95) !important;
                box-shadow: 0 2px 10px rgba(255, 182, 77, 0.4) !important;
            }
            
            .touch-active.primary-cta,
            .touch-active.secondary-cta {
                transform: scale(0.96) !important;
            }
            
            /* Smooth scrolling */
            html {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }
            
            /* Better focus states for accessibility */
            .primary-cta:focus,
            .secondary-cta:focus,
            .submit-btn:focus,
            .newsletter-btn:focus {
                outline: 3px solid var(--logo-orange);
                outline-offset: 2px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = mobileCSS;
        document.head.appendChild(style);
        
        // Optimize scroll performance
        document.addEventListener('scroll', () => {
            // Throttle scroll events
            clearTimeout(window.scrollTimeout);
            window.scrollTimeout = setTimeout(() => {
                // Update any scroll-dependent elements here
            }, 16); // 60fps
        }, { passive: true });
    }
}

// Performance monitoring for mobile devices
function initMobilePerformanceMonitoring() {
    if (window.innerWidth <= 768) {
        // Monitor Core Web Vitals on mobile
        if ('PerformanceObserver' in window) {
            // Monitor Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        console.log('CLS detected:', entry.value);
                    }
                }
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
            
            // Monitor First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
        }
        
        // Monitor memory usage on mobile
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('High memory usage detected on mobile');
                    // Trigger garbage collection if needed
                    optimizeMobilePerformance();
                }
            }, 30000); // Check every 30 seconds
        }
        
        // Monitor battery status if available
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                const handleBatteryChange = () => {
                    if (battery.level < 0.2) {
                        // Battery is low, reduce animations
                        document.body.classList.add('low-battery-mode');
                        gsap.globalTimeline.timeScale(0.5); // Slow down animations
                    } else {
                        document.body.classList.remove('low-battery-mode');
                        gsap.globalTimeline.timeScale(1);
                    }
                };
                
                battery.addEventListener('levelchange', handleBatteryChange);
                handleBatteryChange(); // Initial check
            });
        }
    }
}

// Network-aware loading for mobile
function initNetworkAwareLoading() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        const isSlow = connection.effectiveType === 'slow-2g' || 
                      connection.effectiveType === '2g' || 
                      connection.effectiveType === '3g';
        
        if (isSlow) {
            document.body.classList.add('slow-connection');
            
            // Reduce image quality and disable complex animations
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.filter = 'blur(1px)'; // Slight blur to reduce perceived quality
            });
            
            // Disable heavy animations
            gsap.set('.retro-grid, .floating-elements', { display: 'none' });
            
            console.log('Slow connection detected, optimizing experience');
        }
    }
}
