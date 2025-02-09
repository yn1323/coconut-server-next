// @ts-ignore
import icsToJson from 'ics-to-json-extended';
import { env } from '../../../constants/env';
import { getStartDateTime } from '../../../utils/time';

const outlookIcsSchedule = env.OUTLOOK_ICS_SCHEDULE;

export const getOutlookSchedule = async (url: string) => {
	const data = await fetch(url);
	const text = await data.text();
	return text;
};

export const getOutlookCalendarEvents = async (
	dateTimeString: Date = getStartDateTime(),
) => {
	const ics = await getOutlookSchedule(outlookIcsSchedule);
	if (!ics) return false;

	const dateSchedule = icsToJson(ics)
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
				`${dateTimeString.getFullYear().toString()}-${(
					dateTimeString.getMonth() + 1
				)
					.toString()
					.padStart(
						2,
						'0',
					)}-${dateTimeString.getDate().toString().padStart(2, '0')}`,
			),
		)
		.filter(({ summary }: { summary: string }) => summary !== 'キャンセル済み');

	return dateSchedule;
};
