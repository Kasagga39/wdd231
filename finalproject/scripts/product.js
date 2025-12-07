// ============================================
// PRODUCTS PAGE MODULE - MJ Electronics
// ============================================

// Import functions from other modules
import { formatCurrency, initLazyLoading } from './utils.js';
import { showModal } from './modal.js';

// DOM Elements
const allProductsContainer = document.getElementById('allProducts');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const wishlistContainer = document.getElementById('wishlistItems');

// Local Storage Keys
const WISHLIST_KEY = 'mj_electronics_wishlist';
const PRODUCTS_KEY = 'mj_electronics_products';

// Global variables
let allProducts = [];
let filteredProducts = [];

// Initialize the products page
document.addEventListener('DOMContentLoaded', initProductsPage);

async function initProductsPage() {
    try {
        // Load products from JSON
        await loadProducts();
        
        // Initialize filters
        initFilters();
        
        // Initialize wishlist
        if (wishlistContainer) {
            displayWishlist();
        }
        
        // Initialize lazy loading
        initLazyLoading();
        
    } catch (error) {
        console.error('Error initializing products page:', error);
        showErrorMessage();
    }
}

// Fetch products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Save to localStorage for offline access
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
        
        // Display all products
        displayProducts(filteredProducts);
        
    } catch (error) {
        console.error('Error loading products:', error);
        
        // Try to load from localStorage as fallback
        try {
            const savedProducts = localStorage.getItem(PRODUCTS_KEY);
            if (savedProducts) {
                allProducts = JSON.parse(savedProducts);
                filteredProducts = [...allProducts];
                displayProducts(filteredProducts);
                showNotification('Using cached products data', 'info');
            } else {
                throw new Error('No products data available');
            }
        } catch (localStorageError) {
            console.error('Could not load from localStorage:', localStorageError);
            showErrorMessage();
        }
    }
}

// Display products in the grid
function displayProducts(products) {
    if (!allProductsContainer) return;
    
    if (products.length === 0) {
        allProductsContainer.innerHTML = `
            <div class="no-products">
                <p>No products found matching your criteria.</p>
                <button onclick="resetFilters()" class="cta-button">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    // Use array.map() to create product cards
    const productCards = products.map(product => createProductCard(product));
    
    allProductsContainer.innerHTML = productCards.join('');
    
    // Add event listeners to the new buttons
    addProductEventListeners();
}

// Create HTML for a product card
function createProductCard(product) {
    const isInWishlist = checkIfInWishlist(product.id);
    const wishlistBtnText = isInWishlist ? '❤️ In Wishlist' : '♡ Add to Wishlist';
    const wishlistBtnClass = isInWishlist ? 'in-wishlist' : 'add-to-wishlist';
    
    // Template literal for dynamic content
    return `
        <article class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image lazy-img"
                     loading="lazy"
                     width="300"
                     height="200"
                     onerror="this.src='images/placeholder.jpg'">
                <span class="product-category-badge">${getCategoryLabel(product.category)}</span>
            </div>
            
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-specs">
                    ${product.power ? `<div class="spec-item"><span>Power:</span> ${product.power}</div>` : ''}
                    ${product.capacity ? `<div class="spec-item"><span>Capacity:</span> ${product.capacity}</div>` : ''}
                    ${product.warranty ? `<div class="spec-item"><span>Warranty:</span> ${product.warranty}</div>` : ''}
                    ${product.type ? `<div class="spec-item"><span>Type:</span> ${product.type}</div>` : ''}
                </div>
                
                <div class="product-price-container">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <span class="product-id">#${product.id.toString().padStart(3, '0')}</span>
                </div>
                
                <div class="product-actions">
                    <button class="product-btn view-details" 
                            data-id="${product.id}"
                            aria-label="View details for ${product.name}">
                        View Details
                    </button>
                    <button class="product-btn ${wishlistBtnClass}" 
                            data-id="${product.id}"
                            data-in-wishlist="${isInWishlist}"
                            aria-label="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                        ${wishlistBtnText}
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Get category label for display
function getCategoryLabel(category) {
    const labels = {
        'solar': '☀️ Solar',
        'inverter': '⚡ Inverter',
        'battery': '🔋 Battery',
        'accessories': '🔧 Accessories'
    };
    return labels[category] || category;
}

// Add event listeners to product buttons
function addProductEventListeners() {
    // View Details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = parseInt(e.target.dataset.id);
            await showProductDetails(productId);
        });
    });
    
    // Add/Remove from Wishlist buttons
    document.querySelectorAll('.add-to-wishlist, .in-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const isInWishlist = e.target.dataset.inWishlist === 'true';
            
            if (isInWishlist) {
                removeFromWishlist(productId);
            } else {
                addToWishlist(productId);
            }
        });
    });
}

