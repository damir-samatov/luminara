import { onGetSelfStream } from "@/actions/stream.actions";
import { notFound } from "next/navigation";
import { StreamSettings } from "@/app/dashboard/_components/StreamConfigurator";
import {
  mapStreamToUpdateStreamSettingsDto,
  mapStreamToUpdateStreamCredentialsDto,
} from "@/helpers/stream.helpers";
import { StreamCredentials } from "@/app/dashboard/_components/StreamCredentials";

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
    </div>
  );
};

export default StreamPage;
