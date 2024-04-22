import { Dropdown } from "@/components/Dropdown";
import { FC, useMemo } from "react";
import { SubscriptionPlan } from "@prisma/client";

type SubscriptionPlanSelectorProps = {
  subscriptionPlans: (SubscriptionPlan & {
    imageUrl: string | null;
  })[];
  activeSubscriptionPlan:
    | (SubscriptionPlan & {
        imageUrl: string | null;
      })
    | null;
  onChange: (
    plan:
      | (SubscriptionPlan & {
          imageUrl: string | null;
        })
      | null
  ) => void;
};

export const SubscriptionPlanSelector: FC<SubscriptionPlanSelectorProps> = ({
  subscriptionPlans,
  activeSubscriptionPlan,
  onChange,
}) => {
  const options = useMemo(() => {
    return [
      {
        value: "follower",
        label: "Follower - Free",
      },
      ...subscriptionPlans
        .sort((a, b) => a.price - b.price)
        .map((s) => ({
          value: s.id,
          label: `${s.title} - ${s.price}$`,
        })),
    ];
  }, [subscriptionPlans]);
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-black">
        {activeSubscriptionPlan?.imageUrl && (
          <img
            width={640}
            height={640}
            src={activeSubscriptionPlan.imageUrl}
            alt={activeSubscriptionPlan.title}
            className="object-cover"
          />
        )}
      </div>
      <div className="mt-auto">
        <Dropdown
          options={options}
          active={{
            value: activeSubscriptionPlan?.id ?? "follower",
            label: activeSubscriptionPlan
              ? `${activeSubscriptionPlan.title} - ${activeSubscriptionPlan.price}$`
              : "Follower - Free",
          }}
          onChange={(option) => {
            const plan = subscriptionPlans.find(
              (plan) => plan.id === option.value
            );
            onChange(plan ?? null);
          }}
        />
      </div>
    </div>
  );
};
