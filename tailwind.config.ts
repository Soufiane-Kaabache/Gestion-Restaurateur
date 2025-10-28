import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Couleurs système (shadcn/ui)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        // 🍽️ COULEURS RESTAURANT (ajoutées)
        restaurant: {
          // Couleurs de marque
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },

          // Statuts de réservation
          status: {
            pending: '#fbbf24', // Jaune - En attente
            confirmed: '#10b981', // Vert - Confirmée
            seated: '#3b82f6', // Bleu - Installés
            completed: '#6b7280', // Gris - Terminée
            cancelled: '#ef4444', // Rouge - Annulée
            noshow: '#9ca3af', // Gris clair - Absent
          },

          // Rôles du personnel
          role: {
            manager: '#8b5cf6', // Violet - Gérant
            waiter: '#3b82f6', // Bleu - Serveur
            bartender: '#ec4899', // Rose - Barman
            kitchen: '#f97316', // Orange - Cuisine
          },
        },
      },

      // 📏 Espacements personnalisés
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // 🎭 Animations personnalisées
      keyframes: {
        // Notification slide-in
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },

        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },

        // Pulse subtil pour alertes
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },

        // Shake pour erreurs
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },

        // Bounce doux pour succès
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },

        // Glow pour éléments actifs
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px hsl(var(--primary))' },
          '50%': { boxShadow: '0 0 20px hsl(var(--primary))' },
        },
      },

      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        'bounce-soft': 'bounce-soft 0.6s ease-in-out',
        glow: 'glow 2s ease-in-out infinite',
      },

      // 📐 Border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },

      // 🖼️ Box shadows personnalisées
      boxShadow: {
        'inner-lg': 'inset 0 2px 8px 0 rgb(0 0 0 / 0.1)',
        'glow-sm': '0 0 10px hsl(var(--primary) / 0.5)',
        'glow-md': '0 0 20px hsl(var(--primary) / 0.5)',
        'glow-lg': '0 0 30px hsl(var(--primary) / 0.5)',
      },

      // 🔤 Typographie
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },

      // 📊 Z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // 🎯 Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // 🌈 Gradients personnalisés
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-restaurant':
          'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
      },

      // ⏱️ Transitions
      transitionDuration: {
        '2000': '2000ms',
      },

      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,

    // 🎨 Plugin personnalisé pour les utilitaires restaurant
    function ({ addUtilities }: any) {
      addUtilities({
        // Glassmorphism
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },

        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },

        // Scrollbar personnalisé
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'hsl(var(--muted))',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--primary))',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'hsl(var(--primary) / 0.8)',
          },
        },

        // Status badges
        '.badge-pending': {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fbbf24',
        },

        '.badge-confirmed': {
          backgroundColor: '#d1fae5',
          color: '#065f46',
          border: '1px solid #10b981',
        },

        '.badge-cancelled': {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #ef4444',
        },
      });
    },
  ],
};

export default config;
