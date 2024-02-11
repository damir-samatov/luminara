"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getIvsViewerToken } from "@/services/ivs.service";
import {
  Player,
  PlayerEventType,
  PlayerState,
  Quality,
  registerIVSTech,
  VideoJSIVSTech,
  VideoJSQualityPlugin,
} from "amazon-ivs-player";
import { registerIVSQualityPlugin } from "amazon-ivs-player";
import videojs from "video.js";
import { SliderInput } from "@/components/SliderInput";
import { Button } from "@/components/Button";
import "video.js/dist/video-js.css";
import { classNames } from "@/utils/style.utils";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

const WASM_WORKER_URL =
  "https://player.live-video.net/1.24.0/amazon-ivs-wasmworker.min.js";
const WASM_BINARY_URL =
  "https://player.live-video.net/1.24.0/amazon-ivs-wasmworker.min.wasm";

const TEST_STREAM =
  "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

export const AwsStreamPlayer = () => {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const playerWrapperElRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player>();
  const ivsPlayerRef = useRef<Player>();
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [activeQuality, setActiveQuality] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    (async () => {
      if (!videoElRef.current || !playerWrapperElRef.current || isReady) return;
      const viewerJwt = await getIvsViewerToken(
        "arn:aws:ivs:eu-central-1:036346596583:channel/itr6DdzIlVAn"
      );

      const videoUrl =
        "https://75a562d70e98.eu-central-1.playback.live-video.net/api/video/v1/eu-central-1.036346596583.channel.itr6DdzIlVAn.m3u8";

      const playbackUrl = `${videoUrl}?token=${viewerJwt}`;

      registerIVSTech(videojs, {
        wasmWorker: WASM_WORKER_URL,
        wasmBinary: WASM_BINARY_URL,
      });

      registerIVSQualityPlugin(videojs);

      const player = videojs(
        videoElRef.current,
        {
          techOrder: ["AmazonIVS"],
        },
        () => {
          player.src(playbackUrl);
          player.autoplay(true);
          player.volume(0.5);
          player.muted(true);
          player.enableIVSQualityPlugin();
          const ivsPlayer = player.getIVSPlayer();
          playerRef.current = player;
          ivsPlayerRef.current = ivsPlayer;
          ivsPlayer.addEventListener(PlayerEventType.ERROR, () => {
            setIsOffline(true);
          });
          ivsPlayer.addEventListener(PlayerState.ENDED, () => {
            setIsOffline(true);
          });
          ivsPlayer.addEventListener(PlayerState.READY, () => {
            setQualities(ivsPlayer.getQualities());
            setActiveQuality(ivsPlayer.getQuality().name);
            setIsReady(true);
          });
        }
      ) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;

      document.onfullscreenchange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
    })();
  }, [videoElRef, playerWrapperElRef, isReady]);

  const onPlayToggle = useCallback(
    (value: boolean) => {
      if (!playerRef?.current) return;
      value ? playerRef.current.play() : playerRef.current.pause();
      setIsPlaying(value);
    },
    [playerRef]
  );

  const onMuteToggle = useCallback(
    (value: boolean) => {
      if (!playerRef?.current) return;
      playerRef.current.muted(value);
      setIsMuted(value);
    },
    [playerRef]
  );

  const onFullScreenToggle = useCallback(
    (value: boolean) => {
      if (!playerWrapperElRef?.current) return;
      value
        ? playerWrapperElRef.current.requestFullscreen()
        : document.exitFullscreen();
    },
    [playerWrapperElRef]
  );

  const onVolumeChange = useCallback(
    (volume: number) => {
      if (!playerRef?.current) return;
      playerRef.current.volume(volume / 100);
      setVolume(volume);
    },
    [playerRef]
  );

  const onQualityChange = useCallback(
    (quality: Quality) => {
      if (!ivsPlayerRef?.current) return;
      ivsPlayerRef.current.setQuality(quality);
      setActiveQuality(quality.name);
    },
    [ivsPlayerRef]
  );

  return (
    <div className="overflow-hidden rounded-md bg-black p-4">
      {isOffline ? (
        <VideoPlaceholder text="User is offline" state="offline" />
      ) : (
        <>
          {!isReady && (
            <VideoPlaceholder text="Connecting..." state="loading" />
          )}
          <div
            ref={playerWrapperElRef}
            className={classNames(
              "aws-ivs-player-wrapper group relative aspect-video w-full",
              isReady ? "block" : "hidden"
            )}
          >
            <div onClick={() => onPlayToggle(!isPlaying)}>
              <video playsInline ref={videoElRef} />
            </div>

            <div className="absolute bottom-0 left-0 block">
              <SliderInput
                value={volume}
                onChange={onVolumeChange}
                label="Volume"
                max={100}
                min={0}
                step={1}
              />
              <Button onClick={() => onPlayToggle(!isPlaying)}>
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button onClick={() => onMuteToggle(!isMuted)}>
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button onClick={() => onFullScreenToggle(!isFullscreen)}>
                {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
              </Button>
              {qualities.map((quality) => (
                <Button
                  key={quality.name}
                  onClick={() => onQualityChange(quality)}
                >
                  {quality.name}{" "}
                  {activeQuality === quality.name ? "active" : ""}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
