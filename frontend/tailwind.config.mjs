/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/components/**/*.{js,ts,jsx,tsx}",
    "./app/dashboard/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand palette */
        white: "#ffffff",
        blue: "#3b82f6", // Tailwind blue-500 for accent
        darkBlue: "#1e3a8a", // Tailwind blue-900 for depth
        blueGrey: "#1e293b", // Tailwind slate-800-style shade
        black: "#000000",
        bgCosmic: "#000000",
        /* Accent gradient (blue ➜ deeper blue) */
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6", // blue-500
          600: "#2563eb", // blue-600
          700: "#1d4ed8", // blue-700
        },
        /* Purple shades for multi-color effects */
        purple: {
          400: "#c084fc", // Lighter purple
          500: "#a855f7", // Medium purple
          600: "#9333ea", // Deeper purple
          700: "#7e22ce", // Deepest purple
        },
        /* Cyan accent for tri-color gradient */
        cyan: {
          400: "#22d3ee", // Bright cyan
          500: "#06b6d4", // Standard cyan
        },
        /* Mid-gray used within gradients */
        gray: {
          850: "#1f2937", // custom via-gray-850
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #00ffff 0%, #3b82f6 50%, #8b5cf6 100%)",
        "gradient-halo": 
          "linear-gradient(60deg, #3b82f6, #c084fc, #22d3ee, #a855f7, #3b82f6)",
      },
      /* Animation removed */
      keyframes: {
        "halo-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        }
      },
      animation: {
        "halo-shift": "halo-shift 8s ease infinite",
      },
      backgroundSize: {
        "400%": "400%",
      },
    },
  },
  plugins: [],
};

export default config; 