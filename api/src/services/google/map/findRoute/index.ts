import type { TravelMode } from '@googlemaps/google-maps-services-js';
import { env } from '../../../../constants/env';
import {
	type CommonLocationType,
	getGoogleMapApiClient,
	timeout,
} from '../util';

const home = {
	lat: Number.parseFloat(env.HOME_LATITUDE ?? '0'),
	lng: Number.parseFloat(env.HOME_LONGITUDE ?? '0'),
};
const key = env.GOOGLE_MAPS_API_KEY;

export const getDistance = async ({
	lat,
	lng,
	mode = 'driving' as TravelMode.driving,
}: {
	mode?: TravelMode;
} & CommonLocationType) => {
	const client = getGoogleMapApiClient();
	const res = await client
		.distancematrix({
			params: {
				origins: [{ lat, lng }],
				destinations: [home],
				key,
				mode,
			},
			timeout,
		})
		.catch((e): false => {
			console.error(e);
			return false;
		});

	if (!res || res.status !== 200 || !res.data.rows.length) return 'error';

	if (res.data.rows[0].elements[0].status === 'ZERO_RESULTS') return 'noResult';

	const {
		duration: { value: time = 0 as number },
	} = res.data.rows[0].elements[0];

	const minutes = Math.round(time / 60);

	return {
		duration: {
			minutes,
		},
	};
};
