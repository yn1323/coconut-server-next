import type { WebhookEvent } from '@line/bot-sdk';
import { responseMessage } from './util';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getLineMessageRequestInfo = (events: any[]) => {
	return {
		replyToken: events[0]?.replyToken ?? '',
		text: events[0]?.message?.text ?? '',
		userId: events[0]?.source?.userId ?? '',
		type: events[0]?.type ?? '',
		messageTypes: events[0]?.message?.type ?? '',
		postBackData: events[0]?.postback?.data ?? '',
	};
};

export const lineController = async ({
	body: { events },
}: { body: { events: WebhookEvent[] } }) => {
	const event = getLineMessageRequestInfo(events).replyToken;

	// 帰宅メッセージのやりとり受信
	const isSelectedTheWayGoHome =
		event.type === 'postback' && 'travelMode' in event.postBackData;
	if (isSelectedTheWayGoHome) {
		return;
	}

	const isMapSent =
		event.type === 'message' && event.messageTypes === 'location';
	if (isMapSent) {
		return;
	}

	if (event.text === '今日の打ち合わせは？') {
		return;
	}

	if (event.text === '今から帰る〜') {
		return;
	}

	if (['ゴミ', 'ごみ'].some((t) => event.text.includes(t))) {
		return;
	}

	return responseMessage({
		result: false,
		message: 'does not match, sent nothing',
	});
};
