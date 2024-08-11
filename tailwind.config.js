module.exports = {
  purge: ['./public/**/*.html', './src/**/*.js'], // Ensure all paths where you use Tailwind classes are included
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
