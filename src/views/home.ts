import type { KnownBlock } from '@slack/web-api';
import { State, Task } from '../state';

// Генерирует кнопки-действия для каждой задачи в зависимости от её колонки
function taskButtons(task: Task, column: 'todo' | 'in_progress' | 'done'): KnownBlock {
  const buttons: KnownBlock = {
    type: 'actions',
    elements: [],
  };

  const els = buttons.elements as object[];

  if (column === 'todo') {
    els.push({
      type: 'button',
      text: { type: 'plain_text', text: '▶ In Progress' },
      action_id: `move_in_progress_${task.id}`,
      style: 'primary',
    });
  }

  if (column === 'in_progress') {
    els.push(
      {
        type: 'button',
        text: { type: 'plain_text', text: '✅ Done' },
        action_id: `move_done_${task.id}`,
        style: 'primary',
      },
      {
        type: 'button',
        text: { type: 'plain_text', text: '↩ ToDo' },
        action_id: `move_todo_${task.id}`,
      }
    );
  }

  if (column === 'done') {
    els.push({
      type: 'button',
      text: { type: 'plain_text', text: '↩ In Progress' },
      action_id: `move_in_progress_${task.id}`,
    });
  }

  els.push({
    type: 'button',
    text: { type: 'plain_text', text: '🗑 Delete' },
    action_id: `delete_task_${task.id}`,
    style: 'danger',
    confirm: {
      title: { type: 'plain_text', text: 'Удалить задачу?' },
      text: { type: 'mrkdwn', text: `*${task.description}* будет удалена.` },
      confirm: { type: 'plain_text', text: 'Да' },
      deny: { type: 'plain_text', text: 'Отмена' },
    },
  });

  return buttons;
}

// Рендерит список задач одной колонки
function renderColumn(
  title: string,
  tasks: Task[],
  column: 'todo' | 'in_progress' | 'done'
): KnownBlock[] {
  const blocks: KnownBlock[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: title },
    },
  ];

  if (tasks.length === 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '_Нет задач_' },
    });
  } else {
    for (const task of tasks) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `• ${task.description}` },
      });
      blocks.push(taskButtons(task, column));
    }
  }

  blocks.push({ type: 'divider' });
  return blocks;
}

// Главная функция — возвращает полный массив блоков для Home Tab
export function createHomeBlocks(state: State): KnownBlock[] {
  return [
    ...renderColumn('📋  ToDo', state.todo, 'todo'),
    ...renderColumn('⚙️  In Progress', state.in_progress, 'in_progress'),
    ...renderColumn('✅  Done', state.done, 'done'),
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '➕ Добавить задачу' },
          action_id: 'open_add_task_modal',
          style: 'primary',
        },
      ],
    },
  ];
}
