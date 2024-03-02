import { StreamCreate } from "@/app/(browse)/dashboard/stream/_components/StreamCreate";
import { redirect } from "next/navigation";
import React from "react";
import { onGetSelfStream } from "@/actions/stream.actions";

const StreamCreatePage = async () => {
  const res = await onGetSelfStream();

  if (res.success) return redirect("/dashboard/stream");

  return <StreamCreate />;
};

export default StreamCreatePage;
