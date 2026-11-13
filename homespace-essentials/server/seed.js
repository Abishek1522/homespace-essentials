import { MODULES } from './modules/index.js';
for (const m of MODULES) console.log(`${m.label}: ${m.list({ limit: 100 }).total} products`);
