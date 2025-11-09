/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			primary: '#10B981',
  			secondary: '#6EE7B7',
  			accent: '#2DD4BF',
  			emerald: {
  				'50': '#ECFDF5',
  				'100': '#D1FAE5',
  				'200': '#A7F3D0',
  				'300': '#6EE7B7',
  				'400': '#34D399',
  				'500': '#10B981',
  				'600': '#059669',
  				'700': '#047857',
  				'800': '#065F46',
  				'900': '#064E3B',
  				'950': '#022C22'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Varela Round',
  				'system-ui',
  				'sans-serif'
  			],
  			serif: [
  				'Varela Round',
  				'Georgia',
  				'serif'
  			]
  		},
  		borderRadius: {
  			lg: '0.75rem',
  			xl: '1rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'spin-reverse': {
  				from: {
  					transform: 'rotate(360deg)'
  				},
  				to: {
  					transform: 'rotate(0deg)'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'spin-reverse': 'spin-reverse 1.5s linear infinite',
  			'shimmer': 'shimmer 2s ease-in-out infinite'
  		}
  	}
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
