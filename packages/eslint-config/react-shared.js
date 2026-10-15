import pluginReactHooks from "eslint-plugin-react-hooks"

export const reactHooksConfig = {
  plugins: {
    "react-hooks": pluginReactHooks,
  },
  settings: { react: { version: "detect" } },
  rules: {
    ...pluginReactHooks.configs.recommended.rules,
    // React scope no longer necessary with new JSX transform.
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
}
