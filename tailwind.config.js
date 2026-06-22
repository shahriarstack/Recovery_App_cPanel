/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js,php}"],
  darkMode: 'class',
  theme: {
    extend: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        colors: {
            brand: {
                50: '#ecfdf5', // Soft Mint
                100: '#d1fae5', // Pale Green
                500: '#10b981', // Emerald (Primary)
                600: '#059669', // Darker Emerald
                800: '#065f46',
                900: '#064e3b',
            },
            dark: {
                bg: '#0f172a',
                card: '#1e293b',
                text: '#f1f5f9'
            }
        },
        animation: {
            blob: "blob 7s infinite",
        },
        keyframes: {
            blob: {
                "0%": { transform: "translate(0px, 0px) scale(1)" },
                "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                "100%": { transform: "translate(0px, 0px) scale(1)" },
            },
        },
    }
  },
  plugins: [],
}
