module.exports = {
    theme: {
      extend: {
        colors: {
          emerald: {
            500: '#10b981',
            600: '#059669',
          },
          rose: {
            500: '#f43f5e',
            600: '#e11d48',
          }
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'], // Default font
            heading: ['Space Grotesk', 'sans-serif'],
            serif: ['"Libre Baskerville"', 'serif'],
 // Custom font class
          },
        rotate: {
          '15': '15deg',
          '180': '180deg',
        },
        transformStyle: {
          'preserve-3d': 'preserve-3d',
        },
        perspective: {
          '1000': '1000px',
        },
        backfaceVisibility: {
          hidden: 'hidden',
        }
      }
    }
  }