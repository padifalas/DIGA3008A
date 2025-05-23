 // footer shared thru website nmnow
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
        });

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