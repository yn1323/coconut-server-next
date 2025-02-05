import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const config = {
	runtime: 'edge',
};

const app = new Hono().basePath('/api');

const outlookPath = app.basePath('/outlook');

const linePath = app.basePath('/line');

const googlePath = app.basePath('/google');
const firebasePath = googlePath.basePath('/firebase');
const googleMapPath = googlePath.basePath('/map');
const spreadSheetPath = googlePath.basePath('/spreadsheet');

app.get('/', (c) => {
	return c.json({ message: 'Hello Hono!' });
});

export default handle(app);
