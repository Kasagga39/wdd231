// Complete JavaScript for Chamber of Commerce Website

// Sample member data
const memberData = [
    {
        "name": "Springfield Manufacturing Co.",
        "address": "123 Industrial Way, Springfield",
        "phone": "(555) 123-4567",
        "website": "www.springfieldmfg.com",
        "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "membershipLevel": "Gold",
        "description": "Leading the way in sustainable manufacturing with innovative solutions for over 30 years."
    },
    {
        "name": "Innovate Tech Solutions",
        "address": "456 Tech Drive, Springfield",
        "phone": "(555) 234-5678",
        "website": "www.innovatetech.com",
        "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "membershipLevel": "Gold",
        "description": "Providing cutting-edge software development and IT services to businesses of all sizes."
    },
    {
        "name": "Green Valley Organics",
        "address": "789 Farm Road, Springfield",
        "phone": "(555) 345-6789",
        "website": "www.greenvalleyorganics.com",
        "image": "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "membershipLevel": "Silver",
        "description": "Your local source for fresh, organic produce and sustainable household products."
    },
    {
        "name": "Pioneer Construction",
        "address": "321 Builder's Lane, Springfield",
        "phone": "(555) 456-7890",
        "website": "www.pioneerconstruction.com",
        "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "membershipLevel": "Gold",
        "description": "Building Springfield's future with quality construction and remodeling services."
    },
    {
        "name": "Springfield Financial Services",
        "address": "654 Money Street, Springfield",
        "phone": "(555) 567-8901",
        "website": "www.springfieldfinancial.com",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "membershipLevel": "Silver",
        "description": "Comprehensive financial planning and investment services for individuals and businesses."
    },
    {
        "name": "Metro Logistics",
        "address": "987 Transport Avenue, Springfield",
        "phone": "(555) 678-9012",
        "website": "www.metrologistics.com",
        "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "membershipLevel": "Silver",
        "description": "Efficient supply chain and logistics solutions for businesses across the region."
    }
];

// Function to get weather icon based on condition code
function getWeatherIcon(code) {
    // Weather code mapping from Open-Meteo API
    if (code === 0) return 'fas fa-sun'; // Clear sky
    if (code === 1 || code === 2) return 'fas fa-cloud-sun'; // Mainly clear, partly cloudy
    if (code === 3) return 'fas fa-cloud'; // Overcast
    if (code >= 45 && code <= 48) return 'fas fa-smog'; // Fog
    if (code >= 51 && code <= 67) return 'fas fa-cloud-rain'; // Drizzle and rain
    if (code >= 71 && code <= 77) return 'fas fa-snowflake'; // Snow
    if (code >= 80 && code <= 82) return 'fas fa-cloud-showers-heavy'; // Rain showers
    if (code >= 85 && code <= 86) return 'fas fa-snowflake'; // Snow showers
    if (code >= 95 && code <= 99) return 'fas fa-bolt'; // Thunderstorm
    
    return 'fas fa-cloud'; // Default
}

