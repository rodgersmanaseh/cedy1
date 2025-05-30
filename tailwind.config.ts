import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config = {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}', // 👈 Add correct path
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // You can define more variables as needed
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
} satisfies Config;

export default config;
