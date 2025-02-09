export const env = {
	LINE_CHANNEL_ID: process.env.LINE_CHANNEL_ID as string,
	LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET as string,
	LINE_ACCESS_TOKEN: process.env.LINE_ACCESS_TOKEN as string,
	LINE_SEND_USERS: process.env.LINE_SEND_USERS as string,

	X_API_KEY: process.env.X_API_KEY as string,

	IS_LOCAL: process.env.IS_LOCAL as string,

	OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,

	SPREADSHEET_ID: process.env.SPREADSHEET_ID as string,

	GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID as string,

	GCP_PROJECT_ID: process.env.GCP_PROJECT_ID as string,
	GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL as string,
	GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY as string,
	GCP_PRIVATE_KEY_ID: process.env.GCP_PRIVATE_KEY_ID as string,

	GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY as string,

	GCP_CLOUD_FUNCTIONS_ENDPOINT: process.env
		.GCP_CLOUD_FUNCTIONS_ENDPOINT as string,

	OUTLOOK_ICS_SCHEDULE: process.env.OUTLOOK_ICS_SCHEDULE as string,

	HOME_LATITUDE: process.env.HOME_LATITUDE as string,
	HOME_LONGITUDE: process.env.HOME_LONGITUDE as string,

	DATABASE_URL: process.env.DATABASE_URL as string,
} as const;
