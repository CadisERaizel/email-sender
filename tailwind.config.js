const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}",
  "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
],  
  theme: {
    backgroundSize: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain',
      'button': '200% 100%'
    },
    extend: {
      'keyframes':{
        'animation':{
          'button-fill': 'button-fill 2s ease-out'
        },
        'button-fill':{
          '0%':{
            'background-position': 'right bottom'
          },
          '100%':{
            'background-position': 'left bottom'
          }
        }
      }
    },
  },
  plugins: [],
});
