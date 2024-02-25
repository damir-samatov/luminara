import { useMemo } from "react";
import { stringToColor } from "@/utils/style.utils";

export const useColorFromText = (text: string) => {
  return useMemo(() => stringToColor(text), [text]);
};
