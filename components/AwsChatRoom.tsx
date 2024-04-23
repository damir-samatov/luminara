"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ChatMessage, ChatRoom } from "amazon-ivs-chat-messaging";
import { Button } from "@/components/Button";
import { v4 as uuid } from "uuid";
import { TextInput } from "@/components/TextInput";
import { stringToColor } from "@/utils/style.utils";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { onDeleteChatMessage } from "@/actions/stream-owner.actions";
import { chatRoomTokenProvider } from "@/helpers/client/chat-room.helpers";
import { StreamUserRoles } from "@/types/stream.types";

type AwsChatRoomProps = {
  streamerUsername: string;
  userRole: StreamUserRoles;
};

export const AwsChatRoom: FC<AwsChatRoomProps> = ({
  streamerUsername,
  userRole,
}) => {
  const [room] = useState(
    () =>
      new ChatRoom({
        regionOrUrl: "eu-central-1",
        tokenProvider: () => chatRoomTokenProvider(streamerUsername),
      })
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribeOnConnecting = room.addListener("connecting", console.log);
    const unsubscribeOnConnected = room.addListener("connect", console.log);
    const unsubscribeOnDisconnected = room.addListener(
      "disconnect",
      console.log
    );

    const unsubscribeOnMessage = room.addListener("message", onMessageReceived);
    const unsubscribeOnMessageDelete = room.addListener(
      "messageDelete",
      (e) => {
        setMessages((prev) =>
          prev.filter((message) => e.messageId !== message.id)
        );
      }
    );

    if (room.state === "disconnected") room.connect();

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnConnecting();
      unsubscribeOnConnected();
      unsubscribeOnDisconnected();
      unsubscribeOnMessageDelete();
    };
  }, [room]);

  const onMessageReceived = (newMessage: ChatMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const chatScrollerRef = useRef<HTMLDivElement>(null);

  const onSendMessage = async () => {
    if (!message) return;
    await room.sendMessage({
      action: "SEND_MESSAGE",
      content: message,
      requestId: uuid(),
    });
    setMessage("");
  };

  const onDeleteMessage = async (messageId: string) => {
    await onDeleteChatMessage(messageId);
  };

  useEffect(() => {
    if (!chatScrollerRef.current) return;
    chatScrollerRef.current.scrollTop = chatScrollerRef.current.scrollHeight;
  }, [messages, chatScrollerRef]);

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div
        ref={chatScrollerRef}
        id="chat"
        className="relative flex-grow overflow-y-auto"
      >
        <div className="inset-0 mt-auto flex flex-col justify-end gap-4">
          {messages.map((message) => {
            const name = message.sender.attributes?.username || "unnamed";
            const color = stringToColor(name);
            const text = message.content;
            return (
              <div key={message.id} className="break-words text-sm">
                <span
                  style={{
                    color,
                  }}
                >
                  @{name}:{" "}
                </span>
                <span>{text}</span>
                {userRole === StreamUserRoles.STREAMER && (
                  <button onClick={() => onDeleteMessage(message.id)}>
                    <TrashIcon className="h-4 w-4 text-red-500"></TrashIcon>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-stretch gap-2">
        <TextInput
          value={message}
          maxLength={100}
          onChange={setMessage}
          placeholder="Type your message..."
          onEnter={onSendMessage}
        />
        <Button type="secondary" onClick={onSendMessage} className="max-w-max">
          <PaperAirplaneIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
