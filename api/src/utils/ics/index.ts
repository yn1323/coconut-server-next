// @ts-ignore
import icsToJson from 'ics-to-json-extended';
import { getStartDateTime } from '../time';

export const getEventsFromIcsFormat = (
	icsString: string,
	dateTime: Date = getStartDateTime(),
) => {
	const schedules = icsToJson(icsString);

	const events = schedules
		.map(
			({
				summary,
				startDate,
				endDate,
			}: { summary: string; startDate: string; endDate: string }) => ({
				summary,
				start: `${startDate}+09:00`,
				end: `${endDate}+09:00`,
			}),
		)
		.filter(({ start }: { start: string }) =>
			start.includes(
				`${dateTime.getFullYear().toString()}-${(dateTime.getMonth() + 1)
					.toString()
					.padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')}`,
			),
		)
		.filter(({ summary }: { summary: string }) => summary !== 'キャンセル済み');

	return events;
};
