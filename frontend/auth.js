function checkAuth() {
    const userId = localStorage.getItem('loggedUserId');
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('signup.html');

    // If not logged in and not on login page -> Redirect to Login
    if (!userId && !isAuthPage) {
        window.location.href = 'login.html';
    }

    // If already logged in and tries to open login -> Redirect to Dashboard
    if (userId && isAuthPage) {
        window.location.href = 'index.html';
    }
}

function logoutUser() {
    localStorage.removeItem('loggedUserId');
    localStorage.removeItem('loggedUsername');
    window.location.href = 'login.html';
}

// Run immediately on page load
checkAuth();