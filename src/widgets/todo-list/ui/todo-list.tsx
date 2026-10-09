import { connection } from "next/server";

import { TodoItem } from "@/entities/todo";
import { listTodos } from "@/entities/todo/index.server";
import { CreateTodoForm } from "@/features/create-todo";

export async function TodoList() {
  // Render at request time: todos change on every write.
  await connection();
  const todos = await listTodos();

  return (
    <section className="flex w-full max-w-md flex-col gap-4">
      <CreateTodoForm />
      {todos.length === 0 ? (
        <p className="text-sm text-zinc-500">No todos yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </section>
  );
}
