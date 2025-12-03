// ES Module for form handling and validation
export class FormHandler {
    constructor(formId, successPage = 'form-action.html') {
        this.form = document.getElementById(formId);
        this.successPage = successPage;
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupLiveValidation();
        }
    }
    
    setupLiveValidation() {
        // Real-time validation for each field
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }
    
    validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`);
        
        if (!field.checkValidity()) {
            let errorMessage = this.getErrorMessage(field);
            this.showError(field, errorElement, errorMessage);
            return false;
        }
        
        this.clearError(field, errorElement);
        return true;
    }
    
    getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required';
        }
        
        if (field.validity.typeMismatch) {
            if (field.type === 'email') return 'Please enter a valid email address';
        }
        
        if (field.validity.tooShort) {
            return `Minimum length is ${field.minLength} characters`;
        }
        
        if (field.validity.tooLong) {
            return `Maximum length is ${field.maxLength} characters`;
        }
        
        return 'Please check this field';
    }
    
    showError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    clearError(field, errorElement = null) {
        field.classList.remove('error');
        const element = errorElement || document.getElementById(`${field.id}Error`);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Collect form data
        const formData = new FormData(this.form);
        const dataObject = {};
        
        for (let [key, value] of formData.entries()) {
            dataObject[key] = value;
        }
        
        // Add timestamp
        dataObject.timestamp = new Date().toISOString();
        
        // Save form data to localStorage before redirecting
        this.saveFormData(dataObject);
        
        // Redirect to success page with query parameters
        this.redirectToSuccessPage(dataObject);
    }
    
    saveFormData(data) {
        // Save to localStorage for backup
        try {
            localStorage.setItem('lastFormSubmission', JSON.stringify(data));
        } catch (error) {
            console.error('Could not save form data to localStorage:', error);
        }
    }
    
    redirectToSuccessPage(data) {
        // Build query string from form data
        const queryParams = new URLSearchParams();
        
        Object.entries(data).forEach(([key, value]) => {
            if (value !== '' && key !== 'timestamp') {
                queryParams.append(key, value);
            }
        });
        
        // Add formatted timestamp for display
        const displayTimestamp = new Date(data.timestamp).toLocaleString('en-UG', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });
        queryParams.append('formattedTimestamp', displayTimestamp);
        
        // Redirect to success page
        window.location.href = `${this.successPage}?${queryParams.toString()}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const formHandler = new FormHandler('contactForm');
    
    // Additional form enhancements
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Format phone number as user types
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '+256 ' + value;
            }
            e.target.value = value;
        });
    }
    
    // Character counter for message
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.8rem';
        counter.style.color = '#666';
        counter.style.marginTop = '0.25rem';
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const remaining = 1000 - this.value.length;
            counter.textContent = `${this.value.length}/1000 characters`;
            counter.style.color = remaining < 50 ? '#e74c3c' : '#666';
        });
    }
});