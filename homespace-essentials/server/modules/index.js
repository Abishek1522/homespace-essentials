import electronics from './electronics.js';
import furniture from './furniture.js';
import vessels from './vessels.js';
import cooking from './cooking.js';

export const MODULES = [electronics, furniture, vessels, cooking];
export const byKey = Object.fromEntries(MODULES.map((m) => [m.key, m]));
