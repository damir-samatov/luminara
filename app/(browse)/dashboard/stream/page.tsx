import { onGetSelfStream } from "@/actions/stream.actions";
import { notFound } from "next/navigation";
import {
  mapStreamToUpdateStreamSettingsDto,
  mapStreamToUpdateStreamCredentialsDto,
} from "@/helpers/stream.helpers";
import { StreamWrapper } from "@/components/StreamWrapper";
import { StreamSettings } from "@/app/(browse)/dashboard/stream/_components/StreamConfigurator";
import { StreamCredentials } from "@/app/(browse)/dashboard/stream/_components/StreamCredentials";

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
      <StreamWrapper hostUserId={res.data.stream.userId} />
    </div>
  );
};

export default StreamPage;
