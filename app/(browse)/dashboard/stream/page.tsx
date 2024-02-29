import { onGetSelfStream } from "@/actions/stream.actions";
import { notFound } from "next/navigation";
import {
  mapStreamToUpdateStreamSettingsDto,
  mapStreamToUpdateStreamCredentialsDto,
} from "@/helpers/stream.helpers";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamConfigurator";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";

const StreamPage = async () => {
  const res = await onGetSelfStream();

  if (!res.success) return notFound();

  return (
    <div className="flex flex-col gap-4 p-4">
      <StreamSettings
        initialStreamSettings={mapStreamToUpdateStreamSettingsDto(
          res.data.stream
        )}
      />
      <StreamCredentials
        initialStreamCredentials={mapStreamToUpdateStreamCredentialsDto(
          res.data.stream
        )}
      />
      <AwsStreamPlayer />
    </div>
  );
};

export default StreamPage;
