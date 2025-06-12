class HomepageAnimator {
    constructor() {
        this.isAnimating = false;
        this.particles = [];
        this.animationElements = [];
        this.observer = null;
        this.isDestroyed = false;
        
        // will makenew objects instead of changing the,
        this.baseConfig = Object.freeze({
            baseDelay: 100,
            staggerDelay: 150,
            particleCount: 25,
            particleCountMobile: 15,
            animationDuration: 800,
            animationDurationMobile: 600,
            staggerDelayMobile: 100
        });
        
       
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleIntersection = this.handleIntersection.bind(this);
        
        this.init();
    }
    
    
    get config() {
        const isMobile = window.innerWidth <= 768;
        return {
            ...this.baseConfig,
            particleCount: isMobile ? this.baseConfig.particleCountMobile : this.baseConfig.particleCount,
            staggerDelay: isMobile ? this.baseConfig.staggerDelayMobile : this.baseConfig.staggerDelay,
            animationDuration: isMobile ? this.baseConfig.animationDurationMobile : this.baseConfig.animationDuration
        };
    }
    
    init() {
        if (this.isDestroyed) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startAnimation());
        } else {
            this.startAnimation();
        }
        
        //  event listeners that i can clean up later
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('mousemove', this.handleMouseMove);
        
        this.setupScrollAnimations();
    }
    
    startAnimation() {
        if (this.isAnimating || this.isDestroyed) return;
        this.isAnimating = true;
        
        this.hideAllElements();
        
        setTimeout(() => {
            if (this.isDestroyed) return;
            this.animateNavigation();
            this.createParticleSystem();
            this.animateHeroText();
            this.animateContentBlocks();
        }, 300);
    }
    

    applyStyles(element, styles) {
        if (!element || this.isDestroyed) return;
        
        // inste of mutating styl stuff one by one...  create a complete style string
        //
        const styleString = Object.entries(styles)
            .map(([key, value]) => `${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${value}`)
            .join('; ');
        
        element.style.cssText += `; ${styleString}`;
    }
    
    hideAllElements() {
        const nav = document.querySelector('nav');
        if (nav) {
            this.applyStyles(nav, {
                transform: 'translateY(-100%)',
                opacity: '0'
            });
        }
        
        const contentBlocks = document.querySelectorAll('.content-block');
        contentBlocks.forEach((block) => {
            const isLeft = block.classList.contains('left-block');
            this.applyStyles(block, {
                transform: `translateX(${isLeft ? '-100%' : '100%'}) scale(0.8)`,
                opacity: '0'
            });
        });
        
        const aboutImage = document.querySelector('.about-image');
        const aboutText = document.querySelector('.about-text');
        
        if (aboutImage) {
            this.applyStyles(aboutImage, {
                transform: 'translateY(100%) rotate(-10deg) scale(0.8)',
                opacity: '0'
            });
        }
        
        if (aboutText) {
            this.applyStyles(aboutText, {
                transform: 'translateX(50%) scale(0.9)',
                opacity: '0'
            });
        }
        
        const skills = document.querySelectorAll('.skills ul li');
        skills.forEach(skill => {
            this.applyStyles(skill, {
                transform: 'translateY(30px) scale(0.8)',
                opacity: '0'
            });
        });
    }
    
    animateNavigation() {
        const nav = document.querySelector('nav');
        if (!nav || this.isDestroyed) return;
        
        this.applyStyles(nav, {
            transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transform: 'translateY(0)',
            opacity: '1'
        });
        
        const navItems = document.querySelectorAll('nav ul li');
        navItems.forEach((item, index) => {
            this.applyStyles(item, {
                transform: 'translateY(-20px)',
                opacity: '0'
            });
            
            setTimeout(() => {
                if (this.isDestroyed) return;
                this.applyStyles(item, {
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: 'translateY(0)',
                    opacity: '1'
                });
            }, this.config.baseDelay + (index * 80));
        });
        
        const logo = document.querySelector('.logo');
        if (logo) {
            setTimeout(() => {
                if (this.isDestroyed) return;
                logo.style.animation = 'logoBounce 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 200);
        }
    }
    
    animateHeroText() {
        setTimeout(() => {
            if (this.isDestroyed) return;
            this.createTextParticles();
        }, 1000);
    }
    
    animateContentBlocks() {
        const contentBlocks = document.querySelectorAll('.content-block');
        const currentConfig = this.config; 
        
        contentBlocks.forEach((block, index) => {
            setTimeout(() => {
                if (this.isDestroyed) return;
                
                const isLeft = block.classList.contains('left-block');
                
                this.applyStyles(block, {
                    transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: 'translateX(0) scale(1)',
                    opacity: '1'
                });
                
                setTimeout(() => {
                    if (this.isDestroyed) return;
                    block.style.animation = 'gentleFloat 6s ease-in-out infinite';
                }, 1000);
                
                this.animateBlockContent(block, index * 200);
                
            }, currentConfig.baseDelay + (index * currentConfig.staggerDelay));
        });
    }
    
    animateBlockContent(block, delay) {
        const elements = [
            block.querySelector('.content-title'),
            block.querySelector('.content-text'),
            block.querySelector('.button')
        ].filter(Boolean); 
        
        elements.forEach((element, index) => {
            this.applyStyles(element, {
                transform: 'translateY(30px)',
                opacity: '0'
            });
            
            setTimeout(() => {
                if (this.isDestroyed) return;
                this.applyStyles(element, {
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: 'translateY(0)',
                    opacity: '1'
                });
            }, delay + (index * 150));
        });
    }
    
    createParticleSystem() {
        const particleContainer = this.createParticleContainer();
        const currentConfig = this.config;
        
        // use for   creation of array
        const particlePromises = Array.from({ length: currentConfig.particleCount }, (_, i) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    if (this.isDestroyed) {
                        resolve();
                        return;
                    }
                    this.createParticle(particleContainer, i);
                    resolve();
                }, Math.random() * 2000);
            });
        });
        
        Promise.all(particlePromises).catch(console.error);
    }
    
    createParticleContainer() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        
        const containerStyles = {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '999'
        };
        
        this.applyStyles(particleContainer, containerStyles);
        document.body.appendChild(particleContainer);
        
        return particleContainer;
    }
    
    createParticle(container, index) {
        if (this.isDestroyed) return;
        
        const particle = document.createElement('div');
        const types = ['circle', 'square', 'triangle'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const size = Math.random() * 8 + 4;
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 50;
        
        const baseStyles = {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            pointerEvents: 'none',
            opacity: '0.7'
        };
        
   
        const typeStyles = {
            circle: {
                ...baseStyles,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#4d8c57',
                borderRadius: '50%'
            },
            square: {
                ...baseStyles,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#e6a57e',
                transform: 'rotate(45deg)'
            },
            triangle: {
                ...baseStyles,
                width: '0',
                height: '0',
                borderLeft: `${size/2}px solid transparent`,
                borderRight: `${size/2}px solid transparent`,
                borderBottom: `${size}px solid #a4c8e1`
            }
        };
        
        particle.className = `particle particle-${type}`;
        this.applyStyles(particle, typeStyles[type]);
        
        container.appendChild(particle);
        this.animateParticle(particle, startX, startY, index);
    }
    
    animateParticle(particle, startX, startY, index) {
        if (this.isDestroyed) return;
        
        const duration = Math.random() * 3000 + 2000;
        const endY = -100;
        const drift = (Math.random() - 0.5) * 200;
        
        const animation = particle.animate([
            { 
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 0.7 
            },
            { 
                transform: `translateY(${endY - startY}px) translateX(${drift}px) rotate(360deg)`,
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.remove();
            }
        };
        
        // store animation ref for cleanup
        this.particles.push(animation);
    }
    
    createTextParticles() {
        if (this.isDestroyed) return;
        
        const heroTextRect = Object.freeze({ 
            x: window.innerWidth / 2, 
            y: 150,
            width: window.innerWidth * 0.8,
            height: 100
        });
        
        Array.from({ length: 10 }, (_, i) => {
            setTimeout(() => {
                if (this.isDestroyed) return;
                this.createTextParticle(heroTextRect);
            }, i * 200);
        });
    }
    
    createTextParticle(textRect) {
        if (this.isDestroyed) return;
        
        const particle = document.createElement('div');
        const startX = textRect.x + (Math.random() - 0.5) * textRect.width;
        const startY = textRect.y + Math.random() * textRect.height;
        
        const particleStyles = {
            position: 'fixed',
            width: '6px',
            height: '6px',
            left: `${startX}px`,
            top: `${startY}px`,
            background: 'radial-gradient(circle, #ffffff, #f0ead6)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '1000',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        };
        
        this.applyStyles(particle, particleStyles);
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;
        
        const animation = particle.animate([
            { 
                transform: 'scale(0)',
                opacity: 1 
            },
            { 
                transform: `translate(${endX - startX}px, ${endY - startY}px) scale(1)`,
                opacity: 0.8 
            },
            { 
                transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.remove();
            }
        };
    }
    
    setupScrollAnimations() {
        if (this.isDestroyed) return;
        
        this.observer = new IntersectionObserver(this.handleIntersection, { 
            threshold: 0.2 
        });
        
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            this.observer.observe(aboutSection);
        }
    }
    
    handleIntersection(entries) {
        if (this.isDestroyed) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateAboutSection();
            }
        });
    }
    
    animateAboutSection() {
        if (this.isDestroyed) return;
        
        const aboutImage = document.querySelector('.about-image');
        const aboutText = document.querySelector('.about-text');
        const skills = document.querySelectorAll('.skills ul li');
        
        if (aboutImage) {
            this.applyStyles(aboutImage, {
                transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: 'translateY(0) rotate(0deg) scale(1)',
                opacity: '1'
            });
        }
        
        if (aboutText) {
            setTimeout(() => {
                if (this.isDestroyed) return;
                this.applyStyles(aboutText, {
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: 'translateX(0) scale(1)',
                    opacity: '1'
                });
            }, 300);
        }
        
        skills.forEach((skill, index) => {
            setTimeout(() => {
                if (this.isDestroyed) return;
                
                this.applyStyles(skill, {
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: 'translateY(0) scale(1)',
                    opacity: '1'
                });
                
// Bounce effect
 setTimeout(() => {
                    if (this.isDestroyed) return;
                    skill.style.transform = 'translateY(-5px) scale(1.05)';
                    setTimeout(() => {
                        if (this.isDestroyed) return;
                        skill.style.transform = 'translateY(0) scale(1)';
                    }, 200);
                }, 100);
                
            }, 800 + (index * 100));
        });
    }
    
    handleResize() {
        if (this.isDestroyed) return;
  
    }
    
    handleMouseMove(e) {
        if (this.isDestroyed || Math.random() <= 0.95) return;
        
        const particle = document.createElement('div');
        
        const mouseParticleStyles = {
            position: 'fixed',
            width: '4px',
            height: '4px',
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            background: 'rgba(77, 140, 87, 0.6)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '999'
        };
        
        this.applyStyles(particle, mouseParticleStyles);
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1.5)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.remove();
            }
        };
    }
    
    // this method to prevent memory leaks
    destroy() {
        this.isDestroyed = true;
        
        // remove event listeners thnx hanli for feedback
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('mousemove', this.handleMouseMove);
        

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        // switch off any running  animations
        this.particles.forEach(animation => {
            if (animation.playState !== 'finished') {
                animation.cancel();
            }
        });
        this.particles = [];
        

        const particleContainers = document.querySelectorAll('.particle-container');
        particleContainers.forEach(container => container.remove());
        

        const remainingParticles = document.querySelectorAll('.particle, [style*="particle"]');
        remainingParticles.forEach(particle => particle.remove());
    }
}

// init the animator again bt this time wih  proper cleanup
const homepageAnimator = new HomepageAnimator();


window.addEventListener('beforeunload', () => {
    if (homepageAnimator && typeof homepageAnimator.destroy === 'function') {
        homepageAnimator.destroy();
    }
});

// migt use on other pages
window.HomepageAnimator = HomepageAnimator;