"use client";
import { Button } from "@/components/Button";
import { onCreateSelfStream } from "@/actions/stream-owner.actions";
import { useState } from "react";
import Image from "next/image";
import streamerImg from "@/public/images/streamer.webp";
import { redirect } from "next/navigation";

export const StreamCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamCreated, setIsStreamCreated] = useState(false);
  const onCreateStreamClick = async () => {
    setIsLoading(true);
    try {
      const res = await onCreateSelfStream();
      if (!res.success) {
        setIsLoading(false);
        return;
      }
      setIsStreamCreated(true);
      redirect("/stream");
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex-grow">
      <div className="absolute inset-0 h-full w-full">
        <Image
          className="rounded-md"
          src={streamerImg}
          alt="Streamer"
          loading="eager"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-[#00000044] p-4">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gray-950 px-12 py-8 text-center text-white">
            <h1 className="text-center text-2xl font-bold text-gray-200">
              Become a Streamer!
            </h1>
            <div className="text-md text-gray-300">
              <p>
                Initiate your own streamer dashboard and start streaming in few
                minutes.
              </p>
            </div>
            <Button
              size="max-content"
              isLoading={isLoading && !isStreamCreated}
              isDisabled={isLoading || isStreamCreated}
              loadingText="Creating the stream dashboard..."
              onClick={onCreateStreamClick}
            >
              {isStreamCreated ? "Ready!!!" : "Let's Go!!!"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
