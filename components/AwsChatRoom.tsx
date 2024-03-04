"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ChatMessage, ChatRoom } from "amazon-ivs-chat-messaging";
import { Button } from "@/components/Button";
import { v4 as uuid } from "uuid";
import { TextInput } from "@/components/TextInput";
import { IvsChatRoomToken } from "@/types/ivs.types";
import { stringToColor } from "@/utils/style.utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

type AwsChatRoomProps = {
  chatRoomToken: IvsChatRoomToken;
};

export const AwsChatRoom: FC<AwsChatRoomProps> = ({ chatRoomToken }) => {
  const [room] = useState(
    () =>
      new ChatRoom({
        regionOrUrl: "eu-central-1",
        tokenProvider: async () => chatRoomToken,
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

    if (room.state === "disconnected") room.connect();

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnConnecting();
      unsubscribeOnConnected();
      unsubscribeOnDisconnected();
    };
  }, [room]);

  const onMessageReceived = (newMessage: ChatMessage) => {
    console.log(newMessage);
    setMessages((prev) => [...prev, newMessage]);
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const onSendMessage = async () => {
    const res = await room.sendMessage({
      action: "SEND_MESSAGE",
      content: message,
      requestId: uuid(),
    });
    setMessage("");
    console.log({ res });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="relative flex-grow overflow-y-auto">
        <div
          ref={messagesContainerRef}
          className="inset-0 mt-auto flex flex-col justify-end gap-4"
        >
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
          placeholder="Type..."
          onEnter={onSendMessage}
        />
        <Button size="max-content" onClick={onSendMessage}>
          <PaperAirplaneIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
