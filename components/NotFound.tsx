import React, { FC } from "react";

type NotFoundProps = {
  message?: string;
};

export const NotFound: FC<NotFoundProps> = ({ message = "PAGE NOT FOUND" }) => {
  return (
    <div className="flex grow flex-col items-center justify-center gap-6 font-semibold">
      <h1 className="text-5xl">404</h1>
      <p className="text-2xl">{message}</p>
    </div>
  );
};
