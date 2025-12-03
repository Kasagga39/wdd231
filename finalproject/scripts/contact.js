// products.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the products page
    if (document.getElementById('allProducts') || document.getElementById('featuredProducts')) {
        loadProducts();
        setupFilters();
    }
    
    // Check if we're on the home page (for featured products)
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
});

// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Load all products on products page
async function loadProducts() {
    const productsGrid = document.getElementById('allProducts');
    if (!productsGrid) return;
    
    // Show loading state
    productsGrid.innerHTML = '<div class="loading"><p>Loading products...</p></div>';
    
    const products = await fetchProducts();
    displayProducts(products, productsGrid);
    setupWishlist();
}

// Load featured products on home page (first 6 products)
async function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    if (!productsGrid) return;
    
    const products = await fetchProducts();
    const featuredProducts = products.slice(0, 6); // Get first 6 products
    
    displayProducts(featuredProducts, productsGrid);
    setupWishlist();
}

// Display products in grid
function displayProducts(products, container) {
    if (!products.length) {
        container.innerHTML = '<div class="no-products"><p>No products found.</p></div>';
        return;
    }
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    card.dataset.price = product.price;
    
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
    }).format(product.price);
    
    // Get category icon
    const categoryIcon = getCategoryIcon(product.category);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" width="300" height="200">
            <button class="wishlist-btn" aria-label="Add ${product.name} to wishlist" data-product-id="${product.id}">
                ♡
            </button>
        </div>
        <div class="product-info">
            <div class="product-category">
                <span class="category-icon">${categoryIcon}</span>
                ${getCategoryName(product.category)}
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-specs">
                ${generateSpecsHTML(product)}
            </div>
            <div class="product-footer">
                <div class="product-price">${formattedPrice}</div>
                <button class="view-details-btn" data-product-id="${product.id}">View Details</button>
            </div>
        </div>
    `;
    
    return card;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'solar': '☀️',
        'inverter': '⚡',
        'battery': '🔋',
        'accessories': '🔧'
    };
    return icons[category] || '📦';
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'solar': 'Solar Systems',
        'inverter': 'Inverters',
        'battery': 'Batteries',
        'accessories': 'Accessories'
    };
    return names[category] || 'Other';
}

// Generate specifications HTML
function generateSpecsHTML(product) {
    let specsHTML = '';
    
    // Common specs for all products
    if (product.warranty) {
        specsHTML += `<div class="spec-item"><span>Warranty:</span> ${product.warranty}</div>`;
    }
    
    // Category-specific specs
    if (product.category === 'solar') {
        if (product.power) specsHTML += `<div class="spec-item"><span>Power:</span> ${product.power}</div>`;
        if (product.type) specsHTML += `<div class="spec-item"><span>Type:</span> ${product.type}</div>`;
    } else if (product.category === 'inverter') {
        if (product.capacity) specsHTML += `<div class="spec-item"><span>Capacity:</span> ${product.capacity}</div>`;
        if (product.efficiency) specsHTML += `<div class="spec-item"><span>Efficiency:</span> ${product.efficiency}</div>`;
    } else if (product.category === 'battery') {
        if (product.capacity) specsHTML += `<div class="spec-item"><span>Capacity:</span> ${product.capacity}</div>`;
        if (product.type) specsHTML += `<div class="spec-item"><span>Type:</span> ${product.type}</div>`;
    } else if (product.category === 'accessories') {
        if (product.power) specsHTML += `<div class="spec-item"><span>Power:</span> ${product.power}</div>`;
        if (product.voltage) specsHTML += `<div class="spec-item"><span>Voltage:</span> ${product.voltage}</div>`;
    }
    
    return specsHTML;
}

// Setup filter functionality
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortByFilter = document.getElementById('sortBy');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }
    
    if (sortByFilter) {
        sortByFilter.addEventListener('change', filterAndSortProducts);
    }
}

// Filter and sort products
async function filterAndSortProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortByFilter = document.getElementById('sortBy');
    const productsGrid = document.getElementById('allProducts');
    
    if (!productsGrid) return;
    
    const products = await fetchProducts();
    
    // Filter by category
    let filteredProducts = products;
    if (categoryFilter && categoryFilter.value !== 'all') {
        filteredProducts = products.filter(product => product.category === categoryFilter.value);
    }
    
    // Sort products
    if (sortByFilter) {
        filteredProducts.sort((a, b) => {
            switch(sortByFilter.value) {
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
    
    // Display filtered and sorted products
    displayProducts(filteredProducts, productsGrid);
}

// Setup wishlist functionality
function setupWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const viewDetailBtns = document.querySelectorAll('.view-details-btn');
    
    // Wishlist buttons
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            toggleWishlist(productId, this);
        });
    });
    
    // View details buttons
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            showProductDetails(productId);
        });
    });
    
    // Load wishlist from localStorage and update display
    updateWishlistDisplay();
}

// Toggle product in wishlist
function toggleWishlist(productId, buttonElement) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        // Add to wishlist
        wishlist.push(productId);
        if (buttonElement) {
            buttonElement.textContent = '♥';
            buttonElement.setAttribute('aria-label', 'Remove from wishlist');
            buttonElement.classList.add('in-wishlist');
        }
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        if (buttonElement) {
            buttonElement.textContent = '♡';
            buttonElement.setAttribute('aria-label', 'Add to wishlist');
            buttonElement.classList.remove('in-wishlist');
        }
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();
}

// Update wishlist display
function updateWishlistDisplay() {
    const wishlistContainer = document.getElementById('wishlistItems');
    if (!wishlistContainer) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <p>Your wishlist is empty.</p>
                <p>Browse products and click the ♡ icon to add items.</p>
            </div>
        `;
        return;
    }
    
    // Fetch products and display wishlist items
    fetchProducts().then(products => {
        const wishlistProducts = products.filter(product => 
            wishlist.includes(product.id.toString())
        );
        
        wishlistContainer.innerHTML = '';
        
        wishlistProducts.forEach(product => {
            const wishlistItem = createWishlistItem(product);
            wishlistContainer.appendChild(wishlistItem);
        });
    });
}

