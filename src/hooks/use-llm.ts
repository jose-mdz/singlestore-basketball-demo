import type { ChatMessage } from "@/components/chat-messages";
import Groq from "groq-sdk";

export function useLlm(apiKey: string) {
	const groq = new Groq({
		apiKey,
		dangerouslyAllowBrowser: true,
	});

	async function callLlm(messages: ChatMessage[]) {
		return groq.chat.completions.create({
			messages: messages.map(({ id, ...m }) => m),
			model: "llama3-70b-8192",
			max_tokens: 300,
		});
	}

	return {
		callLlm,
	};
}

export async function checkApiKeyIsValid(apiKey: string): Promise<boolean> {
	const groq = new Groq({
		apiKey,
		dangerouslyAllowBrowser: true,
	});

	try {
		await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant.",
				},
			],
			model: "llama3-70b-8192",
			max_tokens: 10,
			temperature: 1.5,
			seed: crypto.getRandomValues(new Uint32Array(1))[0],
		});
		return true;
	} catch (error) {
		return false;
	}
}
