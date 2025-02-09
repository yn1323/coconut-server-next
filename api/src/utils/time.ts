type Year = number;
type Month =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12';
type Day =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31';

export type DateString = `${Year}-${Month}-${Day}`;

// GMTで計算されるため、+9時間する
export const jst = (dateString?: DateString) => {
	const date = dateString ? new Date(dateString) : new Date();
	if (process.env.IS_LOCAL) {
		return date;
	}
	date.setTime(date.getTime() + 1000 * 60 * 60 * 9);
	return date;
};

export const getStartDateTime = (dateString?: DateString) => {
	const d = dateString ? jst(dateString) : jst();
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);
	return d;
};

export const getEndDateTime = (dateString?: DateString) => {
	const d = getStartDateTime(dateString);
	d.setDate(d.getDate() + 1);
	d.setMilliseconds(d.getMilliseconds() - 1);
	return d;
};

export const addMinutes = (date: Date, minutes: number) => {
	date.setMinutes(date.getMinutes() + minutes);
	return date;
};
