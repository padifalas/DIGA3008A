document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectTags = document.querySelectorAll('.project-tag');
    const body = document.body;

    
    const defaultCursor = 'default';
    const gameDevCursor = 'url("data:image/png;base64,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"), auto';
    const writingCursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADsklEQVR4nO2Wa0hUWxTHD0XBjfupqEvghVvuPbP3mTx7Tyczx1TUwG7W7dLjFtH0uEP0Qe1hL7OHhn3IrBu3S3SbCexGlB/CcNQeE73DKz2+FPRSiCKCULMHQZq0Yp2ZY04zjc5k8yFasJgzsPf6/87aa619FOVbsnFjxv0kKPfpjI2Ou7iu60ME5Rcl5SAIvxt3CEn4ARQ3Pa4QgrICQ5hrkLGxEiakZscPIonydEF5l7SokF5UDlM8dZD997H4QAir9RdBeCsKOZz5hrjpXx1CVdUfJeG3UCA593fIcXuDAPwQ1TDBkWXWxW1trDZqwAAmJST8IAg7i8F1ezLkVlaFAHxRJpIISZCENUnK6yRlR4wq97tbUu4VhN2RlL81qz4nLRPy9td8BiKGTNiJdXbvtgrrFhUmZ2TBnPyV4P3/Gtx59hx+O3RqYCAkZRW4eNp8JzhLy2Hh5rIed1X8BfnuKlh7vBY2NvgML2nwQePDxxEhMkp29ZoT7GQfAPwCLnRV7ukR6ct7Q0zbeyxYfE052FXND0DYFRzbkfQHCcpf4uI11TX9BjAhaq80QmaKw1+Ybi84lqwwjitQiB5VVYdGfHuRyG24ODUlLSpx0+etWmeI6fYUo0UDKe8WFpYfUdg0SbgLN/36x4KYAHLyZgYVqyCs3W7hOUp/TVC2HzfOX1scFLji/GVoaWuHzu5uaG5tN/5/Kr6h9iSM95/1e0HYJRxWmsUypt/iaJLymwiw/J9/g4Kj+Jl7zVB6+pzx29zaFgJQWHUkUGj8iT5aH4YTU4lhwnVJqw3Wn6gPCo5vjuL4XHbmPLx99y4EYNnuvWaln1NiMZlodWCA9MwpIcEfdbwA3/0WA8J3P3wGFpVt9587ZYdjAhCErcYAMxa5ggJ7mq7Dm84ueNTRYWTiQWtb2BpYWFJqHoE7RgB+FAPgxDODHmi8Bq87O+Fg040+O2BB8eZABvi+2AAoa8EABZ6qqMXRnVu2mQPnv6jFkxkbge2j2zQorjsdlThOTNfOPcbsCPS/N2oAe6I6FTdn5+ZFFMfuwBbFOYGCqRPTQm5KQfj1qAEkYVtx8+LCoh5xzESB55BRE9OdfxrdgS0acjUT/sp/gbEKjbJZtkTbzzEA8HoMtqm4BJYWFkFWbh7oNhHm7VgXDiucmIKoS/HumKsog5UvtfFWW1u4Dw9B+FP8MhKEbdAs6mSccMpAWxKlY1HMbrG9koRflZTv0Ih1hiRkpBIPU1V1OH5mx0Xsuykf7QMdCPBTE4VxYQAAAABJRU5ErkJggg=="), auto';


    let activeFilters = new Set(['all']);


    function setCursorByFilter(filter) {
        switch(filter) {
            case 'game-dev':
                body.style.cursor = gameDevCursor;
                break;
            case 'narratives':
                body.style.cursor = writingCursor;
                break;
            default:
                body.style.cursor = defaultCursor;
                break;
        }
    }

    // added more personality  effects when u hover on project cards so game de looks a lil different
    function applyPersonalityEffects() {
        projectCards.forEach(card => {
            const section = card.closest('.portfolio-section').id;
            
            
            if (section === 'game-dev') {
                card.classList.add('game-card');
            } else if (section === 'narratives') {
                card.classList.add('writing-card');
            }
            
            card.addEventListener('mouseenter', () => {
                if (section === 'game-dev') {
                    body.style.cursor = gameDevCursor;
                    
                    card.style.boxShadow = '0 0 25px rgba(94, 157, 140, 0.6), 0 12px 20px rgba(0,0,0,0.2)';
                    card.style.transform = 'translateY(-8px) scale(1.03) rotateX(2deg)';
                } else if (section === 'narratives') {
                    body.style.cursor = writingCursor;
                 
                    card.style.boxShadow = '0 15px 35px rgba(139, 110, 189, 0.3), 0 5px 15px rgba(0,0,0,0.1)';
                    card.style.transform = 'translateY(-5px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
              
                card.style.boxShadow = '';
                card.style.transform = '';
                
             
                const mainFilter = Array.from(activeFilters).find(f => f !== 'all') || 'all';
                setCursorByFilter(mainFilter);
            });
        });
    }

    // now the  project tags are clickebale filters
    function makeTagsClickable() {
        projectTags.forEach(tag => {
            tag.style.cursor = 'pointer';
            tag.setAttribute('data-tag', tag.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'));
            
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tagValue = tag.getAttribute('data-tag');
                filterByTag(tagValue);
                
                
                tag.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tag.style.transform = '';
                }, 150);
            });
            
            //made the tags clickable btnss and now they are also filters
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.05)';
                tag.style.background = 'var(--highlight-color)';
                tag.style.color = 'white';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.background = '';
                tag.style.color = '';
            });
        });
    }

    //  projects  tag can be filterss
    function filterByTag(tagValue) {
       
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        
        projectCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '0';
        });

        
        setTimeout(() => {
            projectCards.forEach(card => {
                const cardTags = Array.from(card.querySelectorAll('.project-tag'))
                    .map(tag => tag.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'));
                
                if (cardTags.includes(tagValue)) {
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
            
            adjustGrid();
            
            
            activeFilters.clear();
            activeFilters.add(tagValue);
            
           
            const gameDevTags = ['3d-platformer', '2d-platformer', 'prototype', 'music-based-combat', 'enviromental-storytelling', 'indie'];
            const writingTags = ['interactive-fiction', 'choice-based', 'supernatural-mystery', 'script-adaptation', 'narrative-design', 'short-story', 'blog', 'game-analysis'];
            
            if (gameDevTags.includes(tagValue)) {
                setCursorByFilter('game-dev');
            } else if (writingTags.includes(tagValue)) {
                setCursorByFilter('narratives');
            } else {
                setCursorByFilter('all');
            }
        }, 50);
    }


    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
        
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
      
            activeFilters.clear();
            activeFilters.add(filterValue);
            
            setCursorByFilter(filterValue);
            
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    const isInSection = card.closest('.portfolio-section').id === filterValue;
                    
                    if (isInSection) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            adjustGrid();
        });
    });
    
    function adjustGrid() {
        const portfolioSections = document.querySelectorAll('.portfolio-section');
        
        portfolioSections.forEach(section => {
            const visibleCards = section.querySelectorAll('.project-card[style*="display: block"]').length;
            
            if (visibleCards === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
                section.style.opacity = '0';
                setTimeout(() => {
                    section.style.opacity = '1';
                }, 100);
            }
        });
    }

    //   floating tag indicator on top right hope it works lol
    function createTagIndicator() {
        const indicator = document.createElement('section');
        indicator.id = 'tag-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 12px;
            z-index: 1000;
            display: none;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(indicator);
        
     
        const originalFilterByTag = filterByTag;
        filterByTag = function(tagValue) {
            originalFilterByTag(tagValue);
            indicator.textContent = `Filtered by: ${tagValue.replace(/-/g, ' ')}`; //i dont know if this works but should show a lil indicator top right when using filter tag
            indicator.style.display = 'block';
            
            // disappppersafter 3 seconds
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
        };
    }


    applyPersonalityEffects();
    makeTagsClickable();
    createTagIndicator();
    setCursorByFilter('all');
    
    
    const style = document.createElement('style');
    style.textContent = `
        .game-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .writing-card {
            transition: all 0.4s ease-out;
        }
        
        .project-tag {
            transition: all 0.2s ease;
            user-select: none;
        }
        
        .project-tag:hover {
            transform: scale(1.05);
        }
        
        #game-dev .project-card:hover::before {
            content: "🎮";
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            opacity: 0.7;
            z-index: 10;
        }
        
        #narratives .project-card:hover::before {
            content: "✍️";
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            opacity: 0.7;
            z-index: 10;
        }
        
        .game-card:hover {
            background: linear-gradient(135deg, var(--card-bg) 0%, rgba(94, 157, 140, 0.1) 100%);
        }
        
        .writing-card:hover {
            background: linear-gradient(135deg, var(--card-bg) 0%, rgba(139, 110, 189, 0.1) 100%);
        }
    `;
    document.head.appendChild(style);
});