document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.section-title').closest('section');
    const statElements = document.querySelectorAll('.card h3');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statElements.forEach((stat, index) => {
                    const targetNumber = parseInt(stat.textContent.replace(/\D/g, ''));
                    let currentNumber = 0;
                    const duration = 7000; // 7 seconds
                    const increment = targetNumber / (duration / 50); // Update every 50ms

                    const interval = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= targetNumber) {
                            stat.textContent = targetNumber.toLocaleString() + (stat.textContent.includes('+') ? '+' : '');
                            clearInterval(interval);
                        } else {
                            stat.textContent = Math.floor(currentNumber).toLocaleString() + (stat.textContent.includes('+') ? '+' : '');
                        }
                    }, 50);
                });
                observer.unobserve(statsSection);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    if (statsSection) {
        observer.observe(statsSection);
    }
});