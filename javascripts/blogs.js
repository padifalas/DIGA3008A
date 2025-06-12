// storing references for cleanup
const sideNavInstances = new Set();

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.blog-page')) {
        const blogNav = createSideNav('blog');
        sideNavInstances.add(blogNav);
    }
    
    if (document.querySelector('.essay-page')) {
        const essayNav = createSideNav('essay');
        sideNavInstances.add(essayNav);
    }
});

//  function 4 cleanup for when page unloads or navigation changes
window.addEventListener('beforeunload', function() {
    sideNavInstances.forEach(instance => {
        if (instance.cleanup) {
            instance.cleanup();
        }
    });
    sideNavInstances.clear();
});

function createSideNav(pageType) {
    //  non-reassigned variables
    const sideNav = document.createElement('section');
    sideNav.className = 'blog-side-nav';
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'blog-nav-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    toggleBtn.setAttribute('aria-label', `Toggle ${pageType} navigation`);
    
    const navContent = document.createElement('section');
    navContent.className = 'blog-nav-content';
    
    const heading = document.createElement('h3');
    heading.textContent = pageType === 'blog' ? 'Blog Posts' : 'Essays';
    navContent.appendChild(heading);
    
    const linkList = document.createElement('ul');
    
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // changed lets to const
    const navigationItems = getNavigationItems(pageType);
    
    
    const listItems = navigationItems.map(item => createNavigationItem(item, currentPage));
    listItems.forEach(listItem => linkList.appendChild(listItem));
    
    navContent.appendChild(linkList);
    sideNav.appendChild(toggleBtn);
    sideNav.appendChild(navContent);
    document.body.appendChild(sideNav);
    
    // nav can close when page/blog is selected
    const toggleHandler = createToggleHandler(sideNav);
    toggleBtn.addEventListener('click', toggleHandler);
    
   
    return {
        element: sideNav,
        cleanup: function() {
            toggleBtn.removeEventListener('click', toggleHandler);
            if (sideNav.parentNode) {
                sideNav.parentNode.removeChild(sideNav);
            }
        }
    };
}


function getNavigationItems(pageType) {
    const items = {
        blog: [
            { id: 'blog01', title: 'Setting Up GitHub: A Web Publishing Experience', url: 'blog01.html' },
            { id: 'blog02', title: 'Reflection on Moulthrop: Hypertext and the Laws of Media', url: 'blog02.html' },
            { id: 'blog03', title: 'Interaction Design', url: 'blog03.html' },
            { id: 'blog04', title: 'Website Design Process', url: 'blog04.html' },
            { id: 'blog05', title: 'UI/UX Analysis', url: 'blog07.html' },
            { id: 'blog06', title: 'Critical Response to "Internet Access is a Fundamental Right."', url: 'blog09.html' },
            { id: 'blog07', title: 'Critical Response to "The Need for Global Internet Connectivity"', url: 'blog10.html' },
            { id: 'blog08', title: 'Close Reading: "Internet Access is a Fundamental Right."', url: 'blog11.html' },
            { id: 'blog09', title: 'Critical Reflection on Digital Inequalities in the Age of AI and Big Data', url: 'blog12.html' },
            { id: 'blog10', title: 'Incorporating JavaScript & Reflecting on Decolonial Coding Practices', url: 'blog13.html' },
            { id: 'blog11', title: 'An Ethical Internet: Vision and Principles', url: 'blog14.html' },
            { id: 'blog12', title: 'Approaching Justice and Ethics in my Artistic and Programming Practice', url: 'blog15.html' }
        ],
        essay: [
            { id: 'essay01', title: 'Ethics, UI, UX & Interaction: A Case Study of Standard Bank', url: 'essay01.html' },
            { id: 'essay02', title: ' Internet Geographies & Digital Coloniality', url: 'essay02.html' },
             { id: 'essay03', title: 'Portfolio Website Implementation Reflection', url: 'essay03.html' }
        ]
    };
    
    return items[pageType] || [];
}

//individual navv items
function createNavigationItem(item, currentPage) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.title;
    
    if (currentPage === item.url) {
        listItem.className = 'active';
        link.setAttribute('aria-current', 'page');
    }
    
    listItem.appendChild(link);
    return listItem;
}


function createToggleHandler(sideNav) {
    return function() {
        sideNav.classList.toggle('open');
        
        const icon = this.querySelector('i');
       
        icon.className = sideNav.classList.contains('open') 
            ? 'fas fa-chevron-left' 
            : 'fas fa-chevron-right';
    };
}