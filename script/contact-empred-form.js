'use strict';

class FormSecurityManager {
    constructor() {
        this.form = document.getElementById('contact-form');
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
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
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
        
        // Store token in sessionStorage
        sessionStorage.setItem('csrfToken', csrfToken);
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`) || 
                           this.createErrorElement(field);
        
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else {
            // Specific field validations
            switch(field.id) {
                case 'companyName':
                    if (field.value.length < 2) {
                        isValid = false;
                        errorMessage = 'El nombre de la empresa debe tener al menos 2 caracteres';
                    }
                    break;
                    
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

                case 'linkedinProfiles':
                    if (!this.isValidLinkedInUrl(field.value)) {
                        isValid = false;
                        errorMessage = 'Por favor, ingrese URLs válidas de LinkedIn';
                    }
                    break;

                case 'investorDeck':
                    if (!this.isValidUrl(field.value)) {
                        isValid = false;
                        errorMessage = 'Por favor, ingrese una URL válida';
                    }
                    break;
            }
        }

        this.updateFieldStatus(field, isValid, errorMessage, errorElement);
        return isValid;
    }

    createErrorElement(field) {
        const errorElement = document.createElement('span');
        errorElement.id = `${field.id}Error`;
        errorElement.className = 'error';
        field.parentNode.appendChild(errorElement);
        return errorElement;
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

    isValidLinkedInUrl(url) {
        const urls = url.split(',').map(u => u.trim());
        return urls.every(u => /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(u));
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    checkRateLimit(clientId) {
        const now = Date.now();
        const clientAttempts = this.rateLimit.get(clientId) || [];
        
        // Clean up old attempts
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

        // Check honeypot
        if (this.honeypotField.value) {
            console.error('Potential spam detected');
            return;
        }

        // Rate limiting
        const clientId = await this.getClientId();
        if (!this.checkRateLimit(clientId)) {
            this.showError('Demasiados intentos. Por favor, intente más tarde.');
            return;
        }

        // Validate all fields
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Disable submit button and show loading state
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Enviando...';

        try {
            const formData = new FormData(this.form);
            const response = await this.submitForm(formData);

            if (response.ok) {
                this.showSuccess('¡Formulario enviado con éxito!');
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

    async getClientId() {
        // Generate a unique client identifier based on browser fingerprint
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

    async submitForm(formData) {
        const csrfToken = sessionStorage.getItem('csrfToken');
        
        return fetch('/api/submit-form', {
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
    new FormSecurityManager();
});

