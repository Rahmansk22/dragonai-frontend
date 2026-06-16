/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		colors: {
  			zinc: {
  				'950': '#0b0b0c'
  			},
  			background: 'hsl(var(--background))',
  			text: {
  				primary: '#ECECF1',
  				secondary: '#C5C5D2',
  				placeholder: '#8E8EA0'
  			},
  			message: {
  				assistant: '#444654',
  				user: '#2A2B32'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				blue: '#3B82F6',
  				indigo: '#6366F1',
  				emerald: '#10B981',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			userbubble: '#444654',
  			assistantbubble: '#444654',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			soft: '0 10px 30px rgba(0,0,0,0.18)',
  			glass: '0 4px 30px rgba(0,0,0,0.18)',
  			deep: '0 30px 80px rgba(0,0,0,0.30)'
  		},
  		backdropBlur: {
  			xl: '12px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require("tailwindcss-animate")]
};
