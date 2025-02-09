import { env } from '../../../constants/env';
import { lineAllUsers, send } from '../../line/util';

export const sendRecentCyclingDay = async (url: string) => {
	type WeatherResponse = {
		status: number;
		recentWeathers: {
			times: ('03' | '06' | '09' | '12' | '15' | '18' | '21' | '24')[];
			weathers: string[];
			temperatures: `${number}.${number}`[];
			probPrecips: ('---' | `${number}`)[];
			windSpeeds: `${number}`[];
		}[];
	};
	const weather: WeatherResponse | null = await fetch(
		`${env.GCP_CLOUD_FUNCTIONS_ENDPOINT}/scrapeRecentThreeDaysWeather?url=${url}`,
		{
			headers: {
				'Content-Type': 'application/json',
				x_api_key: env.X_API_KEY,
			},
		},
	)
		.then((e) => e.json())
		.catch(() => null);

	if (!weather) {
		return;
	}

	const nextDayWeathers = weather.recentWeathers[1];
	const dayTimeWeatherIndex = nextDayWeathers.times.reduce<number[]>(
		(acc, cur, index) =>
			['09', '12', '15', '18'].includes(cur) ? [...acc, index] : acc,
		[],
	);
	const nextDayDaytimeWeathers = {
		weathers: dayTimeWeatherIndex.map(
			(index) => nextDayWeathers.weathers[index],
		),
		temperatures: dayTimeWeatherIndex.map(
			(index) => nextDayWeathers.temperatures[index],
		),
		probPrecips: dayTimeWeatherIndex.map(
			(index) => nextDayWeathers.probPrecips[index],
		),
		windSpeeds: dayTimeWeatherIndex.map(
			(index) => nextDayWeathers.windSpeeds[index],
		),
	};

	const isGoodDay =
		nextDayDaytimeWeathers.weathers.every(
			(weather) => weather.includes('晴れ') || weather.includes('曇り'),
		) &&
		nextDayDaytimeWeathers.temperatures.every(
			(temp) => Number.parseFloat(temp) >= 10 && Number.parseFloat(temp) <= 32,
		) &&
		nextDayDaytimeWeathers.probPrecips.every(
			(precip) => Number.parseFloat(precip) === 0,
		) &&
		nextDayDaytimeWeathers.windSpeeds.every(
			(wind) => Number.parseFloat(wind) <= 2,
		);

	if (!isGoodDay) {
		return;
	}

	const text = [
		'明日はサイクリング日和だよ！🚴‍♂️️️🚴‍♂️️️🚴‍♂️️️',
		`${url}#forecast-point-3h-tomorrow`,
	];

	await send(text, { sendUsers: lineAllUsers });
};
