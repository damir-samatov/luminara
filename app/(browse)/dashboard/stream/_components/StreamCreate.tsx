"use client";
import { Button } from "@/components/Button";
import { onCreateSelfStream } from "@/actions/stream.actions";
import React, { useState } from "react";

export const StreamCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onCreateStreamClick = async () => {
    setIsLoading(true);
    try {
      await onCreateSelfStream();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Stream</h1>
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={onCreateStreamClick}
      >
        Create Stream
      </Button>
    </div>
  );
};
