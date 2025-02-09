import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { env } from '../../../constants/env';

const auth = new JWT({
	email: env.GCP_CLIENT_EMAIL,
	key: env.GCP_PRIVATE_KEY,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

let doc: GoogleSpreadsheet;

export const getGoogleSpreadSheetDoc = async () => {
	if (doc) {
		return doc;
	}

	doc = new GoogleSpreadsheet(env.SPREADSHEET_ID, auth);
	await doc.loadInfo();
	return doc;
};
