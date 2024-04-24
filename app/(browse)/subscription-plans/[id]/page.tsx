import { SubscriptionPlanEditor } from "../_components/SubscriptionPlanEditor";
import { FC } from "react";
import { onGetSubscriptionPlanById } from "@/actions/subscription-plan.actions";
import { notFound } from "next/navigation";

type SubscriptionPlanDetailsPageProps = {
  params: {
    id: string;
  };
};

const SubscriptionPlanDetailsPage: FC<
  SubscriptionPlanDetailsPageProps
> = async ({ params }) => {
  const res = await onGetSubscriptionPlanById(params.id);
  if (!res.success) return notFound();
  return (
    <>
      <title>Subscription Plan Editor</title>
      <SubscriptionPlanEditor subscriptionPlan={res.data.subscriptionPlan} />
    </>
  );
};

export default SubscriptionPlanDetailsPage;
