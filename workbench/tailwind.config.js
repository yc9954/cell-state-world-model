/**
 * Design tokens borrowed from the ICML-SAIL web UI, which ports them from
 * Open Science Desktop (MIT, ai4s-research/open-science). Kept in sync so the
 * demo reads as the same product family.
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "color-mix(in srgb, var(--bg) calc(<alpha-value> * 100%), transparent)",
        surface: "color-mix(in srgb, var(--surface) calc(<alpha-value> * 100%), transparent)",
        "surface-2": "color-mix(in srgb, var(--surface-2) calc(<alpha-value> * 100%), transparent)",
        border: "color-mix(in srgb, var(--border) calc(<alpha-value> * 100%), transparent)",
        faint: "color-mix(in srgb, var(--border-faint) calc(<alpha-value> * 100%), transparent)",
        text: "color-mix(in srgb, var(--text) calc(<alpha-value> * 100%), transparent)",
        muted: "color-mix(in srgb, var(--muted) calc(<alpha-value> * 100%), transparent)",
        accent: "color-mix(in srgb, var(--accent) calc(<alpha-value> * 100%), transparent)",
        "accent-fg": "color-mix(in srgb, var(--accent-fg) calc(<alpha-value> * 100%), transparent)",
        link: "color-mix(in srgb, var(--link) calc(<alpha-value> * 100%), transparent)",
        warn: "color-mix(in srgb, var(--warn) calc(<alpha-value> * 100%), transparent)",
        ok: "color-mix(in srgb, var(--ok) calc(<alpha-value> * 100%), transparent)",
        error: "color-mix(in srgb, var(--error) calc(<alpha-value> * 100%), transparent)",
        "series-1": "var(--series-1)",
        "series-2": "var(--series-2)",
        "series-3": "var(--series-3)",
        "series-4": "var(--series-4)",
        "series-5": "var(--series-5)",
        "series-6": "var(--series-6)",
      },
      fontFamily: {
        serif: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "3px",
        input: "2px",
      },
      boxShadow: {
        card: "none",
        pop: "0 4px 14px rgba(10, 20, 30, 0.18)",
      },
    },
  },
  plugins: [],
};
