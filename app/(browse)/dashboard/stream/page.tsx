import { onGetStreamDataAsOwner } from "@/actions/stream-owner.actions";
import { notFound } from "next/navigation";
import { ErrorResponseType } from "@/types/action.types";
import { StreamCreate } from "./_components/StreamCreate";
import { StreamEditor } from "./_components/StreamEditor";

const StreamPage = async () => {
  const res = await onGetStreamDataAsOwner();

  if (res.success) {
    const { stream, user, playbackUrl, appliedThumbnailUrl } = res.data;

    return (
      <StreamEditor
        stream={stream}
        user={user}
        playbackUrl={playbackUrl}
        appliedThumbnailUrl={appliedThumbnailUrl}
      />
    );
  }

  if (res.type === ErrorResponseType.NOT_FOUND) return <StreamCreate />;

  return notFound();
};

export default StreamPage;

export const metadata = {
  title: "Stream Dashboard",
};
