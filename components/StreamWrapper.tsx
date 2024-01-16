"use client";
import { FC } from "react";
import { useViewerToken } from "@/hooks/useViewerToken";
import { LiveKitRoom } from "@livekit/components-react";
import { LiveVideo } from "@/components/LiveVideo";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

type StreamWrapperProps = {
  hostUserId: string;
};

export const StreamWrapper: FC<StreamWrapperProps> = ({ hostUserId }) => {
  const { token, isLoading } = useViewerToken(hostUserId);

  if (isLoading) {
    return <VideoPlaceholder text="Loading the sctream..." state="loading" />;
  }

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL!}
      token={token}
    >
      <LiveVideo hostUserId={hostUserId} />
    </LiveKitRoom>
  );
};
