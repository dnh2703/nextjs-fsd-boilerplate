"use server";

import { revalidatePath } from "next/cache";

import { insertTodo } from "@/entities/todo/index.server";

import { type CreateTodoState, createTodoSchema } from "../model/schema";

export async function createTodo(
  _prev: CreateTodoState,
  formData: FormData,
): Promise<CreateTodoState> {
  const parsed = createTodoSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await insertTodo(parsed.data.title);
  } catch (error) {
    console.error("createTodo failed", error);
    return { ok: false, error: "Could not save the todo. Please try again." };
  }

  revalidatePath("/");
  return { ok: true };
}
