"use client";
import { FC, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamSettings";
import { StreamThumbnail } from "@/app/(browse)/dashboard/stream/_components/StreamThumbnail";
import { IvsChatRoomToken } from "@/types/ivs.types";
import { User, Stream } from ".prisma/client";
import {
  onRefreshSelfStreamKey,
  onUpdateSelfStreamSettings,
  onUpdateSelfStreamThumbnailKey,
} from "@/actions/stream-owner.actions";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { uploadFile } from "@/helpers/file.helpers";
import { onGetSignedFileReadUrl } from "@/actions/file.actions";
import { classNames } from "@/utils/style.utils";

type StreamEditorProps = {
  stream: Stream;
  user: User;
  playbackUrl: string;
  appliedThumbnailUrl: string;
  chatRoomToken: IvsChatRoomToken;
};

const StreamEditor: FC<StreamEditorProps> = ({
  stream: initialStream,
  appliedThumbnailUrl: initialAppliedThumbnailUrl,
  user,
  chatRoomToken,
  playbackUrl,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const [stream, setStream] = useState<Stream>(initialStream);

  const [streamSettings, setStreamSettings] = useState<StreamSettingsUpdateDto>(
    {
      description: stream.description,
      title: stream.title,
      isChatEnabled: stream.isChatEnabled,
    }
  );

  const [appliedThumbnailUrl, setAppliedThumbnailUrl] = useState<string>(
    initialAppliedThumbnailUrl
  );

  const onRefreshStreamKeyClick = async () => {
    try {
      const res = await onRefreshSelfStreamKey();
      if (!res.success) return;
      setStream(res.data.stream);
    } catch (error) {
      console.error(error);
    }
  };

  const {
    setPrevState: setSettingsPrevState,
    changeDetected: settingsChangeDetected,
    prevState: settingsPrevState,
  } = useObjectShadow(streamSettings);

  const onSettingsChange = <T extends keyof StreamSettingsUpdateDto>(
    key: T,
    value: StreamSettingsUpdateDto[T]
  ) => {
    setStreamSettings((prev) => ({ ...prev, [key]: value }));
  };

  const onSaveSettings = async () => {
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
  };

  const onDiscardSettings = () => {
    setStreamSettings(settingsPrevState);
  };

  const onUploadThumbnail = async (file: File) => {
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
  };

  const tabs = [
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
        <div className="w-full overflow-hidden rounded-lg border-2 border-gray-700 p-4 lg:aspect-video">
          <AwsStream
            title={stream.title}
            description={stream.description}
            isChatEnabled={stream.isChatEnabled}
            streamerImageUrl={user.imageUrl}
            streamerUsername={user.username}
            playbackUrl={playbackUrl}
            thumbnailUrl={appliedThumbnailUrl}
            chatRoomToken={chatRoomToken}
          />
        </div>
      ),
      label: "Preview",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-2 lg:gap-8 lg:p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {tabs.map((tab, i) => (
          <button
            className={classNames(
              "w-full flex-grow rounded-lg border-2 border-gray-700 p-2 text-gray-300",
              activeTab === i && "bg-gray-700"
            )}
            onClick={() => setActiveTab(i)}
            key={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs[activeTab]?.component}
    </div>
  );
};

export default StreamEditor;
