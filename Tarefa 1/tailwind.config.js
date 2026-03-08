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
                    primary: '#181b1f',
                    secondary: '#22262b',
                    accent: '#f97316',
                    background: '#181b1f',
                    surface: '#26292e',
                    border: '#353940',
                    text: '#f8fafc',
                    muted: '#94a3b8',
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
