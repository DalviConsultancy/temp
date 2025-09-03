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

    let startAngle = 0; // 12:00 PM
    let endAngle = 30;  // 1:00 PM

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
        const totalMinutes = Math.round((angle / 360) * 12 * 60);
        let hours = 12 + Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (hours === 12) {
            return `12:${minutes} PM`;
        }
        if (hours === 24) {
            return `12:${minutes} AM`;
        }
        if (hours > 12 && hours < 24) {
            return `${hours - 12}:${minutes} PM`;
        }
        // This case should ideally not be reached in a 12 PM to 12 AM clock
        return `${hours}:${minutes} AM`;
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

        let duration = (endAngle - startAngle + 360) % 360;
        const durationHours = duration / 30; // 30 degrees per hour
        durationInput.value = durationHours.toFixed(2);
    }

    function createClockNumbers() {
        // Generate minute marks
        const minuteMarksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        minuteMarksGroup.classList.add('minute-marks');

        const hourMarkLength = 15;

        for (let i = 0; i < 12; i++) {
            const angle = i * 30;
            const length = hourMarkLength;

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
            line.setAttribute('stroke-width', '2');
            minuteMarksGroup.appendChild(line);

            const textX = centerX + (radius - length - 15) * Math.cos((angle - 90) * Math.PI / 180);
            const textY = centerY + (radius - length - 15) * Math.sin((angle - 90) * Math.PI / 180);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textX);
            text.setAttribute('y', textY);
            text.setAttribute('fill', '#fff');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            let hour = i + 12;
            if (hour > 12) hour -=12;
            if(hour === 0) hour = 12;
            if(i === 0) hour = 12;
            text.textContent = hour;
            minuteMarksGroup.appendChild(text);
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
