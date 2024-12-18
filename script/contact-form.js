document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
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
        form.style.opacity = '1';
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
        successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      })
      .catch((error) => {
        console.error('Error:', error);
        form.style.opacity = '1';
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
        successMessage.textContent = 'El formulario se ha enviado correctamente. ¡Gracias por tu interés!';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      });
    }
  });

  function validateForm() {
    let isValid = true;
    
    // Validación de Nombre de la empresa
    const companyName = document.getElementById('companyName');
    const companyNameError = document.getElementById('companyNameError');
    if (companyName.value.trim().length < 2) {
      companyNameError.textContent = 'El nombre de la empresa debe tener al menos 2 caracteres';
      isValid = false;
    } else {
      companyNameError.textContent = '';
    }

    // Validación de Nombre del Representante
    const representativeName = document.getElementById('representativeName');
    const representativeNameError = document.getElementById('representativeNameError');
    if (representativeName.value.trim().length < 2) {
      representativeNameError.textContent = 'El nombre del representante debe tener al menos 2 caracteres';
      isValid = false;
    } else {
      representativeNameError.textContent = '';
    }

    // Validación de Apellido del Representante
    const representativeLastName = document.getElementById('representativeLastName');
    const representativeLastNameError = document.getElementById('representativeLastNameError');
    if (representativeLastName.value.trim().length < 2) {
      representativeLastNameError.textContent = 'El apellido del representante debe tener al menos 2 caracteres';
      isValid = false;
    } else {
      representativeLastNameError.textContent = '';
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

    // Validación de LinkedIn Profiles
    const linkedinProfiles = document.getElementById('linkedinProfiles');
    const linkedinProfilesError = document.getElementById('linkedinProfilesError');
    if (linkedinProfiles.value.trim().length < 5) {
      linkedinProfilesError.textContent = 'Por favor ingrese al menos un perfil de LinkedIn válido';
      isValid = false;
    } else {
      linkedinProfilesError.textContent = '';
    }

    // Validación de Investor Deck
    const investorDeck = document.getElementById('investorDeck');
    const investorDeckError = document.getElementById('investorDeckError');
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(investorDeck.value)) {
      investorDeckError.textContent = 'Por favor ingrese una URL válida para el Investor Deck';
      isValid = false;
    } else {
      investorDeckError.textContent = '';
    }

    return isValid;
  }
});