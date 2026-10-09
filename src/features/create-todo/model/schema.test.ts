import { describe, expect, it } from "vitest";

import { createTodoSchema, TITLE_MAX_LENGTH } from "./schema";

function firstError(input: unknown): string | undefined {
  const result = createTodoSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("createTodoSchema", () => {
  it("accepts a title and trims surrounding whitespace", () => {
    expect(createTodoSchema.parse({ title: "  Buy milk  " })).toEqual({ title: "Buy milk" });
  });

  it("rejects an empty title", () => {
    expect(firstError({ title: "" })).toBe("Title is required");
  });

  it("rejects a whitespace-only title", () => {
    expect(firstError({ title: "   " })).toBe("Title is required");
  });

  it("rejects a missing title field (FormData.get returns null)", () => {
    expect(firstError({ title: null })).toBe("Title is required");
  });

  it(`accepts a title of exactly ${TITLE_MAX_LENGTH} characters`, () => {
    expect(firstError({ title: "a".repeat(TITLE_MAX_LENGTH) })).toBeUndefined();
  });

  it(`rejects a title longer than ${TITLE_MAX_LENGTH} characters`, () => {
    expect(firstError({ title: "a".repeat(TITLE_MAX_LENGTH + 1) })).toBe(
      `Title must be at most ${TITLE_MAX_LENGTH} characters`,
    );
  });
});
