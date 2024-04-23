"use client";
import { Button } from "@/components/Button";
import { onCreateStream } from "@/actions/stream-owner.actions";
import { useState } from "react";
import streamerImg from "@/public/images/streamer.webp";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const StreamCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onCreateStreamClick = async () => {
    try {
      setIsLoading(true);

      const res = await onCreateStream();

      toast(res.message, {
        type: res.success ? "success" : "error",
      });

      if (!res.success) return console.error(res.message);

      redirect("/stream");
    } catch (error) {
      console.error(error);
      toast("Something went wrong, try again", {
        type: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex-grow">
      <div className="absolute inset-0 h-full w-full">
        <img
          className="rounded-md"
          src={streamerImg.src}
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
              isLoading={isLoading}
              isDisabled={isLoading}
              loadingText="Creating the stream dashboard..."
              onClick={onCreateStreamClick}
            >
              Let&apos;s Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
