// Global variable to store attractions
let attractions = [];

// Load attractions from JSON file
async function loadAttractions() {
    try {
        const response = await fetch('../data/discover.mjs');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        attractions = await response.json();
        displayAttractions();
    } catch (error) {
        console.error('Error loading attractions:', error);
        // Fallback: Create some default attractions if JSON fails to load
        attractions = getDefaultAttractions();
        displayAttractions();
    }
}

// Fallback function if JSON fails to load
function getDefaultAttractions() {
    return [
        {
            id: 1,
            name: "City Park & Botanical Gardens",
            address: "1500 Park Avenue, Your City",
            description: "A beautiful 50-acre park featuring themed gardens and walking trails.",
            image: "images/attractions/park-gardens.webp"
        },
        {
            id: 2,
            name: "Historic Downtown District",
            address: "Main Street, Your City",
            description: "Charming historic downtown with unique shops and restaurants.",
            image: "images/attractions/downtown.webp"
        }
        // Add more default attractions as needed
    ];
}

// Display attractions in the grid
function displayAttractions() {
    const attractionsContainer = document.getElementById('attractions-container');
    
    if (!attractionsContainer) {
        console.error('Attractions container not found!');
        return;
    }
    
    attractionsContainer.innerHTML = '';
    
    attractions.forEach((attraction, index) => {
        const card = document.createElement('div');
        card.className = 'attraction-card';
        card.innerHTML = `
            <img src="${attraction.image}" alt="${attraction.name}" width="300" height="200" loading="lazy">
            <div class="card-content">
                <h3>${attraction.name}</h3>
                <address>${attraction.address}</address>
                <p>${attraction.description}</p>
                <button class="learn-more-btn" data-id="${attraction.id}">Learn More</button>
            </div>
        `;
        attractionsContainer.appendChild(card);
    });

    // Add event listeners to learn more buttons
    document.querySelectorAll('.learn-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const attractionId = this.getAttribute('data-id');
            showAttractionDetails(attractionId);
        });
    });
}

// Show attraction details
function showAttractionDetails(attractionId) {
    const attraction = attractions.find(a => a.id === parseInt(attractionId));
    if (attraction) {
        alert(`More information about ${attraction.name}:\n\n${attraction.description}\n\nAddress: ${attraction.address}`);
    }
}

// Update visit message using localStorage
function updateVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();
    const visitMessage = document.getElementById('visit-message');
    const visitorMessage = document.querySelector('.visitor-message');
    
    if (!visitMessage || !visitorMessage) {
        console.error('Visit message elements not found!');
        return;
    }
    
    if (!lastVisit) {
        // First visit
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((currentDate - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
        
        if (daysBetween < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = daysBetween === 1 ? "day" : "days";
            visitMessage.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
        }
    }
    
    // Store current visit date
    localStorage.setItem('lastVisit', currentDate.toString());
    
    // Close message functionality
    const closeMessage = document.getElementById('close-message');
    if (closeMessage) {
        closeMessage.addEventListener('click', function() {
            visitorMessage.style.display = 'none';
        });
    }
}

// Set footer dates
function setFooterDates() {
    const currentYearElement = document.getElementById('current-year');
    const lastModifiedElement = document.getElementById('last-modified');
    
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

// Setup navigation
function setupNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (!hamburgerBtn || !primaryNav) {
        console.error('Navigation elements not found!');
        return;
    }
    
    hamburgerBtn.addEventListener('click', function() {
        primaryNav.classList.toggle('show');
        this.textContent = primaryNav.classList.contains('show') ? '✕' : '☰';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#primary-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                primaryNav.classList.remove('show');
                hamburgerBtn.textContent = '☰';
            }
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAttractions(); // This loads the JSON data
    updateVisitMessage();
    setFooterDates();
    setupNavigation();
});

// Handle window resize
window.addEventListener('resize', function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    if (window.innerWidth > 1024 && primaryNav && hamburgerBtn) {
        primaryNav.classList.remove('show');
        hamburgerBtn.textContent = '☰';
    }
});