// Function to get weather description based on condition code
function getWeatherDescription(code) {
    // Weather code mapping from Open-Meteo API
    if (code === 0) return 'Clear sky';
    if (code === 1) return 'Mainly clear';
    if (code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    
    return 'Cloudy'; // Default
}

// Function to format date for forecast
function formatForecastDate(timestamp) {
    const date = new Date(timestamp);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to display weather data
function displayWeather(data) {
    // Hide loading indicators
    document.getElementById('weather-loading').style.display = 'none';
    document.getElementById('forecast-loading').style.display = 'none';
    
    // Show weather containers
    document.getElementById('current-weather').style.display = 'block';
    document.getElementById('forecast-grid').style.display = 'grid';
    
    // Update current weather
    document.getElementById('current-temp').textContent = `${Math.round(data.current.temperature_2m)}°F`;
    document.getElementById('weather-desc').textContent = getWeatherDescription(data.current.weather_code);
    document.getElementById('wind-speed').textContent = `${Math.round(data.current.wind_speed_10m)} mph`;
    document.getElementById('humidity').textContent = `${data.current.relative_humidity_2m}%`;
    
    // Set weather icon
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = getWeatherIcon(data.current.weather_code);
    
    // Get high and low temps for today from daily forecast
    document.getElementById('high-temp').textContent = `${Math.round(data.daily.temperature_2m_max[0])}°F`;
    document.getElementById('low-temp').textContent = `${Math.round(data.daily.temperature_2m_min[0])}°F`;
    
    // Display 3-day forecast
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = '';
    
    // Show next 3 days (skip today)
    for (let i = 1; i <= 3; i++) {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        
        forecastDay.innerHTML = `
            <div class="forecast-date">${formatForecastDate(data.daily.time[i])}</div>
            <i class="${getWeatherIcon(data.daily.weather_code[i])}" style="font-size: 2rem; color: var(--primary); margin-bottom: 10px;"></i>
            <div class="forecast-temp">${Math.round(data.daily.temperature_2m_max[i])}°F</div>
            <div style="margin-top: 5px; font-size: 0.9rem; color: var(--gray);">${getWeatherDescription(data.daily.weather_code[i])}</div>
        `;
        
        forecastGrid.appendChild(forecastDay);
    }
}

// Function to display fallback weather data (in case API fails)
function displayFallbackWeather() {
    // Hide loading indicators
    document.getElementById('weather-loading').style.display = 'none';
    document.getElementById('forecast-loading').style.display = 'none';
    
    // Show weather containers
    document.getElementById('current-weather').style.display = 'block';
    document.getElementById('forecast-grid').style.display = 'grid';
    
    // Set fallback current weather data
    document.getElementById('current-temp').textContent = '72°F';
    document.getElementById('weather-desc').textContent = 'Partly Cloudy';
    document.getElementById('wind-speed').textContent = '5 mph';
    document.getElementById('humidity').textContent = '45%';
    document.getElementById('high-temp').textContent = '78°F';
    document.getElementById('low-temp').textContent = '65°F';
    
    // Set weather icon
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = 'fas fa-cloud-sun';
    
    // Display fallback 3-day forecast
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = '';
    
    // Create dates for next 3 days
    const today = new Date();
    const forecastDays = [];
    
    for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        forecastDays.push(date);
    }
    
    // Fallback forecast data
    const forecastTemps = [75, 73, 70];
    const forecastConditions = ['Sunny', 'Partly Cloudy', 'Cloudy'];
    const forecastIcons = ['fas fa-sun', 'fas fa-cloud-sun', 'fas fa-cloud'];
    
    // Create forecast elements
    for (let i = 0; i < 3; i++) {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        
        forecastDay.innerHTML = `
            <div class="forecast-date">${formatForecastDate(forecastDays[i])}</div>
            <i class="${forecastIcons[i]}" style="font-size: 2rem; color: var(--primary); margin-bottom: 10px;"></i>
            <div class="forecast-temp">${forecastTemps[i]}°F</div>
            <div style="margin-top: 5px; font-size: 0.9rem; color: var(--gray);">${forecastConditions[i]}</div>
        `;
        
        forecastGrid.appendChild(forecastDay);
    }
}

// Function to fetch weather data from Open-Meteo API
async function fetchWeatherData() {
    try {
        // Use a free weather API that doesn't require a key
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.78&longitude=-89.65&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,time&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago');
        
        if (!response.ok) {
            throw new Error('Weather API failed');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Use fallback data if API fails
        displayFallbackWeather();
    }
}

// Function to display member spotlights
function displayMemberSpotlights() {
    // Hide loading indicator
    const loadingElement = document.getElementById('spotlights-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Show spotlights container
    const spotlightsGrid = document.getElementById('spotlights-grid');
    if (!spotlightsGrid) {
        console.error('Spotlights grid element not found');
        return;
    }
    
    spotlightsGrid.style.display = 'grid';
    
    // Filter for Gold and Silver members
    const premiumMembers = memberData.filter(member => 
        member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
    );
    
    // If no premium members found, show message
    if (premiumMembers.length === 0) {
        spotlightsGrid.innerHTML = '<div class="loading"><p>No premium members found</p></div>';
        return;
    }
    
    // Randomly select 2-3 members
    const numToShow = Math.min(Math.floor(Math.random() * 2) + 2, premiumMembers.length);
    const shuffled = [...premiumMembers].sort(() => 0.5 - Math.random());
    const selectedMembers = shuffled.slice(0, numToShow);
    
    // Display the selected members
    spotlightsGrid.innerHTML = '';
    
    selectedMembers.forEach(member => {
        const spotlightCard = document.createElement('div');
        spotlightCard.className = 'spotlight-card';
        
        // Determine badge color based on membership level
        const badgeColor = member.membershipLevel === 'Gold' ? '#d4af37' : '#c0c0c0';
        
        spotlightCard.innerHTML = `
            <div class="spotlight-img" style="background-image: url('${member.image}');"></div>
            <div class="spotlight-content">
                <span class="spotlight-tag" style="background-color: ${badgeColor}">${member.membershipLevel} Member</span>
                <h3 class="spotlight-title">${member.name}</h3>
                <p>${member.description}</p>
                <div class="spotlight-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
                    <p><i class="fas fa-phone"></i> ${member.phone}</p>
                    <p><i class="fas fa-globe"></i> ${member.website}</p>
                </div>
                <a href="#" class="btn">Learn More</a>
            </div>
        `;
        
        spotlightsGrid.appendChild(spotlightCard);
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing page...');
    
    // Fetch and display weather data
    fetchWeatherData();
    
    // Display member spotlights
    displayMemberSpotlights();
    
    // Add click event to join button
    const joinButton = document.querySelector('.btn-primary');
    if (joinButton) {
        joinButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Thank you for your interest in joining the Springfield Chamber of Commerce! Our membership team will contact you soon.');
        });
    }
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Fallback initialization in case DOMContentLoaded doesn't fire
window.addEventListener('load', function() {
    // Check if spotlights are already loaded
    const spotlightsGrid = document.getElementById('spotlights-grid');
    if (spotlightsGrid && spotlightsGrid.children.length === 0) {
        console.log('Window loaded, initializing spotlights...');
        displayMemberSpotlights();
    }
    
    // Check if weather is already loaded
    const currentWeather = document.getElementById('current-weather');
    if (currentWeather && currentWeather.style.display === 'none') {
        console.log('Window loaded, initializing weather...');
        fetchWeatherData();
    }
});

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        memberData,
        fetchWeatherData,
        displayMemberSpotlights,
        getWeatherIcon,
        getWeatherDescription
    };
}
/*header*/
// Hamburger Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const overlay = document.querySelector('.overlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Event Listeners
hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close menu when clicking on a link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

// Close menu when window is resized to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});