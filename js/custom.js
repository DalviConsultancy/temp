document.addEventListener('DOMContentLoaded', () => {
    const navLinksContainer = document.getElementById('offcanvas-nav-links');
    if (navLinksContainer) {
        const pages = [
            { name: 'Home', file: 'index.html' },
            { name: 'About Us', file: 'about-us.html' },
            { name: 'Booking', file: 'booking.html' },
            { name: 'Contact', file: 'contact.html' },
            { name: 'Deals', file: 'deals.html' },
            { name: 'Events', file: 'events.html' },
            { name: 'Gallery', file: 'gallery.html' },
            { name: 'Games', file: 'games.html' },
            { name: 'News', file: 'news.html' },
            { name: 'PC Specs', file: 'pc-specs.html' },
            { name: 'Prices', file: 'prices.html' }
        ];

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        pages.forEach(page => {
            const listItem = document.createElement('li');
            listItem.classList.add('nav-item');
            const link = document.createElement('a');
            link.classList.add('nav-link');
            link.href = page.file;
            link.textContent = page.name;

            if (currentPage === page.file) {
                listItem.classList.add('active-page');
            }
            listItem.appendChild(link);
            navLinksContainer.appendChild(listItem);
        });
    }
});
