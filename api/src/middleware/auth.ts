import type { MiddlewareHandler } from 'hono';
import { env } from '../constants/env';

export const auth: MiddlewareHandler = async ({ req }, next) => {
	if (req.header('X_API_KEY') !== env.X_API_KEY) {
		return new Response('Unauthorized', { status: 401 });
	}

	await next();
};

export const isFromLine: MiddlewareHandler = async ({ req }, next) => {
	if (!req.header('User-Agent')?.includes('LineBotWebhook')) {
		return new Response('Sent from different platform', { status: 501 });
	}

	await next();
};
