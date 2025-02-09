import { addDays, format } from 'date-fns';
import { getGarbageReminder } from '../../google/spreadSheet/garbaseRule';
import { lineAllUsers, responseMessage, send } from '../../line/util';

export const sendGarbageReminder = async () => {
	const tomorrow = format(
		addDays(new Date(), 1),
		'yyyy/MM/dd',
	) as `${string}/${string}/${string}`;
	const text = await getGarbageReminder(tomorrow);

	if (text.length) {
		await send(text, { sendUsers: lineAllUsers });
	}
	return responseMessage({
		result: !!text.length,
		message: text.length ? 'Sent garbage text' : 'Tomorrow will be no garbage',
	});
};
