let tickets = JSON.parse(localStorage.getItem("tickets")) || []; // Load existing tickets

function mintTicket() {
    const eventName = document.getElementById('eventName').value;
    const ticketPassword = document.getElementById('ticketPassword').value;
    const ticketId = "TICKET" + Math.random().toString(36).substring(2, 10);

    if (eventName && ticketPassword) {
        // Store full ID with "Incomplete Verification" status
        tickets.push({ 
            eventName, 
            ticketId, 
            fullId: ticketId, 
            password: ticketPassword, 
            status: "Incomplete Verification",
            verified: false 
        });
        localStorage.setItem("tickets", JSON.stringify(tickets));

        // Display the FULL ticket ID
        document.getElementById('temporaryTicket').innerHTML = `<p>Your Ticket ID: <strong>${ticketId}</strong></p>`;
        document.getElementById('eventName').value = '';
        document.getElementById('ticketPassword').value = '';

        loadTickets(); // Refresh ticket list
    } else {
        showNotification("Please fill in all fields", "error");
    }
}

function deleteTicket(ticketId) {
    tickets = tickets.filter(ticket => ticket.ticketId !== ticketId);
    localStorage.setItem("tickets", JSON.stringify(tickets));
    loadTickets(); // Refresh the list after deletion
}

function showNotification(message, type) {
    let notification = document.getElementById("notificationBar");

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notificationBar";
        notification.className = `notification ${type}`;
        document.body.appendChild(notification);
    }

    notification.className = `notification ${type} show`;
    notification.innerText = message;
    notification.style.display = "block";

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.style.display = "none";
        }, 500); // Wait for slide-down animation
    }, 5000);
}

function verifyTicket() {
    const ticketId = document.getElementById('verifyTicketId').value;
    const ticketPassword = document.getElementById('verifyTicketPassword').value;
    let storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];

    const ticketIndex = storedTickets.findIndex(t => t.fullId === ticketId && t.password === ticketPassword);

    if (ticketIndex !== -1) {
        storedTickets[ticketIndex].status = "✅ Verified"; // Update status
        storedTickets[ticketIndex].verified = true; // Mark ticket as verified
        localStorage.setItem("tickets", JSON.stringify(storedTickets));
        showNotification("✅ Ticket Verified Successfully!", "success");
        loadTickets(); // Refresh the ticket list

        // Display Confirm Button
        showConfirmButton();
    } else {
        showNotification("❌ Invalid Ticket or Password!", "error");
    }
}

// Function to display Confirm Here button
function showConfirmButton() {
    let confirmButton = document.createElement("button");
    confirmButton.innerText = "Confirm Here";
    confirmButton.className = "confirm-button";
    confirmButton.onclick = function () {
        window.location.href = "verify1.html"; // Redirects to QR page
    };

    let verificationResult = document.getElementById("verificationResult");
    verificationResult.innerHTML = ""; // Clear previous messages
    verificationResult.appendChild(confirmButton);
}

function loadTickets() {
    const ticketTable = document.getElementById('ticketTable');
    if (ticketTable) {
        const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
        const tbody = ticketTable.querySelector("tbody");
        tbody.innerHTML = ""; // Clear old entries

        storedTickets.forEach(ticket => {
            const statusText = ticket.verified ? "✅ Verified" : "Incomplete Verification";
            const statusClass = ticket.verified ? "verified" : "incomplete";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="ticket-name">
                    ${ticket.eventName} 
                    <button class="delete-btn" onclick="deleteTicket('${ticket.ticketId}')">🗑️</button>
                </td>
                <td>${ticket.ticketId}</td>
                <td class="status ${statusClass}">${statusText}</td>
                
            `;

            // ✅ Add a green bar when Verified
            if (ticket.verified) {
                row.style.backgroundColor = "#d4edda"; // Light green background
                row.style.color = "#155724"; // Dark green text
                row.style.fontWeight = "bold";
            }

            tbody.appendChild(row);
        });
    }
}

function redirectToMint() {
    window.location.href = "index.html"; // Change "index.html" if your mint page has a different name
}

function redirectToTickets() {
    window.location.href = "mytickets.html";
}

function redirectToVerify(ticketId) {
    localStorage.setItem("currentTicket", ticketId); // Store the ticket ID for verification
    window.location.href = "verifys.html"; // Redirect to verification page
}

// ✅ When returning from verification, update status
window.onload = function () {
    let ticketId = localStorage.getItem("currentTicket");
    if (ticketId) {
        let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        let ticket = tickets.find(t => t.ticketId === ticketId);
        if (ticket) {
            ticket.verified = true; // Mark as verified
            ticket.status = "✅ Verified"; // Update text
            localStorage.setItem("tickets", JSON.stringify(tickets));
        }
        localStorage.removeItem("currentTicket"); // Clear stored ticket ID
    }
    loadTickets();
};
