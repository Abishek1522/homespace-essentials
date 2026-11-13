import { defineModule } from './_factory.js';

export default defineModule({
  key: 'furniture',
  label: 'Furniture',
  blurb: 'Sofas, beds, tables, storage and chairs for every room.',
  attrs: [
    { name: 'material', label: 'Material', type: 'text' },
    { name: 'dimensions', label: 'Size (W x D x H, cm)', type: 'text' },
    { name: 'colour', label: 'Colour', type: 'text' },
    { name: 'assembly', label: 'Assembly', type: 'text' },
    { name: 'weight_kg', label: 'Weight (kg)', type: 'int' }
  ],
  seed: [
    { slug: 'nilgiri-3-seater-fabric-sofa', name: 'Nilgiri 3-Seater Fabric Sofa', brand: 'Nilgiri', price: 24990, mrp: 34990, stock: 6, room: 'living',
      description: 'A deep three-seater with a solid sal wood frame and high-density foam cushions. The cover is a stain-resistant fabric.', features: ['Solid sal wood frame', 'High-density foam seats', 'Stain-resistant fabric', 'Free assembly at your home'],
      art: 'sofa', tone: '#5b7f6d', accent: '#2a1d17', featured: true, material: 'Sal wood, fabric', dimensions: '210 x 90 x 85', colour: 'Sage green', assembly: 'Free assembly', weight_kg: 48 },
    { slug: 'kaveri-queen-bed-with-storage', name: 'Kaveri Queen Bed with Storage', brand: 'Kaveri', price: 21490, mrp: 29990, stock: 5, room: 'bedroom',
      description: 'A queen size bed with a hydraulic lift and a full-length storage box. Fits a 150 x 200 cm mattress.', features: ['Hydraulic lift storage', 'Engineered wood with teak finish', 'Padded headboard', 'Fits a 150 x 200 cm mattress'],
      art: 'bed', tone: '#c7a98a', accent: '#8a5f3d', featured: true, material: 'Engineered wood', dimensions: '210 x 165 x 95', colour: 'Walnut brown', assembly: 'Free assembly', weight_kg: 62 },
    { slug: 'teak-dining-table-6-seater', name: 'Teak Dining Table, 6 Seater', brand: 'Kaveri', price: 32990, mrp: 44990, stock: 4, room: 'dining',
      description: 'A solid teak table seating six, with a hand-rubbed oil finish. Chairs are sold separately.', features: ['Solid teak top and legs', 'Seats six comfortably', 'Oil finish, no glossy coating', 'Rubber feet protect the floor'],
      art: 'diningtable', tone: '#9b6b43', accent: '#c8a46f', featured: true, material: 'Solid teak', dimensions: '180 x 90 x 76', colour: 'Natural teak', assembly: 'Free assembly', weight_kg: 54 },
    { slug: 'arya-3-door-wardrobe', name: 'Arya 3-Door Wardrobe with Mirror', brand: 'Arya', price: 18990, mrp: 26990, stock: 7, room: 'bedroom',
      description: 'A three-door wardrobe with a full mirror, two drawers and a hanging rail. Soft-close hinges on every door.', features: ['Full-length mirror on one door', 'Two drawers, one with a lock', 'Soft-close hinges', 'Moisture-resistant board'],
      art: 'wardrobe', tone: '#8d6e55', accent: '#2a1d17', featured: false, material: 'Engineered wood', dimensions: '135 x 52 x 200', colour: 'Walnut', assembly: 'Free assembly', weight_kg: 78 },
    { slug: 'study-desk-with-drawers', name: 'Study Desk with Three Drawers', brand: 'Arya', price: 7990, mrp: 11990, stock: 15, room: 'study',
      description: 'A desk for homework or a work-from-home setup. The top holds a laptop and a monitor with space to spare.', features: ['120 cm wide top', 'Three drawers, one with a lock', 'Cable hole at the back', 'Scratch-resistant laminate'],
      art: 'desk', tone: '#b98f66', accent: '#456f3a', featured: false, material: 'Engineered wood', dimensions: '120 x 60 x 75', colour: 'Oak', assembly: 'DIY, tools included', weight_kg: 28 },
    { slug: 'open-bookshelf-5-tier', name: 'Open Bookshelf, 5 Tier', brand: 'Nilgiri', price: 5490, mrp: 8490, stock: 20, room: 'study',
      description: 'A tall open shelf for books, plants and storage boxes. Each shelf carries up to 15 kg.', features: ['Five shelves, 15 kg each', 'Wall anchor included', 'Solid rubberwood frame', 'Flat-packed, 20 minutes to assemble'],
      art: 'bookshelf', tone: '#a77b55', accent: '#6a8fa3', featured: false, material: 'Rubberwood', dimensions: '70 x 30 x 180', colour: 'Honey brown', assembly: 'DIY, tools included', weight_kg: 19 },
    { slug: 'cane-accent-armchair', name: 'Cane Accent Armchair', brand: 'Nilgiri', price: 8990, mrp: 12990, stock: 11, room: 'living',
      description: 'A low armchair with a cushioned seat and angled wooden legs. Fits a reading corner or a bedroom.', features: ['Cushioned seat and back', 'Angled solid wood legs', 'Holds up to 120 kg', 'Arrives fully assembled'],
      art: 'armchair', tone: '#c8794f', accent: '#8a5f3d', featured: true, material: 'Rubberwood, fabric', dimensions: '72 x 78 x 80', colour: 'Terracotta', assembly: 'Fully assembled', weight_kg: 11 },
    { slug: 'round-coffee-table', name: 'Round Coffee Table', brand: 'Kaveri', price: 4290, mrp: 6490, stock: 18, room: 'living',
      description: 'A round table with a 80 cm top and splayed legs. The finish resists heat from a cup of tea.', features: ['80 cm round top', 'Heat-resistant finish', 'Splayed solid wood legs', 'Legs screw on in two minutes'],
      art: 'coffeetable', tone: '#9b6b43', accent: '#456f3a', featured: false, material: 'Mango wood', dimensions: '80 x 80 x 42', colour: 'Natural', assembly: 'DIY, tools included', weight_kg: 12 }
  ]
});
