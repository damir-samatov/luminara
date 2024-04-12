import { SubscriptionLevelEditor } from "../_components/SubscriptionLevelEditor";
import { FC } from "react";
import { onGetSubscriptionLevelById } from "@/actions/subscription-level.actions";
import { notFound } from "next/navigation";

type SubscriptionLevelDetailsPageProps = {
  params: {
    id: string;
  };
};

const SubscriptionLevelDetailsPage: FC<
  SubscriptionLevelDetailsPageProps
> = async ({ params }) => {
  const res = await onGetSubscriptionLevelById(params.id);

  if (!res.success) return notFound();

  return (
    <>
      <title>Subscription Plan Editor</title>
      <SubscriptionLevelEditor subscriptionLevel={res.data.subscriptionLevel} />
    </>
  );
};

export default SubscriptionLevelDetailsPage;
