import Link from "next/link";
import { getSubscriptions } from "@/actions/subscription.actions";
import { getRecommendations } from "@/actions/recommendation.actions";
import { notFound } from "next/navigation";

const IndexPage = async () => {
  const [subscriptionsRes, recommendationsRes] = await Promise.all([
    getSubscriptions(),
    getRecommendations(),
  ]);

  if (!subscriptionsRes.success || !recommendationsRes.success)
    return notFound();

  return (
    <div>
      <p>Subscribed to:</p>
      {subscriptionsRes.data.subscriptions.map((subscription) => (
        <Link
          key={subscription.id}
          href={`/users/${subscription.user.username}`}
        >
          {subscription.user.username}
        </Link>
      ))}

      <p>Recommended for you:</p>
      {recommendationsRes.data.recommendations.map((recommendation) => (
        <Link
          key={recommendation.id}
          href={`/users/${recommendation.username}`}
        >
          {recommendation.username}
        </Link>
      ))}
    </div>
  );
};

export default IndexPage;
