import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

// Add app-wide providers (theme, query client, ...) here as the app grows.
function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

export { screen, within } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
