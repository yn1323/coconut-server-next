import {
	type DateString,
	getEndDateTime,
	getStartDateTime,
} from '../../../utils/time';
import { getGoogleCalendarEvents } from '../../google/calendar';
import { getOutlookCalendarEvents } from '../../microsoft/outlook/schedule';
import { lineAllUsers, send } from '../util';

type SchedulesEvents = {
	summary: string;
	start: string;
	end: string;
	time: string;
};

export const getAllSchedule = async (dateString?: DateString) => {
	const startDateTime = getStartDateTime(dateString);
	const endDateTime = getEndDateTime(dateString);

	const tasks = [
		async () => await getGoogleCalendarEvents(startDateTime, endDateTime),
		async () => await getOutlookCalendarEvents(startDateTime),
	];

	const events = await (
		await Promise.all(tasks.map(async (task) => await task()))
	)
		.flat()
		.map(({ summary, ...event }: { summary: string }) => ({
			...event,
			summary: summary.replace('FW:', '').trim(),
		}));

	const uniqueEvents = Array.from(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		new Map(events.map((event: any) => [event.summary, event])).values(),
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	).map(({ summary, start, end }: any) => ({
		summary,
		start,
		end,
		time: `${start.split('T')[1].substr(0, 5)}-${end.split('T')[1].substr(0, 5)}`,
	}));

	uniqueEvents.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));

	return uniqueEvents as SchedulesEvents[];
};

export const sendSchedule = async (events: SchedulesEvents[]) => {
	const message = events.length
		? `今日の会議だよ！🦈${events.map(({ summary, time }) => `\n${summary}-${time}`).join('')}`
		: '今日は会議ないよ！🦈🦭';

	await send(message, { sendUsers: lineAllUsers });
};
