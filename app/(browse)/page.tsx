import { onGetRecommendations } from "@/actions/recommendation.actions";
import { notFound } from "next/navigation";
import RecommendationCard from "@/components/RecommendationCard";

const IndexPage = async () => {
  const res = await onGetRecommendations();

  if (!res.success) return notFound();

  return (
    <div className="flex flex-col gap-8 p-4">
      <h1 className="text-3xl font-bold">Popular Creators:</h1>
      <div className="flex flex-wrap gap-4">
        {res.data.recommendations.map((recommendation) => (
          <div key={recommendation.username} className="w-60">
            <RecommendationCard recommendation={recommendation} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
