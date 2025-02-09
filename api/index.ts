import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { auth, isFromLine } from './src/middleware/auth';
import { sendGarbageReminder } from './src/services/batch/sendGarbaseReminder';
import { sendRecentCyclingDay } from './src/services/batch/sendGoodDayForCycling';
import { lineController } from './src/services/line/webhook/controller';

export const config = {
	runtime: 'edge',
};

const app = new Hono().basePath('/api');

app.use(auth);

const line = app.basePath('/line');

const scheduler = app.basePath('/scheduler');
const reminder = scheduler.basePath('/reminder');

app.get('/', (c) => {
	return c.json({ message: 'Hello World!' });
});

// スケジューラー
reminder.get('/garbage', async (c) => {
	const result = await sendGarbageReminder();
	return c.json({ result });
});
reminder.get('/cyclingDay', async (c) => {
	const body = await c.req.json();
	const result = await sendRecentCyclingDay(body.url ?? '');
	return c.json({ result });
});

// LINEの返信
line.post('/webhook', isFromLine, async (c) => {
	const body = await c.req.json();
	const result = await lineController({ body });
	return c.json({ result });
});

export default handle(app);
