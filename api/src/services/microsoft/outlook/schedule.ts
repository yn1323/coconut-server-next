export const getOutlookSchedule = async (url: string) => {
	const data = await fetch(url);
	const text = await data.text();
	return text;
};
  