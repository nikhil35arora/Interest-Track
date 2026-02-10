const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://interest-track.onrender.com';
// 1. Redirect if not logged in
const userId = localStorage.getItem('loggedUserId');
if (!userId) {
    window.location.href = 'login.html';
}

document.getElementById('current-date').innerText = new Date().toDateString();

document.getElementById('interest-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 2. Define variables using EXACT IDs from your index.html
    const name = document.getElementById('contact-name').value;
    const amount = parseFloat(document.getElementById('principal').value); // ID IS PRINCIPAL
    const rate = parseFloat(document.getElementById('rate').value);
    const type = document.getElementById('type').value;

    // 3. Prepare data for Server
    const transactionData = {
        userId: userId, 
        name: name,
        amount: amount,
        type: type,
        rate: rate,
        date: new Date()
    };

    try {
        const response = await fetch(`${API_URL}/api/transactions/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData)
        });

        if (response.ok) {
            // 4. Math for the Result Cards
            const monthlyInterest = (amount * rate) / 100;
            const totalPayable = amount + monthlyInterest;

            // 5. Update UI (Using formatCurrency from utils.js)
            document.getElementById('total-interest').innerText = formatCurrency(monthlyInterest);
            document.getElementById('total-payable').innerText = formatCurrency(totalPayable);

            alert("✅ Saved successfully! Dashboard updated.");
            this.reset(); 
        } else {
            alert("❌ Server Error: Could not save.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Server is not running. Check your terminal.");
    }
});