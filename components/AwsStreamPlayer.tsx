"use client";
import { FC, useEffect, useRef, useState } from "react";
import {
  Player,
  PlayerEventType,
  PlayerState,
  registerIVSTech,
  VideoJSIVSTech,
  VideoJSQualityPlugin,
  registerIVSQualityPlugin,
} from "amazon-ivs-player";
import videojs from "video.js";
import { classNames } from "@/utils/style.utils";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import "video.js/dist/video-js.css";

const WASM_WORKER_URL =
  "https://player.live-video.net/1.24.0/amazon-ivs-wasmworker.min.js";
const WASM_BINARY_URL =
  "https://player.live-video.net/1.24.0/amazon-ivs-wasmworker.min.wasm";

// const TEST_STREAM =
//   "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

type AwsStreamPlayerProps = {
  playbackUrl: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
};

export const AwsStreamPlayer: FC<AwsStreamPlayerProps> = ({
  playbackUrl,
  thumbnailUrl,
  fallbackThumbnailUrl,
}) => {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const playerWrapperElRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player>();
  const ivsPlayerRef = useRef<Player>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!videoElRef.current || !playerWrapperElRef.current || isReady) return;

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
          player.fill();
          player.muted(true);
          player.volume(0.3);
          player.src(playbackUrl);
          thumbnailUrl && player.poster(thumbnailUrl);
          const ivsPlayer = player.getIVSPlayer();
          playerRef.current = player;
          ivsPlayerRef.current = ivsPlayer;

          ivsPlayer.addEventListener(PlayerEventType.ERROR, () => {
            setTimeout(() => {
              if (!player.isDisposed()) {
                player.src(playbackUrl);
              }
            }, 5000);
            setIsReady(false);
          });

          ivsPlayer.addEventListener(PlayerState.ENDED, () => {
            setTimeout(() => {
              if (!player.isDisposed()) {
                player.src(playbackUrl);
              }
            }, 5000);
            setIsReady(false);
          });

          ivsPlayer.addEventListener(PlayerState.READY, () => {
            setIsReady(true);
          });
        }
      ) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;
    })();
  }, [videoElRef, playerWrapperElRef, isReady, playbackUrl, thumbnailUrl]);

  useEffect(() => {
    return () => {
      try {
        if (ivsPlayerRef.current) {
          ivsPlayerRef.current.delete();
        }
        if (playerRef.current && !playerRef.current.isDisposed()) {
          playerRef.current.dispose();
        }
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  return (
    <div className="bg-black">
      {!isReady && (
        <VideoPlaceholder
          text="Streamer is offline"
          url={thumbnailUrl}
          fallbackUrl={fallbackThumbnailUrl}
        />
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
    </div>
  );
};
