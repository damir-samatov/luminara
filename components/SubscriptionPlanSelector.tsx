import { Dropdown } from "@/components/Dropdown";
import { FC, useMemo } from "react";
import { SubscriptionPlanDto } from "@/types/subscription-plan.types";

type SubscriptionPlanSelectorProps = {
  freeFollowerImageUrl: string;
  subscriptionPlans: SubscriptionPlanDto[];
  activeSubscriptionPlan: SubscriptionPlanDto | null;
  onChange: (plan: SubscriptionPlanDto | null) => void;
};

export const SubscriptionPlanSelector: FC<SubscriptionPlanSelectorProps> = ({
  subscriptionPlans,
  activeSubscriptionPlan,
  freeFollowerImageUrl,
  onChange,
}) => {
  const options = useMemo(() => {
    return [
      {
        value: "follower",
        label: "Follower",
      },
      ...subscriptionPlans
        .sort((a, b) => a.price - b.price)
        .map((s) => ({
          value: s.id,
          label: `${s.price}$ - ${s.title}`,
        })),
    ];
  }, [subscriptionPlans]);

  return (
    <div className="mx-auto flex w-full max-w-52 flex-col gap-4">
      <div className="mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-lg bg-black">
        {activeSubscriptionPlan ? (
          <img
            width={640}
            height={640}
            src={activeSubscriptionPlan.imageUrl}
            alt={activeSubscriptionPlan.title}
            className="object-cover"
          />
        ) : (
          <img
            width={640}
            height={640}
            src={freeFollowerImageUrl}
            alt="Follower"
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
              ? `${activeSubscriptionPlan.price}$ - ${activeSubscriptionPlan.title}`
              : "Follower",
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
