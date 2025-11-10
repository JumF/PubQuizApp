/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'robot-orange': '#FF6B35', // Heldere oranje van het logo
        'robot-orange-dark': '#E55A2B', // Donkerdere oranje voor hover
        'robot-orange-light': '#FF8C5A', // Lichtere oranje voor accents
        'robot-black': '#1A1A1A', // Zwart van het logo
        'robot-gray': '#F5F5F5', // Lichtgrijs voor achtergronden
        'robot-gray-dark': '#E0E0E0', // Donkerder grijs voor borders
        'robot-beige': '#F5E6D3', // Beige voor subtiele achtergronden
        // Kleurrijke kaart kleuren
        'card-purple': '#8B5CF6',
        'card-green': '#10B981',
        'card-yellow': '#FBBF24',
        'card-red': '#EF4444',
        'card-blue': '#3B82F6',
        'card-pink': '#EC4899',
        'card-cyan': '#06B6D4',
      },
      borderRadius: {
        'robot': '1.5rem', // Ronde vormen zoals in het logo
        'robot-lg': '2rem',
      },
      boxShadow: {
        'robot': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'robot-lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}

