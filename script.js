document.addEventListener('DOMContentLoaded', () => {
    loadFeatures();
    loadNews();
    loadStaff();
});

// 1. Load Features (Why Choose Oaklands)
async function loadFeatures() {
    const list = document.getElementById('features-list');
    if (!list) return;
    try {
        const response = await fetch('/features');
        const data = await response.json();
        list.innerHTML = '';
        if (data.features.length === 0) {
            list.innerHTML = '<p class="loading-text">No features added yet. Admin can add them in the dashboard.</p>';
            return;
        }
        data.features.forEach(f => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML = `<i class="fas ${f.icon}"></i><h3>${f.title}</h3><p>${f.description}</p>`;
            list.appendChild(card);
        });
    } catch (error) { list.innerHTML = '<p>Error loading features.</p>'; }
}

// 2. Load News
async function loadNews() {
    const list = document.getElementById('news-list');
    if (!list) return;
    try {
        const response = await fetch('/news');
        const data = await response.json();
        list.innerHTML = '';
        if (data.news.length === 0) { list.innerHTML = '<p class="loading-text">No news or events yet.</p>'; return; }
        data.news.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `<span class="type">${item.type || 'Announcement'}</span><h3>${item.title}</h3><span class="date">${new Date(item.date).toLocaleDateString()}</span><p>${item.description}</p>`;
            list.appendChild(card);
        });
    } catch (error) { list.innerHTML = '<p>Error loading news.</p>'; }
}

// 3. Load Staff
async function loadStaff() {
    const list = document.getElementById('staff-list');
    if (!list) return;
    try {
        const response = await fetch('/staff');
        const data = await response.json();
        list.innerHTML = '';
        if (data.staff.length === 0) { list.innerHTML = '<p class="loading-text">No staff members added yet.</p>'; return; }
        data.staff.forEach(member => {
            const card = document.createElement('div');
            card.className = 'staff-card';
            let imgHtml = member.photoUrl ? `<img src="${member.photoUrl}" alt="${member.name}">` : '';
            card.innerHTML = `${imgHtml}<h3>${member.name}</h3><span class="role">${member.role}</span><p>${member.bio}</p>`;
            list.appendChild(card);
        });
    } catch (error) { list.innerHTML = '<p>Error loading staff.</p>'; }
}

// 4. Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        try {
            const response = await fetch('/contact', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: document.getElementById('name').value, email: document.getElementById('email').value, message: document.getElementById('message').value })
            });
            if (response.ok) {
                status.innerText = '✅ Message sent successfully!'; status.style.color = 'green'; contactForm.reset();
            } else { throw new Error('Failed'); }
        } catch (error) { status.innerText = '❌ Error sending message.'; status.style.color = 'red'; }
    });
}
