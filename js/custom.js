// Removed offcanvas class manipulation to ensure it always slides from the start (left)
// The offcanvas-start class is already set in the HTML.
// No need for this function if offcanvas-start is desired for all screen sizes.
// function setOffcanvasClass() {
//     const offcanvas = document.getElementById('offcanvasNavbar');
//     // Ensure offcanvas-start is always present and offcanvas-top is removed
//     offcanvas.classList.remove('offcanvas-top');
//     offcanvas.classList.add('offcanvas-start');
// }

// window.addEventListener('resize', setOffcanvasClass);
// window.addEventListener('DOMContentLoaded', setOffcanvasClass);