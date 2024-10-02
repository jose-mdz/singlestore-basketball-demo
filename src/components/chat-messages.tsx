"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface ChatMessage {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
}

export default function ChatMessages({
	messages,
	onMessage,
	isSpecialMessage,
	renderSpecialMessage,
}: {
	messages: ChatMessage[];
	onMessage: (m: ChatMessage) => void;
	isSpecialMessage?: (m: ChatMessage) => boolean;
	renderSpecialMessage?: (m: ChatMessage) => React.ReactNode;
}) {
	const [message, setMessage] = useState("");
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onMessage({ id: crypto.randomUUID(), role: "user", content: message });
		setMessage("");
	};

	const scrollToBottom = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop =
				scrollContainerRef.current.scrollHeight;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: messages is not a constant
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className="flex flex-col space-y-4 flex-1">
			<div className="flex-1 flex flex-col relative">
				<div
					ref={scrollContainerRef}
					className="absolute inset-0 overflow-y-auto flex flex-col gap-3 p-3"
				>
					{
						// ignore first message
						messages
							.slice(1)
							.map((message, index) => {
								if (renderSpecialMessage && isSpecialMessage?.(message)) {
									return renderSpecialMessage(message);
								}
								return (
									<div
										key={message.id}
										className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
									>
										<p className="opacity-30">
											{message.role === "user" ? "You" : "Expert"}
										</p>
										<div
											className={`px-4 py-2 max-w-[70%] rounded-[20px] ${message.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"}`}
										>
											<p className="whitespace-pre-wrap">{message.content}</p>
										</div>
									</div>
								);
							})
					}
				</div>
			</div>
			<form className="flex gap-3" onSubmit={handleSubmit}>
				<div className="flex-1">
					<Input
						autoFocus
						className="w-full text-base"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</div>
				<Button>Send</Button>
			</form>
		</div>
	);
}
