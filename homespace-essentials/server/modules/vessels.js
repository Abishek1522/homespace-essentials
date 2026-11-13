import { defineModule } from './_factory.js';

export default defineModule({
  key: 'vessels',
  label: 'Vessels',
  blurb: 'Steel, copper and ceramic vessels for serving, storing and carrying food.',
  attrs: [
    { name: 'material', label: 'Material', type: 'text' },
    { name: 'capacity', label: 'Capacity', type: 'text' },
    { name: 'pieces', label: 'Pieces in the set', type: 'int' },
    { name: 'dishwasher_safe', label: 'Dishwasher safe', type: 'bool' }
  ],
  seed: [
    { slug: 'steel-storage-jars-set-of-3', name: 'Stainless Steel Storage Jars, Set of 3', brand: 'Annapurna', price: 899, mrp: 1499, stock: 70, room: 'kitchen',
      description: 'Three airtight jars for rice, dal and spices. The lids seal with a silicone ring.', features: ['Food-grade 304 steel', 'Airtight silicone seal', 'Sizes 1 L, 1.5 L and 2 L', 'Rust-proof'],
      art: 'jars', tone: '#b8bcc0', accent: '#456f3a', featured: true, material: 'Stainless steel 304', capacity: '1 L, 1.5 L, 2 L', pieces: 3, dishwasher_safe: true },
    { slug: 'insulated-steel-bottle-1l', name: 'Insulated Steel Bottle, 1 Litre', brand: 'Annapurna', price: 749, mrp: 1299, stock: 90, room: 'everyday',
      description: 'A double-wall bottle that keeps water cold for 24 hours and tea hot for 12.', features: ['Cold 24 hours, hot 12 hours', 'Leak-proof cap', 'BPA-free', 'Powder-coated grip'],
      art: 'bottle', tone: '#456f3a', accent: '#2a1d17', featured: true, material: 'Stainless steel 304', capacity: '1 L', pieces: 1, dishwasher_safe: false },
    { slug: 'bone-china-dinner-set-24', name: 'Bone China Dinner Set, 24 Pieces', brand: 'Chola', price: 3499, mrp: 5999, stock: 22, room: 'dining',
      description: 'A 24 piece dinner set for six: dinner plates, side plates, bowls and mugs. Microwave and dishwasher safe.', features: ['Serves six', 'Microwave and dishwasher safe', 'Chip-resistant rim', 'Gold-free hand-painted border'],
      art: 'dinnerset', tone: '#efe8d8', accent: '#456f3a', featured: true, material: 'Bone china', capacity: '6 plates, 6 side plates, 6 bowls, 6 mugs', pieces: 24, dishwasher_safe: true },
    { slug: 'steel-tumblers-set-of-6', name: 'Steel Tumblers, Set of 6', brand: 'Annapurna', price: 599, mrp: 999, stock: 80, room: 'dining',
      description: 'Six heavy-gauge tumblers with a mirror finish. Each holds 300 ml.', features: ['300 ml each', 'Heavy-gauge steel', 'Smooth rolled rim', 'Stackable'],
      art: 'tumblers', tone: '#c2c6c9', accent: '#c8794f', featured: false, material: 'Stainless steel', capacity: '300 ml each', pieces: 6, dishwasher_safe: true },
    { slug: 'steel-thali-set-11-piece', name: 'Steel Thali Set, 11 Pieces', brand: 'Chola', price: 1299, mrp: 2199, stock: 40, room: 'dining',
      description: 'Two thalis with bowls, spoons and tumblers for two people. Plain polished steel.', features: ['2 thalis, 4 katoris, 2 tumblers, 2 spoons, 1 serving spoon', 'Mirror finish', 'Rolled rim, no sharp edge', 'Nests for storage'],
      art: 'thali', tone: '#c2c6c9', accent: '#b98f66', featured: false, material: 'Stainless steel', capacity: '2 thalis, 4 katoris, 2 tumblers', pieces: 11, dishwasher_safe: true },
    { slug: 'copper-water-jug-1-5l', name: 'Copper Water Jug, 1.5 Litre', brand: 'Chola', price: 1499, mrp: 2499, stock: 33, room: 'everyday',
      description: 'A pure copper jug with a hammered finish. Water stored overnight takes on copper naturally.', features: ['99.9% pure copper', 'Hammered finish', 'Wide mouth for easy cleaning', 'Lid included'],
      art: 'jug', tone: '#b8693f', accent: '#8a4a2a', featured: false, material: 'Pure copper', capacity: '1.5 L', pieces: 1, dishwasher_safe: false },
    { slug: 'stackable-lunch-box-3-tier', name: 'Stackable Lunch Box, 3 Tier', brand: 'Annapurna', price: 849, mrp: 1399, stock: 55, room: 'everyday',
      description: 'Three steel tiers lock together with a carry clip. Each tier holds 350 ml.', features: ['Three leak-proof tiers', 'Locking carry clip', 'Steel inside, plastic-free food contact', 'Insulated bag in the box'],
      art: 'lunchbox', tone: '#b8bcc0', accent: '#c8794f', featured: false, material: 'Stainless steel', capacity: '3 x 350 ml', pieces: 3, dishwasher_safe: true },
    { slug: 'steel-containers-set-of-5', name: 'Steel Containers with Lids, Set of 5', brand: 'Annapurna', price: 1199, mrp: 1999, stock: 48, room: 'kitchen',
      description: 'Five nesting containers for leftovers and pantry staples, from 300 ml to 2 litres.', features: ['Nests to save space', 'Snap-on lids', 'Freezer and microwave lid safe', '300 ml to 2 L'],
      art: 'containers', tone: '#b8bcc0', accent: '#6a8fa3', featured: false, material: 'Stainless steel', capacity: '300 ml to 2 L', pieces: 5, dishwasher_safe: true }
  ]
});
