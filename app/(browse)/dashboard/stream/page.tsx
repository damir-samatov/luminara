import { onGetStreamDataAsOwner } from "@/actions/stream-owner.actions";
import { notFound } from "next/navigation";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamConfigurator";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";
import React from "react";
import { StreamThumbnail } from "./_components/StreamThumbnail";
import { ErrorResponseType } from "@/types/action.types";
import { StreamCreate } from "@/app/(browse)/dashboard/stream/_components/StreamCreate";
import { AwsStream } from "@/components/AwsStream";

const StreamPage = async () => {
  const res = await onGetStreamDataAsOwner();

  if (res.success) {
    const { stream, user, chatRoomToken, playbackUrl, appliedThumbnailUrl } =
      res.data;

    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <StreamSettings
            initialIsLive={stream.isLive}
            initialStreamSettings={{
              title: stream.title,
              isChatEnabled: stream.isChatEnabled,
            }}
          />
          <StreamCredentials
            initialStreamCredentials={{
              streamKey: stream.streamKey,
              serverUrl: stream.serverUrl,
            }}
          />
        </div>
        <StreamThumbnail initialThumbnailUrl={appliedThumbnailUrl} />
        <p className="text-lg font-semibold">Stream Preview</p>
        <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-gray-700">
          <AwsStream
            streamerImageUrl={user.imageUrl}
            streamerUsername={user.username}
            playbackUrl={playbackUrl}
            thumbnailUrl={appliedThumbnailUrl}
            chatRoomToken={chatRoomToken}
            title={stream.title}
            description="Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream Welcome to wiut's Stream "
          />
        </div>
      </div>
    );
  }

  if (res.type === ErrorResponseType.NOT_FOUND) return <StreamCreate />;

  return notFound();
};

export default StreamPage;
