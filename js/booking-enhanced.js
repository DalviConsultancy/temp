document.addEventListener('DOMContentLoaded', () => {
    const clock = document.getElementById('interactive-clock');
    const highlightArc = document.getElementById('highlight-arc');
    const startMarker = document.getElementById('start-marker');
    const endMarker = document.getElementById('end-marker');
    const timeDisplay = document.getElementById('selected-time-range');
    const durationInput = document.getElementById('duration');
    const hiddenTimeInput = document.getElementById('hidden-time-range');

    const centerX = 150;
    const centerY = 150;
    const radius = 140;
    let activeMarker = null;

    let startAngle = 270; // 9:00 AM
    let endAngle = 300;  // 10:00 AM

    function getAngleFromEvent(event) {
        const svgRect = clock.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - svgRect.left;
        const y = (event.clientY || event.touches[0].clientY) - svgRect.top;
        const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 90;
        return (angle + 360) % 360;
    }

    function snapAngle(angle) {
        return Math.round(angle / 7.5) * 7.5; // Snap to 15-minute intervals (360 / (12*4))
    }

    function angleToTime(angle) {
        const totalMinutes = (angle / 360) * 12 * 60;
        let hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);

        // Determine AM/PM based on the flipped logic
        const ampm = (angle >= 180 && angle < 360) ? 'AM' : 'PM';

        // Adjust hours for 12-hour format
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12; // 0 becomes 12

        // Handle special cases for 12 AM and 12 PM based on flipped logic
        // 12 PM is at 0/360 degrees
        if ((angle >= 352.5 || angle < 7.5) && ampm === 'PM') { // Around 12 PM (top)
            return `12:${minutes.toString().padStart(2, '0')} PM`;
        }
        // 12 AM is at 180 degrees
        if (Math.abs(angle - 180) < 7.5 && ampm === 'AM') { // Around 12 AM (bottom)
            return `12:${minutes.toString().padStart(2, '0')} AM`;
        }

        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    function updateClock() {
        let drawStartAngle = startAngle;
        let drawEndAngle = endAngle;

        // Handle angle wrapping for the arc
        if (drawEndAngle < drawStartAngle) {
            drawEndAngle += 360;
        }

        const startRad = (drawStartAngle - 90) * Math.PI / 180;
        const endRad = (drawEndAngle - 90) * Math.PI / 180;

        const startX = centerX + radius * Math.cos(startRad);
        const startY = centerY + radius * Math.sin(startRad);
        const endX = centerX + radius * Math.cos(endRad);
        const endY = centerY + radius * Math.sin(endRad);

        startMarker.setAttribute('cx', startX);
        startMarker.setAttribute('cy', startY);
        endMarker.setAttribute('cx', endX);
        endMarker.setAttribute('cy', endY);

        const largeArcFlag = (drawEndAngle - drawStartAngle) > 180 ? 1 : 0;
        const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
        highlightArc.setAttribute('d', pathData);
        highlightArc.setAttribute('fill', 'rgba(0, 240, 255, 0.3)');
        highlightArc.setAttribute('stroke', '#00f0ff');
        highlightArc.setAttribute('stroke-width', '20');
        highlightArc.setAttribute('stroke-opacity', '0.5');

        const startTime = angleToTime(startAngle);
        const endTime = angleToTime(endAngle);
        timeDisplay.textContent = `${startTime} - ${endTime}`;
        hiddenTimeInput.value = `${startTime} - ${endTime}`;

        let duration = (endAngle - drawStartAngle + 360) % 360;
        const durationHours = duration / 30; // 30 degrees per hour
        durationInput.value = durationHours.toFixed(2);
    }

    function createClockNumbers() {
        // Generate minute marks
        const minuteMarksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        minuteMarksGroup.classList.add('minute-marks');

        const minuteMarkLength = 8;
        const hourMarkLength = 15;

        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * 360;
            const isHourMark = i % 5 === 0;
            const length = isHourMark ? hourMarkLength : minuteMarkLength;

            const x1 = centerX + (radius - length) * Math.cos((angle - 90) * Math.PI / 180);
            const y1 = centerY + (radius - length) * Math.sin((angle - 90) * Math.PI / 180);
            const x2 = centerX + radius * Math.cos((angle - 90) * Math.PI / 180);
            const y2 = centerY + radius * Math.sin((angle - 90) * Math.PI / 180);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#00f0ff');
            line.setAttribute('stroke-width', isHourMark ? '2' : '1');
            minuteMarksGroup.appendChild(line);
        }
        clock.appendChild(minuteMarksGroup);
    }

    function startDrag(event) {
        event.preventDefault();
        if (event.target === startMarker || event.target === endMarker) {
            activeMarker = event.target;
        }
    }

    function drag(event) {
        if (!activeMarker) return;
        event.preventDefault();
        const angle = getAngleFromEvent(event);
        const snapped = snapAngle(angle);

        if (activeMarker === startMarker) {
            startAngle = snapped;
        } else {
            endAngle = snapped;
        }
        updateClock();
    }

    function endDrag(event) {
        event.preventDefault();
        activeMarker = null;
    }

    clock.addEventListener('mousedown', startDrag);
    clock.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    clock.addEventListener('touchstart', startDrag, { passive: false });
    clock.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    createClockNumbers(); // Call once to create the numbers and marks
    updateClock(); // Initial render of the clock
});