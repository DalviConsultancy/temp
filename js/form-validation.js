(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }

                // Custom validation for phone number
                if (input.id === 'phone') {
                    const phoneRegex = /^\d{10}$/;
                    if (!phoneRegex.test(input.value) && input.value !== '') {
                        input.setCustomValidity('Please enter a valid 10-digit phone number.');
                        input.parentElement.querySelector('.invalid-feedback').textContent = 'Please enter a valid 10-digit phone number.';
                    } else {
                        input.setCustomValidity('');
                    }
                }

                // Custom validation for booking date
                if (input.id === 'date') {
                    const selectedDate = new Date(input.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
                    if (selectedDate < today) {
                        input.setCustomValidity('Please select a date in the future.');
                        input.parentElement.querySelector('.invalid-feedback').textContent = 'Please select a date in the future.';
                    } else {
                        input.setCustomValidity('');
                    }
                }
            });
        });
    })
})()