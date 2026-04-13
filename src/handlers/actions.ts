import { App } from '@slack/bolt';
import { deleteTask, moveTask, addTask, ColumnName } from '../state';
import { updateHomeView } from './events';

export function registerActionHandlers(app: App): void {
  // Удаление задачи: action_id вида "delete_task_<id>"
  app.action(/^delete_task_(.+)$/, async ({ ack, action, body, logger }) => {
    await ack(); // обязательно в течение 3 секунд

    const actionId = (action as { action_id: string }).action_id;
    const id = actionId.replace('delete_task_', '');
    deleteTask(id);

    try {
      await updateHomeView(app, body.user.id);
    } catch (err) {
      logger.error(err);
    }
  });

  // Перемещение задачи: action_id вида "move_<column>_<id>"
  app.action(/^move_(todo|in_progress|done)_(.+)$/, async ({ ack, action, body, logger }) => {
    await ack();

    const actionId = (action as { action_id: string }).action_id;
    // Разбираем: move_in_progress_1234 → column=in_progress, id=1234
    const match = actionId.match(/^move_(todo|in_progress|done)_(.+)$/);
    if (!match) return;

    const [, column, id] = match;
    moveTask(id, column as ColumnName);

    try {
      await updateHomeView(app, body.user.id);
    } catch (err) {
      logger.error(err);
    }
  });

  // Открытие модального окна добавления задачи
  app.action('open_add_task_modal', async ({ ack, body, client, logger }) => {
    await ack();

    try {
      await client.views.open({
        trigger_id: (body as { trigger_id: string }).trigger_id,
        view: {
          type: 'modal',
          callback_id: 'add_task_modal',
          title: { type: 'plain_text', text: 'Новая задача' },
          submit: { type: 'plain_text', text: 'Добавить' },
          close: { type: 'plain_text', text: 'Отмена' },
          blocks: [
            {
              type: 'input',
              block_id: 'task_input_block',
              label: { type: 'plain_text', text: 'Описание задачи' },
              hint: { type: 'plain_text', text: 'Поддерживается Markdown: *жирный*, _курсив_, ~зачёркнутый~, `код`, ссылки <https://example.com|текст>' },
              element: {
                type: 'plain_text_input',
                action_id: 'task_description',
                placeholder: { type: 'plain_text', text: 'Что нужно сделать?' },
                multiline: true,
              },
            },
          ],
        },
      });
    } catch (err) {
      logger.error(err);
    }
  });

  // Обработка отправки формы модального окна
  app.view('add_task_modal', async ({ ack, view, body, logger }) => {
    await ack();

    const description =
      view.state.values['task_input_block']['task_description'].value ?? '';

    if (description.trim()) {
      addTask(description.trim());
    }

    try {
      await updateHomeView(app, body.user.id);
    } catch (err) {
      logger.error(err);
    }
  });
}
