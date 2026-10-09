"use client";

import { useActionState } from "react";

import { createTodo } from "../api/create-todo.action";
import { TITLE_MAX_LENGTH } from "../model/schema";

export function CreateTodoForm() {
  const [state, formAction, isPending] = useActionState(createTodo, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <label htmlFor="todo-title" className="text-sm font-medium">
        Title
      </label>
      <div className="flex gap-2">
        <input
          id="todo-title"
          name="title"
          maxLength={TITLE_MAX_LENGTH}
          className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isPending ? "Adding…" : "Add"}
        </button>
      </div>
      {state && !state.ok ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
