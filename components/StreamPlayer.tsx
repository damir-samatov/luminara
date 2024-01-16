"use client";
import { FC } from "react";
import { Stream, User } from ".prisma/client";
import { useViewerToken } from "@/hooks/useViewerToken";
import { LiveKitRoom } from "@livekit/components-react";
import { LiveVideo } from "@/components/LiveVideo";
import { VideoPlaceholder } from "@/components/VideoLoading";

type StreamPlayerProps = {
  user: User;
  stream: Stream;
};

export const StreamPlayer: FC<StreamPlayerProps> = ({ user, stream }) => {
  const { token, isLoading } = useViewerToken(user.id);

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL!}
      token={token}
    >
      {isLoading ? (
        <VideoPlaceholder text="HOST USER IS LOADING..." state="loading" />
      ) : (
        <LiveVideo hostUserId={user.id} />
      )}
    </LiveKitRoom>
  );
};
