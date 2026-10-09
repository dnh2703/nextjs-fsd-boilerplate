import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  { ignores: ["**/*.{test,spec}.{ts,tsx}", "./src/shared/lib/test/**"] },
  {
    // The example slices are deliberately tiny and each is used only once.
    // Delete this block together with the examples.
    files: [
      "./src/entities/todo/**",
      "./src/features/create-todo/**",
      "./src/widgets/todo-list/**",
    ],
    rules: { "fsd/insignificant-slice": "off" },
  },
]);
