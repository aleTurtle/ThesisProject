const puppeteer = require('puppeteer');
const fs = require('fs');
const path = 'data/ruoli.json';

async function estraiRuoli() {
    try {
        // Avvia il browser Puppeteer
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Vai alla pagina con i ruoli
        await page.goto('https://computerscience.unicam.it/organizzazione', { waitUntil: 'networkidle2' });

        // Fai uno screenshot per il debug
        await page.screenshot({ path: 'screenshot_ruoli.png', fullPage: true });
        console.log('Screenshot salvato. Controlla il file screenshot_ruoli.png');

        // Aspetta che i dati siano visibili
        await page.waitForSelector('p > strong', { timeout: 60000 });

        // Estrai i dati dei ruoli, nomi, email e telefono
        const ruoli = await page.evaluate(() => {
            const paragrafi = document.querySelectorAll('p');
            const ruoliInfo = [];

            // Ciclo per ogni paragrafo trovato
            paragrafi.forEach((p) => {
                const ruolo = p.querySelector('strong')?.innerText || 'N/A';
                const nomeMatch = p.innerHTML.match(/<\/strong>:\s*([^<]+)/);
                const nome = nomeMatch ? nomeMatch[1].trim() : 'N/A';
                const email = p.querySelector('a[href^="mailto:"]')?.innerText || 'N/A';
                const telMatch = p.innerHTML.match(/Tel\s*([\+0-9\s]+)/);
                const telefono = telMatch ? telMatch[1].trim() : 'N/A';

                if (ruolo && nome) {
                    ruoliInfo.push({ ruolo, nome, email, telefono });
                }
            });

            return ruoliInfo;
        });

        // Chiudi il browser
        await browser.close();

        // Verifica se la cartella 'data' esiste, altrimenti la crea
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');  // Crea la cartella se non esiste
        }

        // Salva i dati in un file JSON
        fs.writeFileSync(path, JSON.stringify(ruoli, null, 2));
        console.log('Dati dei ruoli salvati in "data/ruoli.json"');
    } catch (error) {
        console.error('Errore durante l\'estrazione dei dati:', error);
    }
}

estraiRuoli();
