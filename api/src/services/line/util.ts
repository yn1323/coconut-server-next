import type { Client, Message } from '@line/bot-sdk';

type ResponseMessageProps = {
	result: boolean;
	message: string;
};

export const responseMessage = ({ result, message }: ResponseMessageProps) => ({
	result: result ? 'success' : 'failed',
	message,
});

export const send = async (
	text: string | string[],
	{ sendUsers, client }: { sendUsers: string | string[]; client: Client },
) => {
	const lineBreakText = Array.isArray(text) ? text.join('\n') : text;
	const sendMessage: Message = { type: 'text', text: lineBreakText };

	const isMultipleUser = Array.isArray(sendUsers);

	const requestId = isMultipleUser
		? await client.multicast(sendUsers, sendMessage).catch((e) => {
				console.error(e);
				return false;
			})
		: await client.pushMessage(sendUsers, sendMessage).catch((e) => {
				console.error(e);
				return false;
			});

	const logUserString = isMultipleUser ? sendUsers.join(',') : sendUsers;

	return responseMessage({
		result: !!requestId,
		message: `SEND_USER: ${logUserString}, MESSAGE: ${sendMessage.text}`,
	});
};
