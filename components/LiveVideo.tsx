"use client";
import { FC, useEffect, useRef } from "react";
import { ConnectionState, Track } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoPlaceholder } from "@/components/VideoLoading";

type LiveVideoProps = {
  hostUserId: string;
};

export const LiveVideo: FC<LiveVideoProps> = ({ hostUserId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const participant = useRemoteParticipant(hostUserId);
  const connectionState = useConnectionState();
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  useEffect(() => {
    if (!participant) return;

    const filteredTracks = tracks.filter(
      (track) => track.participant.identity === participant.identity
    );

    filteredTracks.forEach((track) => {
      if (videoRef.current) track.publication.track?.attach(videoRef.current);
    });
  }, [tracks, participant]);

  if (!participant && connectionState === ConnectionState.Connected) {
    return <VideoPlaceholder text="HOST USER IS OFFLINE" state="offline" />;
  }

  if (!participant || tracks.length < 1) {
    return <VideoPlaceholder text="HOST USER IS LOADING..." state="loading" />;
  }

  return <VideoPlayer videoRef={videoRef} />;
};
