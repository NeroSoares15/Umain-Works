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
                    primary: '#020817', // Slate 950
                    secondary: '#0f172a', // Slate 900
                    accent: '#ea580c', // Orange 600 - Copper
                    background: '#020817', // Slate 950
                    surface: '#0f172a', // Slate 900
                    border: '#1e293b', // Slate 800
                    background: '#f8fafc', // Slate 50
                    surface: '#ffffff',
                    text: '#0f172a',
                    muted: '#64748b',
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
