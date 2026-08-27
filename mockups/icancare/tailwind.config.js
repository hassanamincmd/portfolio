/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#2563EB',
          deep: '#1D4ED8',
          soft: '#EFF6FF',
          mist: '#DBEAFE',
        },
        sky: '#0EA5E9',
        ink: '#0F172A',
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
