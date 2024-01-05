"use client";
import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((p) => p + 1)}>{count}</button>;
};
