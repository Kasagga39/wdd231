// ES Module for modal functionality
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.querySelector('.close-modal');

export function showModal(content) {
    modalContent.innerHTML = content;
    modal.setAttribute('hidden', 'false');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus trap for accessibility
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    firstFocusableElement.focus();
    
    document.addEventListener('keydown', trapFocus);
    
    function trapFocus(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
        
        if (e.key === 'Escape') {
            closeModal();
        }
    }
}

export function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('hidden', 'true');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trapFocus);
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on close button click
closeModalBtn.addEventListener('click', closeModal);