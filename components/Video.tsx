import { FC } from "react";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { LiveVideo } from "@/components/LiveVideo";

type VideoProps = {
  hostUserId: string;
};

const Video: FC<VideoProps> = ({ hostUserId }) => {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostUserId);

  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostUserId);

  if (!participant && connectionState === ConnectionState.Connected) {
    return <div>HOST IS OFFLINE</div>;
  }

  if (!participant || tracks.length === 0) {
    return <div>HOST IS LOADING...</div>;
  }

  return (
    <div className="aspect-video w-full max-w-[600px]">
      <LiveVideo participantIdentity={participant.identity} />
    </div>
  );
};

export default Video;
