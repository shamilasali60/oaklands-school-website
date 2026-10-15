// --- NEW: Dynamic Gallery Loader ---
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
            item.onclick = () => openModal(img.imageUrl);
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

// Trigger the gallery loader when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicGallery();
});
