// Importa il JSON dei contatti
const jsonData = [
  {
    "ruolo": "Responsabile di Sezione",
    "nome": "Prof. Flavio Corradini",
    "email": "flavio.corradini@unicam.it",
    "telefono": "+39 0737 402564"
  },
  {
    "ruolo": "Responsabile per il Dottorato di Ricerca in Computer Science and Mathematics",
    "nome": "Prof. Andrea Polini",
    "email": "andrea.polini@unicam.it",
    "telefono": "+39 0737 402563"
  },
  {
    "ruolo": "Responsabile per i Corsi di Laurea in Informatica e in Informatica per la Comunicazione Digitale",
    "nome": "Prof.ssa Barbara Re",
    "email": "barbara.re@unicam.it",
    "telefono": "+39 0737 402524"
  },
  {
    "ruolo": "Orientamento Magistrale",
    "nome": "Dr. Lorenzo Rossi",
    "email": "lorenzo.rossi@unicam.it",
    "telefono": "+39 0737 403705"
  },
  // Aggiungi il resto dei dati...
];

// Funzione per compattare il JSON in un formato leggibile per il prompt
const compattaJson = (data) => {
  return data
      .filter(item => item.ruolo && item.ruolo !== "N/A") // Filtra i dati validi
      .map(item => {
          return `${item.ruolo.trim()} - ${item.nome.replace(/&nbsp;/g, '').trim()} - Email: ${item.email.trim()} - Telefono: ${item.telefono.trim()}`;
      })
      .join("\n"); // Unisci tutto in una lista leggibile
};

const jsonCompattato = compattaJson(jsonData);

// Prompt finale
const prompt = `
Ecco una lista di contatti con i relativi ruoli:
${jsonCompattato}

Puoi rispondere alle seguenti domande:
- Chi ricopre un determinato ruolo?
- Qual è l'email di una persona specifica?
- Chi è responsabile di una determinata funzione?

Rispondi solo in base ai dati forniti sopra. Se un'informazione non è disponibile, rispondi: "Informazione non disponibile".

Esempio di domanda:
- Chi è responsabile per il Dottorato di Ricerca in Computer Science and Mathematics?
`;

module.exports = prompt;
