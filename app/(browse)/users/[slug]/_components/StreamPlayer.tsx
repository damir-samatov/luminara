"use client";
import { FC } from "react";
import { Stream, User } from ".prisma/client";
import { useViewerToken } from "@/hooks/useViewerToken";
import { LiveKitRoom } from "@livekit/components-react";
import Video from "@/components/Video";

type StreamPlayerProps = {
  user: User;
  stream: Stream;
};

export const StreamPlayer: FC<StreamPlayerProps> = ({ user, stream }) => {
  const { token, name, identity, isLoading } = useViewerToken(user.id);

  return (
    <div>
      <p>Token: {token}</p>
      <p>Name: {name}</p>
      <p>Identity: {identity}</p>
      {isLoading ? (
        <p>STREAM IS LOADING</p>
      ) : (
        <LiveKitRoom
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL!}
          token={token}
        >
          <Video hostUsername={user.username} hostUserId={user.id} />
        </LiveKitRoom>
      )}
    </div>
  );
};
