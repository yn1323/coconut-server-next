import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { auth, isFromLine } from './src/middleware/auth';
import { lineController } from './src/services/line/controller';

export const config = {
	runtime: 'edge',
};

const app = new Hono().basePath('/api');

app.use(auth);

const outlook = app.basePath('/outlook');

const line = app.basePath('/line');

const google = app.basePath('/google');
const firestore = google.basePath('/firebase');
const googleMap = google.basePath('/map');
const spreadSheet = google.basePath('/spreadsheet');

app.get('/', (c) => {
	return c.json({ message: 'Hello Hono! from hogehoge!' });
});

line.post('/webhook', isFromLine, async (c) => {
	const body = await c.req.json();
	const header = c.req.header('User-Agent');

	lineController({ body });

	return c.json({ message: body, header });
});

export default handle(app);
