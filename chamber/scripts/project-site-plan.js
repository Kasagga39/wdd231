// Add current date to footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString();

// Product Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide products based on filter
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Service Cost Estimator
    const calculateBtn = document.getElementById('calculate-btn');
    const estimateResult = document.getElementById('estimate-result');
    
    calculateBtn.addEventListener('click', function() {
        const serviceType = document.getElementById('service-type').value;
        const deviceType = document.getElementById('device-type').value;
        
        // Base prices for services
        const basePrices = {
            screen: { phone: 79, tablet: 119, laptop: 199 },
            battery: { phone: 49, tablet: 89, laptop: 129 },
            diagnostic: { phone: 29, tablet: 39, laptop: 49 },
            software: { phone: 39, tablet: 59, laptop: 79 }
        };
        
        // Calculate price
        let price = basePrices[serviceType][deviceType];
        
        // Display result
        estimateResult.innerHTML = `
            <h4>Estimated Cost: $${price}</h4>
            <p>This is an estimate for ${deviceType} ${serviceType.replace(/([A-Z])/g, ' $1').toLowerCase()} service.</p>
            <p><em>Note: Final price may vary based on specific device model and condition.</em></p>
        `;
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to sections when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
});