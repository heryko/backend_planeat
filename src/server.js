require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

const swaggerDocs = require("./swagger");
swaggerDocs(app, PORT);



app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  console.log(`📄 Swagger UI dostępny pod: http://localhost:${PORT}/api-docs`);
});


