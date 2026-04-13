// Mock data for testing without GHL API credentials
export const mockConversations = {
  contacts: [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'García',
      phone: '+34 912 345 678',
      email: 'juan@example.com'
    },
    {
      id: '2',
      firstName: 'María',
      lastName: 'López',
      phone: '+34 913 456 789',
      email: 'maria@example.com'
    },
    {
      id: '3',
      firstName: 'Carlos',
      lastName: 'Martínez',
      phone: '+34 914 567 890',
      email: 'carlos@example.com'
    },
    {
      id: '4',
      firstName: 'Ana',
      lastName: 'Rodríguez',
      phone: '+34 915 678 901',
      email: 'ana@example.com'
    }
  ]
};

export const mockMessages = {
  '1': {
    data: [
      {
        id: '1',
        body: 'Hola, ¿cómo estás?',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        body: 'Hola Juan, muy bien. ¿En qué te puedo ayudar?',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 3500000).toISOString()
      },
      {
        id: '3',
        body: 'Necesito información sobre tus servicios',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 3400000).toISOString()
      },
      {
        id: '4',
        body: 'Claro, con gusto te comparto. 📄',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 3300000).toISOString()
      }
    ]
  },
  '2': {
    data: [
      {
        id: '1',
        body: '¿Están disponibles para una reunión?',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '2',
        body: 'Sí, ¿qué día te vendría bien?',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 7100000).toISOString()
      }
    ]
  },
  '3': {
    data: [
      {
        id: '1',
        body: 'Gracias por tu ayuda anterior',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        body: 'De nada, siempre es un placer ayudarte 😊',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 86300000).toISOString()
      }
    ]
  },
  '4': {
    data: [
      {
        id: '1',
        body: 'Hola, tengo una pregunta',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '2',
        body: 'Adelante, dime qué necesitas',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 172700000).toISOString()
      }
    ]
  }
};

export const mockQuickReplies = [
  {
    id: '1',
    title: 'Saludo inicial',
    message: 'Hola, ¿cómo estás? ¿En qué puedo ayudarte?',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Horario de atención',
    message: 'Nuestro horario de atención es de 9:00 a 18:00 de lunes a viernes.',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Gracias por escribir',
    message: 'Gracias por tu mensaje, te responderemos en la brevedad. 😊',
    createdAt: new Date().toISOString()
  }
];
