# ChatBotWebApp


## Descrizione del progetto
Progetto sviluppato a partire da una proposta di tesi: si propone di creare una piattaforma di comunicazione con un chatbot universitario, specificamente orientato alla gestione delle informazioni della sezione di Informatica dell’Università di Camerino. Tale piattaforma prende il nome di SYNCHRO, per il fatto che indica il luogo in cui tutte le informazioni degli studenti esistono contemporaneamente.

Lo scopo di questo progetto è creare le basi per la presenza di un’Intelligenza Artificiale interna e specifica di Unicam, partendo dalla sezione di Informatica, seguendo l'esempio di altre università italiane in questo ambito. 

## Backend
Si tratta di una web app il cui backend è stato sviluppato utilizzando Node.js,  mentre la persistenza dei dati è stata gestita tramite MongoDB.
Il sistema è stato progettato in modo modulare, seguendo una struttura che separa le diverse responsabilità. Per l'elaborazione delle domande in linguaggio naturale, sono state utilizzate due istanze del server Rasa, piattaforma open-source progettata per la creazione di chatbot e assistenti virtuali basati sull'elaborazione del linguaggio naturale (NLP).

Il backend dell'applicazione è avviato tramite server.js, mentre Rasa viene eseguito su due porte separate: la porta predefinita per Rasa NLU (gestendo la comprensione del linguaggio naturale con il comando ‘rasa run’) e una porta separata per le azioni personalizzate (‘rasa run actions’), che carica il file degli addestramenti del modello e risponde alle domande in base agli esempi forniti. Rasa Core è il componente preposto a coordinare l’esecuzione del server delle azioni personalizzate, file Python eseguito dallo stesso server.

Nella fase intermedia del progetto, sono state utilizzate api Swagger per testare il funzionamento del backend in preparazione al frontend.


## Frontend
Il frontend, realizzato con Angular, implementa un pattern Single Page Application ed è stata sviluppato per essere responsive, e quindi fruibile sia in modalità web che mobile.

L’utente può accedere a tale servizio previa autenticazione: poiché il progetto è sperimentale, la persistenza dei dati viene mantenuta in un database fittizio (non è quindi direttamente quello dell’università) atto solo allo scopo di mostrare la persistenza dei dati.
Avvenuta l’autenticazione, l’utente visualizzerà una finestra di chat con un messaggio di benvenuto direttamente dal chatbot e, cliccando l’apposito bottone, potrà visualizzare una sidebar in cui è mostrato il suo profilo e l’elenco delle funzionalità disponibili.


È aggiunta, inoltre, la possibilità di poter inviare consigli di miglioramento per la piattaforma o, in caso, la possibilità di poter segnalare problemi o richieste non ben gestite. Tali funzionalità sono fittizie e simulano solo il comportamento di come potrebbe apparire una applicazione del genere.
La UI adotta un design minimal e moderno, ispirato alla palette di colori del sito di Unicam; è stato fatto uso anche della libreria Boostrap per fornire stili appropriati.


## Sicurezza 🔐

- **Gestione delle password:** 
  le password degli utenti vengono opportunamente protette con l'algoritmo bcrypt (ulizzando l'omonima libreria) evitando di salvarle in chiaro nel DB.

- **Richieste cross-origin (CORS):** 
   Durante lo sviluppo, il client Angular è stato configurato per inoltrare le richieste dal frontend al backend tramite un proxy (vedi `proxy.conf.json`).
   Questa configurazione facilita lo sviluppo per fini didattici del progetto. In un ambiente di produzione, sarebbe necessario configurare correttamente il server per gestire le autorizzazioni CORS.

- **NoSQL Injection:**
   L'interazione con il database è gestita tramite la libreria **Mongoose**, un ODM (Object Data Modeling) per MongoDB.
   Mongoose costruisce query trattando i dati utente come valori separati,non come parte della query stessa. In questo modo, i parametri passati dagli utenti sono soggetti al binding in modo sicuro, impedendo che un attaccante possa iniettare operatori pericolosi (es. `$gt`, `$lt`, `$in`).

- **Attacchi XSS (Cross-Site Scripting):**
è stata utilizzata la libreria **sanitize-html** lato backend, specifica per framework come Node.js. Questa libreria sanifica gli input dell'utente, assicurandosi che ogni dato inserito (ad esempio nelle form di registrazione, login e nella chat con il bot) venga filtrato correttamente per evitare l'inserimento di codice maligno, come script o tag.

- **Autenticazione e autorizzazione:**
   L’autenticazione è gestita tramite lo standard **JWT** (JSON Web Token), che genera token crittograficamente sicuri inclusi in ogni richiesta del client.
   Per implementare questa funzionalità, è stata utilizzata la libreria **jsonwebtoken** disponibile per Node.js.

