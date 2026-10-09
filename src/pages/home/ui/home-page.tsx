import { Suspense } from "react";

import { TodoList } from "@/widgets/todo-list";

export function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-16">
      <h1 className="text-2xl font-semibold">Todos</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading todos…</p>}>
        <TodoList />
      </Suspense>
    </main>
  );
}
