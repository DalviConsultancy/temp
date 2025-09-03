document.addEventListener('DOMContentLoaded', () => {
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.querySelector('.calendar-days');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventModal = new bootstrap.Modal(document.getElementById('eventModal')); // Bootstrap modal instance
    const eventModalLabel = document.getElementById('eventModalLabel');
    const eventModalBody = document.getElementById('eventModalBody');

    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Dummy Event Data (Year, Month (0-11), Day, Title, Description)
    const events = [
        // August 2025
        { year: 2025, month: 7, day: 10, title: "Retro Gaming Night", description: "Get ready for a blast from the past! Our next community event will be a Retro Gaming Night." },
        { year: 2025, month: 7, day: 23, title: "Weekly Valorant Tournament", description: "Join us every Friday for our weekly Valorant tournament. Prizes for the top 3 teams." },

        // September 2025
        { year: 2025, month: 8, day: 5, title: "FIFA 25 Championship", description: "Compete in our first FIFA 25 tournament! Prove you're the best on the virtual pitch." },
        { year: 2025, month: 8, day: 19, title: "Community Board Game Night", description: "Take a break from screens and join us for a fun evening of classic and modern board games." },

        // October 2025
        { year: 2025, month: 9, day: 13, title: "Halloween Horror Game Marathon", description: "Brave the night with us! Play the scariest horror games until dawn." },
        { year: 2025, month: 9, day: 27, title: "Overwatch 2 Showdown", description: "Team up and dominate in our bi-weekly Overwatch 2 tournament." },

        // November 2025
        { year: 2025, month: 10, day: 10, title: "Smash Bros. Ultimate Tournament", description: "Show off your skills in the ultimate fighting game. All characters welcome!" },
        { year: 2025, month: 10, day: 24, title: "Indie Game Spotlight", description: "Discover hidden gems! Play and discuss the best indie games with fellow enthusiasts." },

        // December 2025
        { year: 2025, month: 11, day: 8, title: "Holiday Gaming Gala", description: "Celebrate the holidays with special gaming challenges, prizes, and festive treats." },
        { year: 2025, month: 11, day: 22, title: "Year-End Esports Review", description: "Join us for a discussion and highlights of the biggest esports moments of 2025." },

        // January 2026
        { year: 2026, month: 0, day: 15, title: "New Year, New Games LAN Party", description: "Kick off 2026 with a massive LAN party featuring the latest game releases." },
        { year: 2026, month: 0, day: 29, title: "Apex Legends Championship", description: "Prove your squad is the best in our high-stakes Apex Legends tournament." },

        // February 2026
        { year: 2026, month: 1, day: 12, title: "Valentine's Duo Gaming", description: "Bring a friend or find a partner for fun co-op challenges and prizes." },
        { year: 2026, month: 1, day: 26, title: "Rocket League Rumble", description: "Fast-paced car soccer action! Compete for glory in our Rocket League tournament." }
    ];

    const renderCalendar = () => {
        currentMonthYear.innerHTML = `${months[currentMonth]} ${currentYear}`;
        calendarDays.innerHTML = ''; // Clear all previous days

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Fill in empty days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            calendarDays.appendChild(emptyDiv);
        }

        // Fill in days of the current month
        for (let i = 1; i <= lastDayOfMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;

            // Check for current day
            if (i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
                dayDiv.classList.add('current-day');
            }

            // Check for events on this day
            const dayEvents = events.filter(event =>
                event.year === currentYear && event.month === currentMonth && event.day === i
            );

            if (dayEvents.length > 0) {
                dayDiv.classList.add('has-event');
                dayDiv.style.cursor = 'pointer'; // Indicate clickable

                dayDiv.addEventListener('click', () => {
                    eventModalLabel.textContent = dayEvents[0].title; // Display first event title
                    eventModalBody.innerHTML = `<p>${dayEvents[0].description}</p>`; // Display first event description
                    eventModal.show(); // Show the modal
                });
            }
            calendarDays.appendChild(dayDiv);
        }
    };

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Initial render
    renderCalendar();

    // Render weekdays
    const calendarWeekdays = document.querySelector('.calendar-weekdays');
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(day => {
        const div = document.createElement('div');
        div.textContent = day;
        calendarWeekdays.appendChild(div);
    });
});
