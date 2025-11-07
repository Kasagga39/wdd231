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
