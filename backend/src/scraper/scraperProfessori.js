const puppeteer = require('puppeteer');
const fs = require('fs');
const path = 'data/professori.json';

async function estraiProfessori() {
    try {
        // Avvia il browser Puppeteer in modalità visibile (headless: false)
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Vai alla pagina con i professori
        await page.goto('https://computerscience.unicam.it/people', { waitUntil: 'networkidle2' });

        // Fai uno screenshot per il debug
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        console.log('Screenshot salvato. Controlla il file screenshot.png');

        // Aspetta che i link siano visibili
        await page.waitForSelector('.field-content a', { timeout: 60000 });

        // Estrai i dati dei professori e i link
        const professori = await page.evaluate(() => {
            const elementi = document.querySelectorAll('.field-content a');  // Seleziona tutti i <a> all'interno di <span class="field-content">
            const professoriInfo = [];

            // Ciclo per ogni elemento trovato
            elementi.forEach((el) => {
                const nome = el.innerText;  // Il nome del professore è dentro il testo del tag <a>
                const link = el.href;  // Il link è nell'attributo href del tag <a>
                if (nome && link) {
                    professoriInfo.push({ nome, link });
                }
            });

            return professoriInfo;
        });

        // Chiudi il browser
        await browser.close();

        // Verifica se la cartella 'data' esiste, altrimenti la crea
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');  // Crea la cartella se non esiste
        }

        // Salva i dati in un file JSON
        fs.writeFileSync(path, JSON.stringify(professori, null, 2));
        console.log('Dati dei professori salvati in "data/professori.json"');
    } catch (error) {
        console.error('Errore durante l\'estrazione dei dati:', error);
    }
}

estraiProfessori();
