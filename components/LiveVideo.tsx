"use client";
import { FC, useEffect, useRef } from "react";
import { ConnectionState, Track } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

type LiveVideoProps = {
  hostUserId: string;
};

export const LiveVideo: FC<LiveVideoProps> = ({ hostUserId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const participant = useRemoteParticipant(hostUserId);
  const connectionState = useConnectionState();
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  const isOffline =
    !participant && connectionState === ConnectionState.Connected;

  const isLoading = !participant || tracks.length < 1;

  useEffect(() => {
    if (!participant) return;

    const filteredTracks = tracks.filter(
      (track) => track.participant.identity === participant.identity
    );

    filteredTracks.forEach((track) => {
      if (videoRef.current) track.publication.track?.attach(videoRef.current);
    });
  }, [tracks, participant]);

  if (isOffline)
    return <VideoPlaceholder text="User is offline" state="offline" />;

  if (isLoading)
    return <VideoPlaceholder text="Connecting..." state="loading" />;

  return <VideoPlayer videoRef={videoRef} />;
};
