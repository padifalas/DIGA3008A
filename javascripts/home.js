
class HomepageAnimator {
    constructor() {
        this.isAnimating = false;
        this.particles = [];
        this.animationElements = [];
        this.observer = null;
        
     
        this.config = {
            baseDelay: 100,
            staggerDelay: 150,
            particleCount: window.innerWidth > 768 ? 25 : 15,
            animationDuration: 800,
        };
        
        this.init();
    }
    
    init() {
       
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startAnimation());
        } else {
            this.startAnimation();
        }
        
  
        window.addEventListener('resize', () => this.handleResize());
        
       
        this.setupScrollAnimations();
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
      
        this.hideAllElements();
        
      
        setTimeout(() => {
            this.animateNavigation();
            this.createParticleSystem();
            this.animateHeroText();
            this.animateContentBlocks();
        }, 300);
    }
    
    hideAllElements() {

        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.transform = 'translateY(-100%)';
            nav.style.opacity = '0';
        }
        
  
        const contentBlocks = document.querySelectorAll('.content-block');
        contentBlocks.forEach((block, index) => {
            const isLeft = block.classList.contains('left-block');
            block.style.transform = `translateX(${isLeft ? '-100%' : '100%'}) scale(0.8)`;
            block.style.opacity = '0';
        });
        
       
        const aboutImage = document.querySelector('.about-image');
        const aboutText = document.querySelector('.about-text');
        
        if (aboutImage) {
            aboutImage.style.transform = 'translateY(100%) rotate(-10deg) scale(0.8)';
            aboutImage.style.opacity = '0';
        }
        
        if (aboutText) {
            aboutText.style.transform = 'translateX(50%) scale(0.9)';
            aboutText.style.opacity = '0';
        }
        
       
        const skills = document.querySelectorAll('.skills ul li');
        skills.forEach(skill => {
            skill.style.transform = 'translateY(30px) scale(0.8)';
            skill.style.opacity = '0';
        });
    }
    
    animateNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
      
        nav.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
        
       
        const navItems = document.querySelectorAll('nav ul li');
        navItems.forEach((item, index) => {
            item.style.transform = 'translateY(-20px)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            }, this.config.baseDelay + (index * 80));
        });
        
      
        const logo = document.querySelector('.logo');
        if (logo) {
            setTimeout(() => {
                logo.style.animation = 'logoBounce 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 200);
        }
    }
    
    animateHeroText() {

        setTimeout(() => {
            this.createTextParticles();
        }, 1000);
    }
    
    animateContentBlocks() {
        const contentBlocks = document.querySelectorAll('.content-block');
        
        contentBlocks.forEach((block, index) => {
            setTimeout(() => {
                const isLeft = block.classList.contains('left-block');
                
          
                block.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                block.style.transform = 'translateX(0) scale(1)';
                block.style.opacity = '1';
                
                
                setTimeout(() => {
                    block.style.animation = 'gentleFloat 6s ease-in-out infinite';
                }, 1000);
                
            
                this.animateBlockContent(block, index * 200);
                
            }, this.config.baseDelay + (index * this.config.staggerDelay));
        });
    }
    
    animateBlockContent(block, delay) {
        const title = block.querySelector('.content-title');
        const text = block.querySelector('.content-text');
        const button = block.querySelector('.button');
        
        [title, text, button].forEach((element, index) => {
            if (!element) return;
            
            element.style.transform = 'translateY(30px)';
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            }, delay + (index * 150));
        });
    }
    
    createParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(particleContainer);
        
    
        for (let i = 0; i < this.config.particleCount; i++) {
            setTimeout(() => {
                this.createParticle(particleContainer, i);
            }, Math.random() * 2000);
        }
    }
    
    createParticle(container, index) {
        const particle = document.createElement('div');
        const types = ['circle', 'square', 'triangle'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const size = Math.random() * 8 + 4;
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 50;
        
        particle.className = `particle particle-${type}`;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            top: ${startY}px;
            pointer-events: none;
            opacity: 0.7;
        `;
        
        
        switch(type) {
            case 'circle':
                particle.style.backgroundColor = '#4d8c57';
                particle.style.borderRadius = '50%';
                break;
            case 'square':
                particle.style.backgroundColor = '#e6a57e';
                particle.style.transform = 'rotate(45deg)';
                break;
            case 'triangle':
                particle.style.width = '0';
                particle.style.height = '0';
                particle.style.borderLeft = `${size/2}px solid transparent`;
                particle.style.borderRight = `${size/2}px solid transparent`;
                particle.style.borderBottom = `${size}px solid #a4c8e1`;
                break;
        }
        
        container.appendChild(particle);
        

        this.animateParticle(particle, startX, startY, index);
    }
    
    animateParticle(particle, startX, startY, index) {
        const duration = Math.random() * 3000 + 2000;
        const endY = -100;
        const drift = (Math.random() - 0.5) * 200;
        
        particle.animate([
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
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    createTextParticles() {
       
        const heroTextRect = { 
            x: window.innerWidth / 2, 
            y: 150,
            width: window.innerWidth * 0.8,
            height: 100
        };
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createTextParticle(heroTextRect);
            }, i * 200);
        }
    }
    
    createTextParticle(textRect) {
        const particle = document.createElement('div');
        const startX = textRect.x + (Math.random() - 0.5) * textRect.width;
        const startY = textRect.y + Math.random() * textRect.height;
        
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            left: ${startX}px;
            top: ${startY}px;
            background: radial-gradient(circle, #ffffff, #f0ead6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        `;
        
        document.body.appendChild(particle);
        
    
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;
        
        particle.animate([
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
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    setupScrollAnimations() {
       
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateAboutSection();
                }
            });
        }, { threshold: 0.2 });
        
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            this.observer.observe(aboutSection);
        }
    }
    
    animateAboutSection() {
        const aboutImage = document.querySelector('.about-image');
        const aboutText = document.querySelector('.about-text');
        const skills = document.querySelectorAll('.skills ul li');
        
   
        if (aboutImage) {
            aboutImage.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            aboutImage.style.transform = 'translateY(0) rotate(0deg) scale(1)';
            aboutImage.style.opacity = '1';
        }
 
        if (aboutText) {
            setTimeout(() => {
                aboutText.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                aboutText.style.transform = 'translateX(0) scale(1)';
                aboutText.style.opacity = '1';
            }, 300);
        }
        
       
        skills.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                skill.style.transform = 'translateY(0) scale(1)';
                skill.style.opacity = '1';
                
               
                setTimeout(() => {
                    skill.style.transform = 'translateY(-5px) scale(1.05)';
                    setTimeout(() => {
                        skill.style.transform = 'translateY(0) scale(1)';
                    }, 200);
                }, 100);
                
            }, 800 + (index * 100));
        });
    }
    
    handleResize() {
        
        this.config.particleCount = window.innerWidth > 768 ? 25 : 15;
        
      
        if (window.innerWidth <= 768) {
            this.config.staggerDelay = 100;
            this.config.animationDuration = 600;
        } else {
            this.config.staggerDelay = 150;
            this.config.animationDuration = 800;
        }
    }
}

// should put this in stylesheet instead
const styleSheet = document.createElement('style'); 
styleSheet.textContent = `
    @keyframes logoBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1) rotate(5deg); }
    }
    
    @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    
    .particle {
        animation: pulse 2s ease-in-out infinite;
    }
    
  
    .content-block:hover {
        animation-play-state: paused;
    }
    
    
    @media (max-width: 768px) {
        @keyframes gentleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(styleSheet);


const homepageAnimator = new HomepageAnimator();


document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) { 
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: rgba(77, 140, 87, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1.5)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
});

// might use in other pages
window.HomepageAnimator = HomepageAnimator;