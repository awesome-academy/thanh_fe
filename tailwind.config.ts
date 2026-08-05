import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        navy: {
          950: "rgb(var(--navy-950) / <alpha-value>)",
          900: "rgb(var(--navy-900) / <alpha-value>)",
          800: "rgb(var(--navy-800) / <alpha-value>)",
          700: "rgb(var(--navy-700) / <alpha-value>)",
        },
        cacao: {
          900: "rgb(var(--cacao-900) / <alpha-value>)",
          800: "rgb(var(--cacao-800) / <alpha-value>)",
          700: "rgb(var(--cacao-700) / <alpha-value>)",
          600: "rgb(var(--cacao-600) / <alpha-value>)",
          500: "rgb(var(--cacao-500) / <alpha-value>)",
          400: "rgb(var(--cacao-400) / <alpha-value>)",
          300: "rgb(var(--cacao-300) / <alpha-value>)",
          200: "rgb(var(--cacao-200) / <alpha-value>)",
          100: "rgb(var(--cacao-100) / <alpha-value>)",
          50: "rgb(var(--cacao-50) / <alpha-value>)",
        },
        surface: {
          page: "rgb(var(--surface-page) / <alpha-value>)",
          card: "rgb(var(--surface-card) / <alpha-value>)",
        },
        borderSubtle: "rgb(var(--border-subtle) / <alpha-value>)",
        textStrong: "rgb(var(--text-strong) / <alpha-value>)",
        textBody: "rgb(var(--text-body) / <alpha-value>)",
        textMuted: "rgb(var(--text-muted) / <alpha-value>)",
        textSubtle: "rgb(var(--text-subtle) / <alpha-value>)",
        star: "rgb(var(--status-star) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
