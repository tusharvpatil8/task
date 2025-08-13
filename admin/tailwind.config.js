const flattenColorPalette =
  require("tailwindcss/lib/util/flattenColorPalette").default;
const safeListFile = "safelist.txt";
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./safelist.txt",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "576",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "#-primary": "#003A7b",
        "icon-color": "#003A7b",
      },
    },
  },
  plugins: [
    ({ addUtilities, e, theme, variants }) => {
      const colors = flattenColorPalette(theme("borderColor"));
      delete colors["default"];

      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-${color}`]: { borderTopColor: colors[color] },
        [`.border-r-${color}`]: { borderRightColor: colors[color] },
        [`.border-b-${color}`]: { borderBottomColor: colors[color] },
        [`.border-l-${color}`]: { borderLeftColor: colors[color] },
      }));
      const utilities = Object.assign({}, ...colorMap);

      addUtilities(utilities, variants("borderColor"));
    },
    // If your application does not require multiple theme selection,
    // you can replace {color} to your theme color value
    // this can drastically reduces the size of the output css file
    // e.g 'text-{colors}' --> 'text-emerald'
    require("tailwind-safelist-generator")({
      path: safeListFile,
      patterns: [
        "text-{colors}",
        "bg-{colors}",
        "dark:bg-{colors}",
        "dark:hover:bg-{colors}",
        "dark:active:bg-{colors}",
        "hover:text-{colors}",
        "hover:bg-{colors}",
        "active:bg-{colors}",
        "ring-{colors}",
        "hover:ring-{colors}",
        "focus:ring-{colors}",
        "focus-within:ring-{colors}",
        "border-{colors}",
        "focus:border-{colors}",
        "focus-within:border-{colors}",
        "dark:text-{colors}",
        "dark:hover:text-{colors}",
        "h-{height}",
        "w-{width}",
      ],
    }),
  ],
};
