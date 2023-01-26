const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "src/pages/**/*.{ts,tsx,js,jsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      // work sans
      wsans: ["Work Sans", "sans-serif"],
    },
    extend: {
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite",
        shake: "shake 1s cubic-bezier(.36,.07,.19,.97) infinite",
        gradient: "gradient 1s linear infinite",
        "gradient-medium": "gradient 2s linear infinite",
        "gradient-slow": "gradient 3s linear infinite",
        "bounce-mini": "bounce-mini 8s ease-in-out infinite",
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
        "bounce-mini": {
          "0%, 100%": {
            transform: "translateY(0px)",
            // 'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          "50%": {
            transform: "translateY(15px)",
            // 'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
        gradient: {
          from: {
            "background-size": "200%",
          },
          to: {
            "background-position": "200% center",
            "background-size": "200%",
          },
        },
      },
      colors: {
        gray: {
          ...colors.slate,
          150: `rgb(233, 238, 244)`,
          250: `rgb(214, 222, 232)`,
          350: `rgb(175, 188, 204)`,
          450: `rgb(124, 139, 161)`,
          550: `rgb(85, 100, 122)`,
          650: `rgb(61, 75, 95)`,
          750: `rgb(40, 53, 72)`,
          850: `rgb(22, 32, 50)`,
          950: `rgb(7, 11, 21)`,
        },
      },
    },
    screens: {
      inf: { max: "99999999px" },
      //  => @media (max-width: 99999999px) { ... } Literally so i can use a form of !important

      "4xl": { max: "4096px" },
      // => @media (max-width: 4096px) { ... } Wtf is this...
      "3.5xl": { max: "3096px" },

      "3xl": { max: "2048px" },
      // => @media (max-width: 2048px) { ... }

      "2.5xl": { max: "1920px" },
      // => @media (max-width: 1920px) { ... }

      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
      xs: { max: "389px" },
      // => @media (max-width: 389px) { ... }
    },
  },
  variants: {},
  plugins: [],
};

/*
text-slate-50	color: rgb(248 250 252);
Aa
text-slate-100	color: rgb(241 245 249);
Aa
text-slate-200	color: rgb(226 232 240);
Aa
text-slate-300	color: rgb(203 213 225);
Aa
text-slate-400	color: rgb(148 163 184);
Aa
text-slate-500	color: rgb(100 116 139);
Aa
text-slate-600	color: rgb(71 85 105);
Aa
text-slate-700	color: rgb(51 65 85);
Aa
text-slate-800	color: rgb(30 41 59);
Aa
text-slate-900	color: rgb(15 23 42);

generate colors inbetween using average of 2 colors

text-slate-150 is the average of 100 and 200 r: (241+226)/2 = 233.5 g: (245+232)/2 = 238.5 b: (249+240)/2 = 244.5 = rgb(233, 238, 244)
text-slate-250 is the average of 200 and 300 r: (226+203)/2 = 214.5 g: (232+213)/2 = 222.5 b: (240+225)/2 = 232.5 = rgb(214, 222, 232)
text-slate-350 is the average of 300 and 400 r: (203+148)/2 = 175.5 g: (213+163)/2 = 188 b: (225+184)/2 = 204.5 = rgb(175, 188, 204)
text-slate-450 is the average of 400 and 500 r: (148+100)/2 = 124 g: (163+116)/2 = 139.5 b: (184+139)/2 = 161.5 = rgb(124, 139, 161)
text-slate-550 is the average of 500 and 600 r: (100+71)/2 = 85.5 g: (116+85)/2 = 100.5 b: (139+105)/2 = 122 = rgb(85, 100, 122)
text-slate-650 is the average of 600 and 700 r: (71+51)/2 = 61 g: (85+65)/2 = 75 b: (105+85)/2 = 95 = rgb(61, 75, 95)
text-slate-750 is the average of 700 and 800 r: (51+30)/2 = 40.5 g: (65+41)/2 = 53 b: (85+59)/2 = 72 = rgb(40, 53, 72)
text-slate-850 is the average of 800 and 900 r: (30+15)/2 = 22.5 g: (41+23)/2 = 32 b: (59+42)/2 = 50.5 = rgb(22, 32, 50)
text-slate-950 is the average of 900 and 1000 r: (15+0)/2 = 7.5 g: (23+0)/2 = 11.5 b: (42+0)/2 = 21 = rgb(7, 11, 21)

150: `rgb(233, 238, 244)`,
250: `rgb(214, 222, 232)`,
350: `rgb(175, 188, 204)`,
450: `rgb(124, 139, 161)`,
550: `rgb(85, 100, 122)`,
650: `rgb(61, 75, 95)`,
750: `rgb(40, 53, 72)`,
850: `rgb(22, 32, 50)`,
950: `rgb(7, 11, 21)`,

*/
