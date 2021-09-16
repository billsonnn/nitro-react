module.exports = {
    'extends': [
      'react-app',
      'react-app/jest'
    ],
    'rules': {
      'linebreak-style': [
        'off'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'brace-style': [
        'error',
        'allman',
        {
          'allowSingleLine': true
        }
      ],
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'keyword-spacing': [
        'error',
        {
          'overrides': {
            'if': {
              'after': false
            },
            'for': {
              'after': false
            },
            'while': {
              'after': false
            },
            'switch': {
              'after': false
            }
          }
        }
      ],
      '@typescript-eslint/no-explicit-any': [
        'off'
      ],
      '@typescript-eslint/ban-ts-comment': [
        'off'
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          'allow': [
            'functions',
            'arrowFunctions',
            'generatorFunctions',
            'methods',
            'generatorMethods',
            'constructors'
          ]
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'off'
      ],
      '@typescript-eslint/ban-types': [
        'error',
        {
          'types': {
            'String': true,
            'Boolean': true,
            'Number': true,
            'Symbol': true,
            '{}': false,
            'Object': false,
            'object': false,
            'Function': false
          },
          'extendDefaults': true
        }
      ],
      'no-switch-case-fall-through': [
        'off'
      ]
    }
  }
