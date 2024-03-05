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
  const [stream, setStream] = useState<Stream>(initialStream);

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
  } = useObjectShadow({
    title: stream.title,
    description: stream.description,
    isChatEnabled: stream.isChatEnabled,
  });

  const onSettingsChange = <T extends keyof StreamSettingsUpdateDto>(
    key: T,
    value: StreamSettingsUpdateDto[T]
  ) => {
    setStream((prev) => ({ ...prev, [key]: value }));
  };

  const onSaveSettings = async () => {
    if (!settingsChangeDetected) return;
    try {
      const res = await onUpdateSelfStreamSettings({
        title: stream.title,
        isChatEnabled: stream.isChatEnabled,
        description: stream.description,
      });
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
    setStream((prev) => ({
      ...prev,
      title: settingsPrevState.title,
      description: settingsPrevState.description,
      isChatEnabled: settingsPrevState.isChatEnabled,
    }));
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

  return (
    <div className="flex flex-col gap-4 p-2 lg:gap-6 lg:p-6">
      <div className="w-full overflow-hidden rounded-lg border-2 border-gray-700 lg:aspect-video">
        <AwsStream
          isChatEnabled={stream.isChatEnabled}
          streamerImageUrl={user.imageUrl}
          streamerUsername={user.username}
          playbackUrl={playbackUrl}
          thumbnailUrl={appliedThumbnailUrl}
          chatRoomToken={chatRoomToken}
          title={stream.title}
          description={stream.description}
          isModerator={true}
        />
      </div>
      <StreamCredentials
        onRefreshStreamKey={onRefreshStreamKeyClick}
        streamCredentials={{
          streamKey: stream.streamKey,
          serverUrl: stream.serverUrl,
        }}
      />
      <StreamSettings
        streamSettings={{
          description: stream.description,
          title: stream.title,
          isChatEnabled: stream.isChatEnabled,
        }}
        onDiscardSettings={onDiscardSettings}
        onSaveSettings={onSaveSettings}
        onChange={onSettingsChange}
        changeDetected={settingsChangeDetected}
      />
      <StreamThumbnail
        onUploadThumbnail={onUploadThumbnail}
        thumbnailUrl={appliedThumbnailUrl}
      />
    </div>
  );
};

export default StreamEditor;
