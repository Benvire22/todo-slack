# Slack Task Board

A personal kanban board inside the Slack Home tab. A pet project for learning Slack API, Events API, and Block Kit.

## Features

- Three columns: **ToDo → In Progress → Done**
- Move tasks between columns with a single button click
- Delete tasks with a confirmation dialog
- Add tasks via a modal with Markdown support

## Tech Stack

- **Node.js** + **TypeScript**
- **Slack Bolt SDK** (`@slack/bolt`) — framework for Slack apps
- **Socket Mode** — no public URL required, great for local development
- **dotenv** — secrets management

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Benvire22/todo-slack.git
cd todo-slack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → **Create New App → From scratch**
2. Choose a name and select your workspace

#### Enable Socket Mode
- **Settings → Socket Mode** → toggle on → click **Generate Token**
- Copy the token (`xapp-...`) — this is your `SLACK_APP_TOKEN`

#### Configure Bot Permissions
- **Features → OAuth & Permissions → Scopes → Bot Token Scopes** → add:
  - `chat:write`
  - `users:read`

#### Subscribe to Events
- **Features → Event Subscriptions** → toggle on
- **Subscribe to bot events** → add `app_home_opened`

#### Enable the Home Tab
- **Features → App Home** → enable **Home Tab**

#### Install App to Workspace
- **Settings → Install App → Install to Workspace**
- After installation, copy the **Bot User OAuth Token** (`xoxb-...`) — this is your `SLACK_BOT_TOKEN`

#### Get Signing Secret
- **Settings → Basic Information → App Credentials → Signing Secret**
- This is your `SLACK_SIGNING_SECRET`

### 4. Configure `.env`

Create a `.env` file in the project root:

```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...
PORT=3000
```

### 5. Run the app

```bash
npm run dev
```

You should see: `⚡️ Bolt app is running on port 3000`

### 6. Open in Slack

In the Slack sidebar → **Apps** → find your app → open the **Home** tab

---

## Project Structure

```
src/
├── app.ts              # Entry point, Bolt + Socket Mode initialization
├── state.ts            # In-memory task store (add / move / delete)
├── views/
│   └── home.ts         # Block Kit blocks generator for Home Tab
└── handlers/
    ├── events.ts       # app_home_opened event handler
    └── actions.ts      # Button and modal submission handlers
```

## Markdown in Tasks

The task description field supports Slack mrkdwn syntax:

| Syntax | Result |
|---|---|
| `*bold*` | **bold** |
| `_italic_` | _italic_ |
| `~strikethrough~` | ~~strikethrough~~ |
| `` `code` `` | `code` |
| `<https://example.com\|link text>` | [link text](https://example.com) |
