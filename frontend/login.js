const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
 ? 'http://localhost:8000' 
 : 'https://interest-track.onrender.com';

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        // SAVE the identity of the user
        localStorage.setItem('loggedUserId', data.userId);
        localStorage.setItem('loggedUsername', data.username);
        window.location.href = 'index.html';
    } else {
        alert("Login Failed!");
    }
}