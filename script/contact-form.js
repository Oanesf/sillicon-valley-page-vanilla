// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.getElementById('contact-form');
//   const successMessage = document.getElementById('successMessage');

//   form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if (validateForm()) {
//       const formData = new FormData(form);
      
//       form.style.opacity = '0.5';
//       const submitButton = form.querySelector('button[type="submit"]');
//       submitButton.disabled = true;
//       submitButton.textContent = 'Enviando...';

//       fetch(form.action, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'Accept': 'application/json'
//         },
//       })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Success:', data);
//         form.reset();
//         form.style.opacity = '1';
//         submitButton.disabled = false;
//         submitButton.textContent = 'Enviar';
//         successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
//         successMessage.style.display = 'block';
        
//         setTimeout(() => {
//           successMessage.style.display = 'none';
//         }, 5000);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         form.style.opacity = '1';
//         submitButton.disabled = false;
//         submitButton.textContent = 'Enviar';
//         successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
//         successMessage.style.display = 'block';
        
//         setTimeout(() => {
//           successMessage.style.display = 'none';
//         }, 5000);
//       });
//     }
//   });

//   function validateForm() {
//     let isValid = true;
    
//     // Validación de Nombre de la empresa
//     const companyName = document.getElementById('companyName');
//     const companyNameError = document.getElementById('companyNameError');
//     if (companyName.value.trim().length < 2) {
//       companyNameError.textContent = 'El nombre de la empresa debe tener al menos 2 caracteres';
//       isValid = false;
//     } else {
//       companyNameError.textContent = '';
//     }

//     // Validación de Nombre del Representante
//     const representativeName = document.getElementById('representativeName');
//     const representativeNameError = document.getElementById('representativeNameError');
//     if (representativeName.value.trim().length < 2) {
//       representativeNameError.textContent = 'El nombre del representante debe tener al menos 2 caracteres';
//       isValid = false;
//     } else {
//       representativeNameError.textContent = '';
//     }

//     // Validación de Apellido del Representante
//     const representativeLastName = document.getElementById('representativeLastName');
//     const representativeLastNameError = document.getElementById('representativeLastNameError');
//     if (representativeLastName.value.trim().length < 2) {
//       representativeLastNameError.textContent = 'El apellido del representante debe tener al menos 2 caracteres';
//       isValid = false;
//     } else {
//       representativeLastNameError.textContent = '';
//     }

//     // Validación de Teléfono
//     const phone = document.getElementById('phone');
//     const phoneError = document.getElementById('phoneError');
//     const phoneRegex = /^\+?[0-9]{10,14}$/;
//     if (!phoneRegex.test(phone.value)) {
//       phoneError.textContent = 'Por favor ingrese un número de teléfono válido';
//       isValid = false;
//     } else {
//       phoneError.textContent = '';
//     }

//     // Validación de Email
//     const email = document.getElementById('email');
//     const emailError = document.getElementById('emailError');
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email.value)) {
//       emailError.textContent = 'Por favor ingrese un correo electrónico válido';
//       isValid = false;
//     } else {
//       emailError.textContent = '';
//     }

//     // Validación de LinkedIn Profiles
//     const linkedinProfiles = document.getElementById('linkedinProfiles');
//     const linkedinProfilesError = document.getElementById('linkedinProfilesError');
//     if (linkedinProfiles.value.trim().length < 5) {
//       linkedinProfilesError.textContent = 'Por favor ingrese al menos un perfil de LinkedIn válido';
//       isValid = false;
//     } else {
//       linkedinProfilesError.textContent = '';
//     }

//     // Validación de Investor Deck
//     const investorDeck = document.getElementById('investorDeck');
//     const investorDeckError = document.getElementById('investorDeckError');
//     const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//     if (!urlRegex.test(investorDeck.value)) {
//       investorDeckError.textContent = 'Por favor ingrese una URL válida para el Investor Deck';
//       isValid = false;
//     } else {
//       investorDeckError.textContent = '';
//     }

//     return isValid;
//   }
// });

'use strict';

class FormSecurityManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.honeypotField = this.createHoneypot();
        this.rateLimit = new Map();
        this.maxAttempts = 5;
        this.timeWindow = 300000; // 5 minutos
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
                e.target.value = this.sanitizeInput(e.target.value);
            });
        });
    }

    sanitizeInput(value) {
        // Implementar una función de sanitización básica
        return value.replace(/[<>&]/g, function (c) {
            return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c];
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
        const errorElement = document.getElementById(`${field.id}Error`) || 
                           this.createErrorElement(field);
        
        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else {
            switch(field.id) {
                case 'firstName':
                case 'lastName':
                    if (field.value.length < 2) {
                        isValid = false;
                        errorMessage = `El ${field.id === 'firstName' ? 'nombre' : 'apellido'} debe tener al menos 2 caracteres`;
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
                case 'reason':
                    if (field.value.length < 10) {
                        isValid = false;
                        errorMessage = 'Por favor, proporcione más detalles sobre el motivo de contacto';
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
        // event.preventDefault();

        // if (this.honeypotField.value) {
        //     console.error('Potential spam detected');
        //     return;
        // }

        // const clientId = await this.getClientId();
        // if (!this.checkRateLimit(clientId)) {
        //     this.showError('Demasiados intentos. Por favor, intente más tarde.');
        //     return;
        // }

        // let isValid = true;
        // const fields = this.form.querySelectorAll('input, select, textarea');
        // fields.forEach(field => {
        //     if (!this.validateField(field)) {
        //         isValid = false;
        //     }
        // });

        // if (!isValid) {
        //     return;
        // }

        // this.submitButton.disabled = true;
        // this.submitButton.textContent = 'Enviando...';

        // try {
        //     const formData = new FormData(this.form);
        //     const response = await this.submitForm(formData);

        //     if (response.ok) {
        //         this.showSuccess('¡Formulario enviado con éxito!');
        //         this.form.reset();
        //     } else {
        //         throw new Error('Error en el envío');
        //     }
        // } 
        // catch (error) {
        //     this.showError('Error al enviar el formulario. Por favor, intente nuevamente.');
        //     console.error('Submit error:', error);
        // } finally {
        //     this.submitButton.disabled = false;
        //     this.submitButton.textContent = 'Enviar';
        // }
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

    async submitForm(formData) {
        const csrfToken = sessionStorage.getItem('csrfToken');
        
        return fetch(this.form.action, {
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

document.addEventListener('DOMContentLoaded', () => {
    new FormSecurityManager();
});

