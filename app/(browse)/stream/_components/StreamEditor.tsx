"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { StreamCredentials } from "../_components/StreamCredentials";
import { StreamSettings } from "../_components/StreamSettings";
import { StreamThumbnail } from "../_components/StreamThumbnail";
import { User, Stream, SubscriptionPlan } from "@prisma/client";
import {
  onGoLive,
  onGoOffline,
  onRefreshSelfStreamKey,
  onRemoveSelfStreamSubscriptionPlan,
  onUpdateSelfStreamSettings,
  onUpdateSelfStreamSubscriptionPlan,
} from "@/actions/stream-owner.actions";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { classNames } from "@/utils/style.utils";
import { Button } from "@/components/Button";

type StreamEditorProps = {
  stream: Stream;
  user: User;
  subscriptionPlans: SubscriptionPlan[];
  playbackUrl: string;
  appliedThumbnailUrl: string;
};

export const StreamEditor: FC<StreamEditorProps> = ({
  subscriptionPlans,
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
    updatePrevState: setSettingsPrevState,
    changeDetected: settingsChangeDetected,
    prevState: settingsPrevState,
  } = useObjectShadow(streamSettings);

  const [moderationWindow, setModerationWindow] = useState<Window | null>(null);

  const onOpenModerationPage = useCallback(() => {
    moderationWindow?.close();
    const newModerationWindow = window.open(
      `/moderation/${user.username}`,
      "_blank"
    );
    if (newModerationWindow) {
      setModerationWindow(newModerationWindow);
      newModerationWindow.focus();
    }
  }, [user.username, moderationWindow]);

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
      moderationWindow?.close();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [moderationWindow]);

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

  const onSubscriptionPlanClick = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await onUpdateSelfStreamSubscriptionPlan(id);
      if (res.success) setStream(res.data.stream);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, []);

  const onRemoveSubscriptionPlanClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await onRemoveSelfStreamSubscriptionPlan();
      if (res.success) setStream(res.data.stream);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, []);

  const tabs = useMemo(
    () => [
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
          <StreamThumbnail
            setThumbnailUrl={setAppliedThumbnailUrl}
            thumbnailUrl={appliedThumbnailUrl}
          />
        ),
        label: "Thumbnail",
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
      streamSettings,
    ]
  );

  return (
    <div className="flex flex-grow flex-col gap-4 p-4 lg:grid lg:grid-cols-5 lg:items-start">
      <div className="flex h-full flex-grow flex-col gap-4 lg:col-span-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tabs.map((tab, i) => (
            <Button
              type={activeTab === i ? "primary" : "secondary"}
              onClick={() => setActiveTab(i)}
              key={tab.label}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-grow flex-col">
          {tabs[activeTab]?.component}
        </div>
      </div>
      <div
        className={classNames(
          isLoading && "disabled-block",
          "flex flex-col gap-4 rounded-lg border-2 border-gray-700 p-4 text-sm text-gray-300"
        )}
      >
        <p className="text-xl">
          <span>Status: </span>
          {stream.isLive ? (
            <span className="font-bold text-green-500">LIVE</span>
          ) : (
            <span className="font-bold text-red-500">OFFLINE</span>
          )}
        </p>
        <p className="text-lg">
          Starting the stream will make it available for your audience
        </p>

        {!stream.isLive && (
          <>
            <p className="text-sm">Required plan:</p>
            <Button
              type={!stream.subscriptionPlanId ? "primary" : "secondary"}
              onClick={onRemoveSubscriptionPlanClick}
            >
              Follower
            </Button>
            {subscriptionPlans.map((subscriptionPlan) => {
              return (
                <Button
                  type={
                    subscriptionPlan.id === stream.subscriptionPlanId
                      ? "primary"
                      : "secondary"
                  }
                  key={subscriptionPlan.id}
                  onClick={() => onSubscriptionPlanClick(subscriptionPlan.id)}
                >
                  {subscriptionPlan.title} {subscriptionPlan.price}$
                </Button>
              );
            })}
          </>
        )}

        <div className="flex flex-col gap-2">
          {stream.isLive && (
            <Button type="secondary" onClick={onOpenModerationPage}>
              Moderation Tab
            </Button>
          )}
          <Button
            isDisabled={isLoading}
            type={stream.isLive ? "danger" : "success"}
            onClick={stream.isLive ? onGoOfflineClick : onGoLiveClick}
          >
            {isLoading ? "Loading..." : stream.isLive ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
};
