import { onGetStreamDataAsOwner } from "@/actions/stream-owner.actions";
import { notFound } from "next/navigation";
import { ErrorResponseType } from "@/types/action.types";
import { StreamCreate } from "@/app/(browse)/dashboard/stream/_components/StreamCreate";
import StreamEditor from "@/app/(browse)/dashboard/stream/_components/StreamEditor";

const StreamPage = async () => {
  const res = await onGetStreamDataAsOwner();

  if (res.success) {
    const { stream, user, chatRoomToken, playbackUrl, appliedThumbnailUrl } =
      res.data;

    return (
      <StreamEditor
        stream={stream}
        user={user}
        chatRoomToken={chatRoomToken}
        playbackUrl={playbackUrl}
        appliedThumbnailUrl={appliedThumbnailUrl}
      />
    );
  }

  if (res.type === ErrorResponseType.NOT_FOUND) return <StreamCreate />;

  return notFound();
};

export default StreamPage;
