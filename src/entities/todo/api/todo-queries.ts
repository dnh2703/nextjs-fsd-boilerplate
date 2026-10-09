import { desc } from "drizzle-orm";

import { getDb } from "@/shared/db/index.server";

import { type Todo, todos } from "../model/todo.schema";

/** All todos, newest first. */
export async function listTodos(): Promise<Todo[]> {
  return getDb().select().from(todos).orderBy(desc(todos.createdAt), desc(todos.id));
}

export async function insertTodo(title: string): Promise<Todo> {
  const [todo] = await getDb().insert(todos).values({ title }).returning();
  return todo;
}
