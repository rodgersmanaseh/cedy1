/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
