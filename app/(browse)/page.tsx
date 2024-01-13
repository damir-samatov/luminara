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
        <p key={subscription.id}>
          <Link href={`/${subscription.user.username}`}>
            {subscription.user.username}
          </Link>
        </p>
      ))}

      <p>Recommended for you:</p>
      {recommendations.map((recommendation) => (
        <p key={recommendation.id}>
          <Link href={`/users/${recommendation.username}`}>
            {recommendation.username}
          </Link>
        </p>
      ))}
    </div>
  );
};

export default IndexPage;
