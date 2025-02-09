import { type Firestore, getFirestore } from 'firebase-admin/firestore';
import { getGoogleAuth } from '../auth';

let db: Firestore;

export const getFirestoreDb = () => {
	if (db) {
		return db;
	}

	const app = getGoogleAuth();
	db = getFirestore(app);

	return db;
};
