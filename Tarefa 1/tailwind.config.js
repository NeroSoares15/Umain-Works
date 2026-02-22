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
                    primary: '#0f172a', // Slate 900 - Deep Navy
                    secondary: '#334155', // Slate 700
                    accent: '#2563eb', // Blue 600
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
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
