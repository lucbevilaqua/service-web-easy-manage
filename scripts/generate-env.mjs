import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Caminho do template
const templatePath = resolve('src/environments/environment.template.ts');

// Lê o conteúdo
let content = readFileSync(templatePath, 'utf-8');

// Regex para encontrar valores tipo __VAR__
const regex = /__([A-Za-z0-9_]+)__/g;

content = content.replace(regex, (match, p1) => {
  const envValue = process.env[p1];
  if (envValue === undefined) {
    console.error(`❌ ERRO: A variável de ambiente "${p1}" não está definida!`);
    process.exit(1);
  }
  return envValue;
});


const envPath = resolve('src/environments/environment.ts');

writeFileSync(envPath, content);

console.log('✔ environment.ts gerados com sucesso.');
