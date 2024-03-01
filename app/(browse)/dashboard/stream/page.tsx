import { onGetSelfStream } from "@/actions/stream.actions";
import { notFound } from "next/navigation";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamConfigurator";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";
import React from "react";
import { StreamCreate } from "./_components/StreamCreate";
import { StreamThumbnail } from "./_components/StreamThumbnail";
import { ErrorResponseType } from "@/types/action.types";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";

const StreamPage = async () => {
  const res = await onGetSelfStream();

  if (res.success) {
    const { title, isLive, isChatEnabled, streamKey, serverUrl, thumbnailKey } =
      res.data.stream;

    let thumbnailUrl = "";

    if (thumbnailKey) {
      const res = await onGetSignedFileReadUrl({ key: thumbnailKey });

      if (res.success) thumbnailUrl = res.data.signedUrl;
    }

    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="grid grid-cols-2 gap-6">
          <StreamSettings
            initialStreamSettings={{ title, isLive, isChatEnabled }}
          />
          <StreamCredentials
            initialStreamCredentials={{
              streamKey,
              serverUrl,
            }}
          />
        </div>
        <StreamThumbnail initialThumbnailUrl={thumbnailUrl} />
      </div>
    );
  }

  if (res.type === ErrorResponseType.NOT_FOUND) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <StreamCreate />
      </div>
    );
  }

  return notFound();
};

export default StreamPage;
