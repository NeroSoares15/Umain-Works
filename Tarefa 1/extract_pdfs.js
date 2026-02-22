import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const files = [
    "IPTomar - Risco Abandono Escolar",
    "RiskRadar - Definic",
    "RiskRadar OnePager",
    "[IPTomar] - Processo To Be",
    "iptomar_pontos"
];

async function extract() {
    for (const file of files) {
        const ObjectDir = fs.readdirSync('task files');
        const exactFile = ObjectDir.find(d => d.includes(file) && d.endsWith('.pdf'));
        if (!exactFile) {
            console.log(`\n\n--- COULD NOT FIND FILE MATCHING: ${file} ---\n`);
            continue;
        }
        const path = `task files/${exactFile}`;
        console.log(`\n\n--- EXTRACTING: ${exactFile} ---\n`);
        try {
            const dataBuffer = fs.readFileSync(path);
            const data = await pdf(dataBuffer);
            console.log(data.text.substring(0, 3000)); // Limit to first 3000 chars per file to avoid too much output
        } catch (e) {
            console.log(`Error reading ${exactFile}: ${e.message}`);
        }
    }
}
extract();
