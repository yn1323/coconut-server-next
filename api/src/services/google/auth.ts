import admin from 'firebase-admin';
import { type App, cert } from 'firebase-admin/app';
import { env } from '../../constants/env';

let app: App;

export const getGoogleAuth = () => {
	if (app) {
		return app;
	}

	if (!app) {
		app = admin.initializeApp({
			credential: cert({
				projectId: env.GCP_PROJECT_ID,
				clientEmail: env.GCP_CLIENT_EMAIL,
				privateKey: env.GCP_PRIVATE_KEY,
			}),
		});
	}

	return app;
};
