import type { Client, QuickReplyItem, TextMessage } from '@line/bot-sdk';
import { responseMessage } from '../util';

const replyItems = [
	{
		type: 'action',
		action: {
			type: 'postback',
			label: '電車&バス',
			data: '{"travelMode":"transit"}',
		},
	},
	{
		type: 'action',
		action: {
			type: 'postback',
			label: '車',
			data: '{"travelMode":"driving"}',
		},
	},
	{
		type: 'action',
		action: {
			type: 'postback',
			label: '自転車',
			data: '{"travelMode":"bicycling"}',
		},
	},
	{
		type: 'action',
		action: {
			type: 'postback',
			label: '歩き',
			data: '{"travelMode":"walking"}',
		},
	},
	{
		type: 'action',
		action: {
			type: 'uri',
			label: '📌現在地を送る',
			uri: 'https://line.me/R/nv/location/',
		},
	},
] as const satisfies QuickReplyItem[];

export const sendSelectionReply = async ({
	replyToken,
	client,
}: { replyToken: string; client: Client }) => {
	const response: TextMessage = {
		type: 'text',
		text: '帰る方法を選んでから現在地を送信してね〜🦈',
		quickReply: {
			items: replyItems,
		},
	};
	const requestId = await client
		.replyMessage(replyToken, response)
		.catch((e) => {
			console.error(e);
			return false;
		});
	return responseMessage({
		result: !!requestId,
		message: `MESSAGE: QuickReply, REQUEST_ID: ${requestId}`,
	});
};
