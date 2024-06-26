"use client";

import { Fragment, useRef, ElementRef } from "react";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ChatItem } from "@/components/chat/chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "chamberId" | "conversationId";
	paramValue: string;
	type: "chamber" | "conversation";
}

type MessageWithMemberAndProfile = Message & {
	member: Member & { profile: Profile };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatMessages = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}:messages`;
	const updateKey = `chat:${chatId}:messages:update`;

	const chatRef = useRef<ElementRef<"div">>(null);
	const bottomRef = useRef<ElementRef<"div">>(null);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
		queryKey,
		apiUrl,
		paramKey,
		paramValue,
	});

	useChatSocket({ queryKey, addKey, updateKey });
	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0,
	});

	// @ts-ignore
	if (status === "loading") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">Chargement des messages...</p>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="h-10 w-10 text-zinc-500 my-4 animate-pulse" />
				<p className="text-sm text-zinc-500 dark:text-zinc-400">Une erreur est survenue lors du chargement des messages...</p>
			</div>
		);
	}

	return (
		<div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
			{!hasNextPage && <div className="flex-1" />}
			{!hasNextPage && <ChatWelcome type={type} name={name} />}
			{hasNextPage && (
				<div className="flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 text-xs my-4 transition"
						>
							Charger les messages précédents
						</button>
					)}
				</div>
			)}
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, index) => (
					<Fragment key={index}>
						{group.items.map((message: MessageWithMemberAndProfile) => (
							<ChatItem
								key={message.id}
								id={message.id}
								currentMember={member}
								member={message.member}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								isUpdated={message.updatedAt !== message.createdAt}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	);
};
