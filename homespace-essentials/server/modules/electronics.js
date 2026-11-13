import { defineModule } from './_factory.js';

export default defineModule({
  key: 'electronics',
  label: 'Electronics',
  blurb: 'Televisions, laptops, phones, audio and small appliances.',
  attrs: [
    { name: 'warranty_months', label: 'Warranty (months)', type: 'int' },
    { name: 'connectivity', label: 'Connectivity', type: 'text' },
    { name: 'power_use', label: 'Power', type: 'text' },
    { name: 'key_spec', label: 'Key specification', type: 'text' }
  ],
  seed: [
    { slug: 'aurora-43-4k-smart-tv', name: 'Aurora 43" 4K Smart TV', brand: 'Aurora', price: 28990, mrp: 42990, stock: 14, room: 'living',
      description: 'A 43 inch 4K television with built-in streaming apps and a voice remote. Wall mount or table stand.', features: ['4K Ultra HD, 60 Hz panel', '3 HDMI and 2 USB ports', 'Dolby audio, 20 W speakers', 'Wall-mount kit in the box'],
      art: 'tv', tone: '#3d6b8a', accent: '#e0a458', featured: true, warranty_months: 12, connectivity: 'Wi-Fi, Bluetooth 5.0, HDMI, USB', power_use: '95 W', key_spec: '43 inch, 3840 x 2160' },
    { slug: 'lumen-book-14-laptop', name: 'Lumen Book 14 Laptop', brand: 'Lumen', price: 46990, mrp: 58990, stock: 9, room: 'study',
      description: 'A light 14 inch laptop for study and office work. 16 GB memory and a 512 GB solid state drive.', features: ['Intel Core i5, 16 GB RAM', '512 GB SSD', '14 inch full HD anti-glare screen', 'Up to 9 hours of battery'],
      art: 'laptop', tone: '#6b7a86', accent: '#456f3a', featured: true, warranty_months: 12, connectivity: 'Wi-Fi 6, Bluetooth 5.2, USB-C, HDMI', power_use: '65 W adapter', key_spec: '14 inch, 16 GB RAM, 512 GB SSD' },
    { slug: 'nova-5g-smartphone-128', name: 'Nova 5G Smartphone, 8 GB / 128 GB', brand: 'Nova', price: 17999, mrp: 22999, stock: 32, room: 'everyday',
      description: 'A 5G phone with a 6.6 inch display and a 50 MP camera. Fast charging brings it to 50% in 25 minutes.', features: ['6.6 inch AMOLED, 120 Hz', '50 MP main camera', '5000 mAh battery, 33 W charger included', 'Dual SIM, 5G'],
      art: 'phone', tone: '#2f4858', accent: '#e07a5f', featured: true, warranty_months: 12, connectivity: '5G, Wi-Fi 6, Bluetooth 5.3, NFC', power_use: '33 W charger', key_spec: '8 GB RAM, 128 GB storage' },
    { slug: 'echo-beats-wireless-headphones', name: 'Echo Beats Wireless Headphones', brand: 'Echo', price: 2499, mrp: 4999, stock: 60, room: 'everyday',
      description: 'Over-ear headphones with active noise cancellation and 40 hours of playback on one charge.', features: ['Active noise cancellation', '40 hours of playback', 'Soft memory-foam cushions', 'Wired mode with 3.5 mm cable'],
      art: 'headphones', tone: '#3b3b3f', accent: '#c8794f', featured: false, warranty_months: 12, connectivity: 'Bluetooth 5.3, 3.5 mm', power_use: 'USB-C charging', key_spec: '40 mm drivers' },
    { slug: 'drift-bluetooth-speaker', name: 'Drift Portable Bluetooth Speaker', brand: 'Drift', price: 1799, mrp: 2999, stock: 45, room: 'living',
      description: 'A water-resistant speaker with 360 degree sound. It plays for 12 hours and pairs two units for stereo.', features: ['IPX6 water resistance', '12 hours of playback', 'Pairs two speakers for stereo', 'Built-in microphone for calls'],
      art: 'speaker', tone: '#456f3a', accent: '#e5e1d8', featured: true, warranty_months: 6, connectivity: 'Bluetooth 5.0, AUX', power_use: '10 W', key_spec: '10 W output, IPX6' },
    { slug: 'pulse-smartwatch', name: 'Pulse Smartwatch with Heart Rate', brand: 'Pulse', price: 2999, mrp: 5499, stock: 38, room: 'everyday',
      description: 'A smartwatch with a 1.8 inch display, heart rate and sleep tracking, and 7 days of battery life.', features: ['1.8 inch always-on display', 'Heart rate and sleep tracking', '7 days of battery', '100 watch faces'],
      art: 'watch', tone: '#2a2a2e', accent: '#7fb069', featured: false, warranty_months: 12, connectivity: 'Bluetooth 5.2', power_use: 'Magnetic charger', key_spec: '1.8 inch display, 5 ATM' },
    { slug: 'slate-tab-10-tablet', name: 'Slate Tab 10" Tablet, 4 GB / 64 GB', brand: 'Slate', price: 12499, mrp: 16999, stock: 18, room: 'study',
      description: 'A 10 inch tablet for reading, video classes and drawing. It supports a stylus sold separately.', features: ['10.1 inch full HD screen', '4 GB RAM, 64 GB storage', '7000 mAh battery', 'Slot for a memory card up to 512 GB'],
      art: 'tablet', tone: '#6a8fa3', accent: '#d17a5a', featured: false, warranty_months: 12, connectivity: 'Wi-Fi 5, Bluetooth 5.0, USB-C', power_use: '18 W charger', key_spec: '10.1 inch, 64 GB' },
    { slug: 'breeze-table-fan-400', name: 'Breeze Table Fan, 400 mm', brand: 'Breeze', price: 2299, mrp: 3199, stock: 52, room: 'bedroom',
      description: 'A quiet three-speed table fan with an oscillating head. The copper motor runs on 55 W.', features: ['400 mm blades, 3 speeds', 'Oscillation and tilt', 'Copper motor, 55 W', 'Safety grill with fine mesh'],
      art: 'fan', tone: '#9a9a8e', accent: '#456f3a', featured: false, warranty_months: 24, connectivity: 'None', power_use: '55 W', key_spec: '400 mm sweep, 1350 rpm' }
  ]
});
