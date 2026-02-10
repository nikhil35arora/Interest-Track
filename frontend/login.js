// 1. Put this at the VERY TOP
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://interest-track.onrender.com';

// 2. Select the FORM, not the button, for submit buttons
const loginForm = document.querySelector('form'); 

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // <--- THIS STOPS THE REFRESH
    
    console.log("Attempting to login...");

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('loggedUserId', data.userId);
            localStorage.setItem('loggedUsername', data.username);
            window.location.href = 'index.html';
        } else {
            alert(data.message || "Invalid Login");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Cannot connect to server. Check your connection.");
    }
});