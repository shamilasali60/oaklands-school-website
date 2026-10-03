// 1. Load Staff Members when the page loads
document.addEventListener('DOMContentLoaded', loadStaff);

async function loadStaff() {
    const staffList = document.getElementById('staff-list');
    
    try {
        // Fetch staff from our backend API
        const response = await fetch('/staff');
        const data = await response.json();
        
        // Clear the "Loading..." text
        staffList.innerHTML = '';

        if (data.staff.length === 0) {
            staffList.innerHTML = '<p>No staff members added yet.</p>';
            return;
        }

        // Create a card for each staff member
        data.staff.forEach(member => {
            const card = document.createElement('div');
            card.className = 'staff-card';
            card.innerHTML = `
                <h3>${member.name}</h3>
                <span class="role">${member.role}</span>
                <p>${member.bio}</p>
            `;
            staffList.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading staff:', error);
        staffList.innerHTML = '<p>Error loading staff members.</p>';
    }
}

// 2. Handle Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page from refreshing

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        // Send data to our backend API
        const response = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            formStatus.innerText = '✅ Message sent successfully! We will get back to you soon.';
            formStatus.style.color = 'green';
            contactForm.reset(); // Clear the form
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        formStatus.innerText = '❌ Error sending message. Please try again.';
        formStatus.style.color = 'red';
    }
});