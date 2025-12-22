const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'Meal Planner API', 
      version: '1.0.0',          
      description: 'Dokumentacja API do aplikacji planowania posiłków', // Opis
      contact: {
        name: 'MH',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Serwer lokalny',
      },
    ],
  },

  apis: ["./src/routes/*.js"]
  
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📄 Swagger UI jest dostępny pod adresem: http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;