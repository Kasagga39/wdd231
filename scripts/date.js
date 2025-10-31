// Dynamically insert current year
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Display last modified date
document.getElementById("lastModified").textContent = `Last modified: ${document.lastModified}`;
