const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://interest-track.onrender.com';
async function handleSignup(event) {
    event.preventDefault(); // Stop page from refreshing

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Account created! You can now login.");
            window.location.href = 'login.html'; // Send them to login page
        } else {
            alert("Error: " + data.error);
        }
    } catch (err) {
        console.error("Connection failed:", err);
        alert("Could not connect to server. Is server running?");
    }
}