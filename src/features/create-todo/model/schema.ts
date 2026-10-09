import { z } from "zod";

export const TITLE_MAX_LENGTH = 200;

export const createTodoSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
});

/** Result of the createTodo server action; `null` before the first submit. */
export type CreateTodoState = { ok: true } | { ok: false; error: string } | null;
