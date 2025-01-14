// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('investor-form');
//     const successMessage = document.getElementById('successMessage');
  
//     form.addEventListener('submit', function(e) {
//       e.preventDefault();
//       if (validateForm()) {
//         const formData = new FormData(form);
        
//         form.style.opacity = '0.5';
//         const submitButton = form.querySelector('button[type="submit"]');
//         submitButton.disabled = true;
//         submitButton.textContent = 'Enviando...';
  
//         fetch(form.action, {
//           method: 'POST',
//           body: formData,
//           headers: {
//               'Accept': 'application/json'
//           },
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log('Success:', data);
//           form.reset();
//           form.style.opacity = '1';
//           submitButton.disabled = false;
//           submitButton.textContent = 'Enviar';
//           successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
//           successMessage.style.display = 'block';
          
//           setTimeout(() => {
//             successMessage.style.display = 'none';
//           }, 5000);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//           form.style.opacity = '1';
//           submitButton.disabled = false;
//           submitButton.textContent = 'Enviar';
//           successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
//           successMessage.style.display = 'block';
          
//           setTimeout(() => {
//             successMessage.style.display = 'none';
//           }, 5000);
//         });
//       }
//     });
  
//     function validateForm() {
//       let isValid = true;
      
//       // Validación de Email
//       const email = document.getElementById('email');
//       const emailError = document.getElementById('emailError');
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email.value)) {
//         emailError.textContent = 'Por favor ingrese un correo electrónico válido';
//         isValid = false;
//       } else {
//         emailError.textContent = '';
//       }
  
//       // Validación de Nombre
//       const name = document.getElementById('name');
//       const nameError = document.getElementById('nameError');
//       if (name.value.trim().length < 2) {
//         nameError.textContent = 'El nombre debe tener al menos 2 caracteres';
//         isValid = false;
//       } else {
//         nameError.textContent = '';
//       }
  
//       // Validación de Apellido
//       const lastName = document.getElementById('lastName');
//       const lastNameError = document.getElementById('lastNameError');
//       if (lastName.value.trim().length < 2) {
//         lastNameError.textContent = 'El apellido debe tener al menos 2 caracteres';
//         isValid = false;
//       } else {
//         lastNameError.textContent = '';
//       }
  
//       // Validación de Teléfono
//       const phone = document.getElementById('phone');
//       const phoneError = document.getElementById('phoneError');
//       const phoneRegex = /^\+?[0-9]{10,14}$/;
//       if (!phoneRegex.test(phone.value)) {
//         phoneError.textContent = 'Por favor ingrese un número de teléfono válido';
//         isValid = false;
//       } else {
//         phoneError.textContent = '';
//       }
  
//       // Validación de LinkedIn Profile
//       const linkedinProfile = document.getElementById('linkedinProfile');
//       const linkedinProfileError = document.getElementById('linkedinProfileError');
//       const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//       if (!urlRegex.test(linkedinProfile.value)) {
//         linkedinProfileError.textContent = 'Por favor ingrese una URL válida';
//         isValid = false;
//       } else {
//         linkedinProfileError.textContent = '';
//       }
  
//       // Validación de Sector de Inversión
//       const investmentSector = document.getElementById('investmentSector');
//       const investmentSectorError = document.getElementById('investmentSectorError');
//       if (investmentSector.value.trim().length < 10) {
//         investmentSectorError.textContent = 'Por favor proporcione más detalles sobre el sector de inversión';
//         isValid = false;
//       } else {
//         investmentSectorError.textContent = '';
//       }
  
//       // Validación de Red
//       const network = document.getElementById('network');
//       const networkError = document.getElementById('networkError');
//       if (network.value === '') {
//         networkError.textContent = 'Por favor seleccione una red';
//         isValid = false;
//       } else {
//         networkError.textContent = '';
//       }
  
//       return isValid;
//     }
  
//     // Mostrar/ocultar campo "Otra red" según la selección
//     const networkSelect = document.getElementById('network');
//     const otherNetworkGroup = document.getElementById('otherNetworkGroup');
  
//     networkSelect.addEventListener('change', function() {
//       if (this.value === 'other') {
//         otherNetworkGroup.style.display = 'block';
//       } else {
//         otherNetworkGroup.style.display = 'none';
//       }
//     });
// });

// Probar los formularios

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('investor-form');
  const successMessage = document.getElementById('successMessage');
  const networkSelect = document.getElementById('network');
  const otherNetworkGroup = document.getElementById('otherNetworkGroup');

  form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm()) {
          submitForm();
      }
  });

  function validateForm() {
      let isValid = true;
      
      // Validación de Email
      isValid = validateField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingrese un correo electrónico válido') && isValid;

      // Validación de Nombre
      isValid = validateField('name', /.{2,}/, 'El nombre debe tener al menos 2 caracteres') && isValid;

      // Validación de Apellido
      isValid = validateField('lastName', /.{2,}/, 'El apellido debe tener al menos 2 caracteres') && isValid;

      // Validación de Teléfono
      isValid = validateField('phone', /^\+?[0-9]{10,14}$/, 'Por favor ingrese un número de teléfono válido') && isValid;

      // Validación de LinkedIn Profile
      isValid = validateField('linkedinProfile', /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/, 'Por favor ingrese una URL de LinkedIn válida') && isValid;

      // Validación de Sector de Inversión
      isValid = validateField('investmentSector', /.{10,}/, 'Por favor proporcione más detalles sobre el sector de inversión') && isValid;

      // Validación de Red
      isValid = validateField('network', /.+/, 'Por favor seleccione una red') && isValid;

      // Validación de Otra Red si es necesario
      if (networkSelect.value === 'other') {
          isValid = validateField('otherNetwork', /.+/, 'Por favor especifique la otra red') && isValid;
      }

      return isValid;
  }

  function validateField(fieldId, regex, errorMessage) {
      const field = document.getElementById(fieldId);
      const errorElement = document.getElementById(`${fieldId}Error`);
      const isValid = regex.test(field.value.trim());
      
      if (!isValid) {
          errorElement.textContent = errorMessage;
          field.classList.add('error-input');
      } else {
          errorElement.textContent = '';
          field.classList.remove('error-input');
      }
      
      return isValid;
  }

  function submitForm() {
      const formData = new FormData(form);
      
      form.style.opacity = '0.5';
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';

      fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
              'Accept': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          form.reset();
          showSuccessMessage();
      })
      .catch((error) => {
          console.error('Error:', error);
          showSuccessMessage(); // Mostramos el mensaje de éxito incluso en caso de error para este ejemplo
      })
      .finally(() => {
          form.style.opacity = '1';
          submitButton.disabled = false;
          submitButton.textContent = 'Enviar';
      });
  }

  function showSuccessMessage() {
      successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
      successMessage.style.display = 'block';
      
      setTimeout(() => {
          successMessage.style.display = 'none';
      }, 5000);
  }

  // Mostrar/ocultar campo "Otra red" según la selección
  networkSelect.addEventListener('change', function() {
      otherNetworkGroup.style.display = this.value === 'other' ? 'block' : 'none';
  });
});

