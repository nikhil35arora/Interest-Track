// 1. Check if user is logged in
const userId = localStorage.getItem('loggedUserId');
if (!userId) {
    window.location.href = 'login.html';
}

async function fetchTransactionHistory() {
    const tableBody = document.getElementById('table-body');
    const headerTitle = document.querySelector('.history-header h1');
    
    // 2. Check for a specific filter (from Contacts page)
    const filterName = localStorage.getItem('filterName');

    try {
        // 3. Fetch ONLY this user's data
        const response = await fetch(`http://127.0.0.1:8000/api/transactions/${userId}`);
        let transactions = await response.json();
        
        tableBody.innerHTML = ''; 

        if (!transactions || transactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No transactions found.</td></tr>';
            return;
        }

        // 4. Apply Filter if it exists
        if (filterName) {
            transactions = transactions.filter(txn => txn.name === filterName);
            headerTitle.innerText = `Transactions: ${filterName}`;
            // IMPORTANT: Clear the filter so next time we see everything
            localStorage.removeItem('filterName'); 
        } else {
            headerTitle.innerText = "Transaction History";
        }

        // 5. Build the Table
        transactions.forEach(txn => {
            const row = document.createElement('tr');
            const amount = parseFloat(txn.amount) || 0;
            const rate = parseFloat(txn.rate) || 0;
            const monthlyInterest = (amount * rate) / 100;
            
            row.innerHTML = `
                <td>${new Date(txn.date).toLocaleDateString('en-IN')}</td>
                <td><strong>${txn.name}</strong></td>
                <td><span class="type-tag ${txn.type.toLowerCase()}">${txn.type}</span></td>
                <td>${formatCurrency(amount)}</td>
                <td>${txn.rate}%</td>
                <td>${formatCurrency(monthlyInterest)}</td>
                <td><span class="status-ok">Active</span></td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("History Load Error:", error);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Error connecting to server.</td></tr>';
    }
}

// 6. Search Functionality
function filterTable() {
    const input = document.getElementById("search-bar");
    const filter = input.value.toUpperCase();
    const rows = document.getElementById("table-body").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[1];
        if (nameColumn) {
            const textValue = nameColumn.textContent || nameColumn.innerText;
            rows[i].style.display = textValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

window.onload = fetchTransactionHistory;