// ES Module imports
import { fetchRecipes, fetchCategories } from './api.js';
import { showModal, closeModal } from './modal.js';
import { saveFavorite, getFavorites } from './favorites.js';

// DOM Elements
const featuredRecipesContainer = document.getElementById('featuredRecipes');
const categoriesList = document.getElementById('categoriesList');
const recipeModal = document.getElementById('recipeModal');
const searchForm = document.getElementById('searchForm');

// Fetch and display featured recipes
async function displayFeaturedRecipes() {
    try {
        const recipes = await fetchRecipes('chicken'); // Example category
        
        // Use array method (map) to transform data
        const recipeCards = recipes.slice(0, 15).map(recipe => {
            return `
                <article class="recipe-card" data-id="${recipe.idMeal}">
                    <img src="${recipe.strMealThumb}" 
                         alt="${recipe.strMeal}" 
                         class="lazy-img"
                         loading="lazy">
                    <div class="recipe-info">
                        <h3>${recipe.strMeal}</h3>
                        <p>${recipe.strCategory}</p>
                        <p>${recipe.strArea}</p>
                        <button class="view-recipe" data-id="${recipe.idMeal}">
                            View Recipe
                        </button>
                        <button class="favorite-btn" data-id="${recipe.idMeal}">
                            ♡ Favorite
                        </button>
                    </div>
                </article>
            `;
        });
        
        featuredRecipesContainer.innerHTML = recipeCards.join('');
        
        // Add event listeners
        document.querySelectorAll('.view-recipe').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const recipeId = e.target.dataset.id;
                await showRecipeDetails(recipeId);
            });
        });
        
        // Initialize lazy loading
        initLazyLoading();
        
    } catch (error) {
        console.error('Error loading recipes:', error);
        featuredRecipesContainer.innerHTML = 
            '<p>Failed to load recipes. Please try again later.</p>';
    }
}

// Lazy loading implementation
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Local storage for user preferences
function initUserPreferences() {
    const preferences = {
        theme: localStorage.getItem('theme') || 'light',
        itemsPerPage: localStorage.getItem('itemsPerPage') || '12'
    };
    
    // Apply preferences
    if (preferences.theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Save preference function
    window.savePreference = (key, value) => {
        localStorage.setItem(key, value);
    };
}

// Form handling
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchForm.querySelector('input[type="search"]').value;
        
        try {
            const results = await fetchRecipes(searchTerm);
            displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    });
}

// Filter recipes using array method
function filterByCategory(recipes, category) {
    return recipes.filter(recipe => 
        recipe.strCategory.toLowerCase() === category.toLowerCase()
    );
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedRecipes();
    initUserPreferences();
    
    // Update copyright year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchRecipes(searchTerm) {
    try {
        const response = await fetch(`${API_BASE}/search.php?s=${searchTerm}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.meals || [];
        
    } catch (error) {
        console.error('Error fetching recipes:', error);
        // Fallback to local data
        return fetchLocalData();
    }
}

export async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals?.[0] || null;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        return null;
    }
}

// Local fallback data
async function fetchLocalData() {
    try {
        const response = await fetch('data/local-recipes.json');
        return await response.json();
    } catch (error) {
        return [];
    }
}