// Show product details in modal
async function showProductDetails(productId) {
    try {
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        // Create modal content with template literal
        const modalContent = `
            <div class="product-modal-content">
                <div class="product-modal-image">
                    <img src="${product.image}" 
                         alt="${product.name}"
                         onerror="this.src='images/placeholder.jpg'">
                </div>
                
                <div class="product-modal-details">
                    <h2>${product.name}</h2>
                    <p class="product-modal-category">${getCategoryLabel(product.category)}</p>
                    
                    <div class="product-modal-price">
                        ${formatCurrency(product.price)}
                    </div>
                    
                    <p class="product-modal-description">${product.description}</p>
                    
                    <div class="product-modal-specs">
                        <h3>Specifications</h3>
                        <ul>
                            ${product.power ? `<li><strong>Power:</strong> ${product.power}</li>` : ''}
                            ${product.capacity ? `<li><strong>Capacity:</strong> ${product.capacity}</li>` : ''}
                            ${product.efficiency ? `<li><strong>Efficiency:</strong> ${product.efficiency}</li>` : ''}
                            ${product.type ? `<li><strong>Type:</strong> ${product.type}</li>` : ''}
                            ${product.warranty ? `<li><strong>Warranty:</strong> ${product.warranty}</li>` : ''}
                            ${product.runtime ? `<li><strong>Runtime:</strong> ${product.runtime}</li>` : ''}
                            ${product.life ? `<li><strong>Life Span:</strong> ${product.life}</li>` : ''}
                            ${product.solarInput ? `<li><strong>Solar Input:</strong> ${product.solarInput}</li>` : ''}
                            ${product.transfer ? `<li><strong>Transfer Time:</strong> ${product.transfer}</li>` : ''}
                            ${product.cameras ? `<li><strong>Cameras:</strong> ${product.cameras}</li>` : ''}
                            ${product.storage ? `<li><strong>Storage:</strong> ${product.storage}</li>` : ''}
                            ${product.quantity ? `<li><strong>Quantity:</strong> ${product.quantity}</li>` : ''}
                            ${product.wattage ? `<li><strong>Wattage:</strong> ${product.wattage}</li>` : ''}
                        </ul>
                    </div>
                    
                    ${product.components ? `
                        <div class="product-modal-components">
                            <h3>Components Included</h3>
                            <ul>
                                ${product.components.map(component => `<li>${component}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="product-modal-actions">
                        <button class="cta-button add-to-wishlist-modal" 
                                data-id="${product.id}"
                                onclick="toggleWishlist(${product.id})">
                            ${checkIfInWishlist(product.id) ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
                        </button>
                        <button class="cta-button secondary" onclick="window.location.href='contact.html?product=${product.id}'">
                            Get Quote
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        showModal(modalContent);
        
    } catch (error) {
        console.error('Error showing product details:', error);
        showModal('<p class="error">Error loading product details. Please try again.</p>');
    }
}

// Initialize filter controls
function initFilters() {
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilterChange);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', handleSortChange);
    }
}

// Handle category filter change
function handleFilterChange() {
    const category = categoryFilter.value;
    
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        // Use array.filter() method
        filteredProducts = allProducts.filter(product => product.category === category);
    }
    
    // Apply current sort
    const sortValue = sortBy.value;
    applySorting(sortValue);
    
    displayProducts(filteredProducts);
}

// Handle sort change
function handleSortChange() {
    const sortValue = sortBy.value;
    applySorting(sortValue);
    displayProducts(filteredProducts);
}

// Apply sorting to filtered products
function applySorting(sortByValue) {
    // Use array.sort() method
    filteredProducts.sort((a, b) => {
        switch (sortByValue) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
}

// Reset all filters
function resetFilters() {
    if (categoryFilter) categoryFilter.value = 'all';
    if (sortBy) sortBy.value = 'name';
    
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
}

// Wishlist functionality
function getWishlist() {
    try {
        const wishlistJSON = localStorage.getItem(WISHLIST_KEY);
        return wishlistJSON ? JSON.parse(wishlistJSON) : [];
    } catch (error) {
        console.error('Error getting wishlist:', error);
        return [];
    }
}

function saveWishlist(wishlist) {
    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error saving wishlist:', error);
    }
}

function checkIfInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}

function addToWishlist(productId) {
    const wishlist = getWishlist();
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist(wishlist);
        showNotification('Product added to wishlist!', 'success');
        updateWishlistDisplay();
        updateProductButtons(productId, true);
    }
}

function removeFromWishlist(productId) {
    // Use array.filter() method
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(id => id !== productId);
    saveWishlist(updatedWishlist);
    showNotification('Product removed from wishlist', 'info');
    updateWishlistDisplay();
    updateProductButtons(productId, false);
}

function toggleWishlist(productId) {
    if (checkIfInWishlist(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

function updateProductButtons(productId, isInWishlist) {
    const buttons = document.querySelectorAll(`[data-id="${productId}"]`);
    
    buttons.forEach(button => {
        if (button.classList.contains('add-to-wishlist') || button.classList.contains('in-wishlist')) {
            if (isInWishlist) {
                button.textContent = '❤️ In Wishlist';
                button.classList.remove('add-to-wishlist');
                button.classList.add('in-wishlist');
                button.dataset.inWishlist = 'true';
            } else {
                button.textContent = '♡ Add to Wishlist';
                button.classList.remove('in-wishlist');
                button.classList.add('add-to-wishlist');
                button.dataset.inWishlist = 'false';
            }
        }
    });
}

function displayWishlist() {
    if (!wishlistContainer) return;
    
    const wishlist = getWishlist();
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <p>Your wishlist is empty.</p>
                <p>Browse our products and click the ♡ icon to add items.</p>
            </div>
        `;
        return;
    }
    
    const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id));
    
    // Use array.map() with template literal
    const wishlistHTML = wishlistProducts.map(product => `
        <div class="wishlist-item" data-id="${product.id}">
            <div class="wishlist-item-image">
                <img src="${product.image}" 
                     alt="${product.name}"
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="wishlist-item-info">
                <h4>${product.name}</h4>
                <p class="wishlist-item-price">${formatCurrency(product.price)}</p>
                <p class="wishlist-item-category">${getCategoryLabel(product.category)}</p>
            </div>
            <div class="wishlist-item-actions">
                <button class="view-details-small" data-id="${product.id}">
                    View
                </button>
                <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
    
    wishlistContainer.innerHTML = wishlistHTML;
    
    // Add event listeners to view buttons in wishlist
    document.querySelectorAll('.view-details-small').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = parseInt(e.target.dataset.id);
            await showProductDetails(productId);
        });
    });
}

function updateWishlistDisplay() {
    if (wishlistContainer) {
        displayWishlist();
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Use inline styles instead of creating a style tag
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.backgroundColor = type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1';
    notification.style.color = type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460';
    notification.style.border = `1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'}`;
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showErrorMessage() {
    if (allProductsContainer) {
        allProductsContainer.innerHTML = `
            <div class="error-state">
                <p>Unable to load products at this time.</p>
                <p>Please check your internet connection and try again.</p>
                <button onclick="location.reload()" class="cta-button">Retry</button>
            </div>
        `;
    }
}

// Make functions available globally for inline onclick handlers
window.resetFilters = resetFilters;
window.toggleWishlist = toggleWishlist;
window.removeFromWishlist = removeFromWishlist;

