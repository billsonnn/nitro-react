/** @type {import('tailwindcss').Config} */

const { generateShades } = require('./css-utils/CSSColorUtils');

const colors = {
    'toolbar': '#555555',
};

const boxShadow = {
    'inner1px': 'inset 0 0 0 1px rgba(255,255,255,.3)'
};


module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: [ 'Ubuntu', 'sans-serif' ],
            },
            colors: generateShades(colors),
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
