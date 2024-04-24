"use client";
import { Button } from "@/components/Button";
import { onCreateStream } from "@/actions/stream-owner.actions";
import { useState } from "react";
import streamerImg from "@/public/images/streamer-bg.webp";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export const StreamCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onCreateStreamClick = async () => {
    try {
      setIsLoading(true);
      const res = await onCreateStream();
      toast(res.message, {
        type: res.success ? "success" : "error",
      });
      if (!res.success) return;
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
        <Image
          className="rounded-md"
          src={streamerImg.src}
          alt="Streamer"
          loading="eager"
          width={1920}
          height={1080}
        />
        <div className="absolute left-0 right-0 top-10 flex flex-col items-center justify-center rounded-lg bg-[#00000020] p-4">
          <div className="flex max-w-screen-sm flex-col items-center justify-between gap-6 rounded-lg bg-gray-950 p-6 text-center text-white">
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
              className="w-full max-w-40"
              loadingText="Initiating..."
              isLoading={isLoading}
              isDisabled={isLoading}
              onClick={onCreateStreamClick}
            >
              Initiate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
