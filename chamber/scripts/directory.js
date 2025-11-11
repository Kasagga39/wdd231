// DOM elements
const directoryContainer = document.getElementById('directory-container');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

// Current year for footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Last modified date for footer
document.getElementById('lastModified').textContent = document.lastModified;

// Toggle mobile navigation
menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('active');
});

// View toggle functionality
gridViewButton.addEventListener('click', () => {
    directoryContainer.classList.remove('list-view');
    directoryContainer.classList.add('grid-view');
    gridViewButton.classList.add('active');
    listViewButton.classList.remove('active');
    displayMembers(allMembers);
});

listViewButton.addEventListener('click', () => {
    directoryContainer.classList.remove('grid-view');
    directoryContainer.classList.add('list-view');
    listViewButton.classList.add('active');
    gridViewButton.classList.remove('active');
    displayMembers(allMembers);
});

// Store members globally once fetched to avoid re-fetching on view change
let allMembers = [];

// Fetch and display member data
async function fetchAndDisplayMembers() {
    try {
        if (allMembers.length === 0) {
            const response = await fetch('../chamber/data/members.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            allMembers = data.members; // ✅ FIX: extract array
        }

        displayMembers(allMembers);
    } catch (error) {
        console.error('Error fetching members:', error);
        directoryContainer.innerHTML = '<div class="loading">Error loading directory data. Please try again later.</div>';
    }
}

// Display members based on current view
function displayMembers(members) {
    directoryContainer.innerHTML = '';

    members.forEach(member => {
        if (directoryContainer.classList.contains('list-view')) {
            directoryContainer.appendChild(createListItem(member));
        } else {
            directoryContainer.appendChild(createCardItem(member));
        }
    });
}

// Create grid view card
function createCardItem(member) {
    const card = document.createElement('div');
    card.className = 'member-card';

    const membershipText = getMembershipText(member.membership);

    card.innerHTML = `
        <img src="../images/${member.image}" alt="${member.name} logo" class="member-logo">
        <h3 class="member-name">${member.name}</h3>
        <p class="member-address">${member.address}</p>
        <p class="member-phone">${member.phone}</p>
        <a href="${member.website}" target="_blank" class="member-website">Visit Website</a>
        <span class="membership-badge membership-${membershipText.toLowerCase()}">${membershipText}</span>
    `;
    
    return card;
}

// Create list view item
function createListItem(member) {
    const listItem = document.createElement('div');
    listItem.className = 'list-item';

    const membershipText = getMembershipText(member.membership);

    listItem.innerHTML = `
        <img src="../images/${member.image}" alt="${member.name} logo" class="list-logo">
        <div class="list-details">
            <h3 class="list-name">${member.name}</h3>
            <p class="list-address">${member.address}</p>
            <p class="list-phone">${member.phone}</p>
            <a href="${member.website}" target="_blank" class="list-website">Visit Website</a>
        </div>
        <span class="list-badge membership-${membershipText.toLowerCase()}">${membershipText}</span>
    `;

    return listItem;
}

// Convert numeric membership to text
function getMembershipText(level) {
    switch (level) {
        case 1: return "Bronze";
        case 2: return "Silver";
        case 3: return "Gold";
        default: return "Member";
    }
}

// Initialize the directory
fetchAndDisplayMembers();


// Hamburger Menu Functionality
class HamburgerMenu {
    constructor() {
        this.menuToggle = document.getElementById('menu-toggle');
        this.primaryNav = document.getElementById('primary-nav');
        this.navLinks = document.querySelectorAll('#nav-links a');
        this.body = document.body;
        
        this.init();
    }

    init() {
        // Check if required elements exist
        if (!this.menuToggle || !this.primaryNav) {
            console.error('Hamburger menu elements not found');
            return;
        }

        // Create overlay if it doesn't exist
        this.createOverlay();
        
        // Create hamburger lines
        this.createHamburgerLines();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize accessibility
        this.initAccessibility();
        
        console.log('Hamburger menu initialized');
    }

    createOverlay() {
        // Check if overlay already exists
        if (document.querySelector('.nav-overlay')) {
            this.navOverlay = document.querySelector('.nav-overlay');
            return;
        }

        // Create overlay element
        this.navOverlay = document.createElement('div');
        this.navOverlay.className = 'nav-overlay';
        document.body.appendChild(this.navOverlay);
    }

    createHamburgerLines() {
        // Only create lines if they don't exist
        if (this.menuToggle.querySelector('.hamburger-line')) {
            return;
        }

        this.menuToggle.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            line.className = 'hamburger-line';
            this.menuToggle.appendChild(line);
        }
    }

    addEventListeners() {
        // Menu toggle click
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Overlay click
        this.navOverlay.addEventListener('click', () => {
            this.closeMenu();
        });

        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });

        // Click outside to close menu (mobile only)
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen() && 
                window.innerWidth <= 768 &&
                !this.primaryNav.contains(e.target) && 
                e.target !== this.menuToggle) {
                this.closeMenu();
            }
        });

        // Window resize handling
        this.handleResize();
    }

    initAccessibility() {
        // Set initial ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-controls', 'primary-nav');
        this.primaryNav.setAttribute('aria-hidden', 'true');
    }

    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menuToggle.classList.add('active');
        this.primaryNav.classList.add('active');
        this.navOverlay.classList.add('active');
        this.body.classList.add('menu-open');
        
        // Update ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.primaryNav.setAttribute('aria-hidden', 'false');
        
        console.log('Menu opened');
    }

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.primaryNav.classList.remove('active');
        this.navOverlay.classList.remove('active');
        this.body.classList.remove('menu-open');
        
        // Update ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.primaryNav.setAttribute('aria-hidden', 'true');
        
        console.log('Menu closed');
    }

    isMenuOpen() {
        return this.menuToggle.classList.contains('active');
    }

    handleResize() {
        let resizeTimeout;
        
        const resizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.isMenuOpen()) {
                    this.closeMenu();
                }
            }, 100);
        };

        window.addEventListener('resize', resizeHandler);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.hamburgerMenu = new HamburgerMenu();
});