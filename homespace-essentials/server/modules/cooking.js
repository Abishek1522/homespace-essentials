import { defineModule } from './_factory.js';

export default defineModule({
  key: 'cooking',
  label: 'Cooking',
  blurb: 'Cookers, pans, cookware sets and kitchen appliances.',
  attrs: [
    { name: 'material', label: 'Material', type: 'text' },
    { name: 'capacity', label: 'Capacity', type: 'text' },
    { name: 'induction_ok', label: 'Induction compatible', type: 'bool' },
    { name: 'warranty_months', label: 'Warranty (months)', type: 'int' }
  ],
  seed: [
    { slug: 'hard-anodised-pressure-cooker-5l', name: 'Hard-Anodised Pressure Cooker, 5 Litre', brand: 'Rasoi', price: 2499, mrp: 3999, stock: 36, room: 'kitchen',
      description: 'An outer-lid pressure cooker with a hard-anodised body. It works on gas and induction.', features: ['Hard-anodised, 4.2 mm base', 'Gasket release system', 'Works on gas and induction', 'Includes a steel steamer'],
      art: 'cooker', tone: '#3b3b3f', accent: '#c8794f', featured: true, material: 'Hard-anodised aluminium', capacity: '5 L', induction_ok: true, warranty_months: 60 },
    { slug: 'non-stick-kadai-26cm', name: 'Non-Stick Kadai, 26 cm', brand: 'Rasoi', price: 1199, mrp: 1999, stock: 44, room: 'kitchen',
      description: 'A deep kadai with a three-layer non-stick coating. Fries and simmers with little oil.', features: ['PFOA-free non-stick', 'Cool-touch handles', 'Glass lid included', 'Works on gas and induction'],
      art: 'kadai', tone: '#2f2f33', accent: '#8a5f3d', featured: true, material: 'Aluminium, non-stick coating', capacity: '3 L', induction_ok: true, warranty_months: 12 },
    { slug: 'cast-iron-dosa-tawa-30cm', name: 'Cast Iron Dosa Tawa, 30 cm', brand: 'Rasoi', price: 1099, mrp: 1799, stock: 41, room: 'kitchen',
      description: 'A pre-seasoned cast iron tawa for dosa and roti. It holds heat evenly and lasts for decades.', features: ['Pre-seasoned, ready to use', 'Even heat across the surface', 'Long wooden-grip handle', 'Works on gas and induction'],
      art: 'tawa', tone: '#3a3a3e', accent: '#8a5f3d', featured: false, material: 'Cast iron', capacity: '30 cm diameter', induction_ok: true, warranty_months: 0 },
    { slug: 'tri-ply-cookware-set-5-piece', name: 'Tri-Ply Cookware Set, 5 Pieces', brand: 'Rasoi', price: 5999, mrp: 9499, stock: 17, room: 'kitchen',
      description: 'A kadai, a saucepan, a frying pan and two lids in tri-ply steel. Heats evenly and cleans easily.', features: ['Steel-aluminium-steel base', 'Glass lids with steam vents', 'Riveted steel handles', 'Dishwasher safe'],
      art: 'cookwareset', tone: '#b8bcc0', accent: '#2a1d17', featured: true, material: 'Tri-ply stainless steel', capacity: '2 L to 4 L', induction_ok: true, warranty_months: 60 },
    { slug: 'mixer-grinder-750w-3-jars', name: 'Mixer Grinder, 750 W with 3 Jars', brand: 'Sumeru', price: 3299, mrp: 5499, stock: 28, room: 'kitchen',
      description: 'A 750 W mixer with a wet grinding jar, a dry jar and a chutney jar. Three speeds and a pulse setting.', features: ['750 W motor', '3 steel jars with lids', 'Overload protection', '2 year motor warranty'],
      art: 'mixer', tone: '#c8794f', accent: '#2a1d17', featured: true, material: 'ABS body, steel jars', capacity: '1.5 L, 1 L, 0.4 L jars', induction_ok: false, warranty_months: 24 },
    { slug: 'induction-cooktop-2000w', name: 'Induction Cooktop, 2000 W', brand: 'Sumeru', price: 2199, mrp: 3499, stock: 26, room: 'kitchen',
      description: 'A glass-top induction cooker with eight preset menus and a digital timer. Needs an induction-compatible pan.', features: ['2000 W, 8 preset menus', 'Digital timer up to 3 hours', 'Auto-off on no pan', 'Touch panel'],
      art: 'induction', tone: '#3a3a3e', accent: '#7fb069', featured: false, material: 'Crystal glass top', capacity: '2000 W', induction_ok: true, warranty_months: 12 },
    { slug: 'electric-kettle-1-8l', name: 'Electric Kettle, 1.8 Litre', brand: 'Sumeru', price: 999, mrp: 1799, stock: 64, room: 'kitchen',
      description: 'A stainless steel kettle with auto shut-off and boil-dry protection. Boils a litre in about four minutes.', features: ['1500 W, boils 1 L in 4 minutes', 'Auto shut-off', 'Boil-dry protection', '360 degree base'],
      art: 'kettle', tone: '#b8bcc0', accent: '#2a1d17', featured: false, material: 'Stainless steel', capacity: '1.8 L', induction_ok: false, warranty_months: 12 },
    { slug: 'air-fryer-4l', name: 'Air Fryer, 4 Litre', brand: 'Sumeru', price: 5499, mrp: 8999, stock: 19, room: 'kitchen',
      description: 'A 4 litre air fryer that cooks with a tablespoon of oil. Dials set the time and temperature up to 200 degrees.', features: ['1500 W, up to 200 C', 'Removable non-stick basket', 'Timer with auto shut-off', 'Basket is dishwasher safe'],
      art: 'airfryer', tone: '#2f2f33', accent: '#e0a458', featured: true, material: 'ABS body, non-stick basket', capacity: '4 L', induction_ok: false, warranty_months: 12 }
  ]
});
