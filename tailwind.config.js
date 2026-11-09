module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      // slate-950 ships with Tailwind 3.3+, this project is on an older 3.x.
      colors: { slate: { 950: "#020617" } },
    },
  },
  plugins: [],
};
