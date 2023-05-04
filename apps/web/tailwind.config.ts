import type { Config } from "tailwindcss";

import baseConfig from "@mecab-edge/tailwind-config";

export default {
  content: baseConfig.content,
  presets: [baseConfig],
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
