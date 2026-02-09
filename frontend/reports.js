const userId = localStorage.getItem('loggedUserId');
if (!userId) {
    window.location.href = 'login.html';
}
// Helper function (Paste this at the top)
function formatCurrency(amount) {
    const symbol = localStorage.getItem('appCurrency') || '₹';
    const rate = parseFloat(localStorage.getItem('conversionRate')) || 1;
    const convertedAmount = amount * rate;
    const locale = symbol === '$' ? 'en-US' : 'en-IN';
    
    return symbol + convertedAmount.toLocaleString(locale, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

async function generateReport() {
    try {
        const userId = localStorage.getItem('loggedUserId');
        const response = await fetch(`http://127.0.0.1:8000/api/transactions/${userId}`);
        const transactions = await response.json();

        // 1. Start totals at 0
        let totalLent = 0;
        let totalTaken = 0;
        let totalMonthlyInterest = 0;
        const uniqueDebtors = new Set();

        transactions.forEach(txn => {
            // 2. Force values to numbers to avoid 'NaN'
            const amt = Number(txn.amount) || 0;
            const rate = Number(txn.rate) || 0;
            const type = (txn.type || "").trim().toLowerCase();

            if (type === 'lent' || type === 'given') {
                totalLent += amt;
                totalMonthlyInterest += (amt * rate) / 100;
                if (txn.name) uniqueDebtors.add(txn.name);
            } else if (type === 'taken' || type === 'received') {
                totalTaken += amt;
            }
        });

        // 3. Update the UI using the formatCurrency helper
        document.getElementById('total-lent').innerText = formatCurrency(totalLent);
        document.getElementById('total-taken').innerText = formatCurrency(totalTaken);
        document.getElementById('monthly-interest').innerText = formatCurrency(totalMonthlyInterest);
        
        const net = totalLent - totalTaken;
        const netEl = document.getElementById('net-position');
        netEl.innerText = formatCurrency(net);
        
        // Color coding
        netEl.style.color = net >= 0 ? "#27ae60" : "#e74c3c";

        // 4. Update Table
        document.getElementById('performance-body').innerHTML = `
            <tr><td>Active Borrowers</td><td>${uniqueDebtors.size} People</td></tr>
            <tr><td>Annual Projected Profit</td><td>${formatCurrency(totalMonthlyInterest * 12)}</td></tr>
        `;

    } catch (error) {
        console.error("Report Logic Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', generateReport);