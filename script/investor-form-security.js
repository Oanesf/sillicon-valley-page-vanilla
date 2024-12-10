'use strict';

class InvestorFormSecurity {
    constructor() {
        this.form = document.getElementById('investor-form');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.honeypotField = this.createHoneypot();
        this.rateLimit = new Map();
        this.maxAttempts = 5;
        this.timeWindow = 300000; // 5 minutes
        this.initializeForm();
    }

    createHoneypot() {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.style.display = 'none';
        honeypot.name = 'website';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        this.form.appendChild(honeypot);
        return honeypot;
    }

    initializeForm() {
        this.setupEventListeners();
        this.setupInputSanitization();
        this.initializeCSRFProtection();
        this.setupNetworkFieldToggle();
    }

    setupNetworkFieldToggle() {
        const networkSelect = document.getElementById('network');
        const otherNetworkGroup = document.getElementById('otherNetworkGroup');
        
        networkSelect.addEventListener('change', (e) => {
            otherNetworkGroup.style.display = e.target.value === 'other' ? 'block' : 'none';
        });
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => this.validateField(e.target));
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });
    }

    setupInputSanitization() {
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="email"], textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = DOMPurify.sanitize(e.target.value.trim());
            });
        });
    }

    initializeCSRFProtection() {
        const csrfToken = this.generateCSRFToken();
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfToken;
        this.form.appendChild(csrfInput);
        sessionStorage.setItem('csrfToken', csrfToken);
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (!errorElement) return true;

        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else {
            switch(field.id) {
                case 'email':
                    if (!this.isValidEmail(field.value)) {
                        isValid = false;
                        errorMessage = 'Por favor, ingrese un email válido';
                    }
                    break;
                case 'phone':
                    if (!this.isValidPhone(field.value)) {
                        isValid = false;
                        errorMessage = 'Por favor, ingrese un número válido';
                    }
                    break;
                case 'linkedinProfile':
                    if (!this.isValidUrl(field.value)) {
                        isValid = false;
                        errorMessage = 'Por favor, ingrese una URL válida';
                    }
                    break;
                case 'name':
                case 'lastName':
                    if (field.value.length < 2) {
                        isValid = false;
                        errorMessage = 'Debe tener al menos 2 caracteres';
                    }
                    break;
            }
        }

        this.updateFieldStatus(field, isValid, errorMessage, errorElement);
        return isValid;
    }

    updateFieldStatus(field, isValid, errorMessage, errorElement) {
        if (!isValid) {
            field.classList.add('error-input');
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error-input');
            errorElement.textContent = '';
        }
    }

    isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    isValidPhone(phone) {
        const re = /^\+?[0-9]{10,14}$/;
        return re.test(phone.replace(/\s+/g, ''));
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    async getClientId() {
        const userAgent = navigator.userAgent;
        const screenResolution = `${screen.width}x${screen.height}`;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const fingerprint = await crypto.subtle.digest('SHA-256',
            new TextEncoder().encode(`${userAgent}${screenResolution}${timeZone}`)
        );

        return Array.from(new Uint8Array(fingerprint))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    checkRateLimit(clientId) {
        const now = Date.now();
        const clientAttempts = this.rateLimit.get(clientId) || [];
        const recentAttempts = clientAttempts.filter(timestamp => 
            now - timestamp < this.timeWindow
        );

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        recentAttempts.push(now);
        this.rateLimit.set(clientId, recentAttempts);
        return true;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.honeypotField.value) {
            console.error('Potential spam detected');
            return;
        }

        const clientId = await this.getClientId();
        if (!this.checkRateLimit(clientId)) {
            this.showError('Demasiados intentos. Por favor, intente más tarde.');
            return;
        }

        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Enviando...';

        try {
            const formData = new FormData(this.form);
            const response = await this.submitForm(formData);

            if (response.ok) {
                this.showSuccess('¡Gracias por tu mensaje! Te contactaremos pronto.');
                this.form.reset();
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            this.showError('Error al enviar el formulario. Por favor, intente nuevamente.');
            console.error('Submit error:', error);
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Enviar';
        }
    }

    async submitForm(formData) {
        const csrfToken = sessionStorage.getItem('csrfToken');
        
        return fetch('/api/submit-investor-form', {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData,
            credentials: 'same-origin'
        });
    }

    showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        this.form.insertBefore(errorElement, this.submitButton);
        setTimeout(() => errorElement.remove(), 5000);
    }
}

// Initialize the form security manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvestorFormSecurity();
});

