"use client";
import ChatMessages, { type ChatMessage } from "@/components/chat-messages";
import { useKeys } from "@/hooks/keys-provider";
import { useEffect, useState } from "react";
import { EnterKey } from "./components/enter-key";
import { useLlm } from "@/hooks/use-llm";

export default function Home() {
	const { keys, setKeys } = useKeys();
	const [inited, setInited] = useState(false);
	const { callLlm } = useLlm(keys?.groqApiKey || "");
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const handleMessage = (m: ChatMessage) => {
		const newMessages = [...messages, m];
		setMessages(newMessages);
		callLlm(newMessages).then((response) => {
			const text = response.choices[0].message.content;
			setMessages([
				...newMessages,
				{ id: crypto.randomUUID(), content: text || "", role: "assistant" },
			]);
		});
	};

	useEffect(() => {
		if (inited) return;
		setInited(true);
	}, [inited]);

	useEffect(() => {
		if (messages.length > 0) {
			callLlm(messages).then((response) => {
				console.log(response);
			});
		}
	}, [callLlm, messages]);

	if (!inited) {
		return (
			<main className="w-full h-svh flex items-center justify-center">
				Loading...
			</main>
		);
	}

	if (!keys) {
		return <EnterKey onSuccess={(k) => setKeys(k)} />;
	}

	return (
		<main className=" h-svh flex flex-col p-10">
			<h1>Hello World</h1>
			<ChatMessages messages={messages} onMessage={handleMessage} />
		</main>
	);
}
