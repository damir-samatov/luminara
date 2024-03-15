"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamSettings";
import { StreamThumbnail } from "@/app/(browse)/dashboard/stream/_components/StreamThumbnail";
import { User, Stream } from ".prisma/client";
import {
  onGoLive,
  onGoOffline,
  onRefreshSelfStreamKey,
  onUpdateSelfStreamSettings,
  onUpdateSelfStreamThumbnailKey,
} from "@/actions/stream-owner.actions";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { uploadFile } from "@/helpers/client/file.helpers";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import { classNames } from "@/utils/style.utils";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

type StreamEditorProps = {
  stream: Stream;
  user: User;
  playbackUrl: string;
  appliedThumbnailUrl: string;
};

export const StreamEditor: FC<StreamEditorProps> = ({
  stream: initialStream,
  appliedThumbnailUrl: initialAppliedThumbnailUrl,
  user,
  playbackUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [stream, setStream] = useState<Stream>(initialStream);

  const [appliedThumbnailUrl, setAppliedThumbnailUrl] = useState<string>(
    initialAppliedThumbnailUrl
  );

  const [streamSettings, setStreamSettings] = useState<StreamSettingsUpdateDto>(
    {
      description: stream.description,
      title: stream.title,
      isChatEnabled: stream.isChatEnabled,
    }
  );

  const {
    setPrevState: setSettingsPrevState,
    changeDetected: settingsChangeDetected,
    prevState: settingsPrevState,
  } = useObjectShadow(streamSettings);

  const onOpenModerationPage = useCallback(() => {
    const moderationWindow = window.open(
      `/moderation/${user.username}`,
      "_blank",
      "noopener,noreferrer"
    );

    console.log(moderationWindow);
  }, [user.username]);

  const onGoLiveClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await onGoLive();
      if (!res.success) return;
      setStream(res.data.stream);
      onOpenModerationPage();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [onOpenModerationPage]);

  const onGoOfflineClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await onGoOffline();
      if (!res.success) return;
      setStream(res.data.stream);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, []);

  const onRefreshStreamKeyClick = useCallback(async () => {
    try {
      const res = await onRefreshSelfStreamKey();
      if (!res.success) return;
      setStream(res.data.stream);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onSettingsChange = useCallback(
    <T extends keyof StreamSettingsUpdateDto>(
      key: T,
      value: StreamSettingsUpdateDto[T]
    ) => {
      setStreamSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const onSaveSettings = useCallback(async () => {
    if (!settingsChangeDetected) return;
    try {
      const res = await onUpdateSelfStreamSettings(streamSettings);
      if (!res.success) return;
      const { title, isChatEnabled, description } = res.data.stream;
      setSettingsPrevState({
        title,
        isChatEnabled,
        description,
      });
      setStream((prev) => ({
        ...prev,
        title,
        isChatEnabled,
        description,
      }));
    } catch (error) {
      console.error(error);
    }
  }, [settingsChangeDetected, streamSettings, setSettingsPrevState]);

  const onDiscardSettings = useCallback(() => {
    setStreamSettings(settingsPrevState);
  }, [settingsPrevState]);

  const onUploadThumbnail = useCallback(async (file: File) => {
    try {
      if (!file) return;
      const uploadRes = await uploadFile(file);
      if (!uploadRes) return;
      const resThumbnailKey = await onUpdateSelfStreamThumbnailKey(
        uploadRes.fileKey
      );
      if (!resThumbnailKey.success) return;

      const { thumbnailKey } = resThumbnailKey.data.stream;

      const resThumbnailUrl = await onGetSignedFileReadUrl({
        key: thumbnailKey,
      });

      if (resThumbnailUrl.success)
        setAppliedThumbnailUrl(resThumbnailUrl.data.signedUrl);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const tabs = useMemo(
    () => [
      {
        component: (
          <StreamSettings
            streamSettings={streamSettings}
            onDiscardSettings={onDiscardSettings}
            onSaveSettings={onSaveSettings}
            onChange={onSettingsChange}
            changeDetected={settingsChangeDetected}
          />
        ),
        label: "Settings",
      },
      {
        component: (
          <StreamCredentials
            onRefreshStreamKey={onRefreshStreamKeyClick}
            streamCredentials={{
              streamKey: stream.streamKey,
              serverUrl: stream.serverUrl,
            }}
          />
        ),
        label: "Credentials",
      },
      {
        component: (
          <StreamThumbnail
            onUploadThumbnail={onUploadThumbnail}
            thumbnailUrl={appliedThumbnailUrl}
          />
        ),
        label: "Thumbnail",
      },
      {
        component: (
          <div className="flex aspect-[9/16] h-full w-full flex-grow flex-col overflow-y-auto rounded-lg border-2 border-gray-700 lg:aspect-auto">
            <AwsStream
              title={stream.title}
              description={stream.description}
              isChatEnabled={stream.isChatEnabled}
              streamerImageUrl={user.imageUrl}
              streamerUsername={user.username}
              playbackUrl={playbackUrl}
              thumbnailUrl={appliedThumbnailUrl}
            />
          </div>
        ),
        label: "Preview",
      },
    ],
    [
      stream,
      appliedThumbnailUrl,
      playbackUrl,
      user,
      onRefreshStreamKeyClick,
      onSettingsChange,
      onDiscardSettings,
      onSaveSettings,
      settingsChangeDetected,
      onUploadThumbnail,
      streamSettings,
    ]
  );

  return (
    <div className="flex flex-grow flex-col gap-4 p-4 lg:grid lg:grid-cols-5 lg:items-start">
      <div className="flex h-full flex-grow flex-col gap-4 lg:col-span-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tabs.map((tab, i) => (
            <button
              className={classNames(
                "w-full rounded-lg border-2 border-gray-700 p-2 text-gray-300 transition-colors duration-200 hover:bg-gray-700",
                activeTab === i && "bg-gray-700"
              )}
              onClick={() => setActiveTab(i)}
              key={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-grow flex-col">
          {tabs[activeTab]?.component}
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4 text-sm text-gray-300">
        <p>
          You are currently
          {stream.isLive ? (
            <span className="font-bold text-green-600"> LIVE</span>
          ) : (
            <span className="font-bold text-red-600"> OFFLINE</span>
          )}
        </p>
        <p>Going online will make your stream available to your audience.</p>

        <div className="mt-4 flex flex-col gap-2">
          {stream.isLive && (
            <button
              className={classNames(
                "flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-700 p-2 font-bold text-gray-300 hover:bg-gray-700"
              )}
              onClick={onOpenModerationPage}
            >
              <span>Moderation</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-white" />
            </button>
          )}
          <button
            disabled={isLoading}
            className={classNames(
              "w-full rounded-lg border-2 p-2 font-bold transition-colors duration-200 hover:text-gray-200",
              stream.isLive
                ? "border-red-600 text-red-600 hover:bg-red-600"
                : "border-green-600 text-green-600 hover:bg-green-600"
            )}
            onClick={stream.isLive ? onGoOfflineClick : onGoLiveClick}
          >
            {isLoading
              ? "Loading..."
              : stream.isLive
                ? "Go Offline"
                : "Go Live"}
          </button>
        </div>
      </div>
    </div>
  );
};
