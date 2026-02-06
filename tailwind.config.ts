import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ImmoJuste — Navy 95% + Green 5%
        brand: {
          primary: "#5AAE85",         // Green accent (5%)
          "primary-dark": "#4A9E75",
          "primary-light": "#6ABE95",
          secondary: "#2B3A5A",       // Navy (dark sections)
          "secondary-dark": "#1E2D4D",
          "secondary-light": "#3B4A6A",
          accent: "#5AAE85",
          dark: "#2B3A5A",            // Navy (text, 95%)
          gray: "#6B7280",
          "gray-light": "#D1D5DB",
          background: "#F5F6F8",
          "background-warm": "#F0F4F2",
        },
        success: "#5AAE85",
        warning: "#F59E0B",
        error: "#DC2626",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: [
          "Cereal",
          "Circular",
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "display-lg": ["3.5rem", { lineHeight: "1.15", fontWeight: "800" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "display-sm": ["2rem", { lineHeight: "1.25", fontWeight: "700" }],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        "card": "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
        "card-hover": "0 2px 4px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12)",
        "card-elevated": "0 6px 20px rgba(0,0,0,0.15)",
        "button": "0 2px 8px rgba(90,174,133,0.3)",
        "button-hover": "0 4px 14px rgba(90,174,133,0.4)",
        "modal": "0 8px 28px rgba(0,0,0,0.28)",
        "nav": "0 2px 12px rgba(0,0,0,0.08)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #5AAE85, #4A9E75)",
        "gradient-primary-hover": "linear-gradient(to right, #4A9E75, #3A8E65)",
        "gradient-hero": "linear-gradient(135deg, #2B3A5A 0%, #1E2D4D 50%, #162040 100%)",
        "gradient-warm": "linear-gradient(180deg, #F0F4F2 0%, #FFFFFF 100%)",
        "gradient-card": "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        "gradient-dark": "linear-gradient(180deg, #2B3A5A 0%, #1E2D4D 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "fade-in-down": "fadeInDown 0.4s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
