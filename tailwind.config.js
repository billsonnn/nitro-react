/** @type {import('tailwindcss').Config} */

const colors = {
    'toolbar': 'rgba(28, 28, 32, .95)'
};

const boxShadow = {
};

module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: [ 'Ubuntu', 'sans-serif' ],
            },
            colors,
            boxShadow,
            height: {
                'toolbar': '55px'
            },
            zIndex: {
                'toolbar': ''
            }
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require('@headlessui/tailwindcss')({ prefix: 'ui' })
    ],
    content: [
        './index.html',
        './src/**/*.{html,js,jsx,ts,tsx}'
    ]
}
