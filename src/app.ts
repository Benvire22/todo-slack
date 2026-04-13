import 'dotenv/config';
import { App } from '@slack/bolt';
import { registerEventHandlers } from './handlers/events';
import { registerActionHandlers } from './handlers/actions';

// Socket Mode позволяет работать без публичного URL (удобно для разработки)
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

registerEventHandlers(app);
registerActionHandlers(app);

(async () => {
  const port = Number(process.env.PORT) || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app запущен на порту ${port}`);
})();
