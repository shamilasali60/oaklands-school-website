// Mobile Menu Toggle
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
    loadFeatures(); 
    loadNews(); 
    loadStaff();
    loadDynamicGallery(); // Load gallery on page load
});

// Back to Top Button
document.body.insertAdjacentHTML('beforeend', '<button id="scrollTopBtn" title="Go to top">↑</button>');
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) scrollTopBtn.style.display = "block";
  else scrollTopBtn.style.display = "none";
};
scrollTopBtn.addEventListener("click", function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// Load Features
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

// Load News
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

// Load Staff (Segmented by Department)
async function loadStaff() {
    const adminList = document.getElementById('admin-list');
    const primaryList = document.getElementById('primary-list');
    const nurseryList = document.getElementById('nursery-list');
    
    if (!adminList && !primaryList && !nurseryList) return;

    try {
        const response = await fetch('/staff');
        const data = await response.json();
        
        if(adminList) adminList.innerHTML = '';
        if(primaryList) primaryList.innerHTML = '';
        if(nurseryList) nurseryList.innerHTML = '';

        let adminCount = 0, primaryCount = 0, nurseryCount = 0;

        data.staff.forEach(member => {
            const card = document.createElement('div');
            card.className = 'staff-card';
            let imgHtml = member.photoUrl ? `<img src="${member.photoUrl}" alt="${member.name}">` : '';
            card.innerHTML = `${imgHtml}<h3>${member.name}</h3><span class="role">${member.role}</span><p>${member.bio}</p>`;

            const dept = member.department || 'Primary';
            
            if (dept === 'Administration') {
                if(adminList) adminList.appendChild(card); adminCount++;
            } else if (dept === 'Nursery') {
                if(nurseryList) nurseryList.appendChild(card); nurseryCount++;
            } else {
                if(primaryList) primaryList.appendChild(card); primaryCount++;
            }
        });

        if (adminList && adminCount === 0) adminList.innerHTML = '<p class="loading-text">No administration staff added yet.</p>';
        if (primaryList && primaryCount === 0) primaryList.innerHTML = '<p class="loading-text">No primary staff added yet.</p>';
        if (nurseryList && nurseryCount === 0) nurseryList.innerHTML = '<p class="loading-text">No nursery staff added yet.</p>';

    } catch (error) { 
        if(adminList) adminList.innerHTML = '<p>Error loading staff.</p>';
    }
}

// Load Dynamic Gallery (NEW - Fetches from database)
async function loadDynamicGallery() {
    const container = document.getElementById('dynamic-gallery');
    if (!container) return; // Exit if we aren't on the gallery page

    try {
        const response = await fetch('/gallery');
        const data = await response.json();
        container.innerHTML = ''; // Clear loading text

        if (data.images.length === 0) {
            container.innerHTML = '<p class="loading-text" style="grid-column: 1/-1; text-align: center;">No photos added to the gallery yet.</p>';
            return;
        }

        data.images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            // Add click event to open modal
            item.onclick = function() { openModal(img.imageUrl); };
            item.innerHTML = `
                <img src="${img.imageUrl}" alt="${img.caption}">
                <div class="overlay">
                    <i class="fas fa-search-plus"></i>
                    <p>${img.caption}</p>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        container.innerHTML = '<p class="loading-text" style="grid-column: 1/-1; text-align: center; color: red;">Error loading gallery.</p>';
    }
}

// Contact Form Handler
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

// Modal Functions - MUST BE GLOBAL
window.openModal = function(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
    }
}

window.closeModal = function() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}
