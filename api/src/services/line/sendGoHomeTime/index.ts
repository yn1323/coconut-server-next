import type { TravelMode } from '@googlemaps/google-maps-services-js';
import type {
	Client,
	LocationEventMessage,
	PostbackEvent,
	QuickReplyItem,
	TextMessage,
} from '@line/bot-sdk';
import { addMinutes, jst } from '../../../utils/time';
import {
	getTravelModeHistory,
	updateTravelModeHistory,
} from '../../google/firestore/travelMode';
import { getDistance } from '../../google/map/findRoute';
import { lineAllUsers, responseMessage, send } from '../util';

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

export const updateTravelMode = async (event: PostbackEvent) => {
	const data: { travelMode: string } = JSON.parse(event.postback.data);
	const { userId } = event.source;

	await updateTravelModeHistory({
		lineUserId: userId ?? '',
		travelMode: data.travelMode as TravelMode,
	});
};

export const replyCalculatedRouteTime = async (
	event: LocationEventMessage,
	{ userId }: { userId: string },
) => {
	const { travelMode } = (await getTravelModeHistory(userId)) as {
		travelMode: string;
	};

	const result = await getDistance({
		lat: event.latitude,
		lng: event.longitude,
		mode:
			travelMode === 'transit'
				? ('driving' as TravelMode.driving)
				: (travelMode as TravelMode),
	});
	if (result === 'error') throw new Error('direction failed');

	if (result === 'noResult') {
		return await send('ルートが見つからないよー', { sendUsers: userId });
	}

	// APIがなく、超ざっくり計算
	const goHomeTime =
		travelMode === 'transit'
			? result.duration.minutes * 1.25
			: result.duration.minutes;

	const currentTime = jst();
	const arrivalTime = addMinutes(currentTime, goHomeTime);
	const arrivalTimeStr = `${arrivalTime
		.getHours()
		.toString()
		.padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`;

	const travelModeKey: Record<TravelMode, string> = {
		transit: '電車&バス',
		driving: '車',
		bicycling: '自転車',
		walking: '歩き',
	};

	const text =
		travelMode === 'transit'
			? [
					`${travelModeKey[travelMode]}で帰ってくるみたいだよー`,
					`${arrivalTimeStr}頃に家に着きそう〜🦈`,
					'乗り換え時間はざっくり計算だけど許して〜🦭',
				]
			: [
					`${travelModeKey[travelMode as TravelMode]}で帰ってくるってよー`,
					`${arrivalTimeStr}頃に家に着きそう〜🦈`,
				];

	await send(text, { sendUsers: lineAllUsers });
};
