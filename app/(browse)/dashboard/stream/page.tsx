import { onGetSelfStream } from "@/actions/stream-owner.actions";
import { notFound, redirect } from "next/navigation";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamConfigurator";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";
import React from "react";
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
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <StreamSettings
            initialIsLive={isLive}
            initialStreamSettings={{ title, isChatEnabled }}
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
    return redirect("/dashboard/stream/create");
  }

  return notFound();
};

export default StreamPage;