// Create wishlist item HTML
function createWishlistItem(product) {
    const item = document.createElement('div');
    item.className = 'wishlist-item';
    item.dataset.id = product.id;
    
    const formattedPrice = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
    }).format(product.price);
    
    item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="80" height="80">
        <div class="wishlist-info">
            <h4>${product.name}</h4>
            <div class="wishlist-price">${formattedPrice}</div>
        </div>
        <div class="wishlist-actions">
            <button class="remove-wishlist" aria-label="Remove ${product.name} from wishlist" data-product-id="${product.id}">✕</button>
            <button class="view-wishlist-details" data-product-id="${product.id}">View</button>
        </div>
    `;
    
    return item;
}

// Show product details in modal
async function showProductDetails(productId) {
    const products = await fetchProducts();
    const product = products.find(p => p.id == productId);
    
    if (!product) return;
    
    // Format price
    const formattedPrice = new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0
    }).format(product.price);
    
    // Create modal content
    const modalContent = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="modal-product-info">
                <h2 id="modalTitle">${product.name}</h2>
                <div class="modal-product-category">${getCategoryName(product.category)}</div>
                <p class="modal-product-description">${product.description}</p>
                
                <div class="modal-product-specs">
                    <h3>Specifications</h3>
                    ${generateModalSpecsHTML(product)}
                </div>
                
                <div class="modal-product-price">${formattedPrice}</div>
                
                <div class="modal-actions">
                    <button class="modal-wishlist-btn" data-product-id="${product.id}">
                        Add to Wishlist
                    </button>
                    <button class="modal-close" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Display in modal (you'll need to implement modal functionality)
    const modalContentEl = document.getElementById('modalContent');
    const modal = document.getElementById('productModal');
    
    if (modalContentEl && modal) {
        modalContentEl.innerHTML = modalContent;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        
        // Add event listener for wishlist button in modal
        const modalWishlistBtn = modalContentEl.querySelector('.modal-wishlist-btn');
        if (modalWishlistBtn) {
            modalWishlistBtn.addEventListener('click', function() {
                toggleWishlist(productId, this);
            });
        }
        
        // Close modal when clicking outside or escape key
        setupModalClose(modal);
    }
}

// Generate specifications HTML for modal
function generateModalSpecsHTML(product) {
    let specsHTML = '<ul>';
    
    // Add all available specifications
    for (const [key, value] of Object.entries(product)) {
        // Skip these keys
        if (['id', 'name', 'category', 'description', 'image', 'price'].includes(key)) continue;
        
        // Format key name
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        specsHTML += `<li><strong>${formattedKey}:</strong> ${value}</li>`;
    }
    
    specsHTML += '</ul>';
    return specsHTML;
}

// Setup modal close functionality
function setupModalClose(modal) {
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}