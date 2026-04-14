export interface Task {
  id: string;
  description: string;
}

export type ColumnName = 'todo' | 'in_progress' | 'done';

export interface State {
  todo: Task[];
  in_progress: Task[];
  done: Task[];
}

// Single source of truth — stored in process memory
export const state: State = {
  todo: [
    { id: '1', description: 'Настроить Slack App на portal.slack.com' },
    { id: '2', description: 'Изучить Block Kit Builder' },
  ],
  in_progress: [],
  done: [],
};

export function addTask(description: string): void {
  state.todo.push({ id: String(Date.now()), description });
}

export function deleteTask(id: string): void {
  for (const col of Object.keys(state) as ColumnName[]) {
    state[col] = state[col].filter((t) => t.id !== id);
  }
}

export function moveTask(id: string, to: ColumnName): void {
  let task: Task | undefined;

  for (const col of Object.keys(state) as ColumnName[]) {
    const idx = state[col].findIndex((t) => t.id === id);
    if (idx !== -1) {
      [task] = state[col].splice(idx, 1);
      break;
    }
  }

  if (task) {
    state[to].push(task);
  }
}
