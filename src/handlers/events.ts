import { App } from '@slack/bolt';
import { state } from '../state';
import { createHomeBlocks } from '../views/home';

// Переиспользуемая функция публикации/обновления Home Tab
export async function updateHomeView(app: App, userId: string): Promise<void> {
  await app.client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      blocks: createHomeBlocks(state),
    },
  });
}

export function registerEventHandlers(app: App): void {
  // Срабатывает, когда пользователь открывает вкладку Home
  app.event('app_home_opened', async ({ event, logger }) => {
    try {
      await updateHomeView(app, event.user);
    } catch (err) {
      logger.error(err);
    }
  });
}
