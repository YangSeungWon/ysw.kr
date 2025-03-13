export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,md,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,md,mdx}",
        "./blog/**/*.{js,ts,jsx,tsx,md,mdx}",
        "./docs/**/*.{md,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
};
