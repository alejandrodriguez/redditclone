/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            borderWidth: {
                1: "1px"
            },
            screens: {
                480: "480px"
            }
        }
    },
    plugins: []
};
