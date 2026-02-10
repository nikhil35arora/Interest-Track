const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://interest-track.onrender.com';
const userId = localStorage.getItem('loggedUserId');
if (!userId) {
    window.location.href = 'login.html';
}

// 1. Unified Currency Formatter (Matches your Settings)
function formatCurrency(amount) {
    const symbol = localStorage.getItem('appCurrency') || '₹';
    const rate = parseFloat(localStorage.getItem('conversionRate')) || 1;
    
    // Convert the value based on the exchange rate
    const convertedAmount = amount * rate;

    // Use US formatting for Dollars, Indian formatting for Rupees
    const locale = symbol === '$' ? 'en-US' : 'en-IN';
    
    return symbol + convertedAmount.toLocaleString(locale, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

async function loadReminders() {
    const reminderBody = document.getElementById('reminder-body');
    const dueCountEl = document.getElementById('due-count');

    try {
        const response = await fetch(`${API_URL}/api/transactions/${userId}`);
        const transactions = await response.json();

        let dueThisWeek = 0;
        reminderBody.innerHTML = '';
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        transactions.forEach(txn => {
            const type = (txn.type || "").trim().toLowerCase();
            
            if (type === 'lent' || type === 'given') {
                const amount = Number(txn.amount) || 0;
                const rate = Number(txn.rate) || 0;
                const monthlyInterest = (amount * rate) / 100;
                const entryDate = new Date(txn.date);

                // Calculate next due date
                let nextDueDate = new Date(today.getFullYear(), today.getMonth(), entryDate.getDate());
                if (nextDueDate < today) {
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                }

                // Check if due in next 7 days
                const diffTime = nextDueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isDueSoon = diffDays >= 0 && diffDays <= 7;

                let statusHTML = '';
                if (isDueSoon) {
                    dueThisWeek++;
                    statusHTML = `<span class="status-overdue">Due in ${diffDays} days</span>`;
                } else {
                    statusHTML = `<span class="status-ok">Due on ${nextDueDate.toLocaleDateString()}</span>`;
                }

                const row = `
                    <tr>
                        <td><strong>${txn.name}</strong></td>
                        <td>${formatCurrency(amount)}</td>
                        <td>${formatCurrency(monthlyInterest)}</td>
                        <td>${nextDueDate.toLocaleDateString()}</td>
                        <td>${statusHTML}</td>
                        <td><button class="whatsapp-btn" onclick="sendWhatsApp('${txn.name}', ${monthlyInterest})">Remind</button></td>
                    </tr>
                `;
                reminderBody.innerHTML += row;
            }
        });

        if (dueCountEl) dueCountEl.innerText = dueThisWeek;

    } catch (err) {
        console.error("Reminder Page Error:", err);
    }
}

function sendWhatsApp(name, interestAmount) {
    const formattedInterest = formatCurrency(interestAmount);
    const msg = `Hello ${name}, this is a reminder regarding the interest of ${formattedInterest} due. Please check. Thanks!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

window.onload = loadReminders;