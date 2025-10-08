// Simple client-side user storage using localStorage (for demo only)

// Register user
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const messageEl = document.getElementById('registerMessage');

    if (password !== confirmPassword) {
        messageEl.textContent = "Passwords do not match.";
        return;
    }

    if (localStorage.getItem(email)) {
        messageEl.textContent = "User already exists. Please login.";
        return;
    }

    const user = { name, email, password };
    localStorage.setItem(email, JSON.stringify(user));
    messageEl.style.color = "green";
    messageEl.textContent = "Registration successful! Redirecting to login...";
    
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
});

// Login user
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    const userData = localStorage.getItem(email);
    if (!userData) {
        messageEl.textContent = "User not found. Please register.";
        return;
    }

    const user = JSON.parse(userData);
    if (user.password !== password) {
        messageEl.textContent = "Incorrect password.";
        return;
    }

    // Save logged-in user email in session storage
    sessionStorage.setItem('loggedInUser', email);
    messageEl.style.color = "green";
    messageEl.textContent = "Login successful! Redirecting...";
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1500);
});

// Dashboard logic
if (window.location.pathname.endsWith('dashboard.html')) {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // Redirect to login if not logged in
        window.location.href = "index.html";
    }

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = "index.html";
    });

    // Load donation records from sessionStorage or initialize
    const donationList = JSON.parse(sessionStorage.getItem('donations')) || [];

    const tbody = document.querySelector('#donationTable tbody');

    function renderDonations() {
        tbody.innerHTML = '';
        if (donationList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No donations recorded yet.</td></tr>';
            return;
        }
        donationList.forEach(donation => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${donation.donorName}</td>
                <td>${donation.bloodGroup}</td>
                <td>${donation.donationDate}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderDonations();

    // Add new donation
    document.getElementById('donationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const donorName = document.getElementById('donorName').value.trim();
        const bloodGroup = document.getElementById('bloodGroup').value;
        const donationDate = document.getElementById('donationDate').value;

        if (!donorName || !bloodGroup || !donationDate) return;

        donationList.push({ donorName, bloodGroup, donationDate });
        sessionStorage.setItem('donations', JSON.stringify(donationList));

        renderDonations();

        this.reset();
    });
}
