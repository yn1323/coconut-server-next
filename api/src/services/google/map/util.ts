import { Client } from '@googlemaps/google-maps-services-js';
import { env } from '../../../constants/env';

export type CommonLocationType = {
	lat: number;
	lng: number;
};
export const timeout = 30000;
export const googleMapApiKey = env.GOOGLE_MAPS_API_KEY;

let client: Client;
export const getGoogleMapApiClient = () => {
	if (!client) {
		client = new Client({});
	}

	return client;
};
