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
            },
            screens: {
                sm: "0px",
                lg: "997px",
            },
            colors: {
                primary: 'var(--ifm-color-primary)',
                'primary-dark': 'var(--ifm-color-primary-dark)',
                'primary-darker': 'var(--ifm-color-primary-darker)',
                'primary-darkest': 'var(--ifm-color-primary-darkest)',
                'primary-light': 'var(--ifm-color-primary-light)',
                'primary-lighter': 'var(--ifm-color-primary-lighter)',
                'primary-lightest': 'var(--ifm-color-primary-lightest)',
            },
        },
    },
    plugins: [],
};