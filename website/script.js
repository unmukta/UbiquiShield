document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const reveal = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial check and event listener for scroll
    window.addEventListener('scroll', reveal);
    reveal(); // Trigger once on load
    
    // Simple counter animation for stats
    const animateStatBars = () => {
        const statBars = document.querySelectorAll('.stat-bar .fill');
        statBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
                bar.style.width = width;
            }, 300);
        });
    };

    // Run stat animation when panel comes into view or on load
    setTimeout(animateStatBars, 500);
});
