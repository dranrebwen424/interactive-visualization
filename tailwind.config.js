/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#111a2b',
        panelSoft: '#18253a',
        ink: '#f2f7ff',
        mute: '#a8bdd9',
        accent: '#35f2d1',
        warm: '#f9b46f',
        danger: '#ff5f7a'
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(0,0,0,.35)'
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif']
      }
    }
  },
  plugins: []
};
