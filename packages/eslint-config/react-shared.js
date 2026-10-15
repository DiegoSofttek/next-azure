import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"

export function createReactHookConfig() {
  return {
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
}

export function createReactRecommendedConfig(languageOptions) {
  return {
    ...pluginReact.configs.flat.recommended,
    ...(languageOptions ? { languageOptions } : {}),
  }
}
