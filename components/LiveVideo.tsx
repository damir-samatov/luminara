"use client";
import { FC, useEffect, useRef } from "react";
import { Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";
import { VideoPlayer } from "@/components/VideoPlayer";

type LiveVideoProps = {
  participantIdentity: string;
};

export const LiveVideo: FC<LiveVideoProps> = ({ participantIdentity }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  useEffect(() => {
    const filteredTracks = tracks.filter(
      (track) => track.participant.identity === participantIdentity
    );

    filteredTracks.forEach((track) => {
      if (videoRef.current) track.publication.track?.attach(videoRef.current);
    });
  }, [tracks, participantIdentity]);

  return <VideoPlayer videoRef={videoRef} />;
};
