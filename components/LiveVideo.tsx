"use client";
import { FC, useEffect, useRef } from "react";
import { Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";

type LiveVideoProps = {
  participantIdentity: string;
};

export const LiveVideo: FC<LiveVideoProps> = ({ participantIdentity }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participantIdentity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });

  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  useEffect(() => {
    const filteredTracks = tracks.filter(
      (track) => track.participant.identity === participantIdentity
    );

    filteredTracks.forEach((track) => {
      if (videoRef.current) track.publication.track?.attach(videoRef.current);
    });

    console.log(filteredTracks);
  }, [tracks, participantIdentity]);

  return <video ref={videoRef}></video>;
};
