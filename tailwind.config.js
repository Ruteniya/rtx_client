;/ @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src//*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        secondaryDark: 'var(--colorSecondaryDark)',

        success: 'var(--colorSuccess)',
        warning: 'var(--colorWarning)',
        error: 'var(--colorError)',
        textBase: 'var(--colorTextBase)',
        border: 'var(--colorBorder)',
        grayText: 'var(--grayText)'
      }
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  plugins: []
}
