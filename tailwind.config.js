/** @type {import('tailwindcss').Config} */

const { generateShades } = require('./css-utils/CSSColorUtils');

const colors = {
    'toolbar': '#555555',
    'card-header': '#1E7295',
    'card-close': '#921911',
    'card-tabs': '#185D79',
    'card-border': '#283F5D',
    'card-tab-item': '#B6BEC5',
    'card-tab-item-active': '#DFDFDF',
    'card-content-area': '#DFDFDF',
    'card-grid-item': '#CDD3D9',
    'card-grid-item-active': '#ECECEC',
    'card-grid-item-border': '#B6BEC5',
    'card-grid-item-border-active': '#FFFFFF',
    'loading': '#393A85'
};

const boxShadow = {
    'inner1px': 'inset 0 0 0 1px rgba(255,255,255,.3)',
    'room-previewer': '-2px -2px rgba(0, 0, 0, 0.4), inset 3px 3px rgba(0, 0, 0, 0.2);'
};


module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: [ 'Ubuntu', 'sans-serif' ],
            },
            colors: generateShades(colors),
            boxShadow,
            backgroundImage: {
                'button-gradient-gray': 'linear-gradient(to bottom, #e2e2e2 50%, #c8c8c8 50%)',
            },
            spacing: {
                'card-header': '33px',
                'card-tabs': '33px',
                'navigator-w': '420px',
                'navigator-h': '440px',
                'inventory-w': '528px',
                'inventory-h': '320px'
            },
            zIndex: {
                'toolbar': '',
                'loading': '100',
                'chat-zindex': '20'
            },
        },
    },
    safelist: [
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-4',
        'grid-cols-5',
        'grid-cols-6',
        'grid-cols-7',
        'grid-cols-8',
        'grid-cols-9',
        'grid-cols-10',
        'grid-cols-11',
        'grid-cols-12'
    ],
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
