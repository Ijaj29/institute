/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1E2A44',
          50: '#F1F3F7',
          100: '#DBE0EA',
          400: '#57678A',
          600: '#2D3E63',
          700: '#1E2A44',
          900: '#131C30',
        },
        brass: {
          DEFAULT: '#C79A3D',
          100: '#F6ECD3',
          400: '#D4AE5C',
          600: '#B08329',
        },
        sage: {
          DEFAULT: '#3F8361',
          100: '#DCEEE2',
          600: '#2E6B4C',
        },
        paper: '#FAF7F0',
        parchment: '#F2EDE1',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ledger: '0 1px 0 0 rgba(30, 42, 68, 0.08)',
        card: '0 20px 60px -20px rgba(19, 28, 48, 0.35)',
      },
      backgroundImage: {
        'ledger-lines':
          'repeating-linear-gradient(180deg, transparent, transparent 27px, rgba(30,42,68,0.06) 28px)',
      },
    },
  },
  plugins: [],
};
