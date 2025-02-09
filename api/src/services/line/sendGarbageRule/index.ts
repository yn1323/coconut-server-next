import type { Message } from '@line/bot-sdk';
import { getLineClient, responseMessage } from '../util';

export const sendGarbageImages = async (
	sendUser: string,
	imageUrls: string[],
) => {
	const client = getLineClient();

	const sendMessage: Message = {
		type: 'text',
		text: 'じぶんで探してちょ🐟',
	};
	const sendImages: Message[] = imageUrls.map((url) => ({
		type: 'image',
		originalContentUrl: url,
		previewImageUrl: url,
	}));

	for (const msg of sendImages) {
		await client.pushMessage(sendUser, msg);
	}
	await client.pushMessage(sendUser, sendMessage);

	return responseMessage({
		result: true,
		message: 'sent garbage schedule images',
	});
};
