// chamber/scripts/join.js
        // Set timestamp when page loads
        document.addEventListener('DOMContentLoaded', function() {
            const now = new Date();
            document.getElementById('timestamp').value = now.toISOString();
            
            // Modal functionality
            const modalLinks = document.querySelectorAll('.card-link');
            const modals = document.querySelectorAll('.modal');
            const closeButtons = document.querySelectorAll('.close-modal');
            
            // Open modal when card link is clicked
            modalLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const modalId = this.getAttribute('data-modal');
                    document.getElementById(modalId).style.display = 'flex';
                });
            });
            
            // Close modal when close button is clicked
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.closest('.modal').style.display = 'none';
                });
            });
            
            // Close modal when clicking outside the modal content
            modals.forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.style.display = 'none';
                    }
                });
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    modals.forEach(modal => {
                        modal.style.display = 'none';
                    });
                }
            });
        });
    