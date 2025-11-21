 
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Display submitted data
        document.getElementById('display-first-name').textContent = urlParams.get('first-name') || 'Not provided';
        document.getElementById('display-last-name').textContent = urlParams.get('last-name') || 'Not provided';
        document.getElementById('display-email').textContent = urlParams.get('email') || 'Not provided';
        document.getElementById('display-phone').textContent = urlParams.get('phone') || 'Not provided';
        document.getElementById('display-org-name').textContent = urlParams.get('org-name') || 'Not provided';
        
        // Format and display timestamp
        const timestamp = urlParams.get('timestamp');
        if (timestamp) {
            const date = new Date(timestamp);
            document.getElementById('display-timestamp').textContent = date.toLocaleString();
        } else {
            document.getElementById('display-timestamp').textContent = 'Not available';
        }
    