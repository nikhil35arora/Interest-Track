const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://interest-track.onrender.com';
const userId = localStorage.getItem('loggedUserId');
if (!userId) {
    window.location.href = 'login.html';
}

// Save currency to LocalStorage so other pages can use it
function saveCurrency() {
    const currency = document.getElementById('currency-select').value;
    localStorage.setItem('appCurrency', currency);
    alert(`Currency changed to ${currency}. Please refresh other pages.`);
}

// Function to wipe the database
async function clearDatabase() {
    const confirmation = confirm("Are you sure? This will delete EVERY transaction in your database forever.");
    
    if (confirmation) {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${userId}`,{
                method: 'DELETE', // This must match the app.delete in server.js
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert("Database wiped clean!");
                // Clear local storage too just in case
                localStorage.removeItem('filterName'); 
                location.href = 'index.html'; // Redirect to dashboard
            } else {
                alert("Server error: Could not delete data.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Connection error: Is your server running?");
        }
    }
}

// Function to export MongoDB data to an Excel-friendly CSV
async function exportToCSV() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/transactions');
        const data = await response.json();

        let csvContent = "Date,Name,Type,Amount,Rate%\n";
        
        data.forEach(txn => {
            csvContent += `${txn.date},${txn.name},${txn.type},${txn.amount},${txn.rate}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'my_transactions.csv');
        a.click();
    } catch (err) {
        alert("Export failed.");
    }
}
// Function to fetch live rate and save settings
async function saveCurrency() {
    const currency = document.getElementById('currency-select').value;
    localStorage.setItem('appCurrency', currency);

    if (currency === '$') {
        try {
            // Fetching live INR to USD rate
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
            const data = await response.json();
            const rate = data.rates.USD;
            
            localStorage.setItem('conversionRate', rate);
            alert(`Settings Saved! Current Rate: 1 ₹ = $${rate}`);
        } catch (err) {
            alert("Could not fetch live rate. Using default (0.012)");
            localStorage.setItem('conversionRate', 0.012);
        }
    } else {
        // If it's Rupee, rate is always 1 (base currency)
        localStorage.setItem('conversionRate', 1);
        alert("Currency changed to Rupee (₹)");
    }
    
    location.reload(); 
}

// Load current settings
window.onload = () => {
    const savedCurrency = localStorage.getItem('appCurrency') || '₹';
    document.getElementById('currency-select').value = savedCurrency;
};