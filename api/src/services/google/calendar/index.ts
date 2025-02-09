import { google } from 'googleapis';
import { getEndDateTime, getStartDateTime } from '../../../utils/time';

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const auth = new google.auth.JWT(
	process.env.GCP_CLIENT_EMAIL,
	undefined,
	process.env.GCP_PRIVATE_KEY,
	SCOPES,
);

const calendar = google.calendar({
	version: 'v3',
	auth,
});

export const getGoogleCalendarEvents = async (
	startDateTime: Date = getStartDateTime(),
	endDateTime: Date = getEndDateTime(),
) => {
	const res = await calendar.events
		.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID,
			timeMin: startDateTime.toISOString(),
			timeMax: endDateTime.toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		})
		.catch((e) => console.log(e));

	if (!res || !res.data.items) {
		return [];
	}

	const events = res.data.items
		.filter(({ status }) => status !== 'cancelled')
		.map(({ summary, start, end }) => ({
			summary,
			start: start?.dateTime,
			end: end?.dateTime,
		}));

	return events;
};
