"use client";
import { useEffect, useRef, useState } from "react";
import { FileDrop } from "@/components/FileDrop";
import { Button } from "@/components/Button";
import { onGetSignedFileUploadUrl } from "@/actions/file.actions";
import { createIvsChannel, getIvsViewerToken } from "@/services/ivs.service";
import Script from "next/script";

export const MyProfile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [isIvsPlayerReady, setIsIvsPlayerReady] = useState(false);

  const onCreateChannelClick = async () => {
    setIsCreatingChannel(true);
    try {
      await createIvsChannel({
        key: "test-channel_" + new Date().getTime(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingChannel(false);
    }
  };

  const onUploadClick = async () => {
    setIsUploading(true);
    const file = files[0];
    if (!file) return;
    try {
      const res = await onGetSignedFileUploadUrl({
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!res.success) return onError(res.message);

      await fetch(res.data.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onError = (message: string) => {
    console.log({ message });
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      if (!videoRef.current || !isIvsPlayerReady) return;
      const viewerJwt = await getIvsViewerToken(
        "arn:aws:ivs:eu-central-1:036346596583:channel/itr6DdzIlVAn"
      );

      const playbackUrl =
        "https://75a562d70e98.eu-central-1.playback.live-video.net/api/video/v1/eu-central-1.036346596583.channel.itr6DdzIlVAn.m3u8";

      const videoUrl = `${playbackUrl}?token=${viewerJwt}`;

      console.log({ videoUrl });

      const ivsPlayer = (window as any).IVSPlayer.create();
      ivsPlayer.attachHTMLVideoElement(videoRef.current);
      ivsPlayer.setAutoplay(true);
      ivsPlayer.load(videoUrl);
    })();
  }, [videoRef, isIvsPlayerReady]);

  return (
    <div>
      <Script
        src="https://player.live-video.net/1.24.0/amazon-ivs-player.min.js"
        strategy="lazyOnload"
        onReady={() => setIsIvsPlayerReady(true)}
      />
      <FileDrop files={files} onChange={setFiles} />
      <Button
        size="max-content"
        isLoading={isUploading}
        isDisabled={isUploading || files.length < 1}
        onClick={onUploadClick}
        loadingText="UPLOADING..."
      >
        UPLOAD
      </Button>
      <Button
        size="max-content"
        isLoading={isCreatingChannel}
        isDisabled={isCreatingChannel}
        onClick={onCreateChannelClick}
        loadingText="CREATING IVS CHANNEL..."
      >
        CREATE IVS CHANNEL
      </Button>
      {isIvsPlayerReady && <video controls ref={videoRef}></video>}
    </div>
  );
};
