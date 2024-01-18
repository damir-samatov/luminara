import { onGetSelfStream } from "@/actions/stream.actions";
import { notFound } from "next/navigation";
import { StreamSettings } from "@/app/dashboard/_components/StreamConfigurator";
import { mapStreamToUpdateStreamSettingsDto } from "@/helpers/stream.helpers";

const StreamPage = async () => {
  const res = await onGetSelfStream();

  if (!res.success) return notFound();

  return (
    <StreamSettings
      initialStreamSettings={mapStreamToUpdateStreamSettingsDto(
        res.data.stream
      )}
    />
  );
};

export default StreamPage;
