import Link from "next/link";
import { getSubscriptions } from "@/actions/subscription.actions";
import { getRecommendations } from "@/actions/recommendation.actions";

const IndexPage = async () => {
  const [subscriptions, recommendations] = await Promise.all([
    getSubscriptions(),
    getRecommendations(),
  ]);

  return (
    <div>
      <p>Subscribed to:</p>
      {subscriptions.map((subscription) => (
        <Link
          key={subscription.id}
          href={`/users/${subscription.user.username}`}
        >
          {subscription.user.username}
        </Link>
      ))}

      <p>Recommended for you:</p>
      {recommendations.map((recommendation) => (
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
