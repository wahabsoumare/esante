// Tailwind config avec la palette fournie (pas de dégradés)
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#023336', // très foncé
          600: '#4DA674', // primaire
          300: '#C1E68A', // accent clair
          50:  '#EAF8E7', // fond très clair
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 51, 54, 0.08)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}
