/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                umain: {
                    primary: '#C15B38',
                    secondary: '#f4eee3',
                    accent: '#C15B38',
                    background: '#FCFCF7',
                    surface: '#ffffff',
                    border: '#e5e7eb',
                    text: '#111827',
                    muted: '#6b7280',
                },
                risk: {
                    low: '#10b981', // Emerald 500
                    medium: '#f59e0b', // Amber 500
                    high: '#ef4444', // Red 500
                }
            },
            fontFamily: {
                sans: ['Manrope', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
