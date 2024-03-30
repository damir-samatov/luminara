import { onGetSelfSubscriptionLevels } from "@/actions/subscription-level.actions";
import { notFound } from "next/navigation";

const SubscriptionLevelsPage = async () => {
  const res = await onGetSelfSubscriptionLevels();

  if (!res.success) return notFound();

  return <div>{JSON.stringify(res, null, 2)}</div>;
};

export default SubscriptionLevelsPage;
