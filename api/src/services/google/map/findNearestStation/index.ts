import type { PlaceInputType } from '@googlemaps/google-maps-services-js';
import { env } from '../../../../constants/env';
import {
	type CommonLocationType,
	getGoogleMapApiClient,
	googleMapApiKey,
	timeout,
} from '../util';

export const findNearestStation = async ({
	lat = Number.parseFloat(env.HOME_LATITUDE),
	lng = Number.parseFloat(env.HOME_LONGITUDE),
}: CommonLocationType) => {
	const client = getGoogleMapApiClient();
	const res = await client
		.findPlaceFromText({
			params: {
				input: '駅',
				inputtype: 'textquery' as PlaceInputType,
				fields: ['geometry', 'name', 'formatted_address'],
				locationbias: `circle:1000@${lat},${lng}`,
				key: googleMapApiKey,
			},
			timeout,
		})
		.catch((e): false => {
			console.error(e);
			return false;
		});

	if (!res || res.status !== 200 || !res.data.candidates.length) return 'error';

	return res.data.candidates;
};
