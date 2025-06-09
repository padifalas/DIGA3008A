
function initializeBackToTop() {
   
    const backToTopBtn = document.createElement('button');  // his its to createh the back to top button
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
        <img src="../images/pandora.png" alt="Back to top" class="back-to-top-image">
    `;
    
    // will add thee button to page
    document.body.appendChild(backToTopBtn);
    
    // so it show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

//footer so its consistent on all pages using java
document.addEventListener("DOMContentLoaded", () => {
    const currentYear = new Date().getFullYear();
    
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
    document.body.appendChild(footer);

    initializeHamburgerMenu();
    initializeSmoothScrolling();
    initializeReadingProgress();
    initializeLightbox(); 
      initializeBackToTop();
});


function initializeLightbox() {

     // only make wirk on pages with lightbox class
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
    
   
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    

    const figures = document.querySelectorAll('.screenshot-figure');
    
    // u can jus click thee images
    figures.forEach(figure => {
        const img = figure.querySelector('img');
        const caption = figure.querySelector('.screenshot-caption');
        
        if (img) {
           
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                openLightbox(img.src, img.alt, caption ? caption.textContent : '');
            });
            
          
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.02)';
                img.style.transition = 'transform 0.3s ease';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        }
    });
    
   
    function openLightbox(imageSrc, imageAlt, captionText) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
    
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; 
    
        setTimeout(() => {
            lightboxImage.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    }
    
    
    closeBtn.addEventListener('click', closeLightbox);
    
   
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // u can aslso close it using esc kekeyy
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    
    lightboxImage.addEventListener('click', (e) => {
        e.stopPropagation();
    });
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

    let overlay = menuOverlay;
    if (!overlay) {
        overlay = document.createElement('section');
        overlay.className = 'menu-overlay';
        overlay.id = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    menuToggle.addEventListener('change', function() {
        if (this.checked) {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    overlay.addEventListener('click', () => {
        closeMenu();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && menuToggle.checked) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    function closeMenu() {
        menuToggle.checked = false;
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeReadingProgress() {
    const article = document.querySelector('article');
    const progressBar = document.querySelector('.reading-progress');
    
    if (!article || !progressBar) {
        return;
    }
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollPercent = scrollTop / (documentHeight - windowHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        
        if (scrollPercentRounded <= 100) {
            progressBar.style.width = scrollPercentRounded + '%';
        }
    });
}