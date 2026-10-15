function toggleMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('navLinks');
            if (nav && nav.classList.contains('active')) nav.classList.remove('active');
        });
    });
    loadFeatures(); loadNews(); loadStaff();
});

document.body.insertAdjacentHTML('beforeend', '<button id="scrollTopBtn" title="Go to top">↑</button>');
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) scrollTopBtn.style.display = "block";
  else scrollTopBtn.style.display = "none";
};
scrollTopBtn.addEventListener("click", function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

async function loadFeatures() {
    const list = document.getElementById('features-list'); if (!list) return;
    try {
        const response = await fetch('/features'); const data = await response.json(); list.innerHTML = '';
        if (data.features.length === 0) { list.innerHTML = '<p class="loading-text">No features added yet.</p>'; return; }
        data.features.forEach(f => {
            const card = document.createElement('div'); card.className = 'feature-card';
            card.innerHTML = `<i class="fas ${f.icon}"></i><h3>${f.title}</h3><p>${f.description}</p>`; list.appendChild(card);
        });
    } catch (error) { list.innerHTML = '<p>Error loading features.</p>'; }
}

async function loadNews() {
    const list = document.getElementById('news-list'); if (!list) return;
    try {
        const response = await fetch('/news'); const data = await response.json(); list.innerHTML = '';
        if (data.news.length === 0) { list.innerHTML = '<p class="loading-text">No news or events yet.</p>'; return; }
        data.news.forEach(item => {
            const card = document.createElement('div'); card.className = 'news-card';
            let linkHtml = item.eventUrl ? `<a href="${item.eventUrl}" target="_blank" class="news-link-btn">View Event <i class="fas fa-external-link-alt"></i></a>` : '';
            card.innerHTML = `<span class="type">${item.type || 'Announcement'}</span><h3>${item.title}</h3><span class="date">${new Date(item.date).toLocaleDateString()}</span><p>${item.description}</p>${linkHtml}`;
            list.appendChild(card);
        });
    } catch (error) { list.innerHTML = '<p>Error loading news.</p>'; }
}

// UPDATED: Sort staff into 3 different sections
async function loadStaff() {
    const adminList = document.getElementById('admin-list');
    const primaryList = document.getElementById('primary-list');
    const nurseryList = document.getElementById('nursery-list');
    
    // If we are not on the staff page, exit
    if (!adminList && !primaryList && !nurseryList) return;

    try {
        const response = await fetch('/staff');
        const data = await response.json();
        
        // Clear loading text
        if(adminList) adminList.innerHTML = '';
        if(primaryList) primaryList.innerHTML = '';
        if(nurseryList) nurseryList.innerHTML = '';

        let adminCount = 0, primaryCount = 0, nurseryCount = 0;

        data.staff.forEach(member => {
            const card = document.createElement('div');
            card.className = 'staff-card';
            let imgHtml = member.photoUrl ? `<img src="${member.photoUrl}" alt="${member.name}">` : '';
            card.innerHTML = `${imgHtml}<h3>${member.name}</h3><span class="role">${member.role}</span><p>${member.bio}</p>`;

            const dept = member.department || 'Primary'; // Default to Primary if missing
            
            if (dept === 'Administration') {
                if(adminList) adminList.appendChild(card); adminCount++;
            } else if (dept === 'Nursery') {
                if(nurseryList) nurseryList.appendChild(card); nurseryCount++;
            } else {
                if(primaryList) primaryList.appendChild(card); primaryCount++;
            }
        });

        // Show message if a section is empty
        if (adminList && adminCount === 0) adminList.innerHTML = '<p class="loading-text">No administration staff added yet.</p>';
        if (primaryList && primaryCount === 0) primaryList.innerHTML = '<p class="loading-text">No primary staff added yet.</p>';
        if (nurseryList && nurseryCount === 0) nurseryList.innerHTML = '<p class="loading-text">No nursery staff added yet.</p>';

    } catch (error) { 
        if(adminList) adminList.innerHTML = '<p>Error loading staff.</p>';
    }
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); const status = document.getElementById('form-status');
        try {
            const response = await fetch('/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: document.getElementById('name').value, email: document.getElementById('email').value, message: document.getElementById('message').value }) });
            if (response.ok) { status.innerText = '✅ Message sent successfully!'; status.style.color = 'green'; contactForm.reset(); } 
            else { throw new Error('Failed'); }
        } catch (error) { status.innerText = '❌ Error sending message.'; status.style.color = 'red'; }
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById("imageModal"); const modalImg = document.getElementById("modalImg");
    if (modal && modalImg) { modal.style.display = "block"; modalImg.src = imageSrc; }
}
function closeModal() { const modal = document.getElementById("imageModal"); if (modal) modal.style.display = "none"; }
