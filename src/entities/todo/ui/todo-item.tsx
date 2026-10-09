import type { Todo } from "../model/todo.schema";

export function TodoItem({ todo }: { todo: Pick<Todo, "title"> }) {
  return (
    <li className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800">{todo.title}</li>
  );
}
