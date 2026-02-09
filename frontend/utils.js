function formatCurrency(amount) {
    const symbol = localStorage.getItem('appCurrency') || '₹';
    const rate = parseFloat(localStorage.getItem('conversionRate')) || 1;
    
    // Calculate the converted value
    const convertedAmount = amount * rate;

    // Use US formatting for Dollars, Indian formatting for Rupees
    const locale = symbol === '$' ? 'en-US' : 'en-IN';
    
    return symbol + convertedAmount.toLocaleString(locale, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}
// utils.js
function logoutUser() {
    console.log("Logging out..."); // Helps you see it working in the Console
    localStorage.removeItem('loggedUserId');
    localStorage.removeItem('loggedUsername');
    window.location.href = 'login.html';
}