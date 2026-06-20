import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

register(StyleDictionary);

const themes = [
  {
    name: "light",
    source: ["core", "light", "theme"],
    outputFile: "build/css/light.css",
    selector: ":root",
  },
  {
    name: "dark",
    source: ["core", "dark", "theme"],
    outputFile: "build/css/dark.css",
    selector: '[data-theme="dark"]',
  },
];

for (const theme of themes) {
  const sd = new StyleDictionary({
    source: theme.source.map((set) => `tokens/${set}.json`),
    preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        transformGroup: "tokens-studio",
        prefix: "fl",
        buildPath: "",
        files: [
          {
            destination: theme.outputFile,
            format: "css/variables",
            options: {
              selector: theme.selector,
              outputReferences: false,
            },
          },
        ],
      },
    },
    log: {
      verbosity: "silent",
    },
  });

  await sd.buildAllPlatforms();
}

console.log("\n✅ Built CSS variables for all themes.");
