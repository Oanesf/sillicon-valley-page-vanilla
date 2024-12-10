document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm()) {
          // Simulación de envío de formulario
          form.style.opacity = '0.5';
          form.querySelector('button[type="submit"]').disabled = true;
          
          setTimeout(() => {
              form.reset();
              form.style.opacity = '1';
              form.querySelector('button[type="submit"]').disabled = false;
              successMessage.style.display = 'block';
              
              setTimeout(() => {
                  successMessage.style.display = 'none';
              }, 5000);
          }, 2000);
      }
  });

  function validateForm() {
      let isValid = true;
      
      // Validación de Nombre
      const firstName = document.getElementById('firstName');
      const firstNameError = document.getElementById('firstNameError');
      if (firstName.value.trim().length < 2) {
          firstNameError.textContent = 'El nombre debe tener al menos 2 caracteres';
          isValid = false;
      } else {
          firstNameError.textContent = '';
      }

      // Validación de Apellido
      const lastName = document.getElementById('lastName');
      const lastNameError = document.getElementById('lastNameError');
      if (lastName.value.trim().length < 2) {
          lastNameError.textContent = 'El apellido debe tener al menos 2 caracteres';
          isValid = false;
      } else {
          lastNameError.textContent = '';
      }

      // Validación de Email
      const email = document.getElementById('email');
      const emailError = document.getElementById('emailError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
          emailError.textContent = 'Por favor ingrese un correo electrónico válido';
          isValid = false;
      } else {
          emailError.textContent = '';
      }

      // Validación de Teléfono
      const phone = document.getElementById('phone');
      const phoneError = document.getElementById('phoneError');
      const phoneRegex = /^\+?[0-9]{10,14}$/;
      if (!phoneRegex.test(phone.value)) {
          phoneError.textContent = 'Por favor ingrese un número de teléfono válido';
          isValid = false;
      } else {
          phoneError.textContent = '';
      }

      // Validación de País
      const country = document.getElementById('country');
      const countryError = document.getElementById('countryError');
      if (country.value === '') {
          countryError.textContent = 'Por favor seleccione un país';
          isValid = false;
      } else {
          countryError.textContent = '';
      }

      // Validación de Motivo de contacto
      const reason = document.getElementById('reason');
      const reasonError = document.getElementById('reasonError');
      if (reason.value.trim().length < 10) {
          reasonError.textContent = 'Por favor proporcione un motivo de contacto de al menos 10 caracteres';
          isValid = false;
      } else {
          reasonError.textContent = '';
      }

      return isValid;
  }
});