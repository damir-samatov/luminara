import { FC } from "react";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { LiveVideo } from "@/components/LiveVideo";

type VideoProps = {
  hostUsername: string;
  hostUserId: string;
};

const Video: FC<VideoProps> = ({ hostUsername, hostUserId }) => {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostUserId);

  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostUserId);

  if (!participant && connectionState === ConnectionState.Connected) {
    return <div>{hostUsername} is offline</div>;
  }

  if (!participant || tracks.length === 0) {
    return <div>{hostUsername} is loading...</div>;
  }

  return (
    <div className="aspect-video w-full max-w-[600px]">
      <LiveVideo participantIdentity={participant.identity} />
    </div>
  );
};

export default Video;
