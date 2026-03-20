import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdf8',
          100: '#fff7ea',
          200: '#fdeed6'
        },
        choco: {
          500: '#6f3b27',
          600: '#5a2f1f',
          700: '#452418'
        },
        blush: {
          100: '#ffe7ec',
          200: '#ffcdd8',
          500: '#f27792'
        }
      },
      boxShadow: {
        pastry: '0 20px 50px -30px rgba(111, 59, 39, 0.65)'
      },
      backgroundImage: {
        sprinkles:
          'radial-gradient(circle at 18% 22%, rgba(242,119,146,0.16) 0 10px, transparent 11px), radial-gradient(circle at 75% 65%, rgba(111,59,39,0.12) 0 14px, transparent 15px)'
      }
    }
  },
  plugins: []
};

export default config;
