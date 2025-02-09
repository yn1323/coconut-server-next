import type { TravelMode } from '@googlemaps/google-maps-services-js';
import { getFirestoreDb } from '../util';

export const updateTravelModeHistory = async (field: {
	travelMode: TravelMode;
	lineUserId: string;
}) => {
	const collectionRef = getFirestoreDb()
		.collection('concierge')
		.doc('store')
		.collection('travelMode');

	await collectionRef.doc(field.lineUserId).set(field);
};

export const getTravelModeHistory = async (lineUserId: string) => {
	const doc = getFirestoreDb()
		.collection('concierge')
		.doc('store')
		.collection('travelMode')
		.doc(lineUserId);

	const d = await doc.get().catch((e) => console.error(e));

	return d ? d.data() : { travelMode: 'transit' };
};
