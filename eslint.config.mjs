import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default config;
