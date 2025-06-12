function initializeBackToTop() {
    const backToTopBtn = document.createElement('button'); // his its to createh the back to top button
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
       
    `;
    
     // will add thee button to page
    document.body.appendChild(backToTopBtn);
    
    // its nw more idiomatic: use a named function for the scroll handler
    const handleScroll = () => {
        const shouldShow = window.pageYOffset > 300;
        backToTopBtn.classList.toggle('visible', shouldShow);
    };initializeBackToTop
    
        // so it show/hide button based on scroll position
    window.addEventListener('scroll', handleScroll);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    backToTopBtn.addEventListener('click', scrollToTop);
}

//footer so its consistent on all pages using javasc
document.addEventListener("DOMContentLoaded", () => {
    const currentYear = new Date().getFullYear();
    
    const createFooter = () => {
        const footer = document.createElement("footer");
        footer.innerHTML = `
            &copy; ${currentYear} Padi Falas-Maifala Portfolio
            <section class="social-icons">
                <a href="https://padifalass.itch.io" target="_blank" aria-label="Itch.io">
                    <i class="fab fa-itch-io"></i>
                </a>
                <a href="https://github.com/padifalas" target="_blank" aria-label="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://linkedin.com/in/padi-maifala" target="_blank" aria-label="LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
            </section>
        `;
        return footer;
    };
    
    document.body.appendChild(createFooter());

    // init all components
    const initializers = [
        initializeHamburgerMenu,
        initializeSmoothScrolling,
        initializeReadingProgress,
        initializeLightbox,
        initializeBackToTop
    ];
    
    initializers.forEach(init => init());
});

     // only make wirk on pages with lightbox class
function initializeLightbox() {
    // earlyy return pattern... more idiomatic
    if (!document.body.classList.contains('has-lightbox')) {
        return;
    }
   
    const lightboxHTML = `
        <div id="lightbox" class="lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Use const for DOM elements that won't change
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const figures = document.querySelectorAll('.screenshot-figure');
    
       // u can jus click thee images
    // isepearted  into smaller functions
    const openLightbox = (imageSrc, imageAlt, captionText) => {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear content after animation
        setTimeout(() => {
            lightboxImage.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    };
    
    const addHoverEffects = (img) => {
        const handleMouseEnter = () => {
            img.style.transform = 'scale(1.02)';
            img.style.transition = 'transform 0.3s ease';
        };
        
        const handleMouseLeave = () => {
            img.style.transform = 'scale(1)';
        };
        
        img.addEventListener('mouseenter', handleMouseEnter);
        img.addEventListener('mouseleave', handleMouseLeave);
    };
    
    const setupImageClickHandlers = () => {
        figures.forEach(figure => {
            const img = figure.querySelector('img');
            const caption = figure.querySelector('.screenshot-caption');
            
            if (!img) return; // Guard clause
            
            img.style.cursor = 'pointer';
            
            const handleImageClick = () => {
                const captionText = caption?.textContent ?? '';
                openLightbox(img.src, img.alt, captionText);
            };
            
            img.addEventListener('click', handleImageClick);
            addHoverEffects(img);
        });
    };
    
    const setupEventListeners = () => {
        closeBtn.addEventListener('click', closeLightbox);
        
   
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // u can aslso close it using esc kekeyy
        const handleKeydown = (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
    
        lightboxImage.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    };
    

    setupImageClickHandlers();
    setupEventListeners();
}

function initializeHamburgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.getElementById('menu-overlay');
    

    if (!menuToggle || !navMenu || !hamburger) {
        console.error('Required menu elements not found');
        return;
    }

    //  so things arent assigned again n again, 
    const overlay = menuOverlay ?? (() => {
        const newOverlay = document.createElement('section');
        newOverlay.className = 'menu-overlay';
        newOverlay.id = 'menu-overlay';
        document.body.appendChild(newOverlay);
        return newOverlay;
    })();

    const closeMenu = () => {
        menuToggle.checked = false;
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    const toggleMenu = (isOpen) => {
        const action = isOpen ? 'add' : 'remove';
        navMenu.classList[action]('active');
        overlay.classList[action]('active');
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    // event listeners with named functions
    const handleMenuToggle = function() {
        toggleMenu(this.checked);
    };

    const handleEscapeKey = (event) => {
        if (event.key === 'Escape' && menuToggle.checked) {
            closeMenu();
        }
    };

    const handleResize = () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    };

    // where im attachning my event listeners
    menuToggle.addEventListener('change', handleMenuToggle);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    const handleAnchorClick = function(e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });
}

function initializeReadingProgress() {
    const article = document.querySelector('article');
    const progressBar = document.querySelector('.reading-progress');
    
   
    if (!article || !progressBar) {
        return;
    }
    
    const updateProgress = () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollPercent = scrollTop / (documentHeight - windowHeight);
        const scrollPercentRounded = Math.min(Math.round(scrollPercent * 100), 100);
        
        progressBar.style.width = `${scrollPercentRounded}%`;
    };
    
    window.addEventListener('scroll', updateProgress);
}