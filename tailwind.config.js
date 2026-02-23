export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        escayr: {
          dark: '#2F6B2F', // Verde oscuro principal
          light: '#CFE8B4', // Verde claro fondos
          base: '#FFFFFF', // Blanco base
          technical: '#1A1A1A', // Negro técnico
          accent: '#FF6A2A', // Naranja seguridad/acento
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming Inter as default
      }
    },
  },
  plugins: [],
}
