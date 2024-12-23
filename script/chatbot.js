document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbot = document.getElementById('chatbot');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');

  let knowledgeBase = {};
  let conversationContext = [];

  const ignoreWords = [
    'que', 'cual', 'como', 'donde', 'quien', 'cuando', 'por que', 'para que',
    'es', 'son', 'esta', 'estan', 'fue', 'fueron', 'sera', 'seran',
    'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'lo', 'la', 'los', 'las',
    'un', 'una', 'unos', 'unas', 'el', 'ella', 'ellos', 'ellas',
    'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
    'aquel', 'aquella', 'aquellos', 'aquellas',
    'mi', 'tu', 'su', 'nuestro', 'vuestro',
    'y', 'o', 'pero', 'si', 'no', 'porque', 'aunque', 'sino',
    'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'en', 'entre',
    'hacia', 'hasta', 'para', 'por', 'segun', 'sin', 'sobre', 'tras',
    'durante', 'mediante', 'excepto', 'salvo',
    'puedes', 'puedo', 'puede', 'podemos', 'podeis', 'pueden',
    'quiero', 'quieres', 'quiere', 'queremos', 'quereis', 'quieren',
    'debo', 'debes', 'debe', 'debemos', 'debeis', 'deben',
    'tengo', 'tienes', 'tiene', 'tenemos', 'teneis', 'tienen',
    'soy', 'eres', 'es', 'somos', 'sois', 'son',
    'estoy', 'estas', 'esta', 'estamos', 'estais', 'estan',
    'hago', 'haces', 'hace', 'hacemos', 'haceis', 'hacen',
    'voy', 'vas', 'va', 'vamos', 'vais', 'van',
    'dime', 'explicame', 'cuentame', 'muestrame', 'enseñame',
    'sobre', 'acerca', 'respecto',
    'mas', 'menos', 'muy', 'mucho', 'poco', 'bastante', 'demasiado',
    'algo', 'alguien', 'ninguno', 'nada', 'nadie',
    'todo', 'toda', 'todos', 'todas',
    'otro', 'otra', 'otros', 'otras',
    'mismo', 'misma', 'mismos', 'mismas',
    'tan', 'tanto', 'tanta', 'tantos', 'tantas',
    'cual', 'cuales', 'cuanto', 'cuanta', 'cuantos', 'cuantas',
    'primero', 'segundo', 'tercero', 'ultimo',
    'ahora', 'despues', 'luego', 'antes', 'ayer', 'hoy', 'mañana',
    'siempre', 'nunca', 'jamas', 'pronto', 'tarde', 'temprano',
    'bien', 'mal', 'mejor', 'peor', 'regular',
    'aqui', 'ahi', 'alli', 'alla', 'lejos', 'cerca',
    'arriba', 'abajo', 'encima', 'debajo', 'delante', 'detras',
    'dentro', 'fuera', 'adentro', 'afuera', 
    'silicon','valley', "zenith", 'hub', 'venezuela',

    'acerca', 'además', 'al', 'algún', 'alguna', 'algunas', 'alguno', 'algunos', 'allí',
    'ambos', 'ante', 'antes', 'aquel', 'aquellas', 'aquellos', 'aquí', 'arriba', 'así', 'atrás', 'aún', 'aunque',
    'bajo', 'bastante', 'bien', 'cabe', 'cada', 'casi', 'cierto', 'como', 'cómo', 'con', 'conmigo', 'conseguir',
    'consigo', 'contigo', 'contra', 'cual', 'cuales', 'cualquier', 'cualquiera', 'cuan', 'cuando', 'cuanto',
    'cuanta', 'cuantas', 'cuantos', 'de', 'dejar', 'del', 'demás', 'demasiado', 'dentro', 'desde', 'donde',
    'dos', 'el', 'él', 'ella', 'ellas', 'ello', 'ellos', 'emplear', 'en', 'encima', 'entonces', 'entre', 'era',
    'erais', 'éramos', 'eran', 'eras', 'eres', 'es', 'esa', 'esas', 'ese', 'eso', 'esos', 'esta', 'estaba',
    'estabais', 'estaban', 'estabas', 'estad', 'estada', 'estadas', 'estado', 'estados', 'estamos', 'estando',
    'estar', 'estaremos', 'estará', 'estarán', 'estarás', 'estaré', 'estaréis', 'estaría', 'estaríais',
    'estaríamos', 'estarían', 'estarías', 'estas', 'este', 'estemos', 'esto', 'estos', 'estoy', 'estuve',
    'estuviera', 'estuvierais', 'estuvieran', 'estuvieras', 'estuvieron', 'estuviese', 'estuvieseis',
    'estuviesen', 'estuvieses', 'estuvimos', 'estuviste', 'estuvisteis', 'estuvo', 'ex', 'excepto', 'fin',
    'final', 'fue', 'fuera', 'fuerais', 'fueran', 'fueras', 'fueron', 'fuese', 'fueseis', 'fuesen', 'fueses',
    'fui', 'fuimos', 'fuiste', 'fuisteis', 'gueno', 'ha', 'habéis', 'haber', 'habida', 'habidas', 'habido',
    'habidos', 'habiendo', 'habrá', 'habrán', 'habrás', 'habré', 'habréis', 'habría', 'habríais', 'habríamos',
    'habrían', 'habrías', 'hace', 'haceis', 'hacemos', 'hacen', 'hacer', 'haces', 'hago', 'han', 'has', 'hasta',
    'hay', 'haya', 'hayáis', 'hayamos', 'hayan', 'hayas', 'he', 'hemos', 'hube', 'hubiera', 'hubierais',
    'hubieran', 'hubieras', 'hubieron', 'hubiese', 'hubieseis', 'hubiesen', 'hubieses', 'hubimos', 'hubiste',
    'hubisteis', 'hubo', 'incluso', 'intenta', 'intentais', 'intentamos', 'intentan', 'intentar', 'intentas',
    'intento', 'ir', 'jamás', 'junto', 'juntos', 'la', 'largo', 'las', 'lo', 'los', 'mas', 'más', 'me', 'medio',
    'mejor', 'menos', 'mi', 'mía', 'mias', 'mientras', 'mio', 'míos', 'mis', 'misma', 'mismas', 'mismo',
    'mismos', 'modo', 'mucha', 'muchas', 'muchísima', 'muchísimas', 'muchísimo', 'muchísimos', 'mucho',
    'muchos', 'nada', 'ni', 'ningún', 'ninguna', 'ningunas', 'ninguno', 'ningunos', 'no', 'nos', 'nosotras',
    'nosotros', 'nuestra', 'nuestras', 'nuestro', 'nuestros', 'nueva', 'nuevas', 'nuevo', 'nuevos', 'nunca',
    'os', 'otra', 'otras', 'otro', 'otros', 'para', 'parecer', 'pero', 'poca', 'pocas', 'poco', 'pocos', 'poder',
    'podría', 'podrías', 'podríais', 'podríamos', 'podrían', 'poner', 'por', 'porque', 'primero', 'puede',
    'pueden', 'puedo', 'pues', 'que', 'qué', 'querer', 'quién', 'quienes', 'quienesquiera', 'quienquiera',
    'quizá', 'quizás', 'sabe', 'sabeis', 'sabemos', 'saben', 'saber', 'sabes', 'se', 'sea', 'seamos', 'sean',
    'seas', 'ser', 'será', 'serán', 'serás', 'seré', 'seréis', 'seríamos', 'serían', 'serías', 'si', 'sí',
    'siempre', 'siendo', 'sin', 'sino', 'so', 'sobre', 'sois', 'solamente', 'solo', 'sólo', 'somos', 'soy',
    'sr', 'sra', 'sres', 'sta', 'su', 'sus', 'suya', 'suyas', 'suyo', 'suyos', 'tal', 'tales', 'también',
    'tampoco', 'tan', 'tanta', 'tantas', 'tanto', 'tantos', 'te', 'tenéis', 'tenemos', 'tener', 'tengo', 'ti',
    'tiempo', 'tiene', 'tienen', 'toda', 'todas', 'todo', 'todos', 'tomar', 'trabaja', 'trabajais', 'trabajamos',
    'trabajan', 'trabajar', 'trabajas', 'trabajo', 'tras', 'tú', 'tu', 'tus', 'tuya', 'tuyas', 'tuyo', 'tuyos',
    'último', 'un', 'una', 'unas', 'uno', 'unos', 'usa', 'usais', 'usamos', 'usan', 'usar', 'usas', 'uso',
    'usted', 'ustedes', 'va', 'vais', 'valor', 'vamos', 'van', 'vaya', 'verdad', 'verdadera', 'verdadero', 'vosotras',
    'vosotros', 'voy', 'vuestra', 'vuestras', 'vuestro', 'vuestros', 'y', 'ya', 'yo'
    
  ];

  // Cargar la base de conocimientos
  fetch('data/knowledgeBase.json')
      .then(response => response.json())
      .then(data => {
          knowledgeBase = data;
          console.log('Base de conocimientos cargada');
      })
      .catch(error => console.error('Error al cargar la base de conocimientos:', error));

  chatbotToggle.addEventListener('click', function() {
      chatbot.classList.add('active');
      addMessage('bot', '¡Hola! Soy la asistente virtual de Silicon Valley Zentith Hub. ¿En qué puedo ayudarte hoy?');
  });

  chatbotClose.addEventListener('click', function() {
      chatbot.classList.remove('active');
      conversationContext = []; // Reiniciar el contexto al cerrar el chat
  });

  chatbotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const userMessage = chatbotInput.value.trim();
      if (userMessage) {
          addMessage('user', userMessage);
          chatbotInput.value = '';
          setTimeout(() => respondToUser(userMessage), 500);
      }
  });

  function addMessage(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('chatbot-message', sender);
      messageElement.textContent = message;
      chatbotMessages.appendChild(messageElement);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function normalizeText(text) {
    return text.toLowerCase()
               .replace(/[¿?.,;:!¡]/g, '')
               .replace(/á/g, 'a')
               .replace(/é/g, 'e')
               .replace(/í/g, 'i')
               .replace(/ó/g, 'o')
               .replace(/ú/g, 'u')
               .trim();
  }

  function findBestMatch(userMessage, knowledgeBase) {
    const normalizedUserMessage = normalizeText(userMessage);
    let bestMatch = { question: '', answer: '', similarity: 0 };

    for (let category in knowledgeBase) {
      for (let question in knowledgeBase[category]) {
        const normalizedQuestion = normalizeText(question);
        
        const cleanUserMessage = normalizedUserMessage.split(' ').filter(word => !ignoreWords.includes(word)).join(' ');
        const cleanQuestion = normalizedQuestion.split(' ').filter(word => !ignoreWords.includes(word)).join(' ');

        const similarity = calculateSimilarity(cleanUserMessage, cleanQuestion);

        if (similarity > bestMatch.similarity) {
          bestMatch = {
            question: question,
            answer: knowledgeBase[category][question],
            similarity: similarity
          };
        }
      }
    }

    return bestMatch.similarity > 0.4 ? bestMatch : null;
  }

  function calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return intersection.size / Math.max(set1.size, set2.size);
  }

  function findRelatedInfo(userMessage, knowledgeBase) {
    const normalizedUserMessage = normalizeText(userMessage);
    const words = normalizedUserMessage.split(/\s+/);
    const relatedInfo = [];

    for (let category in knowledgeBase) {
      for (let question in knowledgeBase[category]) {
        const normalizedQuestion = normalizeText(question);
        if (words.some(word => normalizedQuestion.includes(word) && word.length > 3)) {
          relatedInfo.push({
            question: question,
            answer: knowledgeBase[category][question],
            relevance: calculateRelevance(normalizedUserMessage, normalizedQuestion)
          });
        }
      }
    }

    return relatedInfo
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3);
  }

  function calculateRelevance(userMessage, question) {
    const userWords = new Set(userMessage.split(' '));
    const questionWords = new Set(question.split(' '));
    const commonWords = new Set([...userWords].filter(x => questionWords.has(x)));
    return commonWords.size / Math.sqrt(userWords.size * questionWords.size);
  }

  function handleTypos(userMessage) {
    const commonTypos = {
      'startp': 'startup',
      'startap': 'startup',
      'start-up': 'startup',
      'starup': 'startup',
      'estarup': 'startup',
      'finanziacion': 'financiación',
      'financiacion': 'financiación',
      'finanziamiento': 'financiamiento',
      'inovacion': 'innovación',
      'innovasion': 'innovación',
      'tegnologia': 'tecnología',
      'tecnolojia': 'tecnología',
      'emprendimiento': 'emprendimiento',
      'emprendedurismo': 'emprendimiento',
      'invercion': 'inversión',
      'inversion': 'inversión',
      'negosio': 'negocio',
      'negocio': 'negocio',
      'dessarrollo': 'desarrollo',
      'desarollo': 'desarrollo',
      'intelijencia': 'inteligencia',
      'artificial': 'artificial',
      'blockchein': 'blockchain',
      'block-chain': 'blockchain',
      'big-data': 'big data',
      'machine-learning': 'machine learning',
      'machinelearning': 'machine learning',
      'aprendisaje': 'aprendizaje',
      'automatico': 'automático',
      'automatizado': 'automatizado',
      'nuve': 'nube',
      'cloud': 'nube',
      'ciberseguridad': 'ciberseguridad',
      'cyber-seguridad': 'ciberseguridad',
      'realidad-virtual': 'realidad virtual',
      'realidad-aumentada': 'realidad aumentada',
      'internet-de-las-cosas': 'internet de las cosas',
      'iot': 'internet de las cosas',
      'api': 'API',
      'apis': 'APIs',
      'saas': 'SaaS',
      'software-como-servicio': 'software como servicio',
      'mvp': 'MVP',
      'producto-minimo-viable': 'producto mínimo viable',
      'ux': 'UX',
      'experiencia-de-usuario': 'experiencia de usuario',
      'ui': 'UI',
      'interfaz-de-usuario': 'interfaz de usuario',
      'crm': 'CRM',
      'gestion-de-relaciones-con-clientes': 'gestión de relaciones con clientes',
      'erp': 'ERP',
      'planificacion-de-recursos-empresariales': 'planificación de recursos empresariales',
      'b2b': 'B2B',
      'business-to-business': 'business-to-business',
      'b2c': 'B2C',
      'business-to-consumer': 'business-to-consumer',
      'roi': 'ROI',
      'retorno-de-inversion': 'retorno de inversión',
      'kpi': 'KPI',
      'indicador-clave-de-rendimiento': 'indicador clave de rendimiento',
      'hubicados':'ubicados',
      'emprendimiento': 'emprendimiento',
      'emprendedurismo': 'emprendimiento',
      'invercion': 'inversión',
      'inversion': 'inversión',
      'negosio': 'negocio',
      'negocio': 'negocio',
      'dessarrollo': 'desarrollo',
      'desarollo': 'desarrollo',
      'intelijencia': 'inteligencia',
      'artificial': 'artificial',
      'blockchein': 'blockchain',
      'block-chain': 'blockchain',
      'big-data': 'big data',
      'machine-learning': 'machine learning',
      'machinelearning': 'machine learning',
      'aprendisaje': 'aprendizaje',
      'automatico': 'automático',
      'automatizado': 'automatizado',
      'nuve': 'nube',
      'cloud': 'nube',
      'ciberseguridad': 'ciberseguridad',
      'cyber-seguridad': 'ciberseguridad',
      'realidad-virtual': 'realidad virtual',
      'realidad-aumentada': 'realidad aumentada',
      'internet-de-las-cosas': 'internet de las cosas',
      'iot': 'internet de las cosas',
      'api': 'API',
      'apis': 'APIs',
      'saas': 'SaaS',
      'software-como-servicio': 'software como servicio',
      'mvp': 'MVP',
      'producto-minimo-viable': 'producto mínimo viable',
      'ux': 'UX',
      'experiencia-de-usuario': 'experiencia de usuario',
      'ui': 'UI',
      'interfaz-de-usuario': 'interfaz de usuario',
      'crm': 'CRM',
      'gestion-de-relaciones-con-clientes': 'gestión de relaciones con clientes',
      'erp': 'ERP',
      'planificacion-de-recursos-empresariales': 'planificación de recursos empresariales',
      'b2b': 'B2B',
      'business-to-business': 'business-to-business',
      'b2c': 'B2C',
      'business-to-consumer': 'business-to-consumer',
      'roi': 'ROI',
      'retorno-de-inversion': 'retorno de inversión',
      'kpi': 'KPI',
      'indicador-clave-de-rendimiento': 'indicador clave de rendimiento',
      'hubicados': 'ubicados',
      'fintech': 'fintech',
      'tecnologia-financiera': 'tecnología financiera',
      'criptomoneda': 'criptomoneda',
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'blockchain': 'blockchain',
      'inteligencia-artificial': 'inteligencia artificial',
      'ia': 'IA',
      'realidad-virtual': 'realidad virtual',
      'rv': 'RV',
      'realidad-aumentada': 'realidad aumentada',
      'ra': 'RA',
      'internet-de-las-cosas': 'Internet de las Cosas',
      'iot': 'IoT',
      'computacion-en-la-nube': 'computación en la nube',
      'cloud-computing': 'computación en la nube',
      'ciberseguridad': 'ciberseguridad',
      'seguridad-informatica': 'seguridad informática',
      'big-data': 'Big Data',
      'analisis-de-datos': 'análisis de datos',
      'machine-learning': 'Machine Learning',
      'aprendizaje-automatico': 'aprendizaje automático',
      'deep-learning': 'Deep Learning',
      'aprendizaje-profundo': 'aprendizaje profundo',
      'robotica': 'robótica',
      'automatizacion': 'automatización',
      'impresion-3d': 'impresión 3D',
      'fabricacion-aditiva': 'fabricación aditiva',
      'realidad-mixta': 'realidad mixta',
      'rm': 'RM',
      'computacion-cuantica': 'computación cuántica',
      'nanotecnologia': 'nanotecnología',
      'biotecnologia': 'biotecnología',
      'neurotecnologia': 'neurotecnología',
      'energia-renovable': 'energía renovable',
      'energia-solar': 'energía solar',
      'energia-eolica': 'energía eólica',
      'vehiculos-autonomos': 'vehículos autónomos',
      'drones': 'drones',
      'economia-colaborativa': 'economía colaborativa',
      'economia-circular': 'economía circular',
      'transformacion-digital': 'transformación digital'
    };

    function findBestMatch(word) {
      if (commonTypos[word.toLowerCase()]) {
        return commonTypos[word.toLowerCase()];
      }
      
      let bestMatch = word;
      let maxSimilarity = 0;
      
      for (let typo in commonTypos) {
        const similarity = calculateSimilarity(word.toLowerCase(), typo);
        if (similarity > maxSimilarity && similarity > 0.7) {
          maxSimilarity = similarity;
          bestMatch = commonTypos[typo];
        }
      }
      
      return bestMatch;
    }

    return userMessage.split(' ').map(word => findBestMatch(word)).join(' ');
  }

  function respondToUser(userMessage) {
    conversationContext.push(userMessage);
    
    if (conversationContext.length > 5) {
      conversationContext.shift(); // Mantener solo las últimas 5 interacciones
    }

    const correctedMessage = handleTypos(userMessage);
    if (correctedMessage !== userMessage) {
      addMessage('bot', `¿Quisiste decir "${correctedMessage}"?`);
      userMessage = correctedMessage;
    }

    const bestMatch = findBestMatch(userMessage, knowledgeBase);
    
    if (bestMatch) {
      addMessage('bot', bestMatch.answer);
      
      // Sugerir preguntas relacionadas
      const relatedQuestions = findRelatedQuestions(bestMatch.question, knowledgeBase);
      if (relatedQuestions.length > 0) {
        setTimeout(() => {
          addMessage('bot', "Quizás también te interese saber:");
          relatedQuestions.forEach(q => addMessage('bot', `- ${q}`));
        }, 1000);
      }
    } else {
      const relatedInfo = findRelatedInfo(userMessage, knowledgeBase);
      
      if (relatedInfo.length > 0) {
        addMessage('bot', "No encontré una respuesta exacta, puedes contactarnos por WhatsApp o Instagram para más información, pero aquí hay información relacionada que podría ser útil:");
        relatedInfo.forEach(info => {
          addMessage('bot', `${info.question}: ${info.answer}`);
        });
      } else {
        handleUnknownQuery(userMessage);
      }
    }

    // Buscar y mostrar información adicional basada en palabras clave
    const additionalInfo = findAdditionalInfo(userMessage, knowledgeBase);
    if (additionalInfo.length > 0) {
      setTimeout(() => {
        addMessage('bot', "Además, aquí hay información adicional relacionada con tu pregunta:");
        additionalInfo.forEach(info => addMessage('bot', `- ${info}`));
      }, 1500);
    }
  }

  function findRelatedQuestions(question, knowledgeBase) {
    const normalizedQuestion = normalizeText(question);
    const relatedQuestions = [];

    for (let category in knowledgeBase) {
      for (let q in knowledgeBase[category]) {
        if (q !== question && calculateSimilarity(normalizedQuestion, normalizeText(q)) > 0.3) {
          relatedQuestions.push(q);
        }
      }
    }

    return relatedQuestions.slice(0, 2); // Devolver las 2 preguntas más relacionadas
  }

  function handleUnknownQuery(userMessage) {
    const genericResponses = [
      "Lo siento, no tengo información específica sobre eso, puedes contactarnos por WhatsApp o Instagram para más información. ¿Puedes reformular tu pregunta o preguntar sobre otro tema?",
      "No estoy seguro de cómo responder a eso, puedes contactarnos por WhatsApp o Instagram para más información. ¿Hay algo más en lo que pueda ayudarte?",
      "Esa es una pregunta interesante, pero no tengo una respuesta precisa, puedes contactarnos por WhatsApp o Instagram para más información. ¿Quieres saber sobre algún otro tema relacionado con startups o tecnología?"
    ];

    const response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    addMessage('bot', response);

    // Sugerir temas populares
    setTimeout(() => {
      addMessage('bot', "Aquí hay algunos temas populares sobre los que puedo informarte:");
      addMessage('bot', "- ¿Qué es una startup?");
      addMessage('bot', "- ¿Cómo funciona el proceso de financiación de startups?");
      addMessage('bot', "- ¿Qué servicios ofrece Silicon Valley Zentith Hub?");
    }, 1000);
  }

  function findAdditionalInfo(userMessage, knowledgeBase) {
    const normalizedUserMessage = normalizeText(userMessage);
    const words = normalizedUserMessage.split(/\s+/);
    const additionalInfo = new Set();

    const keywordMap = {
      'startup': ['incubadora', 'aceleradora', 'pitch'],
      'financiación': ['inversor ángel', 'capital de riesgo', 'ronda de financiación'],
      'innovación': ['disruptivo', 'propiedad intelectual', 'I+D'],
      'tecnología': ['IA', 'blockchain', 'big data'],
      'emprendimiento': ['modelo de negocio', 'escalabilidad', 'pivote']
    };

    words.forEach(word => {
      if (keywordMap[word]) {
        keywordMap[word].forEach(relatedTerm => {
          for (let category in knowledgeBase) {
            for (let question in knowledgeBase[category]) {
              if (question.toLowerCase().includes(relatedTerm)) {
                additionalInfo.add(`${question}: ${knowledgeBase[category][question]}`);
              }
            }
          }
        });
      }
    });

    return Array.from(additionalInfo).slice(0, 2); // Limitar a 2 piezas de información adicional
  }
});
