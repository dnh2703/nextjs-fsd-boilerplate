import { describe, expect, it } from "vitest";

import { render, screen } from "@/shared/lib/test";

import { TodoItem } from "./todo-item";

describe("TodoItem", () => {
  it("renders the todo title as a list item", () => {
    render(
      <ul>
        <TodoItem todo={{ title: "Buy milk" }} />
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Buy milk");
  });

  it("renders HTML in a title as literal text", () => {
    const { container } = render(
      <ul>
        <TodoItem todo={{ title: "<img src=x onerror=alert(1)>" }} />
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("<img src=x onerror=alert(1)>");
    expect(container.querySelector("img")).toBeNull();
  });
});
