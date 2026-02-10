const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://interest-track.onrender.com';
window.onload = function() {
    console.log("Contacts script is officially running!");
    loadContacts();
};
// contact.js
// Add this at the very top of your JS files
function getCurrency() {
    return localStorage.getItem('appCurrency') || '₹';
}
async function loadContacts() {
    const tableBody = document.getElementById('contacts-table-body');
    
    try {
        const userId = localStorage.getItem('loggedUserId');
        const response = await fetch(`${API_URL}/api/transactions/${userId}`);
        const transactions = await response.json();
        
        if (!transactions || transactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No data found.</td></tr>';
            return;
        }

        const contacts = {};

        transactions.forEach(txn => {
            const personName = txn.name || "Unknown"; 
            if (!contacts[personName]) {
                contacts[personName] = { lent: 0, taken: 0 };
            }

            const amount = parseFloat(txn.amount) || 0;
            const type = (txn.type || "").trim().toLowerCase();

            // FIX: We now look for 'given' OR 'lent'
            if (type === 'given' || type === 'lent') {
                contacts[personName].lent += amount;
            } 
            // FIX: We now look for 'taken' OR 'received'
            else if (type === 'taken' || type === 'received') {
                contacts[personName].taken += amount;
            }
        });

        tableBody.innerHTML = ''; 

        Object.keys(contacts).forEach(name => {
            const { lent, taken } = contacts[name];
            const net = lent - taken;
            const statusClass = net >= 0 ? 'text-green' : 'text-red';

            tableBody.innerHTML += `
             <tr>
                <td><strong>${name}</strong></td>
                <td>${formatCurrency(lent)}</td>
                <td>${formatCurrency(taken)}</td>
                <td class="${statusClass}"><strong>${formatCurrency(net)}</strong></td>
                <td><button class="view-btn" onclick="goToLedger('${name}')">View</button></td>
            </tr>
            `;
        });

    } catch (error) {
        console.error("Math Error:", error);
    }
}

function goToLedger(name) {
    localStorage.setItem('filterName', name);
    location.href = 'history.html';
}

window.onload = loadContacts;