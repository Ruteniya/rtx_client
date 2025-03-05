;/ @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src//*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        success: 'var(--colorSuccess)',
        warning: 'var(--colorWarning)',
        error: 'var(--colorError)',
        textBase: 'var(--colorTextBase)',
        border: 'var(--colorBorder)',
        grayText: 'var(--grayText)'
      }
    }
  },
  plugins: []
}
