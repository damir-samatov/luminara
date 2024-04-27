"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { AwsStream } from "@/components/AwsStream";
import { StreamCredentials } from "../_components/StreamCredentials";
import { StreamSettings } from "../_components/StreamSettings";
import { StreamThumbnail } from "../_components/StreamThumbnail";
import { User, Stream } from "@prisma/client";
import {
  onGoLive,
  onGoOffline,
  onUpdateStreamSettings,
  onUpdateStreamSubscriptionPlan,
} from "@/actions/stream-owner.actions";
import { StreamSettingsUpdateDto } from "@/types/stream.types";
import { useObjectShadow } from "@/hooks/useObjectShadow";
import { Button } from "@/components/Button";
import { SubscriptionPlanSelector } from "@/components/SubscriptionPlanSelector";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";
import { toast } from "react-toastify";

type StreamEditorProps = {
  stream: Stream;
  user: User;
  subscriptionPlans: SubscriptionPlanDto[];
  playbackUrl: string;
  thumbnailUrl: string;
};

export const StreamEditor: FC<StreamEditorProps> = ({
  subscriptionPlans,
  stream: savedStream,
  thumbnailUrl: savedThumbnailUrl,
  user,
  playbackUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [stream, setStream] = useState<Stream>(savedStream);
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] =
    useState<SubscriptionPlanDto | null>(null);

  const [thumbnailUrl, setAppliedThumbnailUrl] =
    useState<string>(savedThumbnailUrl);

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
      const res = await onUpdateStreamSettings(streamSettings);
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

  const tabs = useMemo(
    () => [
      {
        label: "Preview",
        component: (
          <div className="flex aspect-[9/16] h-full w-full flex-grow flex-col overflow-y-auto rounded-lg border-2 border-gray-700 lg:aspect-auto">
            <AwsStream
              title={stream.title}
              description={stream.description}
              isChatEnabled={stream.isChatEnabled}
              streamerImageUrl={user.imageUrl}
              streamerUsername={user.username}
              playbackUrl={playbackUrl}
              thumbnailUrl={thumbnailUrl}
            />
          </div>
        ),
      },
      {
        label: "Keys",
        component: (
          <StreamCredentials
            streamKey={stream.streamKey}
            streamUrl={stream.serverUrl}
          />
        ),
      },
      {
        label: "Settings",
        component: (
          <StreamSettings
            streamSettings={streamSettings}
            onDiscardSettings={onDiscardSettings}
            onSaveSettings={onSaveSettings}
            onChange={onSettingsChange}
            changeDetected={settingsChangeDetected}
          />
        ),
      },
      {
        label: "Thumbnail",
        component: (
          <StreamThumbnail
            fallbackThumbnailUrl={user.imageUrl}
            setThumbnailUrl={setAppliedThumbnailUrl}
            thumbnailUrl={thumbnailUrl}
          />
        ),
      },
    ],
    [
      stream,
      thumbnailUrl,
      playbackUrl,
      user,
      onSettingsChange,
      onDiscardSettings,
      onSaveSettings,
      settingsChangeDetected,
      streamSettings,
    ]
  );

  const onSubscriptionPlanChange = useCallback(
    async (subscriptionPlanDto: SubscriptionPlanDto | null) => {
      let prevSubscriptionPlan: SubscriptionPlanDto | null = null;

      setActiveSubscriptionPlan((prev) => {
        prevSubscriptionPlan = prev;
        return subscriptionPlanDto;
      });

      try {
        const res = await onUpdateStreamSubscriptionPlan(
          subscriptionPlanDto?.id || null
        );

        if (res.success) {
          toast("Subscription plan successfully updated", {
            type: "success",
          });
        } else {
          setActiveSubscriptionPlan(prevSubscriptionPlan);
          toast("Failed to update the subscription plan", {
            type: "error",
          });
        }
      } catch (error) {
        toast("Failed to update the subscription plan", { type: "error" });
        console.error(error);
        setActiveSubscriptionPlan(prevSubscriptionPlan);
      }
    },
    []
  );

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-grow flex-col gap-4 p-4">
      <h2 className="text-sm md:text-xl lg:text-3xl">My Stream Dashboard</h2>
      <div className="flex w-full flex-grow flex-col gap-4 lg:grid lg:grid-cols-4 lg:items-start">
        <div className="flex h-full flex-grow flex-col gap-4 lg:col-span-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
        <div className="flex flex-col gap-4  text-sm text-gray-300">
          {!stream.isLive && (
            <SubscriptionPlanSelector
              freeFollowerImageUrl={user.imageUrl}
              subscriptionPlans={subscriptionPlans}
              activeSubscriptionPlan={activeSubscriptionPlan}
              onChange={onSubscriptionPlanChange}
            />
          )}

          <p className="mt-8 text-center text-xl">
            {stream.isLive ? (
              <span className="font-bold text-green-500">LIVE</span>
            ) : (
              <span className="font-bold text-red-500">OFFLINE</span>
            )}
          </p>

          <p>Starting the stream will make it available for your audience</p>

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
