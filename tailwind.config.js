/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a', // deep blue
        },
        saffron: {
          DEFAULT: '#ea580c', // restrained saffron
        },
        green: {
          DEFAULT: '#16a34a', // restrained green
        }
      }
    },
  },
  plugins: [],
}
