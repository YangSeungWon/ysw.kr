const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false,
        container: false,
    },
    darkMode: ['class', '[data-theme="dark"]'],
    content: ["./src/**/*.{js,jsx,ts,tsx,md,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', ...fontFamily.sans],
                jakarta: ['"Plus Jakarta Sans"', ...fontFamily.sans],
                mono: ['"Fira Code"', ...fontFamily.mono],
            },
            borderRadius: {
                sm: "4px",
                md: "6px",
                lg: "8px",
                xl: "12px",
            },
            screens: {
                sm: "0px",
                lg: "997px",
            },
            colors: {
                primary: {
                    DEFAULT: 'var(--ifm-color-primary)',
                    dark: 'var(--ifm-color-primary-dark)',
                    darker: 'var(--ifm-color-primary-darker)',
                    darkest: 'var(--ifm-color-primary-darkest)',
                    light: 'var(--ifm-color-primary-light)',
                    lighter: 'var(--ifm-color-primary-lighter)',
                    lightest: 'var(--ifm-color-primary-lightest)',
                },
                background: 'var(--ifm-background-color)',
                'background-surface': 'var(--ifm-background-surface-color)',
                'font': 'var(--ifm-font-color-base)',
                'font-secondary': 'var(--ifm-font-color-secondary)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '120': '30rem',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};