// Main ES Module - imports
import { fetchProducts, filterProductsByCategory, sortProducts } from './api.js';
import { showModal, closeModal } from './modal.js';
import { formatCurrency, getCurrentYear, getLastModified, initLazyLoading, debounce } from './utils.js';

// DOM Elements
const hamburgerBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('mainNav');
const featuredProductsContainer = document.getElementById('featuredProducts');
const allProductsContainer = document.getElementById('allProducts');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const wishlistContainer = document.getElementById('wishlistItems');

// Local Storage Keys
const WISHLIST_KEY = 'mj_electronics_wishlist';
const THEME_KEY = 'mj_electronics_theme';

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    // Set current year and last modified date
    document.getElementById('currentYear').textContent = getCurrentYear();
    document.getElementById('lastModified').textContent = `Last Modified: ${getLastModified()}`;
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize theme
    initTheme();
    
    // Initialize products on relevant pages
    if (featuredProductsContainer) {
        await displayFeaturedProducts();
    }
    
    if (allProductsContainer) {
        await displayAllProducts();
        initFilters();
    }
    
    // Initialize wishlist
    if (wishlistContainer) {
        displayWishlist();
    }
    
    // Add theme toggle button
    createThemeToggle();
}

// Navigation
function initNavigation() {
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Set active link based on current page
    setActiveNavLink();
}

function toggleMenu() {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    navMenu.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

function createThemeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '🌓';
    toggleBtn.setAttribute('aria-label', 'Toggle dark/light theme');
    toggleBtn.addEventListener('click', toggleTheme);
    document.body.appendChild(toggleBtn);
}

// Products Display
async function displayFeaturedProducts() {
    try {
        const products = await fetchProducts();
        const featured = products.slice(0, 6); // Show first 6 as featured
        
        // Use array.map() method to transform data
        const productCards = featured.map(product => createProductCard(product));
        
        featuredProductsContainer.innerHTML = productCards.join('');
        
        // Add event listeners to the new buttons
        addProductEventListeners();
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        featuredProductsContainer.innerHTML = 
            '<p class="error">Failed to load products. Please try again later.</p>';
    }
}

async function displayAllProducts() {
    try {
        const products = await fetchProducts();
        displayProductsGrid(products);
    } catch (error) {
        console.error('Error loading all products:', error);
        allProductsContainer.innerHTML = 
            '<p class="error">Failed to load products. Please try again later.</p>';
    }
}

function displayProductsGrid(products) {
    // Use array.map() method with template literals
    const productCards = products.map(product => createProductCard(product));
    
    allProductsContainer.innerHTML = productCards.join('');
    addProductEventListeners();
}

function createProductCard(product) {
    // Template literal for dynamic content generation
    return `
        <article class="product-card" data-id="${product.id}" data-category="${product.category}">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="product-image lazy-img"
                 loading="lazy"
                 width="300"
                 height="200">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-category">Category: ${product.category}</p>
                <p class="product-warranty">Warranty: ${product.warranty}</p>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <div class="product-actions">
                    <button class="product-btn view-details" data-id="${product.id}">
                        View Details
                    </button>
                    <button class="product-btn add-to-wishlist" data-id="${product.id}">
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </article>
    `;
}

function addProductEventListeners() {
    // View Details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.dataset.id;
            await showProductDetails(productId);
        });
    });
    
    // Add to Wishlist buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            addToWishlist(productId);
        });
    });
}

async function showProductDetails(productId) {
    try {
        const product = await fetchProductById(parseInt(productId));
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        // Create modal content with template literal
        const modalContentHTML = `
            <h2 id="modalTitle">${product.name}</h2>
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; margin: 1rem 0;">
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> ${formatCurrency(product.price)}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Warranty:</strong> ${product.warranty}</p>
            
            ${product.power ? `<p><strong>Power:</strong> ${product.power}</p>` : ''}
            ${product.capacity ? `<p><strong>Capacity:</strong> ${product.capacity}</p>` : ''}
            ${product.efficiency ? `<p><strong>Efficiency:</strong> ${product.efficiency}</p>` : ''}
            ${product.type ? `<p><strong>Type:</strong> ${product.type}</p>` : ''}
            
            ${product.components ? `
                <p><strong>Components:</strong></p>
                <ul>
                    ${product.components.map(component => `<li>${component}</li>`).join('')}
                </ul>
            ` : ''}
            
            <button class="cta-button" onclick="addToWishlist(${product.id})" style="margin-top: 1rem;">
                Add to Wishlist
            </button>
        `;
        
        showModal(modalContentHTML);
        
    } catch (error) {
        console.error('Error showing product details:', error);
        showModal('<p>Error loading product details. Please try again.</p>');
    }
}

// Wishlist Management
function getWishlist() {
    const wishlistJSON = localStorage.getItem(WISHLIST_KEY);
    return wishlistJSON ? JSON.parse(wishlistJSON) : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function addToWishlist(productId) {
    const wishlist = getWishlist();
    
    if (!wishlist.includes(productId)) {
        wishlist.push(parseInt(productId));
        saveWishlist(wishlist);
        alert('Product added to wishlist!');
        
        // Update wishlist display if on wishlist page
        if (wishlistContainer) {
            displayWishlist();
        }
    } else {
        alert('Product is already in your wishlist!');
    }
}

function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(id => id !== parseInt(productId));
    saveWishlist(updatedWishlist);
    
    if (wishlistContainer) {
        displayWishlist();
    }
}

async function displayWishlist() {
    const wishlist = getWishlist();
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }
    
    try {
        const allProducts = await fetchProducts();
        const wishlistProducts = allProducts.filter(product => 
            wishlist.includes(product.id)
        );
        
        // Use array.map() with template literal
        const wishlistHTML = wishlistProducts.map(product => `
            <div class="wishlist-item" data-id="${product.id}">
                <div>
                    <h4>${product.name}</h4>
                    <p>${formatCurrency(product.price)}</p>
                </div>
                <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">
                    Remove
                </button>
            </div>
        `).join('');
        
        wishlistContainer.innerHTML = wishlistHTML;
        
    } catch (error) {
        console.error('Error displaying wishlist:', error);
        wishlistContainer.innerHTML = '<p>Error loading wishlist.</p>';
    }
}

// Filter and Sort
function initFilters() {
    if (categoryFilter) {
        categoryFilter.addEventListener('change', debounce(handleFilterChange, 300));
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', debounce(handleSortChange, 300));
    }
}

async function handleFilterChange() {
    const category = categoryFilter.value;
    const products = await filterProductsByCategory(category);
    const sortValue = sortBy ? sortBy.value : 'name';
    const sortedProducts = sortProducts(products, sortValue);
    displayProductsGrid(sortedProducts);
}

async function handleSortChange() {
    const category = categoryFilter ? categoryFilter.value : 'all';
    const products = await filterProductsByCategory(category);
    const sortedProducts = sortProducts(products, sortBy.value);
    displayProductsGrid(sortedProducts);
}

// Make functions available globally for inline onclick handlers
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;