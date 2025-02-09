import { getGoogleSpreadSheetDoc } from '../util';

export const getGarbageReminder = async (
	dateInString: `${string}/${string}/${string}`,
) => {
	const doc = await getGoogleSpreadSheetDoc();

	const sheet = doc.sheetsByTitle['ゴミ収集カレンダー'];
	const rows = await sheet.getRows();
	const { headerValues } = sheet;
	const garbageTypes = headerValues.slice(1, headerValues.length);
	const dateList = rows.map((row) => {
		const dateValue = row.get('日付');
		return dateValue.slice(0, dateValue.length - 3);
	});
	const tomorrowRowIndex = dateList.indexOf(dateInString);
	const tomorrowGarbageMarks = rows[tomorrowRowIndex];

	const tomorrowGarbage = garbageTypes.reduce((text, garbageType) => {
		if (tomorrowGarbageMarks.get(garbageType) === '○') {
			return text + garbageType;
		}
		return text;
	}, '');

	const specialMessage = tomorrowGarbageMarks.get('特別メッセージ');

	if (!tomorrowGarbage && !specialMessage) {
		return [];
	}

	return [`明日は${tomorrowGarbage}の日だよ！🦈`, specialMessage].filter(
		(_) => _,
	);
};
