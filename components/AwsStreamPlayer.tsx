"use client";
import { useEffect, useRef, useState } from "react";
import { getIvsViewerToken } from "@/services/ivs.service";
import {
  Player,
  PlayerEventType,
  PlayerState,
  registerIVSTech,
  VideoJSIVSTech,
  VideoJSQualityPlugin,
} from "amazon-ivs-player";
import { registerIVSQualityPlugin } from "amazon-ivs-player";
import videojs from "video.js";
import { classNames } from "@/utils/style.utils";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import "video.js/dist/video-js.css";

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
          player.enableIVSQualityPlugin();
          player.autoplay(false);
          player.muted(true);
          player.volume(0.3);
          player.src(TEST_STREAM);
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
            setIsReady(true);
          });
        }
      ) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;
    })();
  }, [videoElRef, playerWrapperElRef, isReady]);

  return (
    <div className="bg-black">
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
              "aws-ivs-player-wrapper relative aspect-video w-full",
              isReady ? "block" : "hidden"
            )}
          >
            <video playsInline ref={videoElRef} className="video-js" controls />
          </div>
        </>
      )}
    </div>
  );
};
