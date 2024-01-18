import { onGetSelfStream } from "@/actions/stream.actions";
import { notFound } from "next/navigation";
import { StreamConfigurator } from "@/app/dashboard/_components/StreamConfigurator";

const StreamPage = async () => {
  const res = await onGetSelfStream();

  if (!res.success) return notFound();

  return <StreamConfigurator initialStream={res.data.stream} />;
};

export default StreamPage;
