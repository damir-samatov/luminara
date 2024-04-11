"use client";
import { useState } from "react";
import { ImagePicker } from "@/components/ImagePicker";
import { TextInput } from "@/components/TextInput";
import { TextEditor } from "@/components/TextEditor";
import { Button } from "@/components/Button";
import { SubscriptionLevelCreateDto } from "@/types/subscription-levels.types";
import { createSubscriptionLevel } from "@/helpers/client/subscription-level.helpers";
import { SliderInput } from "@/components/SliderInput";
import { useRouter } from "next/navigation";

export const SubscriptionLevelCreator = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [subscriptionLevelContent, setSubscriptionLevelContent] = useState<
    Omit<SubscriptionLevelCreateDto, "imageKey">
  >({
    title: "",
    description: "",
    price: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChange = <T extends keyof SubscriptionLevelCreateDto>(
    key: T,
    value: SubscriptionLevelCreateDto[T]
  ) => {
    setSubscriptionLevelContent((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (
      !subscriptionLevelContent.title ||
      !imageFile ||
      subscriptionLevelContent.price < 0.1
    )
      return;
    setIsLoading(true);

    const res = await createSubscriptionLevel(
      subscriptionLevelContent,
      imageFile
    );

    if (!res.success) console.error(res.message);
    if (res.success) router.push("/subscription-levels");
    setIsLoading(false);
  };

  return (
    <div className="flex grid-cols-3 flex-col gap-6 p-6 lg:grid">
      <div className="col-span-1">
        <ImagePicker
          label="Drop the image here"
          files={imageFile ? [imageFile] : []}
          onChange={(files) => {
            if (files[0]) return setImageFile(files[0]);
            setImageFile(null);
          }}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-6">
        <TextInput
          placeholder="Subscription level title"
          className="h-auto rounded-md border-2 border-gray-500 bg-transparent p-2"
          value={subscriptionLevelContent.title}
          onChange={(value) => onChange("title", value)}
        />
        <TextEditor
          placeholder="Subscription level description"
          value={subscriptionLevelContent.description}
          onChange={(value) => onChange("description", value)}
        />
        <SliderInput
          value={subscriptionLevelContent.price}
          onChange={(value) => onChange("price", value)}
          label="Price $"
          max={100}
          min={0.1}
          step={0.1}
        />
        <Button
          size="max-content"
          onClick={onSubmit}
          loadingText="Creating..."
          isLoading={isLoading}
        >
          Create
        </Button>
      </div>
    </div>
  );
};
