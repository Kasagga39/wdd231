// ES Module for API/data handling
const API_URL = 'data/products.json';

export async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return fallback data or empty array
        return [];
    }
}

export async function fetchProductById(id) {
    try {
        const products = await fetchProducts();
        return products.find(product => product.id === parseInt(id)) || null;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return null;
    }
}

export async function filterProductsByCategory(category) {
    try {
        const products = await fetchProducts();
        if (category === 'all') return products;
        return products.filter(product => product.category === category);
    } catch (error) {
        console.error('Error filtering products:', error);
        return [];
    }
}

export function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'name':
        default:
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
}