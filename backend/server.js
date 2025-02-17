// Carica le variabili d'ambiente dal file .env
require('dotenv').config();  

// Verifica che la variabile MONGO_URI sia correttamente caricata
console.log('MONGO_URI:', process.env.MONGO_URI);


// Importa le dipendenze
const express = require('express');
const connectDB = require('./src/config/db'); // Importa la funzione di connessione al DB
const swaggerUi = require('swagger-ui-express'); // Interfaccia Swagger
const swaggerSpecs = require('./src/config/swaggerDef'); // Configurazione Swagger

//const Message = require('./src/models/Message'); // Modello per il salvataggio dei messaggi
//const User = require('./src/models/User'); //modello per il salvataggio degli utenti nel db 
//const jwt = require('jsonwebtoken');//importa i moduli per la generazione del jwt

// Importa il motore NLP
const bodyParser = require('body-parser'); // Per elaborare il corpo delle richieste
//const RasaEngine = require('./src/nlp/rasaEngine'); // Classe per interagire con Rasa
console.log('NLP_ENGINE:', process.env.NLP_ENGINE);

//const BASE_URL = process.env.ENGINE_BASE_URL;
//console.log('ENGINE_BASE_URL:', process.env.ENGINE_BASE_URL);

// Crea l'app Express
const app = express();

//app.use(express.json()); // Middleware per il parsing del corpo JSON
app.use(bodyParser.json());

// Connessione al database MongoDB
connectDB();  // Funzione di connessione al DB

// Imposta Swagger per la documentazione delle API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Imposta una route di esempio
app.get('/', (req, res) => {
  res.send('Benvenuto nel chatbot dell\'università!');
});



//route per gestire le lezioni 
const lezioniRoutes = require('./src/routes/lezioni'); // Importa il modulo delle routes
app.use('/lezioni', lezioniRoutes); // Usa le routes


const loginRoutes = require('./src/routes/loginRoutes');
const signupRoutes = require('./src/routes/signupRoutes');

//route per gestire l'autenticazione
app.use('/api/auth', loginRoutes);
app.use('/api/auth', signupRoutes);

//route per inviare messaggi a Rasa
const chatRoutes = require('./src/routes/chatRoute');
app.use('/api/chat',chatRoutes);



// Configura la porta dal file .env o usa 3000 di default
const PORT = process.env.PORT;

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});